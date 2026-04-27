<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ProjectMeta, TechEdge, TechNodeMeta } from '../data/techStack'

type GraphNode = TechNodeMeta & {
  baseX: number
  baseY: number
  x: number
  y: number
  radius: number
  phase: number
}

type TooltipState = {
  visible: boolean
  x: number
  y: number
  node: TechNodeMeta | null
}

const props = defineProps<{
  nodes: TechNodeMeta[]
  edges: TechEdge[]
  projects: ProjectMeta[]
  activeName: string | null
  lockedName: string | null
  relatedNames: Set<string>
}>()

const emit = defineEmits<{
  (e: 'node-enter', name: string): void
  (e: 'node-leave'): void
  (e: 'node-click', name: string): void
}>()

const shellRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const tooltip = ref<TooltipState>({
  visible: false,
  x: 0,
  y: 0,
  node: null
})

const graphNodes = ref<GraphNode[]>([])
const width = ref(0)
const height = ref(360)
const pointerInside = ref(false)

const projectMap = computed(() => new Map(props.projects.map((item) => [item.title, item])))

let ctx: CanvasRenderingContext2D | null = null
let resizeObserver: ResizeObserver | null = null
let frameId = 0
let throttledMoveId = 0
let pendingPointer: PointerEvent | null = null

const browserNavigator = navigator as Navigator & { deviceMemory?: number }
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const lowPowerDevice =
  reduceMotion ||
  ((browserNavigator.hardwareConcurrency && browserNavigator.hardwareConcurrency <= 4) ?? false) ||
  ((browserNavigator.deviceMemory && browserNavigator.deviceMemory <= 4) ?? false)

const levelRadiusMap = {
  core: 13,
  extended: 10,
  tool: 8
} satisfies Record<TechNodeMeta['level'], number>

const rebuildLayout = () => {
  const w = width.value
  const h = height.value
  const groups: Record<TechNodeMeta['level'], TechNodeMeta[]> = {
    core: [],
    extended: [],
    tool: []
  }

  props.nodes.forEach((item) => groups[item.level].push(item))

  const rowMap: Record<TechNodeMeta['level'], number> = {
    core: h * 0.28,
    extended: h * 0.52,
    tool: h * 0.76
  }

  const nextNodes: GraphNode[] = []

  ;(['core', 'extended', 'tool'] as const).forEach((level) => {
    const list = groups[level]
    const gap = w / (list.length + 1)
    list.forEach((item, index) => {
      const baseX = gap * (index + 1)
      const jitterY = (index % 2 === 0 ? -1 : 1) * Math.min(18, w * 0.015)
      nextNodes.push({
        ...item,
        baseX,
        baseY: rowMap[level] + jitterY,
        x: baseX,
        y: rowMap[level] + jitterY,
        radius: levelRadiusMap[level],
        phase: index * 0.75 + (level === 'core' ? 0 : level === 'extended' ? 1.4 : 2.8)
      })
    })
  })

  graphNodes.value = nextNodes
}

const setCanvasSize = () => {
  const shell = shellRef.value
  const canvas = canvasRef.value
  if (!shell || !canvas) return

  width.value = Math.floor(shell.clientWidth)
  height.value = Math.max(320, Math.min(460, Math.floor(shell.clientHeight)))

  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(width.value * ratio)
  canvas.height = Math.floor(height.value * ratio)
  canvas.style.width = `${width.value}px`
  canvas.style.height = `${height.value}px`
  ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  rebuildLayout()
}

const getActiveNode = () => graphNodes.value.find((item) => item.name === props.activeName) ?? null

const getNodeAt = (x: number, y: number) => {
  for (let index = graphNodes.value.length - 1; index >= 0; index -= 1) {
    const node = graphNodes.value[index]
    const radius = node.radius + 12
    const dx = x - node.x
    const dy = y - node.y
    if (dx * dx + dy * dy <= radius * radius) return node
  }
  return null
}

const syncTooltip = (node: GraphNode | null) => {
  const shell = shellRef.value
  if (!shell || !node) {
    tooltip.value = { visible: false, x: 0, y: 0, node: null }
    return
  }

  const cardWidth = 260
  const cardHeight = 160
  const margin = 18
  const prefersRight = node.x < width.value * 0.58
  const nextX = prefersRight ? node.x + 22 : node.x - cardWidth - 22
  const nextY = node.y - cardHeight * 0.45

  tooltip.value = {
    visible: true,
    x: Math.min(width.value - cardWidth - margin, Math.max(margin, nextX)),
    y: Math.min(height.value - cardHeight - margin, Math.max(margin, nextY)),
    node
  }
}

const drawBackground = () => {
  if (!ctx) return
  const context = ctx
  context.clearRect(0, 0, width.value, height.value)

  const gradient = context.createLinearGradient(0, 0, width.value, height.value)
  gradient.addColorStop(0, 'rgba(20, 28, 56, 0.96)')
  gradient.addColorStop(0.5, 'rgba(17, 24, 49, 0.92)')
  gradient.addColorStop(1, 'rgba(34, 18, 63, 0.92)')
  context.fillStyle = gradient
  context.fillRect(0, 0, width.value, height.value)

  const glow = context.createRadialGradient(width.value * 0.25, height.value * 0.22, 0, width.value * 0.25, height.value * 0.22, width.value * 0.42)
  glow.addColorStop(0, 'rgba(77, 144, 254, 0.18)')
  glow.addColorStop(1, 'rgba(77, 144, 254, 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, width.value, height.value)
}

const drawEdges = (time: number) => {
  if (!ctx) return

  props.edges.forEach((edge, index) => {
    const source = graphNodes.value.find((item) => item.name === edge.source)
    const target = graphNodes.value.find((item) => item.name === edge.target)
    if (!source || !target) return

    const related = props.relatedNames.has(source.name) && props.relatedNames.has(target.name)
    const hasActive = Boolean(props.activeName)
    const alpha = hasActive ? (related ? 0.9 : 0.12) : 0.34
    const gradient = ctx!.createLinearGradient(source.x, source.y, target.x, target.y)
    gradient.addColorStop(0, `rgba(88, 168, 255, ${alpha})`)
    gradient.addColorStop(1, `rgba(180, 112, 255, ${alpha * 0.92})`)

    ctx!.strokeStyle = gradient
    ctx!.lineWidth = related ? 2.2 : 1.1
    ctx!.beginPath()
    ctx!.moveTo(source.x, source.y)
    ctx!.lineTo(target.x, target.y)
    ctx!.stroke()

    if (lowPowerDevice) return

    const progress = ((time * 0.0002 + index * 0.13) % 1 + 1) % 1
    const flowX = source.x + (target.x - source.x) * progress
    const flowY = source.y + (target.y - source.y) * progress
    ctx!.fillStyle = `rgba(225, 236, 255, ${related ? 0.95 : 0.45})`
    ctx!.shadowColor = 'rgba(158, 208, 255, 0.95)'
    ctx!.shadowBlur = related ? 10 : 6
    ctx!.beginPath()
    ctx!.arc(flowX, flowY, related ? 2.6 : 1.6, 0, Math.PI * 2)
    ctx!.fill()
    ctx!.shadowBlur = 0
  })
}

const drawNodes = (time: number) => {
  if (!ctx) return

  graphNodes.value.forEach((node) => {
    const active = props.activeName === node.name
    const related = props.relatedNames.has(node.name)
    const hasActive = Boolean(props.activeName)
    const dim = hasActive ? (related ? 1 : 0.2) : 1
    const pulse = lowPowerDevice ? 0 : Math.sin(time * 0.0012 + node.phase) * 0.6
    const radius = node.radius + (active ? 2.6 : related ? 0.8 : 0) + pulse * 0.15
    const color =
      node.level === 'core'
        ? `rgba(110, 196, 255, ${dim})`
        : node.level === 'extended'
          ? `rgba(151, 166, 255, ${dim})`
          : `rgba(191, 128, 255, ${dim})`

    ctx!.shadowColor = color
    ctx!.shadowBlur = active ? 24 : related ? 14 : 8
    ctx!.fillStyle = color
    ctx!.beginPath()
    ctx!.arc(node.x, node.y, radius, 0, Math.PI * 2)
    ctx!.fill()

    ctx!.shadowBlur = 0
    ctx!.fillStyle = `rgba(235, 242, 255, ${hasActive ? (related ? 0.96 : 0.34) : 0.88})`
    ctx!.font = `${active ? 700 : 500} 12px Inter, sans-serif`
    ctx!.textAlign = 'center'
    ctx!.fillText(node.name, node.x, node.y + radius + 16)
  })
}

const animate = (time: number) => {
  const activeNode = getActiveNode()
  const targetShiftX = activeNode ? (width.value * 0.5 - activeNode.baseX) * 0.16 : 0
  const targetShiftY = activeNode ? (height.value * 0.48 - activeNode.baseY) * 0.16 : 0

  graphNodes.value.forEach((node, index) => {
    const floatX = lowPowerDevice ? 0 : Math.sin(time * 0.001 + node.phase) * 5
    const floatY = lowPowerDevice ? 0 : Math.cos(time * 0.00125 + node.phase + index * 0.12) * 7
    node.x += (node.baseX + floatX + targetShiftX - node.x) * 0.08
    node.y += (node.baseY + floatY + targetShiftY - node.y) * 0.08
  })

  if (tooltip.value.node) {
    const current = graphNodes.value.find((item) => item.name === tooltip.value.node?.name) ?? null
    syncTooltip(current)
  }

  drawBackground()
  drawEdges(time)
  drawNodes(time)
  frameId = window.requestAnimationFrame(animate)
}

const handlePointer = (event: PointerEvent) => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const node = getNodeAt(x, y)
  if (node) {
    emit('node-enter', node.name)
    syncTooltip(node)
  } else {
    emit('node-leave')
    if (!props.lockedName) syncTooltip(null)
  }
}

const onPointerMove = (event: PointerEvent) => {
  pendingPointer = event
  if (throttledMoveId) return
  throttledMoveId = window.requestAnimationFrame(() => {
    throttledMoveId = 0
    if (pendingPointer) handlePointer(pendingPointer)
    pendingPointer = null
  })
}

const onPointerLeave = () => {
  pointerInside.value = false
  emit('node-leave')
  if (!props.lockedName) syncTooltip(null)
}

const onPointerDown = (event: PointerEvent) => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const node = getNodeAt(event.clientX - rect.left, event.clientY - rect.top)
  if (node) {
    emit('node-click', node.name)
    syncTooltip(node)
  }
}

watch(
  () => props.activeName,
  () => {
    const current = getActiveNode()
    syncTooltip(current)
  }
)

onMounted(() => {
  setCanvasSize()
  frameId = window.requestAnimationFrame(animate)

  resizeObserver = new ResizeObserver(() => setCanvasSize())
  if (shellRef.value) resizeObserver.observe(shellRef.value)
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
  window.cancelAnimationFrame(frameId)
  window.cancelAnimationFrame(throttledMoveId)
})
</script>

<template>
  <div
    ref="shellRef"
    class="particle-graph-shell"
    @pointerenter="pointerInside = true"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
  >
    <canvas ref="canvasRef" class="particle-graph-canvas"></canvas>

    <div class="graph-levels">
      <span>Core</span>
      <span>Extended</span>
      <span>Tools</span>
    </div>

    <transition name="tooltip-fade">
      <aside
        v-if="tooltip.visible && tooltip.node"
        class="particle-tooltip"
        :style="{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }"
      >
        <div class="tooltip-level">{{ tooltip.node.level }}</div>
        <h4>{{ tooltip.node.name }}</h4>
        <p>{{ tooltip.node.description }}</p>
        <p class="tooltip-usage">使用场景：{{ tooltip.node.usage }}</p>
        <div class="tooltip-projects">
          <a
            v-for="projectTitle in tooltip.node.projects"
            :key="projectTitle"
            :href="projectMap.get(projectTitle)?.demo || projectMap.get(projectTitle)?.github || '#'"
            target="_blank"
            rel="noreferrer"
          >
            {{ projectTitle }}
          </a>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
.particle-graph-shell {
  position: relative;
  height: clamp(320px, 42vw, 460px);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(129, 159, 255, 0.18);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 20px 38px rgba(11, 19, 48, 0.34);
}

.particle-graph-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.graph-levels {
  position: absolute;
  inset: 16px 18px auto 18px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: rgba(204, 219, 255, 0.42);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: none;
}

.graph-levels span:nth-child(2) {
  text-align: center;
}

.graph-levels span:nth-child(3) {
  text-align: right;
}

.particle-tooltip {
  position: absolute;
  width: 260px;
  padding: 14px 14px 12px;
  border-radius: 16px;
  border: 1px solid rgba(160, 182, 255, 0.22);
  background: rgba(20, 28, 58, 0.7);
  box-shadow:
    0 20px 36px rgba(6, 10, 28, 0.42),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  backdrop-filter: blur(14px);
}

.particle-tooltip h4 {
  margin: 4px 0 8px;
  color: #eff5ff;
  font-size: 18px;
}

.particle-tooltip p {
  margin: 0;
  color: rgba(222, 231, 255, 0.82);
  font-size: 13px;
  line-height: 1.6;
}

.tooltip-level {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(110, 169, 255, 0.16);
  color: #bdd6ff;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tooltip-usage {
  margin-top: 8px !important;
}

.tooltip-projects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tooltip-projects a {
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(96, 152, 255, 0.14);
  color: #dbe8ff;
  font-size: 12px;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.tooltip-projects a:hover {
  background: rgba(140, 110, 255, 0.24);
  transform: translateY(-1px);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

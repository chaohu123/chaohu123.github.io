<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Mode = 'tech' | 'project' | 'flow'
type TechMeta = { name: string; level: 'core' | 'extended' | 'tool'; desc: string; cases: string[] }
type ProjectMeta = { title: string }
type NodeType = 'person' | 'tech' | 'project'

type GraphNode = {
  id: string
  type: NodeType
  level?: 'core' | 'extended' | 'tool'
  label: string
  x: number
  y: number
  vx: number
  vy: number
  ax: number
  ay: number
  r: number
  tx: number
  ty: number
}

type GraphLink = { source: string; target: string; kind: 'hierarchy' | 'relation' | 'project' }

const props = defineProps<{
  mode: Mode
  hoveredTech: string | null
  hoveredProject: string | null
  techs: TechMeta[]
  projects: ProjectMeta[]
}>()

const emit = defineEmits<{
  (e: 'node-click', payload: TechMeta): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let frameId = 0
let width = 0
let height = 0
const mouse = { x: 0, y: 0, active: false }

const nodes = new Map<string, GraphNode>()
const links: GraphLink[] = []

const relationPairs: Array<[string, string]> = [
  ['Vue3', 'Pinia'],
  ['TypeScript', 'Vue3'],
  ['Vue3', 'Element Plus'],
  ['Vite', 'Vue3'],
  ['Axios', 'TypeScript'],
  ['Mapbox GL', 'Vue3']
]

const setCanvasSize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.floor(width * ratio)
  canvas.height = Math.floor(height * ratio)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
}

const getPersonAnchor = (mode: Mode) => {
  if (mode === 'project') return { x: width * 0.32, y: height * 0.5 }
  if (mode === 'flow') return { x: width * 0.18, y: height * 0.5 }
  return { x: width * 0.5, y: height * 0.45 }
}

const getTechAnchor = (level: 'core' | 'extended' | 'tool', index: number, mode: Mode) => {
  if (mode === 'flow') {
    const rowGap = 110
    const levelOffset = level === 'core' ? 0 : level === 'extended' ? rowGap : rowGap * 2
    return {
      x: width * 0.35 + index * 88,
      y: height * 0.2 + levelOffset
    }
  }

  const centerX = mode === 'project' ? width * 0.28 : width * 0.5
  const centerY = mode === 'project' ? height * 0.5 : height * 0.42
  const baseRadius = mode === 'project' ? 120 : 210
  const levelBias = level === 'core' ? -28 : level === 'extended' ? 26 : 74
  const ringRadius = baseRadius + levelBias
  const angleOffset = mode === 'project' ? -1.25 : level === 'core' ? -0.55 : level === 'extended' ? 0.6 : 1.35
  const angleStep = mode === 'project' ? 0.56 : 0.9
  const angle = angleOffset + index * angleStep
  return {
    x: centerX + Math.cos(angle) * ringRadius,
    y: centerY + Math.sin(angle) * (ringRadius * 0.58)
  }
}

const getProjectAnchor = (index: number, mode: Mode) => {
  if (mode === 'project') {
    const centers = [
      { x: width * 0.66, y: height * 0.32 },
      { x: width * 0.78, y: height * 0.52 },
      { x: width * 0.64, y: height * 0.74 }
    ]
    return centers[index] ?? { x: width * 0.7, y: height * 0.45 }
  }

  if (mode === 'flow') {
    return {
      x: width * 0.78,
      y: height * 0.28 + index * Math.max(130, height * 0.22)
    }
  }

  return {
    x: width * 0.75,
    y: height * 0.3 + index * Math.max(120, height * 0.19)
  }
}

const rebuildGraph = () => {
  nodes.clear()
  links.length = 0

  const personAnchor = getPersonAnchor(props.mode)
  const person: GraphNode = {
    id: 'person-huchao',
    type: 'person',
    label: '胡超',
    x: personAnchor.x,
    y: personAnchor.y,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    r: 14,
    tx: personAnchor.x,
    ty: personAnchor.y
  }
  nodes.set(person.id, person)

  const levelCounter = { core: 0, extended: 0, tool: 0 }

  props.techs.forEach((tech) => {
    const idx = levelCounter[tech.level]
    levelCounter[tech.level] += 1
    const anchor = getTechAnchor(tech.level, idx, props.mode)
    nodes.set(`tech-${tech.name}`, {
      id: `tech-${tech.name}`,
      type: 'tech',
      level: tech.level,
      label: tech.name,
      x: anchor.x,
      y: anchor.y,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      r: tech.level === 'core' ? 10 : tech.level === 'extended' ? 8 : 7,
      tx: anchor.x,
      ty: anchor.y
    })
    links.push({ source: person.id, target: `tech-${tech.name}`, kind: 'hierarchy' })
  })

  relationPairs.forEach(([a, b]) => {
    if (nodes.has(`tech-${a}`) && nodes.has(`tech-${b}`)) {
      links.push({ source: `tech-${a}`, target: `tech-${b}`, kind: 'relation' })
    }
  })

  props.projects.forEach((project, idx) => {
    const anchor = getProjectAnchor(idx, props.mode)
    nodes.set(`project-${project.title}`, {
      id: `project-${project.title}`,
      type: 'project',
      label: project.title,
      x: anchor.x,
      y: anchor.y,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      r: 9,
      tx: anchor.x,
      ty: anchor.y
    })
    links.push({ source: person.id, target: `project-${project.title}`, kind: 'project' })

    const relatedTechs = idx === 0 ? ['Vue3', 'TypeScript', 'Mapbox GL'] : idx === 1 ? ['Vue3', 'uni-app', 'Pinia'] : ['Vue3', 'Vite', 'Element Plus']
    relatedTechs.forEach((t) => {
      if (nodes.has(`tech-${t}`)) links.push({ source: `tech-${t}`, target: `project-${project.title}`, kind: 'project' })
    })
  })
}

const updateAnchorsByMode = () => {
  const personAnchor = getPersonAnchor(props.mode)
  const personNode = nodes.get('person-huchao')
  if (personNode) {
    personNode.tx = personAnchor.x
    personNode.ty = personAnchor.y
  }

  const levelCounter = { core: 0, extended: 0, tool: 0 }
  props.techs.forEach((tech) => {
    const idx = levelCounter[tech.level]
    levelCounter[tech.level] += 1
    const anchor = getTechAnchor(tech.level, idx, props.mode)
    const node = nodes.get(`tech-${tech.name}`)
    if (node) {
      node.tx = anchor.x
      node.ty = anchor.y
    }
  })

  props.projects.forEach((project, idx) => {
    const anchor = getProjectAnchor(idx, props.mode)
    const node = nodes.get(`project-${project.title}`)
    if (node) {
      node.tx = anchor.x
      node.ty = anchor.y
    }
  })
}

const applyModeLayout = (snap = false) => {
  updateAnchorsByMode()
  if (!snap) return
  nodes.forEach((node) => {
    node.x = node.tx
    node.y = node.ty
    node.vx = 0
    node.vy = 0
  })
}

const getIdealDistance = (kind: GraphLink['kind']) => {
  if (props.mode === 'project') {
    if (kind === 'relation') return 90
    if (kind === 'project') return 105
    return 125
  }
  if (props.mode === 'flow') {
    if (kind === 'relation') return 150
    if (kind === 'project') return 235
    return 205
  }
  if (kind === 'relation') return 130
  if (kind === 'project') return 155
  return 180
}

const physicsStep = (time: number) => {
  const all = [...nodes.values()]
  const maxAccel = props.mode === 'flow' ? 0.22 : 0.18
  const maxVelocity = props.mode === 'flow' ? 2.2 : 1.75

  all.forEach((n) => {
    n.ax = 0
    n.ay = 0
  })

  for (let i = 0; i < all.length; i += 1) {
    for (let j = i + 1; j < all.length; j += 1) {
      const a = all[i]
      const b = all[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist2 = dx * dx + dy * dy + 0.001
      const minGap = (a.r + b.r) * 2.2
      const repel = dist2 < minGap * minGap ? Math.min(0.085, 14 / dist2) : 0
      if (repel > 0) {
        a.ax -= dx * repel
        a.ay -= dy * repel
        b.ax += dx * repel
        b.ay += dy * repel
      }
    }
  }

  links.forEach((l) => {
    const s = nodes.get(l.source)
    const t = nodes.get(l.target)
    if (!s || !t) return
    const dx = t.x - s.x
    const dy = t.y - s.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const ideal = getIdealDistance(l.kind)
    const pull = (len - ideal) * 0.0014
    s.ax += dx * pull
    s.ay += dy * pull
    t.ax -= dx * pull
    t.ay -= dy * pull
  })

  all.forEach((n, idx) => {
    const springX = (n.tx - n.x) * 0.008
    const springY = (n.ty - n.y) * 0.008
    const float = Math.sin(time * 0.001 + idx * 0.7) * 0.03
    n.ax += springX + float
    n.ay += springY - float

    if (mouse.active) {
      const dx = mouse.x - n.x
      const dy = mouse.y - n.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 170 && dist > 1) {
        const force = (170 - dist) / 170
        n.ax += (dx / dist) * force * 0.045
        n.ay += (dy / dist) * force * 0.045
      }
    }

    if (props.mode === 'flow' && props.hoveredProject && n.type === 'tech') {
      const target = nodes.get(`project-${props.hoveredProject}`)
      if (target) {
        n.ax += (target.x - n.x) * 0.0007
        n.ay += (target.y - n.y) * 0.0007
      }
    }

    n.ax = Math.max(-maxAccel, Math.min(maxAccel, n.ax))
    n.ay = Math.max(-maxAccel, Math.min(maxAccel, n.ay))

    n.vx = (n.vx + n.ax) * 0.92
    n.vy = (n.vy + n.ay) * 0.92
    n.vx = Math.max(-maxVelocity, Math.min(maxVelocity, n.vx))
    n.vy = Math.max(-maxVelocity, Math.min(maxVelocity, n.vy))
    n.x += n.vx
    n.y += n.vy

    // Keep nodes in viewport so mode switch remains visible.
    const pad = n.r + 8
    if (n.x < pad) {
      n.x = pad
      n.vx *= -0.35
    } else if (n.x > width - pad) {
      n.x = width - pad
      n.vx *= -0.35
    }
    if (n.y < pad) {
      n.y = pad
      n.vy *= -0.35
    } else if (n.y > height - pad) {
      n.y = height - pad
      n.vy *= -0.35
    }
  })
}

const isNodeHighlighted = (n: GraphNode) => {
  if (n.type === 'person') return true
  if (props.hoveredTech && n.id === `tech-${props.hoveredTech}`) return true
  if (props.hoveredProject && n.id === `project-${props.hoveredProject}`) return true
  if (props.hoveredProject && n.type === 'tech') {
    return links.some(
      (l) =>
        ((l.source === n.id && l.target === `project-${props.hoveredProject}`) ||
          (l.target === n.id && l.source === `project-${props.hoveredProject}`)) &&
        l.kind === 'project'
    )
  }
  return false
}

const draw = () => {
  if (!ctx) return
  const context = ctx
  context.clearRect(0, 0, width, height)
  const modeLabel = props.mode === 'tech' ? 'TECH GRAPH' : props.mode === 'project' ? 'PROJECT CLUSTERS' : 'DATA FLOW'
  context.fillStyle = 'rgba(205, 223, 255, 0.28)'
  context.font = '600 12px Inter, sans-serif'
  context.fillText(modeLabel, 18, 28)

  links.forEach((l) => {
    const s = nodes.get(l.source)
    const t = nodes.get(l.target)
    if (!s || !t) return
    const highlighted = isNodeHighlighted(s) || isNodeHighlighted(t)
    const fade = props.hoveredTech || props.hoveredProject ? (highlighted ? 0.9 : 0.16) : 0.45
    context.strokeStyle = l.kind === 'relation' ? `rgba(168, 85, 247, ${fade})` : `rgba(77, 144, 254, ${fade * 0.9})`
    context.lineWidth = highlighted ? 2 : 1
    context.beginPath()
    context.moveTo(s.x, s.y)
    context.lineTo(t.x, t.y)
    context.stroke()
  })

  nodes.forEach((n) => {
    const highlighted = isNodeHighlighted(n)
    const dim = props.hoveredTech || props.hoveredProject ? (highlighted ? 1 : 0.24) : 1
    const color =
      n.type === 'person'
        ? `rgba(168, 85, 247, ${dim})`
        : n.type === 'project'
          ? `rgba(77, 144, 254, ${dim})`
          : n.level === 'core'
            ? `rgba(109, 180, 255, ${dim})`
            : n.level === 'extended'
              ? `rgba(145, 163, 255, ${dim})`
              : `rgba(188, 130, 255, ${dim})`
    context.shadowBlur = highlighted ? 18 : 10
    context.shadowColor = color
    context.fillStyle = color
    context.beginPath()
    context.arc(n.x, n.y, highlighted ? n.r + 1.5 : n.r, 0, Math.PI * 2)
    context.fill()
    context.shadowBlur = 0
  })
}

const tick = (time: number) => {
  physicsStep(time)
  draw()
  frameId = window.requestAnimationFrame(tick)
}

const onMove = (e: MouseEvent) => {
  mouse.active = true
  mouse.x = e.clientX
  mouse.y = e.clientY
}

const onLeave = () => {
  mouse.active = false
}

const onClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  if (target?.closest('button, a, .el-tag, .el-card, .el-drawer')) return
  const x = e.clientX
  const y = e.clientY
  for (const n of nodes.values()) {
    if (n.type !== 'tech') continue
    const dx = x - n.x
    const dy = y - n.y
    if (dx * dx + dy * dy <= (n.r + 6) * (n.r + 6)) {
      const tech = props.techs.find((t) => `tech-${t.name}` === n.id)
      if (tech) emit('node-click', tech)
      break
    }
  }
}

onMounted(() => {
  if (!canvasRef.value) return
  setCanvasSize()
  rebuildGraph()
  tick(0)
  const onResize = () => {
    setCanvasSize()
    rebuildGraph()
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseleave', onLeave)
  window.addEventListener('click', onClick)

  onBeforeUnmount(() => {
    window.cancelAnimationFrame(frameId)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('click', onClick)
  })
})

watch(
  () => props.mode,
  () => {
    applyModeLayout(true)
  }
)

watch(
  () => [props.hoveredProject, props.hoveredTech],
  () => {
    updateAnchorsByMode()
  }
)
</script>

<template>
  <canvas ref="canvasRef" class="particle-canvas"></canvas>
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  opacity: 0.82;
  mix-blend-mode: screen;
}
</style>

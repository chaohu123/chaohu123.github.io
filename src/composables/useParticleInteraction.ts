import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { TechEdge, TechNodeMeta } from '../data/techStack'

export const useParticleInteraction = (nodes: TechNodeMeta[], edges: TechEdge[]) => {
  const hoveredName = ref<string | null>(null)
  const lockedName = ref<string | null>(null)
  const stableActiveName = ref<string | null>(null)
  const textSwitchDelay = 160
  let hoverTimer: ReturnType<typeof setTimeout> | null = null

  const activeName = computed(() => lockedName.value ?? hoveredName.value)

  const clearHoverTimer = () => {
    if (!hoverTimer) return
    clearTimeout(hoverTimer)
    hoverTimer = null
  }

  watch(
    activeName,
    (value) => {
      clearHoverTimer()
      hoverTimer = setTimeout(() => {
        stableActiveName.value = value
      }, textSwitchDelay)
    },
    { immediate: true }
  )

  const relatedNames = computed(() => {
    const current = activeName.value
    if (!current) return new Set<string>()

    const names = new Set<string>([current])
    edges.forEach((edge) => {
      if (edge.source === current) names.add(edge.target)
      if (edge.target === current) names.add(edge.source)
    })
    return names
  })

  const activeNode = computed(() => {
    const current = activeName.value
    if (!current) return null
    return nodes.find((item) => item.name === current) ?? null
  })

  const stableActiveNode = computed(() => {
    const current = stableActiveName.value
    if (!current) return null
    return nodes.find((item) => item.name === current) ?? null
  })

  const onTagEnter = (name: string) => {
    if (hoveredName.value === name) return
    if (!lockedName.value) hoveredName.value = name
  }

  const onTagLeave = () => {
    if (!hoveredName.value) return
    if (!lockedName.value) hoveredName.value = null
  }

  const onTagClick = (name: string) => {
    lockedName.value = lockedName.value === name ? null : name
    hoveredName.value = lockedName.value ? name : null
  }

  const onNodeEnter = (name: string) => {
    if (hoveredName.value === name) return
    hoveredName.value = name
  }

  const onNodeLeave = () => {
    hoveredName.value = lockedName.value
  }

  const onNodeClick = (name: string) => {
    onTagClick(name)
  }

  const clearActive = () => {
    clearHoverTimer()
    hoveredName.value = null
    lockedName.value = null
    stableActiveName.value = null
  }

  onBeforeUnmount(() => {
    clearHoverTimer()
  })

  return {
    hoveredName,
    lockedName,
    activeName,
    activeNode,
    stableActiveName,
    stableActiveNode,
    relatedNames,
    onTagEnter,
    onTagLeave,
    onTagClick,
    onNodeEnter,
    onNodeLeave,
    onNodeClick,
    clearActive
  }
}

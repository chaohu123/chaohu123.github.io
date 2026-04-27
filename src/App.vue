<script setup lang="ts">
import { computed, ref } from 'vue'
import { Link, UserFilled, Star, Message, Briefcase, Trophy } from '@element-plus/icons-vue'
import ParticleCanvas from './components/ParticleCanvas.vue'

type TechLevel = 'core' | 'extended' | 'tool'
type Mode = 'tech' | 'project' | 'flow'

const viewModes: Array<{ key: Mode; label: string }> = [
  { key: 'tech', label: '技术视图' },
  { key: 'project', label: '项目视图' },
  { key: 'flow', label: '数据流视图' }
]

const currentMode = ref<Mode>('tech')
const hoveredTech = ref<string | null>(null)
const hoveredProject = ref<string | null>(null)

const techStack: Array<{ name: string; level: TechLevel; desc: string; cases: string[] }> = [
  { name: 'Vue3', level: 'core', desc: '组合式 API 与响应式系统，构建复杂单页应用。', cases: ['新疆数字文化平台', '企业官网项目'] },
  { name: 'TypeScript', level: 'core', desc: '类型系统约束业务边界，提升可维护性。', cases: ['新疆数字文化平台', '超市售卖系统'] },
  { name: 'Pinia', level: 'extended', desc: '统一状态管理，保证多页面数据一致性。', cases: ['超市售卖系统'] },
  { name: 'Vite', level: 'extended', desc: '工程构建与按需加载优化。', cases: ['企业官网项目'] },
  { name: 'uni-app', level: 'extended', desc: '跨端小程序与 H5 统一开发。', cases: ['超市售卖系统'] },
  { name: 'Element Plus', level: 'extended', desc: '中后台组件化开发与设计规范落地。', cases: ['企业官网项目'] },
  { name: 'Mapbox GL', level: 'tool', desc: '地图渲染、聚合标注与空间数据交互。', cases: ['新疆数字文化平台'] },
  { name: 'Axios', level: 'tool', desc: '请求封装与拦截器体系。', cases: ['超市售卖系统', '企业官网项目'] },
  { name: 'Three.js', level: 'tool', desc: '可视化粒子与图形交互。', cases: ['个人主页可视化'] }
]

const projects = [
  {
    title: '新疆数字文化平台',
    desc: 'Vue3+TS+Mapbox实现的可视化单页应用，支持地图标注聚合、多条件筛选，首屏加载优化提升性能',
    github: 'https://github.com/huchao/xj-digital-culture-platform',
    demo: 'https://huchao-demo.vercel.app/xj-digital-culture-platform'
  },
  {
    title: '超市售卖系统',
    desc: 'Vue3+uni-app开发的小程序+后台管理系统，实现完整购物流程，Pinia状态管理保证数据一致性',
    github: 'https://github.com/huchao/supermarket-system',
    demo: 'https://huchao-demo.vercel.app/supermarket-system'
  },
  {
    title: '企业官网项目',
    desc: '响应式企业官网开发，兼容PC/移动端，封装通用组件提升复用率，页面还原度95%+',
    github: 'https://github.com/huchao/company-website',
    demo: 'https://huchao-demo.vercel.app/company-website'
  }
]

const activeTech = computed(() => {
  if (!hoveredTech.value) return null
  return techStack.find((item) => item.name === hoveredTech.value) ?? null
})

const detailVisible = ref(false)
const selectedTech = ref<(typeof techStack)[number] | null>(null)

const onTechNodeClick = (tech: (typeof techStack)[number]) => {
  selectedTech.value = tech
  detailVisible.value = true
}

const onProjectEnter = (title: string) => {
  hoveredProject.value = title
}
const onProjectLeave = () => {
  hoveredProject.value = null
}

const modeLabelMap: Record<Mode, string> = {
  tech: '技术视图',
  project: '项目视图',
  flow: '数据流视图'
}
</script>

<template>
  <ParticleCanvas
    :mode="currentMode"
    :hovered-tech="hoveredTech"
    :hovered-project="hoveredProject"
    :techs="techStack"
    :projects="projects"
    @node-click="onTechNodeClick"
  />
  <div class="page-shell">
    <main class="content">
      <div class="view-toolbar">
        <div class="mode-title">🚀 能力模式切换</div>
        <div class="mode-buttons">
          <el-button
            v-for="mode in viewModes"
            :key="mode.key"
            class="mode-btn"
            :type="currentMode === mode.key ? 'primary' : 'default'"
            @click="currentMode = mode.key"
          >
            {{ mode.label }}
          </el-button>
        </div>
        <div class="mode-state">当前模式：{{ modeLabelMap[currentMode] }}</div>
      </div>

      <el-card class="hero-card" shadow="hover">
        <div class="hero-header">
          <el-icon class="hero-icon"><UserFilled /></el-icon>
          <span>Frontend Engineer Portfolio</span>
        </div>
        <h1>Hi, I'm <span class="accent">胡超</span></h1>
        <p class="intro">
          专注构建高性能、强交互、可维护的前端产品，热爱可视化、工程化与用户体验，熟悉Vue3+TS全栈开发。
        </p>
        <div class="actions">
          <el-button type="primary" size="large" tag="a" href="https://github.com/huchao" target="_blank">
            <el-icon><Link /></el-icon>
            访问 GitHub
          </el-button>
          <el-button size="large" plain class="demo-btn" tag="a" href="https://huchao-demo.vercel.app" target="_blank">
            查看项目演示
          </el-button>
        </div>
      </el-card>

      <section class="grid">
        <el-card class="panel stack-panel" shadow="hover">
          <template #header>
            <div class="panel-title">
              <el-icon><Star /></el-icon>
              <span>Tech Stack</span>
            </div>
          </template>
          <div class="tags">
            <el-tag
              v-for="item in techStack"
              :key="item.name"
              round
              class="tech-tag"
              :class="{ active: hoveredTech === item.name }"
              @mouseenter="hoveredTech = item.name"
              @mouseleave="hoveredTech = null"
            >
              {{ item.name }}
            </el-tag>
          </div>
          <p v-if="activeTech" class="tech-hint">
            {{ activeTech.desc }}
          </p>
        </el-card>

        <el-card class="panel project-panel" shadow="hover">
          <template #header>
            <div class="panel-title">
              <el-icon><Trophy /></el-icon>
              <span>Featured Projects</span>
            </div>
          </template>
          <ul class="project-list">
            <li v-for="project in projects" :key="project.title">
              <article
                class="project-card"
                :class="{ active: hoveredProject === project.title }"
                @mouseenter="onProjectEnter(project.title)"
                @mouseleave="onProjectLeave"
              >
                <h3>{{ project.title }}</h3>
                <p>{{ project.desc }}</p>
                <div class="project-actions">
                  <a :href="project.github" target="_blank" rel="noreferrer">GitHub</a>
                  <a :href="project.demo" target="_blank" rel="noreferrer">在线演示</a>
                </div>
              </article>
            </li>
          </ul>
        </el-card>
      </section>

      <section class="bottom-grid">
        <el-card class="panel" shadow="hover">
          <template #header>
            <div class="panel-title">
              <el-icon><Message /></el-icon>
              <span>联系我</span>
            </div>
          </template>
          <p class="meta-item"><strong>邮箱：</strong> huchao.frontend@gmail.com</p>
          <p class="meta-item"><strong>求职意向：</strong> 前端开发工程师 / 可视化开发工程师</p>
        </el-card>

        <el-card class="panel" shadow="hover">
          <template #header>
            <div class="panel-title">
              <el-icon><Briefcase /></el-icon>
              <span>实习经历与荣誉奖励</span>
            </div>
          </template>
          <div class="exp-block">
            <p><strong>实习经历：</strong> 参与数字文化平台前端开发，负责地图可视化、组件封装与性能优化。</p>
            <p><strong>荣誉奖励：</strong> 蓝桥杯省赛奖项、数学建模竞赛奖项。</p>
          </div>
        </el-card>
      </section>
    </main>
  </div>

  <el-drawer v-model="detailVisible" title="技术节点详情" size="360px">
    <template v-if="selectedTech">
      <p><strong>技术：</strong>{{ selectedTech.name }}</p>
      <p><strong>层级：</strong>{{ selectedTech.level }}</p>
      <p><strong>介绍：</strong>{{ selectedTech.desc }}</p>
      <p><strong>项目案例：</strong></p>
      <ul class="drawer-cases">
        <li v-for="item in selectedTech.cases" :key="item">{{ item }}</li>
      </ul>
    </template>
  </el-drawer>
</template>

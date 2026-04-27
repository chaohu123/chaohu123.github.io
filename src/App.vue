<script setup lang="ts">
import { computed } from 'vue'
import { Link, UserFilled, Star, Message, Briefcase, Trophy } from '@element-plus/icons-vue'
import ParticleGraph from './components/ParticleGraph.vue'
import { useParticleInteraction } from './composables/useParticleInteraction'
import { projects, techEdges, techStack } from './data/techStack'

const {
  activeName,
  lockedName,
  relatedNames,
  stableActiveNode,
  onTagEnter,
  onTagLeave,
  onTagClick,
  onNodeEnter,
  onNodeLeave,
  onNodeClick,
  clearActive
} = useParticleInteraction(techStack, techEdges)

const activeLevel = computed(() => techStack.find((item) => item.name === activeName.value)?.level ?? null)

const onLevelSelect = (level: 'core' | 'extended' | 'tool') => {
  if (activeLevel.value === level) {
    clearActive()
    return
  }
  const firstNode = techStack.find((item) => item.level === level)
  if (firstNode) onTagClick(firstNode.name)
}
</script>

<template>
  <div class="page-shell">
    <main class="content">
      <el-card class="hero-card" shadow="hover">
        <div class="hero-header">
          <el-icon class="hero-icon"><UserFilled /></el-icon>
          <span>前端工程师</span>
        </div>
        <h1>Hi, I'm <span class="accent">胡超</span></h1>
        <p class="intro">
          大连大学计算机科学与技术本科（2026届），现于上海迪士领克科技实习。可独立完成 Vue3 + TypeScript 项目从页面搭建、接口联调到性能优化的全流程开发，具备 PC / 移动端 / 小程序多端交付经验。
        </p>
        <div class="actions">
          <el-button type="primary" size="large" tag="a" href="https://github.com/chaohu123" target="_blank">
            <el-icon><Link /></el-icon>
            访问 GitHub
          </el-button>
          <el-button size="large" plain class="demo-btn" tag="a" href="https://github.com/chaohu123" target="_blank">
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
              :class="{
                active: activeName === item.name,
                related: activeName && relatedNames.has(item.name) && activeName !== item.name
              }"
              @mouseenter="onTagEnter(item.name)"
              @mouseleave="onTagLeave"
              @click="onTagClick(item.name)"
            >
              {{ item.name }}
            </el-tag>
          </div>
          <div class="stack-summary">
            <p v-if="stableActiveNode" class="tech-hint">
              {{ stableActiveNode.description }}
            </p>
            <p v-else class="tech-hint">悬停上方标签或下方节点，可查看技术关系与项目落点。</p>
            <button v-if="lockedName" class="stack-clear" type="button" @click="clearActive">清除锁定</button>
          </div>
          <ParticleGraph
            :nodes="techStack"
            :edges="techEdges"
            :projects="projects"
            :active-name="activeName"
            :locked-name="lockedName"
            :related-names="relatedNames"
            :active-level="activeLevel"
            @node-enter="onNodeEnter"
            @node-leave="onNodeLeave"
            @node-click="onNodeClick"
            @level-click="onLevelSelect"
          />
        </el-card>

        <el-card class="panel project-panel" shadow="hover">
          <template #header>
            <div class="panel-title">
              <el-icon><Trophy /></el-icon>
              <span>项目经验</span>
            </div>
          </template>
          <ul class="project-list">
            <li v-for="project in projects" :key="project.title">
              <article
                class="project-card"
                :class="{ active: stableActiveNode?.projects.includes(project.title) }"
              >
                <h3>{{ project.title }}</h3>
                <p class="project-meta">
                  <span>{{ project.period }}</span>
                  <span>{{ project.role }}</span>
                </p>
                <div class="project-stack">
                  <span v-for="tech in project.stack" :key="`${project.title}-${tech}`">{{ tech }}</span>
                </div>
                <p>{{ project.description }}</p>
                <ul class="project-highlights">
                  <li v-for="item in project.highlights" :key="item">{{ item }}</li>
                </ul>
                <div class="project-actions">
                  <a :href="project.github" target="_blank" rel="noreferrer">GitHub</a>
                  <a :href="project.demo" target="_blank" rel="noreferrer">项目主页</a>
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
          <p class="meta-item"><strong>电话：</strong> 17674771379</p>
          <p class="meta-item"><strong>邮箱：</strong> 3251471239@qq.com</p>
          <p class="meta-item"><strong>现居：</strong> 上海市浦东新区</p>
          <p class="meta-item"><strong>求职意向：</strong> 前端开发工程师</p>
        </el-card>

        <el-card class="panel" shadow="hover">
          <template #header>
            <div class="panel-title">
              <el-icon><Briefcase /></el-icon>
              <span>实习经历与荣誉奖励</span>
            </div>
          </template>
          <div class="exp-block">
            <p><strong>实习经历：</strong> 2026.02 至今于上海迪士领克科技担任前端实习生，负责企业官网前端落地、接口联调与动态渲染，并封装通用组件提升复用率。</p>
            <p><strong>校内经历：</strong> 曾任数据科学工作室干事，参与网站维护、技术文稿发布与赛事技术支持。</p>
            <p><strong>荣誉奖励：</strong> 蓝桥杯省二等奖、数学建模校赛一等奖、全国电子商务创新创业挑战赛校级三等奖。</p>
          </div>
        </el-card>
      </section>

    </main>
  </div>
</template>

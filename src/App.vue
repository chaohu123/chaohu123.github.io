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

const projectLookup = computed(() => new Map(projects.map((item) => [item.title, item])))
</script>

<template>
  <div class="page-shell">
    <main class="content">
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
            @node-enter="onNodeEnter"
            @node-leave="onNodeLeave"
            @node-click="onNodeClick"
          />
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
                :class="{ active: stableActiveNode?.projects.includes(project.title) }"
              >
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
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

      <el-card class="panel active-tech-panel" :class="{ 'is-empty': !stableActiveNode }" shadow="hover">
        <template #header>
          <div class="panel-title">
            <el-icon><Star /></el-icon>
            <span>{{ stableActiveNode ? `${stableActiveNode.name} · 技术关系摘要` : '技术关系摘要' }}</span>
          </div>
        </template>
        <p class="meta-item"><strong>一句话描述：</strong>{{ stableActiveNode?.description || '悬停或锁定一个技术标签后，将在此显示详细信息。' }}</p>
        <p class="meta-item"><strong>使用场景：</strong>{{ stableActiveNode?.usage || '用于补充 Tech Stack 图谱中的语义说明与关联项目。' }}</p>
        <div class="related-projects" v-if="stableActiveNode">
          <a
            v-for="title in stableActiveNode.projects"
            :key="title"
            class="related-project-link"
            :href="projectLookup.get(title)?.demo || projectLookup.get(title)?.github || '#'"
            target="_blank"
            rel="noreferrer"
          >
            {{ title }}
          </a>
        </div>
      </el-card>
    </main>
  </div>
</template>

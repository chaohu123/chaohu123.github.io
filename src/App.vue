<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  Link,
  UserFilled,
  Star,
  Message,
  Briefcase,
  Trophy,
  CopyDocument,
  Moon,
  Sunny,
} from "@element-plus/icons-vue";
import ParticleGraph from "./components/ParticleGraph.vue";
import { useParticleInteraction } from "./composables/useParticleInteraction";
import {
  projects,
  techEdges,
  techStack,
  type ProjectMeta,
  type TechLevel,
} from "./data/techStack";

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
  clearActive,
} = useParticleInteraction(techStack, techEdges);

const activeLevel = computed(
  () => techStack.find((item) => item.name === activeName.value)?.level ?? null,
);
const techLevelGroups: Array<{ key: TechLevel; label: string }> = [
  { key: "core", label: "核心能力" },
  { key: "extended", label: "扩展能力" },
  { key: "tool", label: "工具工程" },
];
const expandedProjects = ref<Set<string>>(new Set());
const copiedField = ref<"phone" | "email" | null>(null);
const theme = ref<"dark" | "light">("dark");
const ambientLeftRef = ref<HTMLElement | null>(null);
const ambientRightRef = ref<HTMLElement | null>(null);
let copyFeedbackTimer: ReturnType<typeof setTimeout> | null = null;
let ambientFrameId = 0;
let ambientColorTimer: ReturnType<typeof setInterval> | null = null;

type AmbientDotState = {
  container: HTMLElement;
  dots: HTMLElement[];
  dotStates: Array<{
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
  }>;
};
const ambientStates: AmbientDotState[] = [];

const applyTheme = (nextTheme: "dark" | "light") => {
  theme.value = nextTheme;
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
};

const toggleTheme = () => {
  applyTheme(theme.value === "dark" ? "light" : "dark");
};

const onLevelSelect = (level: "core" | "extended" | "tool") => {
  if (activeLevel.value === level) {
    clearActive();
    return;
  }
  const firstNode = techStack.find((item) => item.level === level);
  if (firstNode) onTagClick(firstNode.name);
};

const toggleProjectHighlights = (title: string) => {
  if (expandedProjects.value.has(title)) expandedProjects.value.delete(title);
  else expandedProjects.value.add(title);
  expandedProjects.value = new Set(expandedProjects.value);
};

const getVisibleHighlights = (project: ProjectMeta) => {
  return expandedProjects.value.has(project.title)
    ? project.highlights
    : project.highlights.slice(0, 2);
};

const copyToClipboard = async (value: string, field: "phone" | "email") => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.setAttribute("readonly", "true");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    copiedField.value = field;
    if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = setTimeout(() => {
      copiedField.value = null;
    }, 1800);
  } catch {
    copiedField.value = null;
  }
};

onBeforeUnmount(() => {
  if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
  if (ambientFrameId) cancelAnimationFrame(ambientFrameId);
  if (ambientColorTimer) clearInterval(ambientColorTimer);
});

onMounted(() => {
  const cachedTheme = localStorage.getItem("theme");
  applyTheme(cachedTheme === "light" ? "light" : "dark");

  const initAmbient = (container: HTMLElement | null) => {
    if (!container) return;
    const dots = Array.from(
      container.querySelectorAll<HTMLElement>(".ambient-dot"),
    );
    if (!dots.length) return;
    const dotStates = dots.map(() => ({
      x: 52 + Math.random() * 26,
      y: 160 + Math.random() * 180,
      velocityX: (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.28),
      velocityY: (Math.random() > 0.5 ? 1 : -1) * (0.45 + Math.random() * 0.35),
    }));
    ambientStates.push({
      container,
      dots,
      dotStates,
    });
  };

  const randomSpeed = () => 0.32 + Math.random() * 0.62;
  const randomSignedSpeed = () =>
    (Math.random() > 0.5 ? 1 : -1) * randomSpeed();

  const reorientAfterCollision = (
    dotState: AmbientDotState["dotStates"][number],
    axis: "x" | "y",
    edge: "min" | "max",
  ) => {
    if (axis === "x") {
      dotState.velocityX = edge === "min" ? randomSpeed() : -randomSpeed();
      dotState.velocityY = randomSignedSpeed();
    } else {
      dotState.velocityY = edge === "min" ? randomSpeed() : -randomSpeed();
      dotState.velocityX = randomSignedSpeed();
    }
  };

  const randomizeDotColor = (dot: HTMLElement) => {
    const hue = Math.floor(Math.random() * 120) + 190;
    const size = 9 + Math.random() * 7;
    const glow = 10 + Math.random() * 12;
    const alpha = 0.2 + Math.random() * 0.28;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = `${45 + Math.random() * 55}%`;
    dot.style.background = `radial-gradient(circle at 35% 35%, hsla(${hue}, 100%, 92%, 0.96), hsla(${hue + 22}, 88%, 66%, ${alpha.toFixed(2)}))`;
    dot.style.boxShadow = `0 0 ${glow}px hsla(${hue + 10}, 88%, 70%, 0.52)`;
  };

  const tickAmbient = () => {
    ambientStates.forEach((state) => {
      const rect = state.container.getBoundingClientRect();
      const insetX = 28;
      const insetY = rect.height * 0.12;
      state.dots.forEach((dot, index) => {
        const dotState = state.dotStates[index];
        if (!dotState) return;
        const width = Number.parseFloat(dot.style.width || "14");
        const height = Number.parseFloat(dot.style.height || "14");
        const radius = Math.max(width, height) / 2;
        const minX = insetX + radius + 1;
        const maxX = rect.width - insetX - radius - 1;
        const minY = insetY + radius + 1;
        const maxY = rect.height - insetY - radius - 1;

        dotState.x += dotState.velocityX;
        dotState.y += dotState.velocityY;

        if (dotState.x < minX) {
          dotState.x = minX;
          reorientAfterCollision(dotState, "x", "min");
        } else if (dotState.x > maxX) {
          dotState.x = maxX;
          reorientAfterCollision(dotState, "x", "max");
        }
        if (dotState.y < minY) {
          dotState.y = minY;
          reorientAfterCollision(dotState, "y", "min");
        } else if (dotState.y > maxY) {
          dotState.y = maxY;
          reorientAfterCollision(dotState, "y", "max");
        }

        dot.style.transform = `translate(${dotState.x}px, ${dotState.y}px)`;
      });
    });
    ambientFrameId = requestAnimationFrame(tickAmbient);
  };

  initAmbient(ambientLeftRef.value);
  initAmbient(ambientRightRef.value);
  ambientStates.forEach((state) =>
    state.dots.forEach((dot) => randomizeDotColor(dot)),
  );
  ambientColorTimer = setInterval(() => {
    ambientStates.forEach((state) =>
      state.dots.forEach((dot) => randomizeDotColor(dot)),
    );
  }, 1300);
  ambientFrameId = requestAnimationFrame(tickAmbient);
});
</script>

<template>
  <div class="page-shell">
    <div
      ref="ambientLeftRef"
      class="side-ambient side-ambient-left"
      aria-hidden="true"
    >
      <span class="ambient-marquee"></span>
      <span class="ambient-marquee"></span>
      <span class="ambient-dot"></span>
      <span class="ambient-dot"></span>
      <span class="ambient-dot"></span>
    </div>
    <div
      ref="ambientRightRef"
      class="side-ambient side-ambient-right"
      aria-hidden="true"
    >
      <span class="ambient-marquee"></span>
      <span class="ambient-marquee"></span>
      <span class="ambient-dot"></span>
      <span class="ambient-dot"></span>
      <span class="ambient-dot"></span>
    </div>
    <main class="content">
      <el-card class="hero-card" shadow="hover">
        <div class="hero-header">
          <div class="hero-title-wrap">
            <el-icon class="hero-icon"><UserFilled /></el-icon>
            <span>前端工程师</span>
          </div>
          <button type="button" class="theme-toggle-btn" @click="toggleTheme">
            <el-icon><Sunny v-if="theme === 'light'" /><Moon v-else /></el-icon>
            <span>{{ theme === "light" ? "浅色" : "深色" }}</span>
          </button>
        </div>
        <h1>Hi, I'm <span class="accent name-breath">胡超</span></h1>
        <p class="intro">
          可独立完成基于 Vue3 + JavaScript
          的前端项目全流程开发，从需求对接、页面搭建、组件封装，到接口联调、状态管理、性能优化与多端适配均可独立落地。熟练掌握
          Git 团队协作流程，包括分支管理、代码提交规范、Code Review
          与冲突解决，能配合团队完成版本迭代与线上发布。同时具备 PC
          端、移动端、小程序的多端交付经验，可快速适配不同终端的开发场景与业务需求。
        </p>
        <div class="intro-advantages">
          <span>独立交付能力</span>
          <span>工程化与性能优化</span>
          <span>可视化交互实现</span>
          <span>多端开发经验</span>
        </div>
        <div class="actions">
          <el-button
            type="primary"
            size="large"
            tag="a"
            href="https://github.com/chaohu123"
            target="_blank"
          >
            <el-icon><Link /></el-icon>
            访问 GitHub
          </el-button>
          <el-button
            size="large"
            plain
            class="demo-btn"
            tag="a"
            href="https://github.com/chaohu123"
            target="_blank"
          >
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
          <div class="tags-group-list">
            <section
              v-for="group in techLevelGroups"
              :key="group.key"
              class="tags-group"
            >
              <h4 class="tags-group-title">{{ group.label }}</h4>
              <div class="tags">
                <el-tag
                  v-for="item in techStack.filter(
                    (tech) => tech.level === group.key,
                  )"
                  :key="item.name"
                  round
                  class="tech-tag"
                  :class="{
                    active: activeName === item.name,
                    related:
                      activeName &&
                      relatedNames.has(item.name) &&
                      activeName !== item.name,
                  }"
                  @mouseenter="onTagEnter(item.name)"
                  @mouseleave="onTagLeave"
                  @click="onTagClick(item.name)"
                >
                  {{ item.name }}
                </el-tag>
              </div>
            </section>
          </div>
          <div class="stack-summary">
            <p v-if="stableActiveNode" class="tech-hint">
              {{ stableActiveNode.description }}
            </p>
            <p v-else class="tech-hint">
              悬停上方标签或下方节点，可查看技术关系与项目落点。
            </p>
            <button
              v-if="lockedName"
              class="stack-clear"
              type="button"
              @click="clearActive"
            >
              清除锁定
            </button>
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
                :class="{
                  active: stableActiveNode?.projects.includes(project.title),
                }"
              >
                <h3>{{ project.title }}</h3>
                <p class="project-meta">
                  <span>{{ project.period }}</span>
                  <span>{{ project.role }}</span>
                </p>
                <div class="project-stack">
                  <span
                    v-for="tech in project.stack"
                    :key="`${project.title}-${tech}`"
                    >{{ tech }}</span
                  >
                </div>
                <p>{{ project.description }}</p>
                <ul class="project-highlights">
                  <li v-for="item in getVisibleHighlights(project)" :key="item">
                    {{ item }}
                  </li>
                </ul>
                <button
                  v-if="project.highlights.length > 2"
                  type="button"
                  class="project-toggle"
                  @click="toggleProjectHighlights(project.title)"
                >
                  {{
                    expandedProjects.has(project.title)
                      ? "收起亮点"
                      : "展开亮点"
                  }}
                </button>
                <div class="project-actions">
                  <a :href="project.github" target="_blank" rel="noreferrer"
                    >GitHub</a
                  >
                  <a :href="project.demo" target="_blank" rel="noreferrer"
                    >项目主页</a
                  >
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
          <div class="contact-row">
            <p class="meta-item"><strong>电话：</strong> 17674771379</p>
            <button
              type="button"
              class="copy-btn"
              :title="copiedField === 'phone' ? '已复制' : '复制电话'"
              @click="copyToClipboard('17674771379', 'phone')"
            >
              <el-icon class="copy-btn-icon"><CopyDocument /></el-icon>
              <span>{{ copiedField === "phone" ? "已复制" : "复制" }}</span>
            </button>
          </div>
          <div class="contact-row">
            <p class="meta-item"><strong>邮箱：</strong> 3251471239@qq.com</p>
            <button
              type="button"
              class="copy-btn"
              :title="copiedField === 'email' ? '已复制' : '复制邮箱'"
              @click="copyToClipboard('3251471239@qq.com', 'email')"
            >
              <el-icon class="copy-btn-icon"><CopyDocument /></el-icon>
              <span>{{ copiedField === "email" ? "已复制" : "复制" }}</span>
            </button>
          </div>
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
            <p>
              <strong>实习经历：</strong> 2026.02
              至今于上海迪士领克科技担任前端实习生，负责企业官网前端落地、接口联调与动态渲染，并封装通用组件提升复用率。
            </p>
            <p>
              <strong>校内经历：</strong>
              曾任数据科学工作室干事，参与网站维护、技术文稿发布与赛事技术支持。
            </p>
            <p>
              <strong>荣誉奖励：</strong>
              蓝桥杯省二等奖、数学建模校赛一等奖、全国电子商务创新创业挑战赛校级三等奖。
            </p>
          </div>
        </el-card>
      </section>
    </main>
  </div>
</template>

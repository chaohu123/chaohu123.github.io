# 胡超 | 前端工程师作品集

> 大连大学计算机科学与技术（2026届）  
> 求职方向：前端开发工程师（Vue3 / TypeScript / 可视化）

本项目是个人求职作品集主页，聚焦“**工程化能力 + 业务落地 + 可视化表达**”，用于展示：

- 前端技术栈与能力关系图（可交互技能树）
- 代表性项目经验与职责成果
- 实习经历、荣誉奖励与联系方式

---

## 面向招聘方的快速信息

- **候选人**：胡超
- **目标岗位**：前端开发工程师
- **当前状态**：离职
- **技术关键词**：Vue3、TypeScript、Pinia、Axios、uni-app、Element Plus、Mapbox GL、Git
- **个人主页 / 仓库主页**：<https://github.com/chaohu123>

---

## 核心亮点（可面试展开）

- **独立交付能力**：可独立完成页面开发、接口联调、状态管理与上线部署流程。
- **工程化意识**：具备 Axios 请求层封装、错误拦截、路由懒加载、模块化拆分等实践。
- **可视化表达能力**：实现基于 Canvas 的技能图谱交互，支持节点联动、关系高亮与层级切换。
- **多端经验**：具备 PC、移动端与小程序场景开发经验（Vue3 + uni-app）。

---

## 项目展示内容

本页面聚合以下信息模块：

- **Hero 简介**：个人定位、技术方向、求职意向
- **Tech Stack 图谱**：技能树节点关系、悬浮说明、层级筛选
- **项目经验**：项目简介、技术栈、GitHub / Demo 入口
- **经历信息**：实习经历、校内经历、荣誉奖励

项目数据集中维护在 `src/data/techStack.ts`，便于按简历快速更新。

---

## 技术栈

- Vue 3（`<script setup>`）
- TypeScript
- Vite
- Element Plus
- Canvas 2D（自定义粒子关系图）

---

## 本地运行

```bash
npm install
npm run dev
```

默认访问：<http://localhost:5173>

## 构建命令

```bash
npm run build
npm run preview
```

---

## 目录结构

```text
src/
  components/
    ParticleGraph.vue           # 技能树可视化图谱组件
  composables/
    useParticleInteraction.ts   # 节点 hover/lock/防抖交互逻辑
  data/
    techStack.ts                # 项目与技能数据配置
  App.vue                       # 页面主结构（模块编排）
  style.css                     # 全局样式
```

---image.png

## 联系方式

- 邮箱：3251471239@qq.com
- 电话：17674771379
- GitHub：<https://github.com/chaohu123>

---

## License

本仓库内容用于个人学习与求职展示。

export type TechLevel = 'core' | 'extended' | 'tool'

export type ProjectMeta = {
  title: string
  description: string
  github: string
  demo: string
}

export type TechNodeMeta = {
  name: string
  level: TechLevel
  description: string
  usage: string
  projects: string[]
}

export type TechEdge = {
  source: string
  target: string
}

export const projects: ProjectMeta[] = [
  {
    title: '新疆数字文化平台',
    description:
      '独立开发的文化资源检索单页应用，基于 Vue3 + TS + Mapbox GL 实现路线可视化、标注聚合与多条件筛选，并完成首屏与路由懒加载优化。',
    github: 'https://github.com/chaohu123/xinjiang',
    demo: 'https://github.com/chaohu123'
  },
  {
    title: '超市售卖系统',
    description:
      '独立完成后台 + 小程序双端开发，覆盖商品、订单、用户与营销流程；通过 Pinia + Axios 封装保障状态一致性与接口容错。',
    github: 'https://github.com/huchao/supermarket-system',
    demo: 'https://github.com/chaohu123'
  },
  {
    title: 'Dslink 企业官网',
    description:
      '在上海迪士领克科技实习期间负责官网前端开发，完成响应式适配、接口联调与动态渲染，并沉淀通用业务组件提升复用效率。',
    github: 'https://dslink.cn',
    demo: 'https://github.com/chaohu123'
  },
]

export const techStack: TechNodeMeta[] = [
  {
    name: 'Vue3',
    level: 'core',
    description: '以 Composition API 组织复杂业务，支持高复用组件与可维护状态流。',
    usage: '企业官网、管理后台、可视化单页应用。',
    projects: ['新疆数字文化平台', '超市售卖系统', 'Dslink 企业官网', '个人主页可视化']
  },
  {
    name: 'TypeScript',
    level: 'core',
    description: '通过类型系统约束业务边界，提升维护性与协作效率。',
    usage: '复杂状态建模、组件约束与接口定义。',
    projects: ['新疆数字文化平台', '超市售卖系统', '个人主页可视化']
  },
  {
    name: 'Vite',
    level: 'extended',
    description: '现代化构建工具链，支持快速启动与可控打包优化。',
    usage: '工程构建、路由懒加载与性能优化实践。',
    projects: ['Dslink 企业官网', '个人主页可视化']
  },
  {
    name: 'Pinia',
    level: 'extended',
    description: '轻量状态管理方案，适配 Vue3 组合式开发。',
    usage: '跨页面状态共享与业务状态沉淀。',
    projects: ['超市售卖系统']
  },
  {
    name: 'uni-app',
    level: 'extended',
    description: '跨端开发框架，可同时覆盖小程序与 H5。',
    usage: '多端业务复用与快速交付。',
    projects: ['超市售卖系统']
  },
  {
    name: 'Element Plus',
    level: 'extended',
    description: 'Vue3 生态中的组件库，适合中后台与信息型页面。',
    usage: '表单、弹层、数据展示等通用 UI 场景。',
    projects: ['Dslink 企业官网', '个人主页可视化', '超市售卖系统', '新疆数字文化平台']
  },
  {
    name: 'Mapbox GL',
    level: 'tool',
    description: '面向空间可视化的地图渲染与交互方案。',
    usage: '地图标注、聚合、图层控制与空间数据展示。',
    projects: ['新疆数字文化平台']
  },
  {
    name: 'Axios',
    level: 'tool',
    description: '统一请求封装与拦截器体系，支持 Token 注入、错误兜底与自动刷新。',
    usage: '接口联调、异常拦截与通用请求层建设。',
    projects: ['超市售卖系统', 'Dslink 企业官网', '新疆数字文化平台']
  },
  {
    name: 'Three.js',
    level: 'tool',
    description: '3D 与图形可视化引擎，可承载动效与空间表达。',
    usage: '粒子系统、图形交互与沉浸式视觉效果。',
    projects: ['个人主页可视化']
  },
  {
    name: 'ECharts',
    level: 'tool',
    description: '成熟的数据可视化库，适合快速构建业务图表。',
    usage: '统计报表、趋势图与数据看板。',
    projects: ['新疆数字文化平台']
  },
  {
    name: 'SCSS',
    level: 'tool',
    description: '增强型 CSS 预处理器，便于样式拆分与主题管理。',
    usage: '复杂样式组织、变量与混入复用。',
    projects: ['Dslink 企业官网', '个人主页可视化']
  },
  {
    name: 'Node.js',
    level: 'tool',
    description: '前端工程化与脚本环境基础设施。',
    usage: '构建脚本、自动化任务与开发环境支持。',
    projects: ['超市售卖系统', 'Dslink 企业官网', '个人主页可视化']
  },
  {
    name: 'Git',
    level: 'tool',
    description: '分布式版本控制工具，支撑多人协作与代码版本追踪。',
    usage: '分支协作、代码回溯、发布流程管理。',
    projects: ['新疆数字文化平台', '超市售卖系统', 'Dslink 企业官网', '个人主页可视化']
  }
]

export const techEdges: TechEdge[] = [
  { source: 'Vue3', target: 'Pinia' },
  { source: 'Vue3', target: 'Vite' },
  { source: 'TypeScript', target: 'Vue3' },
  { source: 'Vue3', target: 'Element Plus' },
  { source: 'Vue3', target: 'uni-app' },
  { source: 'Vue3', target: 'Mapbox GL' },
  { source: 'TypeScript', target: 'Axios' },
  { source: 'TypeScript', target: 'Node.js' },
  { source: 'Node.js', target: 'Git' },
  { source: 'Vue3', target: 'Git' },
  { source: 'Vite', target: 'SCSS' },
  { source: 'Three.js', target: 'TypeScript' },
  { source: 'ECharts', target: 'TypeScript' },
  { source: 'Element Plus', target: 'SCSS' }
]

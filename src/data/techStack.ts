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
    description: 'Vue3 + TS + Mapbox 的可视化单页应用，支持地图标注聚合、多条件筛选与首屏性能优化。',
    github: 'https://github.com/huchao/xj-digital-culture-platform',
    demo: 'https://huchao-demo.vercel.app/xj-digital-culture-platform'
  },
  {
    title: '超市售卖系统',
    description: '基于 Vue3 + uni-app 的小程序与后台管理系统，覆盖购物链路与状态管理。',
    github: 'https://github.com/huchao/supermarket-system',
    demo: 'https://huchao-demo.vercel.app/supermarket-system'
  },
  {
    title: '企业官网项目',
    description: '响应式企业官网开发，兼容 PC 与移动端，沉淀通用组件与页面还原方案。',
    github: 'https://github.com/huchao/company-website',
    demo: 'https://huchao-demo.vercel.app/company-website'
  },
  {
    title: '个人主页可视化',
    description: '围绕前端技术栈构建关系图与可视化交互，强调动画与体验表达。',
    github: 'https://github.com/huchao',
    demo: 'https://huchao-demo.vercel.app'
  }
]

export const techStack: TechNodeMeta[] = [
  {
    name: 'Vue3',
    level: 'core',
    description: '组合式 API 与响应式系统，适合构建复杂单页应用。',
    usage: '中大型业务页面、组件抽象与高交互界面。',
    projects: ['新疆数字文化平台', '超市售卖系统', '企业官网项目', '个人主页可视化']
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
    description: '现代前端构建工具，具备快速启动与良好扩展性。',
    usage: '工程构建、开发体验优化与按需加载配置。',
    projects: ['企业官网项目', '个人主页可视化']
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
    projects: ['企业官网项目', '个人主页可视化']
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
    description: '请求封装基础设施，便于统一拦截与错误处理。',
    usage: '接口请求封装、鉴权与错误兜底。',
    projects: ['超市售卖系统', '企业官网项目']
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
    projects: ['企业官网项目', '个人主页可视化']
  },
  {
    name: 'Node.js',
    level: 'tool',
    description: '前端工程化与脚本环境基础设施。',
    usage: '构建脚本、自动化任务与开发环境支持。',
    projects: ['超市售卖系统', '企业官网项目', '个人主页可视化']
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
  { source: 'Vite', target: 'SCSS' },
  { source: 'Three.js', target: 'TypeScript' },
  { source: 'ECharts', target: 'TypeScript' },
  { source: 'Element Plus', target: 'SCSS' }
]

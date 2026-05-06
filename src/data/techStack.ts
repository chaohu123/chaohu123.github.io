export type TechLevel = 'core' | 'extended' | 'tool'

export type ProjectMeta = {
  title: string
  period: string
  role: string
  stack: string[]
  description: string
  highlights: string[]
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
    title: 'Dslink 企业官网',
    period: '2026.02 - 至今',
    role: '前端实习生 / 前端开发（实习）',
    stack: ['Vue3', 'TypeScript', 'Vite', 'Element Plus', 'Axios', 'SCSS'],
    description:
      '在实习期间负责企业官网前端落地，重点推进响应式适配、接口联调与组件复用。',
    highlights: [
      '独立完成页面静态搭建与多端样式适配，保证 PC 与移动端一致体验。',
      '完成接口对接与动态渲染流程，保障内容更新和交互反馈稳定。',
      '沉淀通用业务组件与工具函数，降低后续页面开发与维护成本。'
    ],
    github: 'https://dslink.cn',
    demo: 'https://github.com/chaohu123'
  },
  {
    title: '反诈信息识别与风险自测平台',
    period: '2024.09 – 2025.05',
    role: '独立开发（毕设）',
    stack: [
      'Vue3',
      'TypeScript',
      'Vite',
      'Pinia',
      'Vue Router',
      'Axios',
      'Element Plus',
      'ECharts',
      'Sass'
    ],
    description:
      '前后端分离的 Web 系统，面向高校学生等普通用户，提供诈骗案例识别训练、防骗知识学习、可解释风险测评与报告、成就激励等能力，并配套管理端用于案例/题库/知识/轮播等内容维护与数据统计，形成「学习—测评—运营」闭环。',
    highlights: [
      '网络层：基于 Axios 封装请求实例与响应拦截，兼容后端统一 Result 结构，集中处理业务错误与网络异常，降低页面侧重复逻辑。',
      '数据可视化与交互：前台/管理端结合 ECharts 做统计与展示；训练、测评、知识库等模块与路由、状态管理联动，支持多入口业务流程。',
      '工程化与体验：Vite 构建、路由懒加载与组件化拆分，配合 Element Plus 统一交互；管理端与用户端通过路由守卫区分访问边界。'
    ],
    github: 'https://github.com/chaohu123',
    demo: 'https://anti-fraud-web.vercel.app/'
  },
  {
    title: '个性化旅游路线规划与旅友结伴平台',
    period: '2025.01 - 2026.05',
    role: '独立开发（全栈）',
    stack: [
      'Vue3',
      'TypeScript',
      'Vite',
      'Pinia',
      'Vue Router',
      'Element Plus',
      'Tailwind CSS',
      'Axios',
      'ECharts',
      '高德地图 JS API',
      'Spring Boot 3'
    ],
    description:
      '围绕智能路线规划、结伴活动、游记与社区动态、私信与消息中心构建前后端分离的单页应用，支持地图上的路线/景点展示与多端业务联动。',
    highlights: [
      '接口层：基于 Axios 封装请求与拦截器，统一错误处理与鉴权头传递，与 Spring Boot REST 对接，提升调用一致性与可维护性。',
      '地图与行程：集成高德地图能力，在路线详情、景点详情等页面完成地图初始化、标记与折线展示，并与行程数据联动，便于「看路线、找点位」。',
      '工程化与体验：前端启用 TypeScript 严格模式与 vue-tsc 做类型检查，配合 Pinia 分域状态（行程规划、会话、消息等），组件化拆分社区/个人中心/聊天等模块，便于迭代与部署。'
    ],
    github: 'https://github.com/chaohu123',
    demo: 'https://web-travel-system.vercel.app/'
  },
  {
    title: '新疆数字文化平台',
    period: '2025.09 - 2025.10',
    role: '独立开发',
    stack: ['Vue3', 'TypeScript', 'Pinia', 'Mapbox GL', 'Axios', 'Element Plus'],
    description:
      '围绕文化资源展示与检索构建单页应用，支持地图路线可视化和多维条件筛选。',
    highlights: [
      '封装 Axios 请求层与拦截器，统一错误处理与 Token 刷新，提升接口稳定性。',
      '实现 Mapbox GL 路线可视化、标注聚合与筛选联动，提升信息检索效率。',
      '通过首屏渲染优化与路由懒加载，改善首次访问体验。'
    ],
    github: 'https://github.com/chaohu123/xinjiang',
    demo: 'https://xinjiang-rc3g.vercel.app/home'
  },
  {
    title: '超市售卖系统',
    period: '2025.08 - 2025.09',
    role: '独立开发',
    stack: ['Vue3', 'uni-app', 'TypeScript', 'Pinia', 'Axios', 'Element Plus'],
    description:
      '搭建后台管理端与微信小程序双端系统，覆盖商品、订单、用户与营销核心流程。',
    highlights: [
      '实现商品分页、条件筛选与批量操作，减少后台重复操作步骤。',
      '在小程序端完成购物车、下单与订单跟踪链路，完善业务闭环。',
      '使用 Pinia 统一用户与订单状态，结合 Axios 异常拦截提升容错能力。'
    ],
    github: 'https://github.com/huchao/supermarket-system',
    demo: 'https://github.com/chaohu123'
  }
]

export const techStack: TechNodeMeta[] = [
  {
    name: 'Vue3',
    level: 'core',
    description: '以 Composition API 组织复杂业务，支持高复用组件与可维护状态流。',
    usage: '企业官网、管理后台、可视化单页应用。',
    projects: [
      '新疆数字文化平台',
      '超市售卖系统',
      'Dslink 企业官网',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台',
      '个人主页可视化'
    ]
  },
  {
    name: 'TypeScript',
    level: 'core',
    description: '通过类型系统约束业务边界，提升维护性与协作效率。',
    usage: '复杂状态建模、组件约束与接口定义。',
    projects: [
      '新疆数字文化平台',
      '超市售卖系统',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台',
      '个人主页可视化'
    ]
  },
  {
    name: 'Vite',
    level: 'extended',
    description: '现代化构建工具链，支持快速启动与可控打包优化。',
    usage: '工程构建、路由懒加载与性能优化实践。',
    projects: [
      'Dslink 企业官网',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台',
      '个人主页可视化'
    ]
  },
  {
    name: 'Vue Router',
    level: 'extended',
    description: '官方路由方案，支撑多入口业务流程与访问边界控制。',
    usage: 'SPA 路由懒加载、导航守卫与权限分流。',
    projects: ['反诈信息识别与风险自测平台', '个性化旅游路线规划与旅友结伴平台']
  },
  {
    name: 'Pinia',
    level: 'extended',
    description: '轻量状态管理方案，适配 Vue3 组合式开发。',
    usage: '跨页面状态共享与业务状态沉淀。',
    projects: [
      '超市售卖系统',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台'
    ]
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
    projects: [
      'Dslink 企业官网',
      '个人主页可视化',
      '超市售卖系统',
      '新疆数字文化平台',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台'
    ]
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
    projects: [
      '超市售卖系统',
      'Dslink 企业官网',
      '新疆数字文化平台',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台'
    ]
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
    projects: [
      '新疆数字文化平台',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台'
    ]
  },
  {
    name: 'Tailwind CSS',
    level: 'tool',
    description: '实用优先的原子化 CSS 方案，便于快速搭建一致界面。',
    usage: '布局、间距、响应式与主题变量组合。',
    projects: ['个性化旅游路线规划与旅友结伴平台']
  },
  {
    name: '高德地图 JS API',
    level: 'tool',
    description: '国内常用的 Web 地图 SDK，支持标记、折线与地理编码等能力。',
    usage: '路线展示、景点定位与地图交互。',
    projects: ['个性化旅游路线规划与旅友结伴平台']
  },
  {
    name: 'SCSS',
    level: 'tool',
    description: '增强型 CSS 预处理器，便于样式拆分与主题管理。',
    usage: '复杂样式组织、变量与混入复用。',
    projects: ['Dslink 企业官网', '个人主页可视化', '反诈信息识别与风险自测平台']
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
    projects: [
      '新疆数字文化平台',
      '超市售卖系统',
      'Dslink 企业官网',
      '反诈信息识别与风险自测平台',
      '个性化旅游路线规划与旅友结伴平台',
      '个人主页可视化'
    ]
  }
]

export const techEdges: TechEdge[] = [
  { source: 'Vue3', target: 'Pinia' },
  { source: 'Vue3', target: 'Vite' },
  { source: 'TypeScript', target: 'Vue3' },
  { source: 'Vue3', target: 'Element Plus' },
  { source: 'Vue3', target: 'uni-app' },
  { source: 'Vue3', target: 'Mapbox GL' },
  { source: 'Vue3', target: 'Vue Router' },
  { source: 'Vue3', target: 'Tailwind CSS' },
  { source: 'Vue3', target: '高德地图 JS API' },
  { source: 'TypeScript', target: 'Axios' },
  { source: 'TypeScript', target: 'Node.js' },
  { source: 'Node.js', target: 'Git' },
  { source: 'Vue3', target: 'Git' },
  { source: 'Vite', target: 'SCSS' },
  { source: 'Three.js', target: 'TypeScript' },
  { source: 'ECharts', target: 'TypeScript' },
  { source: 'Element Plus', target: 'SCSS' },
  { source: 'Vue Router', target: 'Pinia' }
]

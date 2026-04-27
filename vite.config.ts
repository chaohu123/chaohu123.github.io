import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const normalizeBasePath = (rawPath: string | undefined) => {
  if (!rawPath || rawPath.trim() === '') return '/'
  const withLeadingSlash = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: normalizeBasePath(process.env.BASE_PATH)
})

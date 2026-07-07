import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/smart-bharat-ai-civic-companion/',

  plugins: [
    react(),
    tailwindcss(),
  ],
})
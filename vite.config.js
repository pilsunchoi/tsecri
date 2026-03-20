import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: base를 리포지토리 이름으로 설정
// 단독 리포(tsecri)로 배포할 경우: base: '/tsecri/'
// 기존 dashboards 리포 하위로 넣을 경우: base: '/dashboards/tsecri/'
// 아래는 단독 리포 기준. 필요시 수정하세요.
export default defineConfig({
  plugins: [react()],
  base: '/tsecri/',
})

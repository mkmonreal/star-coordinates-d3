import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// Base path:
	// - For Codeberg Pages: uses root /
	// - For GitHub Pages: uses /star-coordinates-d3/
	// Set CODEBERG_PAGES=true in CI to use root path
	base: process.env.CODEBERG_PAGES === 'true' ? '/' : '/star-coordinates-d3/',
});

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'build',
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'WeatherServer',
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			external: [/^node:.*/, /^@modelcontextprotocol\//, 'axios'],
		},
	},
	server: {
		hmr: false,
	},
});

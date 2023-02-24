import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 443,
		https: {
			key: fs.readFileSync('/etc/letsencrypt/live/eesd-file.imoltres.dev/privkey.pem'),
			cert: fs.readFileSync('/etc/letsencrypt/live/eesd-file.imoltres.dev/fullchain.pem')
		},
		proxy: {
			'/api': 'https://eesd-file-service.imoltres.dev:3001'
		}
	}
});

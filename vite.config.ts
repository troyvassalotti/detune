/** @type {import('vite').UserConfig} */

export default {
	build: {
		lib: {
			entry: 'src/index',
			formats: ['es'],
		},
		rollupOptions: {
			external: /^lit/,
		},
	},
}

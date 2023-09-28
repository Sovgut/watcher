export default {
	build: {
		lib: {
			entry: "src/index.ts",
			name: "Watcher",
		},
		rollupOptions: {
			external: [],
			output: {
				// Set the desired output format (e.g., 'es', 'cjs', 'umd')
				format: "es",
				// Define the output file name
				fileName: "watcher.js",
			},
		},
	},
};

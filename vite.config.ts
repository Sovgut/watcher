import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	build: {
		lib: {
			entry: "./src/index.ts",
			name: "Watcher",
		},
		emptyOutDir: true,
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "reactdom",
				},
			},
		},
	},
	plugins: [tsconfigPaths()],
});

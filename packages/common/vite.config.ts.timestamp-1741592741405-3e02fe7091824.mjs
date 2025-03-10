// vite.config.ts
import { defineConfig } from "file:///C:/Users/diyae/Desktop/Code/HedgeWright/node_modules/.pnpm/vite@5.4.14_@types+node@20.17.19/node_modules/vite/dist/node/index.js";
import dts from "file:///C:/Users/diyae/Desktop/Code/HedgeWright/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.17.19_rollup@4.34.9_typescript@5.7.3_vite@5.4.14_@types+node@20.17.19_/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\diyae\\Desktop\\Code\\HedgeWright\\packages\\common";
var vite_config_default = defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      outDir: "dist"
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "HedgeWrightCommon",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`
    },
    sourcemap: true,
    outDir: "dist"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkaXlhZVxcXFxEZXNrdG9wXFxcXENvZGVcXFxcSGVkZ2VXcmlnaHRcXFxccGFja2FnZXNcXFxcY29tbW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkaXlhZVxcXFxEZXNrdG9wXFxcXENvZGVcXFxcSGVkZ2VXcmlnaHRcXFxccGFja2FnZXNcXFxcY29tbW9uXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kaXlhZS9EZXNrdG9wL0NvZGUvSGVkZ2VXcmlnaHQvcGFja2FnZXMvY29tbW9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBkdHMoe1xyXG4gICAgICAgICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qJ10sXHJcbiAgICAgICAgICAgIG91dERpcjogJ2Rpc3QnXHJcbiAgICAgICAgfSlcclxuICAgIF0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIGxpYjoge1xyXG4gICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcclxuICAgICAgICAgICAgbmFtZTogJ0hlZGdlV3JpZ2h0Q29tbW9uJyxcclxuICAgICAgICAgICAgZm9ybWF0czogWydlcycsICdjanMnXSxcclxuICAgICAgICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBpbmRleC4ke2Zvcm1hdCA9PT0gJ2VzJyA/ICdqcycgOiAnY2pzJ31gXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICAgICAgb3V0RGlyOiAnZGlzdCdcclxuICAgIH1cclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VyxTQUFTLG9CQUFvQjtBQUNwWSxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLElBQUk7QUFBQSxNQUNBLFNBQVMsQ0FBQyxVQUFVO0FBQUEsTUFDcEIsUUFBUTtBQUFBLElBQ1osQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILEtBQUs7QUFBQSxNQUNELE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLE1BQ3JCLFVBQVUsQ0FBQyxXQUFXLFNBQVMsV0FBVyxPQUFPLE9BQU8sS0FBSztBQUFBLElBQ2pFO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsRUFDWjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

import { defineConfig } from "vite";
import { resolve } from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { Plugin } from "vite";
import fs from "fs";
import path from "path";

// 展示构建时长、chunk 数量及大小
import { visualizer } from "rollup-plugin-visualizer";

// 自定义插件：实现文件拆分打包到两个目录
export default defineConfig({
  // _Message resolve
  resolve: {
    alias: {
      "@": resolve(__dirname, "../../"),
      "@m": resolve(__dirname, "./"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    }
  },
  // _Message build
  build: {
    target: "modules",
    // 压缩
    minify: true,
    copyPublicDir: false,
    // 开启 CSS 拆分
    // cssCodeSplit: true,
    rollupOptions: {
      input: {
        index: "./src/package/index.ts",
        feedback: "./src/package/components/feedback.ts"
        // 可以根据需要添加更多入口点
      },
      // 忽略打包vue文件
      external: ["vue", "element-plus", "lodash", "pinia", "clipboard", "axios"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          preserveModules: true,
          // 配置打包根目录 - SaltedU
          dir: "SaltedU/es",
          preserveModulesRoot: "src/package"
        }
      ]
    },
    lib: {
      entry: "./src/package/index.ts",
      formats: ["es", "cjs", "umd"]
    }
  },
  // _Message plugins
  plugins: [
    vue(),
    vueJsx(),
    // 为ManagerUI生成类型声明
    dts({
      entryRoot: "./src/package/",
      outDir: "SaltedU/es",
      // include: ["**/*.ts"],
      exclude: ["node_modules", "dist", "**/*.js"]
    }),
    visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true }) as Plugin,
    // 自定义插件：实现文件拆分复制
    {
      name: "split-files-to-multiple-folders",
      enforce: "post",
      async closeBundle() {
        try {
          const projectRoot = resolve(__dirname, "../../../");
          const managerUIRoot = path.join(projectRoot, "SaltedU");
          const managerUIV2Root = path.join(projectRoot, "ManagerUIV2");

          // 确保ManagerUIV2目录存在
          if (!fs.existsSync(managerUIV2Root)) {
            fs.mkdirSync(managerUIV2Root, { recursive: true });
          }

          // 复制UMD文件
          copyUMDFile(managerUIRoot, managerUIV2Root);

          // 复制ES目录下的文件，按规则拆分
          copyAndSplitESFiles(managerUIRoot, managerUIV2Root);

          console.log("文件拆分复制完成！");
        } catch (error) {
          console.error("文件拆分复制失败:", error);
        }
      }
    }
  ]
});

// 复制UMD文件
function copyUMDFile(managerUIRoot, managerUIV2Root) {
  const umdSourcePath = path.join(managerUIRoot, "umd", "salted-ui.umd.js");
  const umdTargetPath = path.join(managerUIV2Root, "umd");
  const umdTargetFile = path.join(umdTargetPath, "salted-ui-v2.umd.js");

  if (fs.existsSync(umdSourcePath)) {
    // 确保目标目录存在
    if (!fs.existsSync(umdTargetPath)) {
      fs.mkdirSync(umdTargetPath, { recursive: true });
    }

    // 复制文件
    fs.copyFileSync(umdSourcePath, umdTargetFile);
    console.log(`已复制UMD文件到: ${umdTargetFile}`);
  }
}

// 复制并拆分ES文件
function copyAndSplitESFiles(managerUIRoot, managerUIV2Root) {
  const esSourcePath = path.join(managerUIRoot, "es");
  const esTargetPath = path.join(managerUIV2Root, "es");

  // 递归复制并拆分文件
  function copyDirectory(source, target) {
    if (!fs.existsSync(source)) {
      return;
    }

    // 确保目标目录存在
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    const entries = fs.readdirSync(source, { withFileTypes: true });

    entries.forEach(entry => {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        // 递归复制目录
        copyDirectory(sourcePath, targetPath);
      } else {
        // 判断是否需要复制该文件到ManagerUIV2
        // 1. 包含m-和v2的组件文件
        const isV2Component = sourcePath.includes("components/m-") && sourcePath.includes("v2");

        // 2. 非组件文件（工具、样式等）需要同时复制到两个目录
        const isCommonFile = !sourcePath.includes("components/m-");

        // 复制文件到ManagerUIV2
        if (isV2Component || isCommonFile) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`已复制文件到: ${targetPath}`);
        }
      }
    });
  }

  // 开始复制
  copyDirectory(esSourcePath, esTargetPath);
}

#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和目标目录
const sourceDir = "/Users/caiqi/Project/document/bbraun-document/src/package/manager-ui/components";
const targetDir = path.join(__dirname, "..", "src", "package", "components");

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created target directory: ${targetDir}`);
}

// 遍历源目录
function syncComponents() {
  try {
    const items = fs.readdirSync(sourceDir, { withFileTypes: true });

    items.forEach(item => {
      if (item.isDirectory() && item.name.match(/^m-[a-zA-Z0-9-]+-v2$/)) {
        const sourcePath = path.join(sourceDir, item.name);
        const newName = item.name.replace(/^m-([a-zA-Z0-9-]+)-v2$/, "sa-$1");
        const targetPath = path.join(targetDir, newName);

        console.log(`Processing ${item.name} -> ${newName}`);

        // 确保目标文件夹存在
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }
        // 同步文件夹内容
        syncDirectory(sourcePath, targetPath, item.name, newName);
      }
    });

    console.log("\nSync completed successfully!");
  } catch (error) {
    console.error("Error during sync:", error);
  }
}

// 同步目录内容
function syncDirectory(source, target, oldPrefix, newPrefix) {
  const items = fs.readdirSync(source, { withFileTypes: true });

  items.forEach(item => {
    const sourcePath = path.join(source, item.name);
    const newFileName = item.name.replace(oldPrefix, newPrefix);
    const targetPath = path.join(target, newFileName);

    // 忽略路径 文件
    const ignorePaths = ["m-icon-v2/iconfont", "m-icon-v2/file", "m-icon-v2/mathematics", "m-editor-v2/index", "api/"];
    const relativePath = path.relative(sourceDir, sourcePath);

    if (ignorePaths.some(ignore => relativePath.includes(ignore))) {
      console.log(`  Ignored: ${relativePath}`);
      return;
    }

    if (item.isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      syncDirectory(sourcePath, targetPath, oldPrefix, newPrefix);
    } else if (item.isFile()) {
      // 读取文件内容
      let content = fs.readFileSync(sourcePath, "utf8");

      // 替换内容
      content = content.replace(new RegExp(oldPrefix, "g"), newPrefix);
      content = content.replace(/ManagerGlobal/g, "SaltedGlobal");

      content = content.replace(/--m-font-/g, "--sa-");
      content = content.replace(/m-manager-v2/g, "sa-content");
      content = content.replace(/m-display-v2/g, "sa-display-style");
      content = content.replace(/m-contrast-v2/g, "sa-contrast-style");
      content = content.replace(/00a47e/g, "43317A");

      content = content.replace(/package\/manager-ui/g, "package");
      content = content.replace(/components\/m-/g, "components/sa-");

      content = content.replace(/M(\w+)V2/g, (match, p1) => `Sa${p1.charAt(0).toUpperCase() + p1.slice(1)}`);
      content = content.replace(
        /--m-component-(\w+)-size/g,
        (match, p1) => `--sa-size-${p1.charAt(0).toLowerCase() + p1.slice(1)}`
      );
      content = content.replace(/m-([\w-]+)-v2(?:-([\w-]+))?/g, (match, p1, p2) => {
        // p1: v2 前面的部分 (例如 "xx-xx")
        // p2: v2 后面的部分 (例如 "xx")，如果没有则为 undefined

        const suffix = p2 ? `-${p2}` : "";
        const body = p1 + suffix;

        return `sa-${body.charAt(0).toLowerCase() + body.slice(1)}`;
      });

      // content = content.replace(/m-(\w+)-v2/g, (match, p1) => `sa-${p1.charAt(0).toLowerCase() + p1.slice(1)}`);

      // content = content.replace(/--m-color-v2/g, "--sa-color");
      // content = content.replace(/--m-color/g, "--sa-color");

      content = content.replace(/-v2/g, "");
      content = content.replace(/--m-/g, "--sa-");
      // content = content.replace(/--m-animation-time/g, "--sa-animation-time");
      // content = content.replace(/--m-font-color/g, "--sa-color");
      // content = content.replace(/--m-size-v2/g, "--sa-size");
      // content = content.replace(/--m-size-v2/g, "--sa-size");

      // content = content.replace(/m-(\w+)-v2/g, (match, p1) => `sa-${p1.charAt(0).toLowerCase() + p1.slice(1)}`);
      // content = content.replace(/m-(\w+)/g, (match, p1) => `sa-${p1.charAt(0).toLowerCase() + p1.slice(1)}`);

      // 写入文件
      fs.writeFileSync(targetPath, content);
      console.log(`  Synced: ${item.name} -> ${newFileName}`);
    }
  });
}

// 执行同步
syncComponents();

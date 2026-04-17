import fs from "fs";
import path from "path";
function moveDirectory(sourceDir, targetDir) {
  // ... 参数校验和目录创建代码保持不变 ...

  function copyContents(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
      const sourcePath = path.join(currentPath, item);
      const relativePath = path.relative(sourceDir, sourcePath);
      const destinationPath = path.join(targetDir, relativePath);
      const stats = fs.statSync(sourcePath);

      if (stats.isDirectory()) {
        // 创建目标目录并递归复制
        if (!fs.existsSync(destinationPath)) {
          fs.mkdirSync(destinationPath, { recursive: true });
        }
        copyContents(sourcePath);
      } else {
        // 处理文件冲突
        if (fs.existsSync(destinationPath)) {
          const parsed = path.parse(destinationPath);
          let counter = 1;
          let newPath = `${parsed.dir}${path.sep}${parsed.name}_${counter}${parsed.ext}`;

          while (fs.existsSync(newPath)) {
            counter++;
            newPath = `${parsed.dir}${path.sep}${parsed.name}_${counter}${parsed.ext}`;
          }
          fs.copyFileSync(sourcePath, newPath);
        } else {
          // 确保目标目录存在
          if (!fs.existsSync(path.dirname(destinationPath))) {
            fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
          }
          fs.copyFileSync(sourcePath, destinationPath);
        }
      }
    });
  }

  copyContents(sourceDir);
}

function deleteDirectory(targetDir) {
  if (fs.existsSync(targetDir)) {
    const entries = fs.readdirSync(targetDir, { withFileTypes: true });

    entries.forEach(entry => {
      const entryPath = path.join(targetDir, entry.name);
      if (entry.isDirectory()) {
        // 递归删除子目录
        deleteDirectory(entryPath);
      } else {
        // 删除文件
        fs.unlinkSync(entryPath);
      }
    });

    // 删除空目录
    fs.rmdirSync(targetDir);
  }
}

// 使用示例
// const sourceDir = "./document";
// const targetDir = "/Users/caiqi/Project/saltedfish-website-github/document";

// deleteDirectory(targetDir);
// moveDirectory(sourceDir, targetDir);

// // // 使用示例
// const sourceDir1 = "./src/package";
// const targetDir1 = "/Users/caiqi/Project/saltedfish-website-github/src/package";

// deleteDirectory(targetDir1);
// moveDirectory(sourceDir1, targetDir1);

// // // 使用示例
// const sourceDir2 = "./script/vitepress/dist/client/theme-default";
// const targetDir2 = "/Users/caiqi/Project/saltedfish-website-github/script/vitepress/dist/client/theme-default";

// deleteDirectory(targetDir2);
// moveDirectory(sourceDir2, targetDir2);

// // // 使用示例
// const sourceDir3 = "./vitepress-ui";
// const targetDir3 = "/Users/caiqi/Project/saltedfish-website-github/vitepress-ui";

// deleteDirectory(targetDir3);
// moveDirectory(sourceDir3, targetDir3);

const synchronousArray = [
  {
    sourceDir: "./script/client",
    targetDir: ["./node_modules/vitepress/dist/client"]
  }
];

for (const item of synchronousArray) {
  const { sourceDir, targetDir } = item;
  for (const dir of targetDir) {
    deleteDirectory(dir);
    moveDirectory(sourceDir, dir);
  }
}

import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

/**
 * 获取 src/package/components 下的所有组件名称
 */
const getComponents = () => {
  const componentsDir = path.join(rootDir, "src/package/components");
  if (fs.existsSync(componentsDir)) {
    return fs.readdirSync(componentsDir).filter(item => {
      const fullPath = path.join(componentsDir, item);
      return fs.statSync(fullPath).isDirectory() && item.startsWith("pa-");
    });
  }
  return [];
};

async function start() {
  const components = getComponents();
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "请选择测试方案 (Select test framework):",
      choices: [
        { name: "Vitest (单元测试)", value: "vitest" },
        { name: "Playwright (E2E测试)", value: "playwright" }
      ]
    }
  ]);

  if (framework === "vitest") {
    const { mode, component } = await inquirer.prompt([
      {
        type: "list",
        name: "mode",
        message: "请选择 Vitest 运行模式:",
        choices: [
          { name: "Watch (监听模式)", value: "test:dev" },
          { name: "Run (运行一次)", value: "test:run" },
          { name: "Coverage (查看覆盖率)", value: "test:coverage" }
        ]
      },
      {
        type: "list",
        name: "component",
        message: "请选择需要测试的组件:",
        choices: ["全部组件", ...components]
      }
    ]);

    let command = `npm run ${mode}`;
    if (component !== "全部组件") {
      // Vitest 支持通过命令行参数过滤路径，这里通过 -- 传递参数
      command += ` -- ${component}`;
    }

    console.log(`\n🚀 正在执行: ${command}\n`);
    execSync(command, { stdio: "inherit", cwd: rootDir });
  } else {
    const { mode, component } = await inquirer.prompt([
      {
        type: "list",
        name: "mode",
        message: "请选择 Playwright 运行模式:",
        choices: [
          { name: "常规运行", value: "e2e" },
          { name: "UI 模式", value: "e2e:ui" },
          { name: "调试模式", value: "e2e:debug" },
          { name: "有头模式", value: "e2e:headed" }
        ]
      },
      {
        type: "list",
        name: "component",
        message: "请选择需要测试的组件:",
        choices: ["全部组件", ...components]
      }
    ]);

    let command = `npm run ${mode}`;
    if (component !== "全部组件") {
      // Playwright 同样支持通过命令行参数过滤测试文件
      command += ` -- ${component}`;
    }

    console.log(`\n🚀 正在执行: ${command}\n`);
    execSync(command, { stdio: "inherit", cwd: rootDir });
  }
}

start().catch(err => {
  console.error("执行失败:", err);
  process.exit(1);
});

# E2E 测试指南

## 概述

本目录包含 PancakeUI 组件的 Playwright E2E 测试用例。

## 测试文件

- `pa-icon.spec.ts` - pa-icon 组件 E2E 测试
- `pa-button.spec.ts` - pa-button 组件 E2E 测试
- `e2e-test.md` - E2E 测试页面

## 前置条件

1. 确保已安装 Playwright 浏览器：
   ```bash
   npx playwright install chromium
   ```

2. 确保 VitePress 开发服务器在运行：
   ```bash
   npm run dev
   ```
   注意：服务器默认在端口 5173 或 7107 运行。

## 运行测试

### 基本运行

```bash
# 使用默认端口 7107
npm run e2e

# 指定端口
SERVER_PORT=7107 npm run e2e
```

### 带可视化运行

```bash
npm run e2e:headed
```

### 调试模式

```bash
npm run e2e:debug
```

### 一键启动服务器并运行测试

```bash
npm run e2e:dev
```

## 测试用例

### pa-icon 测试用例

- ✅ 渲染基本图标元素
- ✅ 验证图标结构正确 (pa-icon 类)
- ✅ 验证带提示的图标
- ✅ 验证不同 name 属性渲染不同图标
- ✅ 验证点击事件触发

### pa-button 测试用例

- ✅ 渲染按钮文本内容
- ✅ 验证不同类型按钮 (primary/success/warning/danger/info)
- ✅ 验证不同尺寸按钮 (large/medium/small)
- ✅ 验证禁用状态
- ✅ 验证加载状态
- ✅ 验证按钮点击事件
- ✅ 验证带图标的按钮
- ✅ 验证朴素/非朴素按钮
- ✅ 验证预设样式按钮 (is prop)

## 注意事项

1. 测试使用 VitePress 文档站的开发服务器，需要先启动 `npm run dev`
2. 服务器端口可能为 5173、7107 或其他可用端口，可通过 `SERVER_PORT` 环境变量指定
3. 测试会自动等待 Vue 组件挂载后再执行断言

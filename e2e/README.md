# E2E 测试

基于 Playwright 的端到端测试。

## 目录结构

```
e2e/
├── pa-icon/
│   ├── e2e-test.md       # 测试页面（VitePress markdown）
│   └── pa-icon.spec.ts   # 测试用例
├── pa-button/
│   ├── e2e-test.md
│   └── pa-button.spec.ts
└── README.md
```

每个组件一个文件夹，测试页面和测试用例放在一起。

## 使用方法

```bash
# 1. 启动 VitePress 开发服务器
npm run dev

# 2. 运行全部 E2E 测试
npm run e2e

# 只跑某个组件
npx playwright test e2e/pa-icon
npx playwright test e2e/pa-button

# 有头模式（看浏览器操作）
npx playwright test e2e/pa-icon --headed

# Playwright UI 面板
npx playwright test e2e/pa-icon --ui

# 调试模式
npx playwright test e2e/pa-button --debug
```

## 添加新组件测试

1. 在 `e2e/` 下创建组件目录，如 `e2e/pa-tag/`
2. 创建 `e2e-test.md`，编写组件的各种状态（使用 `data-testid` 标记）
3. 创建 `pa-tag.spec.ts`，编写测试用例
4. 测试页面 URL 格式：`http://localhost:{port}/e2e/pa-tag/e2e-test`

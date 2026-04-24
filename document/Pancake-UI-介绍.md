# 🥞 Pancake-UI 介绍

## 项目简介

**Pancake-UI** 是一个基于 Vue3 原生开发的 UI 组件库，由 Qi.Cai 开发并开源。它不依赖 Element-Plus 等第三方 UI 框架，具有更轻量、更灵活、更易于定制和扩展的特点。

- **作者**：Qi.Cai
- **许可证**：MIT
- **技术栈**：Vue3 + TypeScript + Scss + Vite
- **组件前缀**：`pa-`

## 核心特点

### 🪶 轻量高效
不依赖 Element-Plus 等重量级框架，打包体积更小，加载速度更快。

### 🎨 灵活定制
基于 Scss 的样式系统，支持主题定制，轻松适配不同项目风格。

### 🧩 功能完备
提供 50+ 组件，覆盖表单、表格、反馈、布局等常见业务场景。

### 🛠 开发友好
TypeScript 类型支持，完整的 API 文档，提升开发体验。

## 组件生态

### 基础组件
| 组件 | 说明 |
|-----|------|
| `pa-button` | 按钮组件 |
| `pa-icon` | 图标组件 |
| `pa-tag` | 标签组件 |
| `pa-badge` | 徽章组件 |
| `pa-color` | 颜色选择器 |

### 表单组件
| 组件 | 说明 |
|-----|------|
| `pa-input` | 输入框 |
| `pa-select` | 选择器 |
| `pa-checkbox` | 多选框 |
| `pa-radio` | 单选框 |
| `pa-switch` | 开关 |
| `pa-form` | 表单 |
| `pa-cascader` | 级联选择器 |
| `pa-transfer` | 穿梭框 |
| `pa-time` | 时间选择器 |
| `pa-number` | 数字输入框 |
| `pa-file` | 文件上传 |

### 布局组件
| 组件 | 说明 |
|-----|------|
| `pa-row` | 行布局 |
| `pa-col` | 列布局 |
| `pa-scrollbar` | 滚动条 |
| `pa-scrollbar-list` | 滚动列表 |

### 数据展示
| 组件 | 说明 |
|-----|------|
| `pa-table` | 表格组件 |
| `pa-pagination` | 分页组件 |
| `pa-empty` | 空状态 |
| `pa-manager` | 数据管理器 |
| `pa-media-view` | 媒体预览 |

### 反馈组件
| 组件 | 说明 |
|-----|------|
| `pa-dialog` | 对话框 |
| `pa-drawer` | 抽屉 |
| `pa-message` | 消息提示 |
| `pa-message-box` | 消息弹框 |
| `pa-notification` | 通知 |
| `pa-popover` | 气泡卡片 |
| `pa-overlay` | 遮罩层 |

### 其他组件
| 组件 | 说明 |
|-----|------|
| `pa-tabs` | 标签页 |
| `pa-title` | 标题 |
| `pa-editor` | 编辑器 |
| `pa-playground` | 演示平台 |
| `pa-development` | 开发工具 |

## 快速开始

### 安装

\`\`\`bash
npm install pancake-ui
# 或
yarn add pancake-ui
\`\`\`

### 完整引入

\`\`\`typescript
import { createApp } from 'vue'
import PancakeUI from 'pancake-ui'
import 'pancake-ui/style.css'

const app = createApp(App)
app.use(PancakeUI)
\`\`\`

### 按需引入

\`\`\`typescript
import { PaButton, PaTable, PaForm } from 'pancake-ui'
import 'pancake-ui/style.css'
\`\`\`

### 基础示例

\`\`\`vue
<template>
  <pa-button type="primary" @click="handleClick">
    点击我
  </pa-button>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('button clicked')
}
</script>
\`\`\`

## 适用场景

### ✅ 推荐使用

- 企业管理系统
- 数据管理平台
- 后台管理界面
- 需要轻量级 UI 方案的项目
- 需要高度定制化的项目

### ❌ 不推荐使用

- 需要移动端适配的项目（暂未优化移动端体验）
- 需要大量现成模板的项目
- 对 IE 浏览器有兼容需求的项目

## 生态工具

### useDictionaries
字典管理工具，用于管理下拉选项数据源。

### Log
日志工具，方便开发调试。

## 相关链接

- [GitHub 仓库](https://github.com/SaltedFish-Cai/Butler-AI-Website)
- [在线文档](http://manager.frontend-m.online/)

## 总结

Pancake-UI 是一个轻量、灵活、功能完备的 Vue3 UI 组件库。它适合需要高度定制化、追求轻量级方案的中后台项目。如果你正在寻找一个不依赖 Element-Plus、更易于掌控的 UI 方案，Pancake-UI 值得一试。

---

*本文档由 Butler 生成 🥸*

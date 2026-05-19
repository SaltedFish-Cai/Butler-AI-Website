---
name: inspect-component
description: 按 checklist.md 规则逐条排查指定组件的代码规范问题并自动修复
---

# Inspect Component

按 `checklist.md` 规则逐条排查 `pa-{name}` 组件的代码规范，修复并提交。

## Usage

触发词：`排查组件 xxx` / `检查组件 xxx` / `inspect component xxx`

示例：`排查组件 tag` → 检查 src/package/components/pa-tag/ 下所有文件

## Workflow

### Step 1 — 启动后台任务

使用后台任务运行，任务名为 `排查 {name} 组件`。

### Step 2 — 读取 checklist.md（必须）

读取项目根目录的 `checklist.md`，如果不存在则提示用户并暂停任务。

### Step 3 — 逐条排查（不可跳过）

按 checklist.md 表格逐条检查，每次只执行一条，将结果 ✅/❌ 填入表格。

> ⚠️ 严格按照表格顺序，上一条完成后再执行下一条，不可预判结果。

### Step 4 — 返回排查结果

排查完成后输出完整表格，等待用户确认。

### Step 5 — 用户确认后自动修复

按 checklist.md 规范自动修复所有 ❌ 项。

### Step 6 — 提交并推送

修复完成后自动 `git commit` 并 `git push`。

---

## 排查细则

### index.ts 规则

| 规则 | 说明 |
|------|------|
| 1.1 | 所有 import 有 JSDoc（多行格式：标题 + @description） |
| 1.2 | install 参数类型为 `App` 非 `any` |
| 1.3 | install 函数有 JSDoc（标题 + @param + @description） |
| 1.4 | name 属性有 JSDoc（标题 + @description） |
| 1.5 | 方法/变量之间无空行 |
| 1.6 | Prettier 格式化 |

### *.vue 规则

| 规则 | 说明 |
|------|------|
| 2.1 | 样式使用独立 `index.scss`，通过 `@use` 引入 |
| 2.2 | 所有 import 有 JSDoc（标题 + @description） |
| 2.3 | 所有变量有 JSDoc（标题 + @description） — ref、reactive、computed、let |
| 2.4 | 所有函数有 JSDoc（标题 + @param + @returns + @description） |
| 2.5 | 所有 watch 有 JSDoc（标题 + @description） |
| 2.6 | 生命周期钩子有 JSDoc（标题 + @description） |
| 2.7 | 无单行注释，改用 JSDoc |
| 2.8 | 无被注释掉的代码 |
| 2.9 | defineEmits 类型化写法 `defineEmits<ComponentEmits>()` |
| 2.10 | 方法/变量之间无空行 |
| 2.11 | 代码顺序：import → const/let → function → 生命周期 → watch |
| 2.12 | Prettier 格式化 |

### *.scss 规则

| 规则 | 说明 |
|------|------|
| 3.1 | 文件命名 `index.scss` |
| 3.2 | 缩进 2 空格 |
| 3.3 | 根类名 `.pa-{组件名}` |
| 3.4 | 无单行注释 `//` |
| 3.5 | 无被注释掉的代码 |
| 3.6 | class 之间有空行分隔 |
| 3.7 | 使用 CSS 变量（`--pa-color-*`、`--pa-size-*`） |
| 3.8 | 无硬编码颜色值 |
| 3.9 | Prettier 格式化 |

### types.d.ts 规则

| 规则 | 说明 |
|------|------|
| 4.1 | 文件命名为 `types.d.ts` 非 `type.d.ts` |
| 4.2 | 类型命名：`ComponentProps`、`ComponentEmits`，其他为 `Component+名称` |
| 4.3 | 必须定义 `id?`、`class?`、`style?` |
| 4.4 | 所有 import 有 JSDoc（标题 + @description） |
| 4.5 | 所有 export type 有 JSDoc（标题 + @type + @description） |
| 4.6 | 所有属性有 JSDoc（标题 + @type + @default + @description） |
| 4.7 | 可选属性 @type 必须包含 `undefined` |
| 4.8 | 数组类型使用 `Array<T>` 非 `T[]` |
| 4.9 | ComponentEmits 函数重载格式 `(e: "name", param): void;` |
| 4.10 | 方法/变量之间无空行 |
| 4.11 | Prettier 格式化 |

### *.ts 规则（index.ts 之外的其他 ts 文件）

| 规则 | 说明 |
|------|------|
| 5.1 | 所有 import 有 JSDoc |
| 5.2 | 所有 export 有 JSDoc |
| 5.3 | 函数使用 `function` 定义非 `const` |
| 5.4 | 数组类型使用 `Array<T>` |
| 5.5 | 可选参数类型含 `undefined` |
| 5.6 | 代码顺序规范 |
| 5.7 | 方法/变量之间无空行 |
| 5.8 | Prettier 格式化 |

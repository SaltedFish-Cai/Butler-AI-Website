# PancakeUI

Vue 3 组件库，技术栈 Vue 3 + TypeScript + SCSS + Vite
- 组件前缀 pa-（如 pa-button, pa-table）
- 组件间有类型依赖，改一个要检查影响范围
- 遵循 checklist.md 规则排查和修复
- 提交信息格式：feat/fix/refactor: 简短描述

## Behavioral Guidelines (andrej-karpathy)

遵循 Karpathy 的 AI 编码行为准则，减少常见 LLM 编程错误：

### 1. Think Before Coding
- 实现前明确声明假设，不确定就问
- 存在多种解释时，展示所有选项，不偷偷选一个
- 有更简单的方案就说出来，必要时 push back
- 不清楚就停下来，指出困惑点

### 2. Simplicity First
- 不写没被要求的特性、抽象、灵活性
- 不为不可能的场景写错误处理
- 如果 200 行能写成 50 行，重写

### 3. Surgical Changes
- 只动必须动的代码，不改相邻代码
- 不重构没坏的东西，匹配现有风格
- 改动产生的孤儿（import、变量）要清理，但不动已有的死代码
- 每行改动都应当能追溯到用户需求

### 4. Goal-Driven Execution
- 把任务转化为可验证的目标：如"加验证"→"写测试覆盖无效输入，然后让它们通过"
- 多步骤任务先列计划：`1. [步骤] → verify: [检查项]`

## Skills
- `/create-component` 创建新组件 — 根据组件名生成完整文件模板（index.ts, types.d.ts, pa-*.vue, index.scss, pa-*.test.ts），遵循 checklist.md 规范
  - 触发词：创建组件、create component、新增组件
- `/test-component` 测试指定组件 — 运行指定 pa- 组件的 vitest 单元测试并返回结果
  - 触发词：测试组件、test component、运行测试
- `/inspect-component` 排查组件规范 — 按 checklist.md 逐条排查组件代码规范问题，确认后自动修复并提交
  - 触发词：排查组件、检查组件、inspect component
# PancakeUI

Vue 3 组件库，技术栈 Vue 3 + TypeScript + SCSS + Vite
- 组件前缀 pa-（如 pa-button, pa-table）
- 组件间有类型依赖，改一个要检查影响范围
- 遵循 checklist.md 规则排查和修复
- 提交信息格式：feat/fix/refactor: 简短描述

## Behavioral Guidelines (Mnilax 12 Rules)

遵循 Mnilax 12 条进阶编码行为准则（Karpathy 4 条扩展版），降低 LLM 错误率至 3%。

### 1. 先思考再编码
- 明确假设，不确定就问；多种解释时展示选项不偷偷选
### 2. 简单优先
- 不写没被要求的特性/抽象，200 行能写成 50 行就重写
### 3. 手术式修改
- 只碰必须改的，不碰相邻代码，不重构没坏的
### 4. 目标驱动
- 定义成功标准循环验证，告诉 AI 成功长什么样而非怎么做
### 5. 只做判断性任务
- 分类/起草用 AI，路由/重试/状态码用普通代码
### 6. 硬性 Token 预算
- 单任务 ≤ 4k tokens，接近上限时主动总结开新 session
### 7. 暴露冲突不折中
- 模式矛盾时选其一，混合是最差选择
### 8. 先读再写
- 改代码前读 exports/callers，"看起来无关"是最危险措辞
### 9. 测试意图而非行为
- 测试测"为什么"非"是什么"，业务逻辑变了测试要能失败
### 10. 多步骤要 Checkpoint
- 每步总结：做了什么、验证了什么、还剩什么
### 11. 配合既有惯例
- 项目用 snake_case 就 snake_case
### 12. 失败要大声音
- 跳过就不算完成，默认暴露不确定性

## Skills
- `/create-component` 创建新组件 — 根据组件名生成完整文件模板（index.ts, types.d.ts, pa-*.vue, index.scss, pa-*.test.ts），遵循 checklist.md 规范
  - 触发词：创建组件、create component、新增组件
- `/test-component` 测试指定组件 — 运行指定 pa- 组件的 vitest 单元测试并返回结果
  - 触发词：测试组件、test component、运行测试
- `/inspect-component` 排查组件规范 — 按 checklist.md 逐条排查组件代码规范问题，确认后自动修复并提交
  - 触发词：排查组件、检查组件、inspect component
- `/mnilax-12-rules` — Mnilax 12 条进阶 AI 编码行为准则（Karpathy 规则扩展版，错误率 41%→3%）
  - 触发词：mnilax、12条规则、twelve rules
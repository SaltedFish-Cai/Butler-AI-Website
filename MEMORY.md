## 默认工作上下文

**当前项目**：Butler-AI-Website (PancakeUI 组件库)
- **项目路径**：`~/Butler-AI-Website`
- **分支**：`butler-dev`
- **仓库**：https://github.com/SaltedFish-Cai/Butler-AI-Website.git

**当前任务**：组件合规性排查与改造
- **规范文件**：
  - `development-guide-v1.0.5.md`（开发指南）
  - `ai-work-v1.0.2.md`（AI工作规范）
  - `component-checklist.md`（组件排查清单）
- **已合规组件**：Icon、Button、Color、Tag、Badge、Title、Empty、Input、Number、Select、SelectIcon

**工作流程**：
1. **开发前检查规范版本**：
   - 检查 development-guide 和 ai-work 文件版本号是否变化
   - 如果版本变化，读取文件并更新检查清单列表
   - 如果版本未变化，使用现有规则
2. 通过 index.ts 确认组件范围
3. 检查 types.d.ts 属性规范
4. 确保 @default 与 withDefaults 一致
5. 运行 ESLint/vue-tsc 检查
6. 同步更新文档
7. **修改后使用 Prettier 格式化代码**
8. **样式文件必须独立为 index.scss**

**代码格式要求（v1.0.5）**：
- Scss：缩进2空格、BEM命名、class间空行
- types.d.ts：属性间空行、import在顶部
- TypeScript：缩进2空格、方法/类型间空行、尽量一行代码
- **注释要求**：所有方法和属性都必须填写注释，使用 JSDoc 风格（如 `/** ... */`），禁用单行注释（如 `// #xxx`）
- **代码简化**：withDefaults 等尽量使用一行代码实现，但以 Prettier 格式化结果为准

---

## 已完成改造的组件

| 序号 | 组件名称 | 状态 |
|------|----------|------|
| 1 | Icon 图标 | ✅ 完成 |
| 2 | Button 按钮 | ✅ 完成 |
| 3 | Color 色彩选择器 | ✅ 完成 |
| 4 | Tag 标签 | ✅ 完成 |
| 5 | Badge 徽标 | ✅ 完成 |
| 6 | Title 标题 | ✅ 完成 |
| 7 | Empty 空状态 | ✅ 完成 |
| 8 | Input 输入框 | ✅ 完成 |
| 9 | Number 数字框 | ✅ 完成 |
| 10 | Select 选择器 | ✅ 完成 |
| 11 | SelectIcon 图标选择器 | ✅ 完成 |

---

## 特殊规则总结

| 规则 | 说明 |
|------|------|
| `update:modelValue` | Vue v-model 约定，事件名保持不变 |
| 事件名驼峰命名 | 如 `confirmClick`（非 `confirm-click`） |
| defineEmits 类型化 | `defineEmits<ComponentEmits>()` |
| 数组类型 | 使用 `Array<T>` 而非 `T[]` |
| 文档类型格式 | 不显示 `undefined`，用空格分隔类型 |
| Array 内部类型 | 使用 `|` 分隔，如 `Array<number | string>` |
| 默认值表示 | 无默认值用 `-` |
| SCSS 独立文件 | 样式必须独立为 index.scss，Vue 文件通过 @use 引入 |

---

*文档版本：v1.0.5 | 更新时间：2026-04-25*

# PancakeUI 组件排查清单

> 版本：v1.0.3  
> 基于 development-guide-v1.0.3.md 和 ai-work-v1.0.2.md 整理  
> 最后更新：2026-04-24

---

## 一、开发前准备

- [ ] 检查 development-guide.md 版本号是否变化，变化则更新规范
- [ ] 通过 `index.ts` 的 install 方法确认组件范围（如 PaColor + PaColorBox 需检查两个文件）
- [ ] 从 GitHub 仓库获取最新代码（分支：butler-dev）

---

## 二、types.d.ts 检查

- [ ] 文件命名为 `types.d.ts`（非 type.d.ts）
- [ ] 类型名称为 `ComponentProps`
- [ ] 必选属性：`id`、`class`、`style` 存在
- [ ] **所有 import 语句都有 JSDoc 注释**（格式：`/** **模块导入** @description ... */`）
- [ ] **所有 export type 都有 JSDoc 注释**（如 ButtonTypeV2Is、TagListType 等）
- [ ] **所有属性都有完整 JSDoc 注释**，格式如下：
  ```ts
  /**
   * **属性名称**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 属性描述（中文，100字以内）
   * */
  ```
- [ ] **@type 格式规范**：
  - 可选属性必须包含 `| undefined`，如 `@type \`boolean\` | \`undefined\``
  - 有默认值的属性可不加 `| undefined`
  - 字符串字面量类型用 `\`'large'\` | \`'medium'\` | \`'small'\`` 格式
  - 数组类型使用 `Array<type>` 而非 `type[]`
  - 对象类型使用 `Record<string, string>`
- [ ] **@default 必须与 Vue 文件中 withDefaults 一致**，无默认值填 `undefined`
- [ ] 标题、提示信息等需支持多语言，类型为 `LanguagePackageType | string`
- [ ] 属性间有空行分隔
- [ ] import 语句在文件顶部

### 示例

```ts
/**
 * **模块导入**
 * @description 导入多语言类型定义
 * */
import { LanguagePackageType } from "../manager-type";

/**
 * **按钮内置样式类型**
 * @description 预设按钮样式类型，包含常用的操作按钮图标和样式
 * */
export type ButtonTypeV2Is = "add" | "cancel" | "check" | "delete";

export type ComponentProps = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * */
  id?: string;

  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * */
  class?: Array<string> | string;

  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;

  /**
   * **按钮大小**
   * @type `'large'` | `'medium'` | `'small'`
   * @default `medium`
   * @description 可选值为 `small` | `large`
   * */
  size?: "large" | "medium" | "small";
};
```

---

## 三、index.scss 检查

- [ ] 缩进为2空格
- [ ] 根元素类名为 `.pa-{组件名}`（如 `.pa-button`）
- [ ] 子元素样式类必须包含在根元素类中（BEM 命名：`.pa-button_text`）
- [ ] **无单行注释**（`// xxx`），如有则删除
- [ ] class 之间有空行分隔
- [ ] 样式属性使用 CSS 变量（如 `--pa-size-font`、`--pa-color-primary` 等）

### CSS 变量参考

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `--pa-size-font` | 字体大小 | 16px |
| `--pa-size-height` | 高度 | 30px |
| `--pa-size-padding` | 内边距 | 10px |
| `--pa-size-radius` | 圆角 | 12px |
| `--pa-color-primary` | 主色 | - |
| `--pa-color-info` | 信息颜色 | #909399 |
| `--pa-color-success` | 成功颜色 | #67c23a |
| `--pa-color-warning` | 警告颜色 | #e6a23c |
| `--pa-color-danger` | 危险颜色 | #f56c6c |

### 示例

```scss
.pa-button {
  display: inline-flex;
  padding: calc(var(--pa-size-padding) / 2) var(--pa-size-padding);
  border-radius: var(--pa-size-radius);

  .pa-button_icon {
    margin-right: calc(var(--pa-size-padding) / 2);
  }

  .pa-button_text {
    font-size: var(--pa-size-font);
  }
}
```

---

## 四、Vue 文件检查（每个 .vue 文件）

- [ ] **符合 Vue 3 规范**，使用 Vue 3 组合式 API
- [ ] **所有 import 语句都有 JSDoc 注释**
- [ ] **所有变量都有 JSDoc 注释**（ref、reactive、computed 等）
- [ ] **所有函数都有 JSDoc 注释**（包含 @param、@returns、@description）
- [ ] **所有 watch 都有 JSDoc 注释**
- [ ] **所有生命周期钩子都有 JSDoc 注释**
- [ ] **无单行注释**（`// #xxx`），如有则替换为 JSDoc 风格
- [ ] import 语句放置在文件顶部
- [ ] **TypeScript 代码顺序**：import > const（常量 > props > ref > reactive > 变量 > computed）> function > watch
- [ ] 变量、函数、类使用驼峰命名法，常量使用全大写下划线分隔
- [ ] withDefaults 尽量一行代码实现

### 示例

```vue
<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, computed, watch, onMounted } from "vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps } from "./types";

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), { size: "medium" });

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emit = defineEmits(["click"]);

/**
 * **当前值**
 * @type `string`
 * @description 当前选中的值
 * */
const currentValue = ref("");

/**
 * **计算属性：显示文本**
 * @returns `string` 显示的文本内容
 * */
const displayText = computed(() => currentValue.value || "默认文本");

/**
 * **点击事件处理**
 * @param `event` `MouseEvent` 鼠标事件对象
 * @returns `void`
 * */
function handleClick(event: MouseEvent) {
  emit("click", event);
}

/**
 * **监听 value 变化**
 * @description 值变化时更新当前值
 * */
watch(
  () => props.value,
  (newVal) => {
    currentValue.value = newVal;
  }
);

/**
 * **组件挂载生命周期**
 * @description 初始化组件状态
 * */
onMounted(() => {
  currentValue.value = props.value;
});
</script>
```

---

## 五、index.ts 检查

- [ ] **所有 import 语句都有 JSDoc 注释**
- [ ] **包含 install 函数**，用于注册组件到 Vue 应用
- [ ] **包含 name 属性**，指定组件名称
- [ ] **包含 default 导出**
- [ ] install 函数有 JSDoc 注释（包含 @param、@description）

### 示例

```ts
/**
 * **模块导入**
 * @description 导入 PaButton 和 PaButtonGroup 组件
 * */
import PaButton from "./pa-button.vue";
import PaButtonGroup from "./pa-button-group.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaButton 和 PaButtonGroup 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaButton"]) {
    app.component("PaButton", PaButton);
    app.component("PaButtonGroup", PaButtonGroup);
  }
};

export default { name: "PaButton", install };
```

---

## 六、文档检查（document/PancakeUI_Doc/{组件名}/readme.md）

- [ ] 组件名称：`pa-{组件名}` 格式
- [ ] 组件描述：中文，100字以内
- [ ] **ComponentProps 表格**：属性名、描述、类型、默认值 四列
- [ ] **ComponentEmits 表格**：事件名、描述、回调函数、函数参数 四列（如存在）
- [ ] **ComponentSlots 表格**：插槽名称、作用 两列（如存在）
- [ ] 示例文件 `base.vue` 必须存在
- [ ] 建议创建 `{属性名}.vue` 示例文件

### 文档目录结构

```
document/PancakeUI_Doc/
├── button/
│   ├── readme.md
│   ├── base.vue
│   ├── size.vue
│   └── disabled.vue
├── color/
│   ├── readme.md
│   └── base.vue
└── ...
```

---

## 七、代码质量检查

- [ ] ESLint 检查通过
- [ ] vue-tsc 检查通过
- [ ] Prettier 格式化通过
- [ ] 类型定义与实际代码一致（移除属性时检查 .vue 文件引用）

### 检查命令

```bash
# ESLint 检查
npx eslint src/package/components/pa-xxx --ext .vue,.ts

# vue-tsc 检查
npx vue-tsc --noEmit --project tsconfig.json

# Prettier 格式化
npx prettier --write src/package/components/pa-xxx/**/*.{vue,ts,scss}

# 检查属性引用
grep -n "props.属性名" src/package/components/pa-xxx/*.vue
```

---

## 八、提交前确认

- [ ] @default 与 withDefaults 默认值一致
- [ ] 所有修改的文件都已格式化
- [ ] 样式文件修改后检查 Vue 文件引用并同步修改
- [ ] 文档和类型定义与代码保持一致
- [ ] 提交信息使用 Git 规范（如 `fix: xxx`、`feat: xxx`）
- [ ] 提交人：ButlerAi211，邮箱：caiqi211@gmail.com

### Git 提交规范

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 Bug |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 代码重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

---

## 附录：常见问题

### Q1: @type 中可选属性是否必须加 `| undefined`？

**是的**，可选属性（带 `?`）的 `@type` 必须包含 `| undefined`，除非该属性有默认值。

```ts
// ❌ 错误
disabled?: boolean; // @type `boolean`

// ✅ 正确
disabled?: boolean; // @type `boolean` | `undefined`
```

### Q2: 单行注释如何处理？

**必须替换为 JSDoc 风格注释**。

```ts
// ❌ 错误
// #Function handleClick
function handleClick() {}

// ✅ 正确
/**
 * **点击事件处理**
 * @description 处理点击事件
 * */
function handleClick() {}
```

### Q3: Scss 中可以有注释吗？

**可以**，但不能使用单行注释 `// xxx`。可以使用多行注释 `/* */` 或直接删除不必要的注释。

```scss
// ❌ 错误
// 颜色预览区域
.pa-color-preview { }

// ✅ 正确（无注释或使用有意义的命名）
.pa-color-preview { }
```

---

*文档版本：v1.0.3 | 创建时间：2026-04-24*

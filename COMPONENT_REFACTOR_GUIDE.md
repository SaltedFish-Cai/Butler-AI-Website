# PancakeUI 组件改造指南

本文档定义了 PancakeUI 组件代码和文档的标准化改造流程。

---

## 一、type.d.ts 类型定义修改

### 1. 导入 LanguageKey

**修改前：**
```typescript
type languageKey = "en-US" | "zh-CN";
```

**修改后：**
```typescript
import { LanguageKey } from "../manager-type";
```

### 2. 类型添加 undefined

所有类型后面加上 `| undefined`：

**修改前：**
```typescript
@type `string`
@type `boolean`
@type `Record<string, string>`
```

**修改后：**
```typescript
@type `string` | `undefined`
@type `boolean` | `undefined`
@type `Record<string, string>` | `undefined`
```

### 3. 默认值改为 undefined

布尔类型属性默认值从 `false` 改为 `undefined`：

**修改前：**
```typescript
* @default `false`
```

**修改后：**
```typescript
* @default `undefined`
```

### 4. 移除冗余注释

删除重复描述，保留核心说明：

**修改前：**
```typescript
/**
 * **组件唯一标识**
 * @type `string` | `undefined`
 * @default `undefined`
 * @description 当设置该值时，会作为组件的唯一标识
 * @description 该值的类型为 `string`，可以是任意类型，但是建议不要重复
 * */
```

**修改后：**
```typescript
/**
 * **组件唯一标识**
 * @type `string` | `undefined`
 * @default `undefined`
 * @description 当设置该值时，会作为组件的唯一标识
 * */
```

### 5. 移除 example 代码块

删除 `@example` 和代码块：

**修改前：**
```typescript
/**
 * **是否禁用**
 * @type `boolean`
 * @default `false`
 * @description 当设置该值为 `true` 时，会禁用该组件
 * @description 当设置该值为 `false` 时，不会禁用该组件
 * @example
 * ```tsx
 * <PaSwitch disabled={true} />
 * ```
 * */
```

**修改后：**
```typescript
/**
 * **是否禁用**
 * @type `boolean` | `undefined`
 * @default `undefined`
 * @description 当设置该值为 `true` 时，会禁用该组件
 * */
```

### 6. 新增通用属性

每个组件都应添加以下属性：

```typescript
/**
 * **纯展示类型下，直接显示值**
 * @type `string` | `undefined`
 * @default `undefined`
 * @description 当设置该值时，会直接显示该值
 * */
displayValue?: string;

/**
 * **表单项标签**
 * @type `Record<LanguageKey, string>` | `string` | `undefined`
 * @default `undefined`
 * @description 当设置该值时，会作为表单项标签
 * */
title?: Record<LanguageKey, string> | string;

/**
 * **表单项标签宽度**
 * @type `string` | `undefined`
 * @default `undefined`
 * @description 当设置该值时，会作为表单项标签宽度
 * */
titleWidth?: string;
```

---

## 二、组件 .vue 文件修改

### 1. 添加 languageValue

在 script 中添加：

```typescript
const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
```

### 2. display 模式优化

**修改前：**
```vue
<div v-else class="pa-display-style">
  <slot name="exDisplay"></slot>
  <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} )</template>
  <template v-else>{{ findData(inValue) || "--" }}</template>
</div>
```

**修改后：**
```vue
<div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
  <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
    {{ typeof title === "string" ? title : title[languageValue] }}
  </div>
  <div class="pa-display-value_content">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ displayValue || findData(inValue) || "--" }} )</template>
    <template v-else>{{ displayValue || findData(inValue) || "--" }}</template>
  </div>
</div>
```

### 3. 添加 displayValue 支持

在 display 模式的显示逻辑中添加 displayValue 优先：

```typescript
function findData(data) {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  // 原有逻辑...
}
```

### 4. 移除 randChar 导入

**修改前：**
```typescript
import { randChar } from "../tools/rand-char";
const props = withDefaults(defineProps<PaXxxType>(), {
  id: randChar(),
  // ...
});
```

**修改后：**
```typescript
const props = withDefaults(defineProps<PaXxxType>(), {
  // 只保留必要默认值
});
```

### 5. 简化 withDefaults

只保留必要的默认值（如 type），移除布尔类型的默认值：

**修改前：**
```typescript
const props = withDefaults(defineProps<PaXxxType>(), {
  id: randChar(),
  type: "select",
  disabled: false,
  display: false,
  alwaysContrast: false
});
```

**修改后：**
```typescript
const props = withDefaults(defineProps<PaXxxType>(), {
  type: "select"
});
```

---

## 三、文档 readme.md 修改

### 1. 使用 ComponentProps 格式

**修改前：**
```markdown
## `SaSwitchType`

| 字段           | 描述                 | 类型                        | 默认值  |
| -------------- | -------------------- | --------------------------- | ------- |
| modelValue     | 绑定值               | `string`                    | —       |
| disabled       | 禁用状态             | `boolean`                   | `false` |
```

**修改后：**
```markdown
## ComponentProps

| 属性名         | 描述         | 类型                        | 默认值      |
| -------------- | ------------ | --------------------------- | ----------- |
| modelValue     | 绑定值       | `string` `undefined`        | `undefined` |
| disabled       | 禁用状态     | `boolean` `undefined`       | `undefined` |
```

### 2. 使用 ComponentEvents 格式

**修改前：**
```markdown
## `SaSwitchEvents`

| 字段   | 描述           | 类型       |
| ------ | -------------- | ---------- |
| change | 当值改变时触发 | `function` |
```

**修改后：**
```markdown
## ComponentEvents

| 字段     | 描述             | 类型                            |
| -------- | ---------------- | ------------------------------- |
| onChange | 数据变更回调函数 | `({ value, oldValue }) => void` |
```

### 3. 类型列添加 undefined

所有类型列都要加上 `undefined`：

```markdown
| modelValue | 绑定值 | `string` `undefined` | `undefined` |
```

### 4. 新增 Display 章节

在基础使用后添加：

```markdown
## Display 纯展示模式

展示单层纯展示模式，使用 `display` 属性开启纯展示模式，如果使用 `displayValue` 属性，将直接显示值。

<demo src="./display.vue"></demo>
```

### 5. 新增相关类型表格

如果组件有配置类型（如 `PaSwitchOptionType`），需要单独列出：

```markdown
## PaSwitchOptionType

| 字段          | 描述         | 类型                                                  | 默认值      |
| ------------- | ------------ | ----------------------------------------------------- | ----------- |
| activeValue   | 打开时的值   | `number` `string` `undefined`                         | `true`      |
| inActiveValue | 关闭时的值   | `number` `string` `undefined`                         | `false`     |
```

---

## 四、新增示例文件

### 1. base.vue

基础使用示例：

```vue
<template>
  <pa-xxx v-model="value" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref("default");
</script>
```

### 2. display.vue

纯展示模式示例：

```vue
<template>
  <pa-xxx
    v-model="value"
    display
    title="标题"
    title-width="80px"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref("default");
</script>
```

---

## 五、改造检查清单

完成改造后，逐项检查：

### type.d.ts

- [ ] 已导入 `LanguageKey`，删除本地 `languageKey`
- [ ] 所有类型已添加 `| undefined`
- [ ] 布尔属性默认值已改为 `undefined`
- [ ] 已移除冗余注释
- [ ] 已移除 example 代码块
- [ ] 已添加 `displayValue`、`title`、`titleWidth` 属性

### 组件 .vue

- [ ] 已添加 `languageValue` 计算属性
- [ ] display 模式已添加 `title` 和 `titleWidth` 支持
- [ ] 已添加 `displayValue` 支持
- [ ] 已移除 `randChar` 导入和默认 id
- [ ] `withDefaults` 只保留必要默认值

### 文档 readme.md

- [ ] 已使用 `ComponentProps` 格式
- [ ] 已使用 `ComponentEvents` 格式
- [ ] 类型列已添加 `undefined`
- [ ] 默认值已改为 `undefined`
- [ ] 已添加 Display 纯展示模式章节
- [ ] 已添加相关类型表格（如有）

### 示例文件

- [ ] 已创建 `base.vue`
- [ ] 已创建 `display.vue`

---

## 六、提交规范

提交信息格式：

```
feat: 优化{组件名}组件类型定义，添加display模式和文档示例
```

示例：
```
feat: 优化Switch组件类型定义，添加display模式和文档示例
```

---

*文档版本：v1.0 | 更新时间：2026年4月*

# 组件 Props 与文档一致性检查报告 v2

> 检查时间：$(date '+%Y-%m-%d %H:%M:%S')
> 检查范围：`src/package/components/pa-*` 组件与 `document/PancakeUI_Doc/` 文档对比

## 总览

| 指标 | 数量 |
|------|------|
| 检查组件总数 | 38 |
| ✅ 一致 | 2 |
| ⚠️ 不一致 | 20 |
| 📄 文档缺失 | 14 |
| 🔧 源码缺失类型定义 | 2 |

---

## 一、✅ 一致的组件 (2个)

| 组件 | 说明 |
|------|------|
| `pa-message` | 组件 props 与文档完全一致 |
| `pa-scrollbar-list` | 组件 props 与文档完全一致 |

---

## 二、⚠️ 不一致的组件 (20个)

### 2.1 pa-button
**文档路径：** `document/PancakeUI_Doc/button/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档多余 | `type` |

> **说明：** 源码中 `type` 属性实际上是在 `buttonConfig` 内部使用，不是独立的顶层 props。

---

### 2.2 pa-cascader
**文档路径：** `document/PancakeUI_Doc/cascader/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `alwaysContrast`, `clearable`, `contrastData`, `disabled`, `display`, `displayValue`, `exOptions`, `modelValue`, `placeholder`, `useSingleText`, `useSingleValue` |

---

### 2.3 pa-checkbox
**文档路径：** `document/PancakeUI_Doc/checkbox/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `alwaysContrast`, `contrastData`, `disabled`, `display`, `exOptions`, `isChecked`, `isIndeterminate`, `label`, `modelValue`, `value` |

---

### 2.4 pa-dialog
**文档路径：** `document/PancakeUI_Doc/dialog/readme.md`

| 差异类型 | Props |
|----------|-------|
| 🔺 源码缺少 | `id` |
| 📝 文档多余 | `modelValue` |

---

### 2.5 pa-drawer
**文档路径：** `document/PancakeUI_Doc/drawer/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档多余 | `modelValue` |

---

### 2.6 pa-editor
**文档路径：** `document/PancakeUI_Doc/editor/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `children`, `value` |

---

### 2.7 pa-empty
**文档路径：** `document/PancakeUI_Doc/empty/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `id`, `image`, `text`, `useImage` |

---

### 2.8 pa-file
**文档路径：** `document/PancakeUI_Doc/file/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `autoUpload`, `children`, `disabled`, `display`, `fileList`, `limit`, `onChange`, `onExceed`, `onRemove`, `requestApi`, `style`, `useDownload` |

---

### 2.9 pa-form
**文档路径：** `document/PancakeUI_Doc/form/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `labelWidth`, `layout`, `modelValue`, `scroll`, `useRequired`, `validateType` |

---

### 2.10 pa-icon
**文档路径：** `document/PancakeUI_Doc/icon/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `class`, `color`, `size`, `spin`, `style` |

---

### 2.11 pa-input
**文档路径：** `document/PancakeUI_Doc/input/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `alwaysContrast`, `contrastData`, `disabled`, `display`, `displayValue`, `exOptions`, `modelValue`, `onFocus`, `placeholder`, `precision`, `showPassword`, `style`, `teleportInContainer`, `type`, `value` |

---

### 2.12 pa-media-view
**文档路径：** `document/PancakeUI_Doc/media-visible/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `alwaysContrast`, `contrastData`, `display`, `modelValue`, `onChange` |

---

### 2.13 pa-message-box
**文档路径：** `document/PancakeUI_Doc/message-box/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `cancelButtonText`, `cancelType`, `confirmButtonText`, `confirmType`, `onCancel`, `showCancel`, `showClose`, `useHtml` |

---

### 2.14 pa-notification
**文档路径：** `document/PancakeUI_Doc/notification/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `id`, `onDestory` |

---

### 2.15 pa-number
**文档路径：** `document/PancakeUI_Doc/number/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `alwaysContrast`, `clearable`, `contrastData`, `disabled`, `display`, `displayValue`, `exOptions`, `modelValue`, `placeholder`, `style`, `teleportInContainer` |

---

### 2.16 pa-pagination
**文档路径：** `document/PancakeUI_Doc/pagination/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `background`, `disabled`, `layout`, `pageCount`, `pageSizes`, `pagerCount`, `style`, `total` |

---

### 2.17 pa-radio
**文档路径：** `document/PancakeUI_Doc/radio/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `alwaysContrast`, `contrastData`, `disabled`, `display`, `exOptions`, `isChecked`, `label`, `modelValue` |

---

### 2.18 pa-select
**文档路径：** `document/PancakeUI_Doc/select/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `alwaysContrast`, `base`, `children`, `clearable`, `contrastData`, `disabled`, `display`, `displayValue`, `exOptions`, `modelValue`, `placeholder`, `requestApi`, `tagStyle`, `textColor` |

---

### 2.19 pa-switch
**文档路径：** `document/PancakeUI_Doc/switch/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `activeText`, `activeValue`, `alwaysContrast`, `contrastData`, `disabled`, `display`, `exOptions`, `inActiveText`, `inActiveValue`, `modelValue` |

---

### 2.20 pa-table
**文档路径：** `document/PancakeUI_Doc/table/readme.md`

| 差异类型 | Props |
|----------|-------|
| 🔺 源码缺少 | `summaryFunction` (文档中有) |
| 📝 文档缺少 | `AdvancedFilter`, `Filter`, `Page`, `PageNum`, `PageSize`, `Params`, `Sort`, `baseWidth`, `cellConfig`, `children`, `class`, `conditionalType`, `disabledRule`, `display`, `displayRule`, `embeddedToolButton`, `errorList`, `exCellDependent`, `exCellRules`, `exDependent`, `exOptions`, `exPagination`, `expandAuto`, `exportApi`, `fieldName`, `fieldValue`, `file_attachedData`, `file_downloadTemplate`, `filterSelectRow`, `filterType`, `fixed`, `fixedValue`, `fixedValueIndex`, `getTableList`, `icon`, `isIndeterminate`, `isOpenChild`, `isSelected`, `isShow`, `label`, `lastLeftFixed`, `lastRightFixed`, `layout`, `minWidth`, `name`, `onExpandRowAllBack`, `onExpandRowBack`, `onRadioRowBack`, `onRenderEnd`, `onSelectRowAllBack`, `onSelectRowBack`, `onTableCellChange`, `pageSizes`, `pagerCount`, `prop`, `requestAuto`, `required`, `rowKey`, `searchCriteria`, `select_RequestApi`, `style`, `summaryConfig`, `tag_click`, `tag_disabled`, `textWarp`, `time_disabledDateFn`, `time_shortcuts`, `unitText`, `useChildren`, `useExpand`, `useExpandAll`, `useFilter`, `useOverflowTooltip`, `usePagination`, `useRadio`, `useSelect`, `useSenior`, `useSeniorFilter`, `useSort`, `useSticky`, `useSum`, `useSummary`, `useTableIndex`, `useToolButton`, `width` |

---

### 2.21 pa-tabs
**文档路径：** `document/PancakeUI_Doc/tabs/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `class`, `id`, `lazy`, `onTabChange`, `padding`, `scroll`, `style`, `tips`, `useBorder`, `useScrollX` |

---

### 2.22 pa-time
**文档路径：** `document/PancakeUI_Doc/time/readme.md`

| 差异类型 | Props |
|----------|-------|
| 📝 文档缺少 | `cellClassName`, `clearable`, `defaultTime`, `defaultValue`, `disabledDate`, `editable`, `endPlaceholder`, `format`, `modelValue`, `popperClass`, `popperOptions`, `rangeSeparator`, `showTime`, `size`, `startPlaceholder`, `validateEvent`, `valueType` |
| 🔺 源码缺少 | `type` (文档中有) |

---

## 三、📄 文档缺失的组件 (14个)

| 组件 | 源码 Props |
|------|------------|
| `pa-badge` | `class`, `show`, `style`, `value` |
| `pa-col` | `offset`, `span` |
| `pa-color` | `class`, `disabled`, `id`, `modelValue`, `onChange`, `onClose`, `onOpen`, `presetColors`, `showAlpha`, `showInput`, `style`, `value` |
| `pa-playground` | `id`, `modelValue`, `style`, `useBackTop`, `useShadow` |
| `pa-popover` | `content`, `disabled`, `display`, `effect`, `id`, `modelValue`, `placement`, `popperClass`, `style`, `teleportInContainer`, `trigger`, `useArrow` |
| `pa-scrollbar` | `class`, `height`, `id`, `maxHeight`, `style`, `useAutoHide`, `useOverflowX`, `useOverflowY`, `width` |
| `pa-select-icon` | `alwaysContrast`, `class`, `contrastData`, `disabled`, `display`, `id`, `modelValue`, `placeholder`, `style`, `teleportInContainer` |
| `pa-tag` | `class`, `disabled`, `popoverWidth`, `style`, `useCollapse` |
| `pa-title` | `line`, `padding`, `tips` |
| `pa-transfer` | `alwaysContrast`, `class`, `contrastData`, `disabled`, `display`, `displayValue`, `exOptions`, `id`, `modelValue`, `onChange`, `optionKey`, `placeholder`, `style`, `useSearch` |

**文档目录缺失：** `cascader`, `checkbox`, `color-v2`, `form`, `media-visible`, `number`, `pagination`, `radio`, `scrollbar`, `select`, `tabs`, `time`, `tools`

---

## 四、🔧 源码缺失类型定义的组件 (2个)

| 组件 | 说明 |
|------|------|
| `pa-development` | 无 type.d.ts 文件 |
| `pa-row` | 无 type.d.ts 文件 |

---

## 五、建议修复优先级

### 🔴 高优先级（props 差异超过10个）
1. **pa-table** - 缺少 67 个 props 文档
2. **pa-input** - 缺少 16 个 props 文档
3. **pa-select** - 缺少 15 个 props 文档
4. **pa-time** - 缺少 16 个 props 文档
5. **pa-cascader** - 缺少 11 个 props 文档
6. **pa-checkbox** - 缺少 10 个 props 文档

### 🟡 中优先级（props 差异 5-10 个）
7. **pa-switch** - 缺少 10 个 props 文档
8. **pa-tabs** - 缺少 10 个 props 文档
9. **pa-number** - 缺少 11 个 props 文档
10. **pa-file** - 缺少 13 个 props 文档
11. **pa-radio** - 缺少 8 个 props 文档
12. **pa-form** - 缺少 6 个 props 文档
13. **pa-pagination** - 缺少 8 个 props 文档

### 🟢 低优先级（差异 1-5 个或无文档）
14. 其他文档缺失或少量差异的组件

---

*报告生成完毕*

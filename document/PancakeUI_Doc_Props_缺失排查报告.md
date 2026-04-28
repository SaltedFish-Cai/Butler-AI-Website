# PancakeUI 组件文档 Props 缺失排查报告

## 排查范围
- 组件目录：`~/Butler-AI-Website/src/package/components/`
- 文档目录：`~/Butler-AI-Website/document/PancakeUI_Doc/`

---

## 📊 汇总统计

| 统计项 | 数量 |
|--------|------|
| 组件总数 | 35 |
| 文档完整 | 19 |
| 文档不完整（缺少props） | 2 |
| 文档完全缺失 | 14 |
| **缺失props总数** | **137** |

---

## 一、文档不完整（缺少 Props）

按缺失数量从多到少排序：

### 1. pa-form
- **文档路径**: `document/PancakeUI_Doc/form/readme.md`
- **缺失数量**: 24

| 缺失的 Props |
|--------------|
| data |
| contrastData |
| alwaysContrast |
| exOptions |
| useRequired |
| noLabel |
| labelWidth |
| labelPosition |
| display |
| exDependent |
| exCellDependent |
| maxSpan |
| exStyles |
| clickTagClick |
| type |
| message |
| trigger |
| min |
| max |
| len |
| pattern |
| validator |
| enum |
| transform |

---

### 2. pa-table
- **文档路径**: `document/PancakeUI_Doc/table/readme.md`
- **缺失数量**: 8

| 缺失的 Props |
|--------------|
| filterSelectRow |
| display |
| useSticky |
| type |
| minWidth |
| baseWidth |
| searchCriteria |
| useSeniorFilter |

---

## 二、文档完全缺失

按缺失数量从多到少排序：

### 1. pa-popover
- **缺失数量**: 16

| 缺失的 Props |
|--------------|
| id |
| class |
| popoverClass |
| style |
| referenceStyle |
| disabled |
| placement |
| trigger |
| contentClassName |
| popoverWidth |
| stopPropagation |
| autoWidth |
| targetClose |
| sticky |
| closeByScroll |
| beforeClose |

---

### 2. pa-transfer
- **缺失数量**: 14

| 缺失的 Props |
|--------------|
| id |
| class |
| style |
| modelValue |
| displayValue |
| exOptions |
| optionKey |
| placeholder |
| disabled |
| display |
| useSearch |
| contrastData |
| alwaysContrast |
| onChange |

---

### 3. pa-color
- **缺失数量**: 12

| 缺失的 Props |
|--------------|
| id |
| class |
| style |
| value |
| modelValue |
| disabled |
| showAlpha |
| showInput |
| presetColors |
| onChange |
| onOpen |
| onClose |

---

### 4. pa-pagination
- **缺失数量**: 10

| 缺失的 Props |
|--------------|
| id |
| class |
| style |
| currentPage |
| pageSize |
| pageSizes |
| pagerCount |
| background |
| layout |
| disabled |

---

### 5. pa-select-icon
- **缺失数量**: 10

| 缺失的 Props |
|--------------|
| id |
| class |
| style |
| modelValue |
| placeholder |
| disabled |
| display |
| teleportInContainer |
| contrastData |
| alwaysContrast |

---

### 6. pa-scrollbar-list
- **缺失数量**: 9

| 缺失的 Props |
|--------------|
| class |
| style |
| styleMode |
| rowKey |
| useShadow |
| useBackTop |
| showPagination |
| padding |
| paddingWidth |

---

### 7. pa-empty
- **缺失数量**: 5

| 缺失的 Props |
|--------------|
| id |
| class |
| style |
| message |
| icon |

---

### 8. pa-media-view
- **缺失数量**: 5

| 缺失的 Props |
|--------------|
| id |
| fileName |
| originalName |
| fileName |
| hideBtn |

---

### 9. pa-tag
- **缺失数量**: 5

| 缺失的 Props |
|--------------|
| class |
| style |
| useCollapse |
| popoverWidth |
| disabled |

---

### 10. pa-badge
- **缺失数量**: 4

| 缺失的 Props |
|--------------|
| value |
| show |
| class |
| style |

---

### 11. pa-overlay
- **缺失数量**: 4

| 缺失的 Props |
|--------------|
| class |
| style |
| useBlock |
| teleportTo |

---

### 12. pa-title
- **缺失数量**: 3

| 缺失的 Props |
|--------------|
| line |
| tips |
| padding |

---

### 13. pa-col
- **缺失数量**: 0 (无 Props 定义)

---

### 14. pa-row
- **缺失数量**: 0 (无 Props 定义)

---

## 三、文档完整的组件（无需处理）

以下 19 个组件的文档已完整，无需补充：

| 组件名 | 文档路径 |
|--------|----------|
| pa-button | document/PancakeUI_Doc/button/readme.md |
| pa-cascader | document/PancakeUI_Doc/cascader/readme.md |
| pa-checkbox | document/PancakeUI_Doc/checkbox/readme.md |
| pa-dialog | document/PancakeUI_Doc/dialog/readme.md |
| pa-drawer | document/PancakeUI_Doc/drawer/readme.md |
| pa-editor | document/PancakeUI_Doc/editor/readme.md |
| pa-file | document/PancakeUI_Doc/file/readme.md |
| pa-icon | document/PancakeUI_Doc/icon/readme.md |
| pa-input | document/PancakeUI_Doc/input/readme.md |
| pa-message | document/PancakeUI_Doc/message/readme.md |
| pa-message-box | document/PancakeUI_Doc/message-box/readme.md |
| pa-notification | document/PancakeUI_Doc/notification/readme.md |
| pa-number | document/PancakeUI_Doc/number/readme.md |
| pa-radio | document/PancakeUI_Doc/radio/readme.md |
| pa-scrollbar | document/PancakeUI_Doc/scrollbar/readme.md |
| pa-select | document/PancakeUI_Doc/select/readme.md |
| pa-switch | document/PancakeUI_Doc/switch/readme.md |
| pa-tabs | document/PancakeUI_Doc/tabs/readme.md |
| pa-time | document/PancakeUI_Doc/time/readme.md |

---

## 四、补全优先级建议

### 高优先级（缺失 >10 个 Props）
1. **pa-form** - 缺失 24 个 Props
2. **pa-popover** - 缺失 16 个 Props（需新建文档）
3. **pa-transfer** - 缺失 14 个 Props（需新建文档）
4. **pa-color** - 缺失 12 个 Props（需新建文档）

### 中优先级（缺失 5-10 个 Props）
5. **pa-pagination** - 缺失 10 个 Props（需新建文档）
6. **pa-select-icon** - 缺失 10 个 Props（需新建文档）
7. **pa-scrollbar-list** - 缺失 9 个 Props（需新建文档）
8. **pa-table** - 缺失 8 个 Props

### 低优先级（缺失 <5 个 Props）
9. **pa-empty** - 缺失 5 个 Props（需新建文档）
10. **pa-media-view** - 缺失 5 个 Props（需新建文档）
11. **pa-tag** - 缺失 5 个 Props（需新建文档）
12. **pa-badge** - 缺失 4 个 Props（需新建文档）
13. **pa-overlay** - 缺失 4 个 Props（需新建文档）
14. **pa-title** - 缺失 3 个 Props（需新建文档）


---
*报告生成完成*

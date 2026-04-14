# 获取字典选项 useDictionaries

快速高效的，获取接口字典数据

:::danger
获取字典方法为 `异步请求` 在项目中不可直接使用在主方法内。否则页面会出现卡死情况。
:::

```typescript
import useDictionaries from "MTools/dictionaries"; // [!code warning]
import { mTagOptionType } from "SaltedU/global";// [!code warning]

const exOptions = ref({});
nextTick(async () => {
  const Select: mTagOptionType[] = await useDictionaries("table", ["Dealer"]); // [!code warning]
  const bgColor = ["#33b698", "#409eff"];
  for (let index = 0; index < Select.length; index++) {
    Select[index].tagStyle = { bgColor: bgColor[index], textColor: "#fff" };
  }
  exOptions.value = { Select };
});
```

```typescript
import useDictionaries from "MTools/dictionaries-all"; // [!code warning]
import { mSelectOptionType } from "SaltedU/global";// [!code warning]

const exOptions = ref({});
nextTick(async () => {
  const Select: { [x: string]: mSelectOptionType[] } = await useDictionaries([
    {
      key: "aa",
      dictionaryType: "table",
      tableName: "SmartLabelImportExportRecord",
      columnName: "RecordType",
      dictionaryKey: ""
    },
    {
      key: "bb",
      dictionaryType: "system",
      tableName: "",
      columnName: "",
      dictionaryKey: "InvoiceTimeOutCheckTaskIntervalDays"
    }
  ]);

  exOptions.value = Select;
});
```

### 入参

| 字段   | 类型                              | 描述         |
| ------ | --------------------------------- | ------------ |
| type   | "system" / "table"                | 获取字典类型 |
| key    | string[]                          | 字典接口参数 |
| params | systemParamsType /tableParamsType | 字典接口参数 |

#### tableParamsType

| 字段            | 类型   | 描述 |
| --------------- | ------ | ---- |
| fieldName       | string |      |
| fieldValue      | string |      |
| conditionalType | string |      |

#### systemParamsType

| 字段 | 类型   | 描述 |
| ---- | ------ | ---- |
| keys | string |      |

### 出参 `mSelectOptionType`

| 字段  | 类型   | 描述   |
| ----- | ------ | ------ |
| label | string | 选项名 |
| value | string | 选项值 |

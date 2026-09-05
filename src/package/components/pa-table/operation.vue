<template>
  <RenderTableColumn v-bind="props.column" />
</template>

<script lang="tsx" setup>
import { inject, useSlots, h, ComputedRef } from "vue";
import { ComponentUseItemProps, PaTableUseType } from "./types";
import { LanguageKey } from "../manager-type";
import { PancakeGlobalConfigType } from "../pa-manager/types";

type OperationPropsType = { tableId: string; column: ComponentUseItemProps; row: PaTableUseType.PaTableInDataType };
const language = inject("language") as ComputedRef<LanguageKey>;
const slots = useSlots();

const props = withDefaults(defineProps<OperationPropsType>(), {});

const PancakeGlobalConfig = inject<PancakeGlobalConfigType>("PancakeGlobalConfig", {});

const displayText = props => {
  if (typeof props.text === "string") return props.text;
  const lang = PancakeGlobalConfig?.language || "zh-CN";
  return props.text?.[lang] || "按钮";
};

function setOperations(arrData) {
  const arrayChild = arrData?.[0].children;
  if (arrayChild && arrayChild.length) {
    const _arrayChild: any = [];
    function findChild(arrayChild) {
      for (let index = 0; index < arrayChild.length; index++) {
        const element = arrayChild[index];
        const { row, tableId } = props;
        const { type, children } = element;

        if (element.props) {
          element.props.dataName = "按钮 - " + displayText(element.props) + ` (表格数据${row.rowIndex})`;
          element.props.renderId = tableId + "-row-" + row.rowIndex + "_" + element.key;
        }

        const stringType = String(type);
        if (stringType.indexOf("Symbol") < 0 || stringType == "Symbol(v-txt)") {
          _arrayChild.push(element);
        } else if (stringType == "Symbol(v-fgt)" && children?.length) {
          findChild(children);
        }
      }
    }
    findChild(arrayChild);

    const baseArr: any = [];
    const otherArr: any = [];

    if (_arrayChild.length > 3) {
      _arrayChild.map((data, index) => {
        if (index < 2) {
          baseArr.push(data);
        } else {
          otherArr.push(data);
        }
      });

      return (
        <>
          {baseArr.map(data => {
            return h(data);
          })}
          {
            <pa-popover trigger="hover" contentClassName="pa-table-more-opt">
              {{
                reference: () => {
                  return <pa-button is="more">{language.value === "zh-CN" ? "更多操作" : "More Operations"}</pa-button>;
                },
                default: () => {
                  return (
                    <>
                      {otherArr.map(data => {
                        return h(data);
                      })}
                    </>
                  );
                }
              }}
            </pa-popover>
          }
        </>
      );
    } else {
      return (
        <>
          {_arrayChild?.map(data => {
            return h(data);
          })}
        </>
      );
    }
  } else {
    return <></>;
  }
}

// #Function 主方法
function RenderTableColumn(item: ComponentUseItemProps & { isTipTitle?: boolean }) {
  const operationArr = slots["operation"]!({ row: item });

  return <>{<div class="operation_item">{setOperations(operationArr)}</div>}</>;
}
</script>

<style lang="scss">
.pa-table-more-opt {
  display: flex;
  flex-direction: column;
  > .pa-button + .pa-button {
    margin-top: calc(var(--pa-size-padding, 10px) / 2);
    margin-left: 0;
  }
}
</style>

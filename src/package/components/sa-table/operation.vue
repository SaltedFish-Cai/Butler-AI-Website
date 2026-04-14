<template>
  <RenderTableColumn v-bind="props.column" />
</template>

<script lang="tsx" setup>
import { inject, useSlots, h } from "vue";
import { SaTableUseItemType, SaTableUseType } from "./type";

type OperationPropsType = { column: SaTableUseItemType; row: SaTableUseType.SaTableInDataType };
const languagePackage = inject("languagePackage") as Record<string, string>;
const slots = useSlots();

const props = withDefaults(defineProps<OperationPropsType>(), {});

function setOperations(arrData) {
  const arrayChild = arrData?.[0].children;
  if (arrayChild && arrayChild.length) {
    const _arrayChild: any = [];
    function findChild(arrayChild) {
      for (let index = 0; index < arrayChild.length; index++) {
        const element = arrayChild[index];

        const { type, children } = element;
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
            <sa-popover trigger="hover" contentClassName="sa-table-more-opt">
              {{
                reference: () => {
                  return <sa-button is="more">{languagePackage.value["more"]}</sa-button>;
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
            </sa-popover>
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
function RenderTableColumn(item: SaTableUseItemType & { isTipTitle?: boolean }) {
  const operationArr = slots["operation"]!({ row: item });

  return <>{<div class="operation_item">{setOperations(operationArr)}</div>}</>;
}
</script>

<style lang="scss">
.sa-table-more-opt {
  > .sa-button {
    margin: calc(var(--m-component-padding-size, 10px) / 2) 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

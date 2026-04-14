<template>
  <template v-if="item.type == 'group' && item.prop">
    <!-- label -->
    <!-- <form-label :label="computedLabel" :tip="computedTip" :item="item" :data="injectConfigContext.data[item.prop]">
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </form-label> -->

    <div class="flex-col m-form-group-item">
      <!-- group -->
      <m-radio-v2
        v-if="!useDisplay"
        :id="id + '-' + item.prop + '-radio'"
        v-model="injectConfigContext.data[item.prop]"
        :disabled="item.disabled"
        :exOptions="radioOptions"
        @change="radioChange"
      ></m-radio-v2>

      <template v-for="groupItem in item.groupFormConfig" :key="groupItem.prop">
        <template
          v-if="injectConfigContext.data && injectConfigContext.data[item.prop] == groupItem.value && groupItem.type != 'null'"
        >
          <formItem :id="id" :item="{ ...groupItem }" noLabel>
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>

            <template #exDisplay>
              {{ findData(injectConfigContext.data[item.prop], radioOptions) || "--" }}
            </template>

            <template #exContrast>
              <div
                v-if="
                  (injectConfigContext.alwaysContrast && !isNil(injectConfigContext.contrastData)) ||
                  (!isNil(injectConfigContext.contrastData) &&
                    !isEqual(injectConfigContext.data[item.prop], injectConfigContext.contrastData))
                "
                :class="['m-contrast-v2']"
              >
                {{ injectConfigContext.contrastData || "--" }}
              </div>
            </template>
          </formItem>
        </template>
      </template>
    </div>
  </template>
</template>
<script lang="tsx" setup>
// # Import
import { Ref, ref, inject, computed, onMounted } from "vue";
// import formLabel from "../form-label.vue";
import formItem from "../form-basics-element.vue";
import { GroupItemPropsType } from "../item";
import lodashPkg from "lodash";
import { ConfigContextType, MFormV2ChildType, MFormV2ItemType } from "../type";
import { MOptionV2Type } from "../../manager-type";
import { findData } from "../../m-select-v2/find-data";

const { isNil, isEqual } = lodashPkg;
// # Var
const props = withDefaults(defineProps<GroupItemPropsType>(), {});

// # 处理Display状态
const useDisplay = computed(() => {
  return !isNil(props.item.display) ? props.item.display : injectConfigContext.value.display || false;
});

const injectConfigContext = inject<Ref<ConfigContextType>>(
  "configContext",
  ref({
    baseSpanSize: 4,
    itemSpanSize: {},
    data: {},
    contrastData: {},
    alwaysContrast: false,
    display: false,
    languagePackage: {},
    language: "zh-CN",
    exOptions: {},
    exDependent: {},
    exCellDependent: {},
    useRequired: true,
    noLabel: false
  })
);
const injectSetRule = inject<
  (item: MFormV2ChildType | MFormV2ItemType, type?: string, options?: { titleKey?: string; removeList?: string[] }) => void
>("setRule", () => {
  //
});

// const computedLabel = computed(() => {
//   return typeof props.item.label == "object"
//     ? props.item.label?.[injectConfigContext.value.language || "zh-CN"]
//     : props.item.label;
// });

// const computedTip = computed(() => {
//   return typeof props.item.tip == "object" ? props.item.tip?.[injectConfigContext.value.language || "zh-CN"] : props.item.tip;
// });

const radioOptions = computed(() => {
  const val = injectConfigContext.value.data[String(props.item.prop)];
  let opts = (injectConfigContext.value.exOptions[String(props.item.prop)] ||
    props.item.groupFormConfig) as MOptionV2Type.SelectList;
  const types = typeof val;
  if (types == "number") {
    opts = opts.map(item => {
      return {
        label: item?.label?.[injectConfigContext.value.language || "zh-CN"] || item.label,
        value: item.value
      };
    });
  } else {
    opts = opts.map(item => {
      return {
        label: item?.label?.[injectConfigContext.value.language || "zh-CN"] || item.label,
        value: String(item.value)
      };
    });
  }
  if (isNil(injectConfigContext.value?.data?.[String(props.item.prop)])) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    injectConfigContext.value.data[String(props.item.prop)] = opts[0].value;
  }
  return opts;
});

function radioChange({ value }) {
  if (props.item.groupFormConfig) {
    const item = props.item.groupFormConfig.find(item => item.value == value);
    if (item) {
      const filterList = props.item.groupFormConfig.map(item => String(item.prop));
      injectSetRule(item, "default", { removeList: filterList });
    }
  }
}

onMounted(() => {
  radioChange({ value: injectConfigContext.value.data[String(props.item.prop)] });
});

// function findData2(data) {
//   const prop = props.item.prop;
//   if (!prop) {
//     return;
//   }
//   let text = "";
//   const options = radioOptions.value;
//   for (let index = 0; index < options.length; index++) {
//     const option = options[index];
//     if (option.value == data) {
//       if (text == "") text += props.item.label + ":";
//       text += option.label;
//     }
//   }
//   return text || "--";
// }
</script>
<style lang="scss" scoped>
.flex-col {
  width: 100%;
}
</style>

<template>
  <template v-if="item.prop">
    <!-- other-item -->
    <m-col-v2 :xs="colSize" :sm="colSize" :md="colSize" :lg="colSize" :xl="colSize" :span="item.colSpan">
      <m-form-v2-item
        :prop="Array.isArray(item.prop) ? item.prop.join('-') : item.prop"
        :class="[item.exStyles?.class || '']"
        :style="item.exStyles?.style || {}"
      >
        <!-- label -->
        <template #label v-if="computedLabel && !injectConfigContext.noLabel && !noLabel">
          <form-label :label="computedLabel" :tip="computedTip" :item="item" :data="computedValue">
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </form-label>
        </template>

        <!-- cell -->
        <section class="flex-start-start flex-cell">
          <!-- input -->
          <template v-if="item.type == 'input' || item.type == 'textarea'">
            <m-input-v2
              :id="id + '-' + item.prop + '-input'"
              v-model="computedValue"
              :type="item.type"
              :placeholder="usePlaceholder"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :display="useDisplay"
              :maxLength="item.maxLength"
              :clearable="item.clearable"
              :autofocus="item.autofocus"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-input-v2>
          </template>

          <!-- number -->
          <template v-else-if="item.type == 'number'">
            <m-number-v2
              :id="id + '-' + item.prop + '-number'"
              v-model="computedValue"
              :placeholder="usePlaceholder"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :display="useDisplay"
              :min="item.min"
              :max="item.max"
              :precision="item.precision"
              :controls="item.controls"
              :step="item.step"
              :unit="item.unit"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-number-v2>
          </template>

          <!-- select -->
          <template
            v-else-if="
              item.type == 'select' ||
              item.type == 'multiple-select' ||
              item.type == 'request-select' ||
              item.type == 'multiple-request-select' ||
              item.type == 'online-select' ||
              item.type == 'multiple-online-select'
            "
          >
            <m-select-v2
              :id="id + '-' + item.prop + '-select'"
              v-model="computedValue"
              :type="item.type"
              :displayValue="item.displayValue ? injectConfigContext.data[item.displayValue] : undefined"
              :exOptions="useExOptions as MOptionV2Type.SelectList"
              :requestApi="injectConfigContext.exCellDependent?.select_RequestApi?.[item.prop]"
              :optionKey="item.optionKey"
              :placeholder="usePlaceholder"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :display="useDisplay"
              :clearable="item.clearable"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #optionLabel="scope">
                <slot :name="`option-${item.prop}`" :scope="scope"></slot>
              </template>
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-select-v2>
          </template>

          <!-- cascader -->
          <template
            v-else-if="
              item.type == 'cascader' ||
              item.type == 'cascader-check' ||
              item.type == 'multiple-cascader' ||
              item.type == 'multiple-cascader-check'
            "
          >
            <m-cascader-v2
              :id="id + '-' + item.prop + '-cascader'"
              v-model="computedValue"
              :type="item.type"
              :displayValue="item.displayValue ? injectConfigContext.data[item.displayValue] : undefined"
              :exOptions="useExOptions as MOptionV2Type.SelectList"
              :placeholder="usePlaceholder"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :display="useDisplay"
              :useSingleValue="item.useSingleValue"
              :useSingleText="item.useSingleText"
              :clearable="item.clearable"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #optionLabel="scope">
                <slot :name="`option-${item.prop}`" :scope="scope"></slot>
              </template>
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-cascader-v2>
          </template>

          <!-- switch -->
          <template v-else-if="item.type == 'switch'">
            <m-switch-v2
              :id="id + '-' + item.prop + '-switch'"
              v-model="computedValue"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :exOptions="injectConfigContext.exOptions[item.prop] as MOptionV2Type.Switch"
              :display="useDisplay"
              :activeValue="item.activeValue"
              :inActiveValue="item.inActiveValue"
              :activeText="item.activeText"
              :inActiveText="item.inActiveText"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-switch-v2>
          </template>

          <!-- checkbox -->
          <template v-else-if="item.type == 'checkbox'">
            <m-checkbox-v2
              :id="id + '-' + item.prop + '-checkbox'"
              v-model="computedValue"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :exOptions="useExOptions as MOptionV2Type.SelectList"
              :display="useDisplay"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-checkbox-v2>
          </template>

          <!-- radio -->
          <template v-else-if="item.type == 'radio'">
            <m-radio-v2
              :id="id + '-' + item.prop + '-radio'"
              v-model="computedValue"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :exOptions="useExOptions as MOptionV2Type.SelectList"
              :display="useDisplay"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-radio-v2>
          </template>

          <!-- time -->
          <template
            v-else-if="
              item.type == 'date-picker-group' ||
              item.type == 'date-picker' ||
              item.type == 'date-time-picker' ||
              item.type == 'date-time-picker-group' ||
              item.type == 'month-picker-group' ||
              item.type == 'month-picker' ||
              item.type == 'time-picker-group' ||
              item.type == 'time-picker' ||
              item.type == 'year-picker-group' ||
              item.type == 'year-picker'
            "
          >
            <m-time-v2
              :id="id + '-' + item.prop + '-time'"
              v-model="computedValue"
              :type="item.type"
              :placeholder="usePlaceholder"
              :disabledDateFn="item.disabledDateFn"
              :shortcuts="injectConfigContext.exCellDependent?.time_shortcuts?.[String(item.prop)] || item.shortcuts"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :display="useDisplay"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-time-v2>
          </template>

          <!-- select-icon -->
          <template v-else-if="item.type == 'select-icon'">
            <m-select-icon-v2
              :id="id + '-' + item.prop + '-select-icon'"
              v-model="computedValue"
              :placeholder="usePlaceholder"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :display="useDisplay"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-select-icon-v2>
          </template>

          <!-- file -->
          <template v-else-if="item.type == 'file'">
            <m-file-v2
              :id="id + '-' + item.prop + '-file'"
              v-model="computedValue"
              :placeholder="usePlaceholder"
              :attachedData="item.attachedData || injectConfigContext.exCellDependent?.file_attachedData?.[String(item.prop)]"
              :downloadTemplate="injectConfigContext.exCellDependent?.file_downloadTemplate?.[String(item.prop)]"
              :fileMultiple="item.fileMultiple"
              :fileIncludeType="item.fileIncludeType"
              :fileExcludeType="item.fileExcludeType"
              :fileSingleSize="item.fileSingleSize"
              :fileAllSize="item.fileAllSize"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :display="useDisplay"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>

              <template v-if="$slots['cell-file-' + String(item.prop)]" #downloadTemplate>
                <slot :name="'cell-file-' + item.prop" :config="item" :data="injectConfigContext.data"></slot>
              </template>
            </m-file-v2>
          </template>

          <!-- transfer -->
          <template v-else-if="item.type == 'transfer'">
            <m-transfer-v2
              :id="id + '-' + item.prop + '-transfer'"
              v-model="computedValue"
              :disabled="item.disabled || disabledFn(injectConfigContext.data)"
              :exOptions="useExOptions as MOptionV2Type.SelectList"
              :useSearch="item.useSearch"
              :display="useDisplay"
              :contrastData="item.prop && injectConfigContext.contrastData?.[item.prop]"
              :alwaysContrast="injectConfigContext.alwaysContrast"
              style="height: 300px"
              @change="valueChange"
            >
              <template #exDisplay v-if="$slots.exDisplay"> <slot name="exDisplay"></slot> </template>
              <template #exContrast v-if="$slots.exContrast"> <slot name="exContrast"></slot> </template>
            </m-transfer-v2>
          </template>

          <!-- group -->
          <template v-else-if="item.type == 'group'">
            <groupItem :id="id + '-' + item.prop + '-group'" :item="item">
              <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                <slot :name="slot" v-bind="scope"></slot>
              </template>
            </groupItem>
          </template>

          <!-- slot -->
          <template v-else-if="item.type == 'slot' || $slots[String(item.prop)]">
            <slot :name="item.prop" :config="item" :data="injectConfigContext.data"></slot>
          </template>
        </section>

        <div class="cell-slots" v-if="$slots[`cell-${item.prop}`]">
          <slot :name="'cell-' + item.prop" v-bind="{ data: injectConfigContext.data, item: item }"></slot>
        </div>

        <div v-if="item.exStyles?.message" :class="item.exStyles?.messageClass" :style="item.exStyles?.messageStyle">
          {{ item.exStyles?.message }}
        </div>
      </m-form-v2-item>
    </m-col-v2>
  </template>
  <!-- null -->
  <m-col-v2 v-else-if="item.type == 'null'" :xs="colSize" :sm="colSize" :md="colSize" :lg="colSize" :xl="colSize"> </m-col-v2>
</template>

<script lang="ts" setup>
// # Import
import { ref, computed, onMounted, inject, Ref, watch, ComputedRef } from "vue";
import formLabel from "./form-label.vue";
import mFormV2Item from "./m-form-v2-item.vue"; // 添加这行
import groupItem from "./components/group-item.vue";

import { isNil } from "lodash";

import { ConfigContextType, MFormV2ItemType } from "./type";
import { MOptionV2Type } from "../manager-type";
import { GetSystemAddressMap } from "../api/form";

// # Var
type BasicsItemPropsType = {
  id: string;
  item: MFormV2ItemType;
  noLabel?: boolean;
  tabsProps?: string;
  tabsIndex?: number;
  exData?: any;
  enforcementDisplay?: boolean;
};
const props = withDefaults(defineProps<BasicsItemPropsType>(), {});
const injectConfigContext = inject<Ref<ConfigContextType>>(
  "configContext",
  ref({
    labelWidth: "auto",
    labelPosition: "top",
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
const injectFormContext = inject<any>("formContext", {});
const addressMap = ref<MOptionV2Type.SelectList>([]);

const computedValue = computed({
  get: () => {
    return !isNil(props.exData)
      ? props.exData
      : props.tabsProps && !isNil(props.tabsIndex)
      ? injectConfigContext.value.data[props.tabsProps][props.tabsIndex][String(props.item.prop)]
      : injectConfigContext.value.data[String(props.item.prop)];
  },
  set: value => {
    if (props.tabsProps && !isNil(props.tabsIndex)) {
      injectConfigContext.value.data[props.tabsProps][props.tabsIndex][String(props.item.prop)] = value;
    } else {
      injectConfigContext.value.data[String(props.item.prop)] = value;
    }
  }
});

const computedLabel: ComputedRef<string | undefined> = computed(() => {
  return typeof props.item.label == "object"
    ? props.item.label?.[injectConfigContext.value.language || "zh-CN"]
    : (props.item.label as string);
});

const computedTip: ComputedRef<string | undefined> = computed(() => {
  return typeof props.item.tip == "object"
    ? props.item.tip?.[injectConfigContext.value.language || "zh-CN"]
    : (props.item.tip as string);
});

const useExOptions = computed(() => {
  return injectConfigContext.value.exOptions[String(props.item.prop)] || props.item.exOptions;
});

onMounted(async () => {
  if (props.item.type == "address") {
    props.item.type = "cascader" as any;
    props.item.useSingleValue = false as any;
    const res = await GetSystemAddressMap();
    function setSmallLabel(arrayData) {
      return arrayData.map(item => {
        item.label = item.Label || item.label;
        item.value = item.Value || item.value;
        delete item.Label;
        delete item.Value;
        if (item.Children?.length) {
          item.children = setSmallLabel(item.Children);
          delete item.Children;
        }
        return item;
      });
    }
    addressMap.value = setSmallLabel(res || []);
  }
});

// # Function 设置单行列数
function setSpanStyle(span?: 1 | 2 | 3 | 4, baseSpanSize = 4) {
  const maxSpanList = {
    4: [6, 12, 18, 24],
    3: [8, 16, 24, 24],
    2: [12, 24, 24, 24],
    1: [24, 24, 24, 24]
  };

  let data = 24 / baseSpanSize;
  if (maxSpanList[data]) {
    if (span == 1) {
      data = maxSpanList[data][0];
    } else if (span == 2) {
      data = maxSpanList[data][1];
    } else if (span == 3) {
      data = maxSpanList[data][2];
    } else if (span == 4) {
      data = maxSpanList[data][3];
    }
  }

  return data;
}

// # 间隔大小
const colSize = computed(() => {
  const _injectConfigContext = injectConfigContext.value;
  const _prop = Array.isArray(props.item.prop) ? props.item.prop.join("-") : String(props.item.prop);
  // 无Label时，spanSize为24
  if (props.noLabel) return 24;

  const data =
    _prop && props.item.exSpan
      ? setSpanStyle(props.item.exSpan, _injectConfigContext.baseSpanSize)
      : _injectConfigContext.baseSpanSize;

  return data;
});

// # 处理Placeholder
const usePlaceholder = computed(() => {
  let placeholder = props.item?.placeholder;
  if (!placeholder) {
    const item = props.item;
    if (item.type == "input" || item.type == "textarea" || item.type == "number") {
      placeholder = injectConfigContext.value.languagePackage["input"] + computedLabel.value;
    } else if (
      item.type == "select" ||
      item.type == "multiple-select" ||
      item.type == "cascader" ||
      item.type == "cascader-check" ||
      item.type == "multiple-cascader-check" ||
      item.type == "multiple-cascader" ||
      item.type == "online-select" ||
      item.type == "multiple-online-select" ||
      item.type == "request-select" ||
      item.type == "multiple-request-select" ||
      item.type == "date-picker-group" ||
      item.type == "date-picker" ||
      item.type == "date-time-picker" ||
      item.type == "date-time-picker-group" ||
      item.type == "month-picker-group" ||
      item.type == "month-picker" ||
      item.type == "time-picker-group" ||
      item.type == "time-picker" ||
      item.type == "year-picker-group" ||
      item.type == "year-picker" ||
      item.type == "select-icon" ||
      item.type == "file"
    ) {
      placeholder = injectConfigContext.value.languagePackage["select"] + computedLabel.value;
    }
  }
  return placeholder;
});

// # 处理Display状态
const useDisplay = computed(() => {
  return (
    props.enforcementDisplay || (!isNil(props.item.display) ? props.item.display : injectConfigContext.value.display || false)
  );
});

// const changeFormState: any = inject("changeFormState");
const formCellChange: any = inject("formCellChange");

function valueChange(data) {
  formCellChange({ prop: props.item.prop, ...data });
  injectFormContext.validateField(props.item.prop, data.value);
}

// #Function 执行外部disabled方法
function disabledFn(data) {
  if (!props.item.prop || !injectConfigContext.value.exDependent?.disabledRule) return false;

  const prop = Array.isArray(props.item.prop) ? props.item.prop.join("-") : props.item.prop;
  const disabledRule = injectConfigContext.value.exDependent?.disabledRule;

  return disabledRule[prop] && disabledRule[prop](data);
}

// #Function 变更formState状态
// function changeState(data: "Pending" | "Working") {
//   changeFormState(data);
// }

watch(
  () => props.item.type,
  newVal => {
    if (newVal == "address") {
      props.item.type = "cascader" as any;
      props.item.useSingleValue = false as any;
    }
  }
);
</script>

<style lang="scss" scoped>
.flex-cell {
  width: 100%;
  word-break: break-all;
}
.cell-slots {
  font-size: 14px;
  line-height: 1.5em;
  word-break: break-all;
  padding-top: 5px;
}

.h26 {
  height: 26px;
}
</style>

<style lang="scss">
// .span_item_all-center {
//   width: 100%;
//   .m-form-v2-item {
//     margin-bottom: 18px !important;
//     &__content {
//       display: flex;
//       justify-content: center;
//     }
//   }
// }
</style>

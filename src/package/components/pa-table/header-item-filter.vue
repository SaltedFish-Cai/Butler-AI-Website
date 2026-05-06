<template>
  <!-- 表头筛选 -->
  <pa-popover ref="mPopoverRef" :id="_id" :popover-width="340">
    <template #reference>
      <div @click="openVisible"><slot name="default"></slot></div>
    </template>
    <div class="flex-center-between filter-body">
      <!-- select -->
      <pa-select
        v-if="isSelectType(item, true)"
        v-model="state.searchValue"
        :placeholder="languagePackage['selectPlaceholder']"
        type="multiple-select"
        :exOptions="(_exOptions[String(item.prop)] as PaOptionType.SelectList)"
        teleport-in-container
      >
        <template #optionLabel="{ scope }">
          <div class="flex-center-start">
            <div class="pa-table-tag-color mr-size" :style="{ backgroundColor: scope?.tagStyle?.bgColor }"></div>
            {{ typeof scope?.label === "object" ? scope?.label[language] : scope?.label }}
          </div>
        </template>
        <!-- <template #tag>
          <slot :name="'header-tag-' + item.prop" v-bind="{ row: state.searchValue }"></slot>
        </template>

        <template #label>
          <slot :name="'header-label-' + item.prop" v-bind="{ row: state.searchValue }"></slot>
        </template> -->

        <!-- <el-option v-for="opt in _exOptions[item.prop]" :key="opt.label + opt.value" :value="opt.value" :label="opt.label">
          <slot :name="'header-option-' + item.prop" v-bind="{ row: opt }">
            <div class="flex-center-start">
              <div
                class="pa-table-tag-color mr-size"
                v-if="opt.tagStyle?.bgColor"
                :style="{ backgroundColor: opt.tagStyle.bgColor }"
              ></div>
              <div :class="[size == 'small' ? 'm-table-select-label_small' : '']">{{ opt.label }}</div>
            </div>
          </slot>
        </el-option> -->
      </pa-select>

      <!-- time -->
      <div v-else-if="isTimeType(item, true)" class="flex-center my-date-picker">
        <pa-time
          v-model="state.searchValue[0]"
          type="date-picker"
          :placeholder="languagePackage['startTime']"
          :disabledDateFn="time => disabledStart(time)"
          teleport-in-container
          @keydown.enter="FetchSaveAndFilter"
        />
        <div class="ml5 mr5">/</div>
        <pa-time
          v-model="state.searchValue[1]"
          type="date-picker"
          :placeholder="languagePackage['endTime']"
          :disabledDateFn="time => disabledEnd(time)"
          teleport-in-container
          @keydown.enter="FetchSaveAndFilter"
        />
      </div>

      <!-- number -->
      <pa-number
        v-else-if="isNumberType(item, true)"
        v-model="state.searchValue"
        @keydown.enter="FetchSaveAndFilter"
        :placeholder="languagePackage['inputPlaceholder']"
        :disabled="item?.cellConfig?.disabled"
        :min="item?.cellConfig?.min"
        :max="item?.cellConfig?.max"
        :precision="item?.cellConfig?.precision"
        :step="item?.cellConfig?.step"
        :contrastData="Number(item?.cellConfig?.contrastData)"
        :alwaysContrast="item?.cellConfig?.alwaysContrast"
      ></pa-number>

      <!-- input -->
      <pa-input
        v-else
        v-model="state.searchValue"
        :placeholder="languagePackage['inputPlaceholder']"
        @enter="FetchSaveAndFilter"
        style="width: 100%; min-width: 210px"
      />

      <!-- button -->
      <pa-button class="ml-size" style="flex: 0 0 89px" is="search" @click="FetchSaveAndFilter">
        {{ languagePackage["search"] }}
      </pa-button>
    </div>
    <slot name="exBtn"></slot>
    <!-- <div class="hold-back" @click="state.visible = false"></div> -->
  </pa-popover>
</template>

<script setup lang="ts" name="TableColumnFilter">
// # import
import { ref, inject, reactive, watch, computed, ComputedRef } from "vue";
import { isSelectType, isTimeType, isNumberType } from "./hooks/isType";
import { randChar } from "../tools/rand-char";
import { ComponentItemProps, ComponentUseItemProps, PaTableUseType } from "./types";
import { PaOptionType } from "../manager-type";
import { M_Message } from "../feedback";

type TableColumnFilterType = {
  /**
   * 列筛选配置
   * @type TableColumnFilterType
   * @description 列筛选配置
   */
  item: ComponentItemProps & ComponentUseItemProps;
  id: string;
  data: PaTableUseType.FilterType;
};

// # Var
const props = withDefaults(defineProps<TableColumnFilterType>(), {});
const exOptions = inject("exOptions") as PaOptionType.Default;
const _id = randChar();
// const emits = defineEmits(["saveAndFilter", "handleRemoveQ", "openSeniorFilter"]);
const emits = defineEmits(["saveAndFilter", "openSeniorFilter"]);

const languagePackage = inject("languagePackage") as Record<string, string>;
const language = inject("language") as string;

// const shortcuts = [
//   {
//     text: languagePackage.value["today"],
//     value: [new Date(), new Date()]
//   },
//   {
//     text: languagePackage.value["aWeekAgo"],
//     value: () => {
//       const now = new Date();
//       return [new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now];
//     }
//   }
// ];

const mPopoverRef = ref();
const state = reactive({
  visible: false,
  searchValue: (isTimeType(props.item, true) ? [] : "") as any
});

// #Function 配置初始化开始时间
const disabledStart = (time: Date) => {
  return time > new Date();
};

// #Function 配置初始化结束时间
const disabledEnd = (time: Date) => {
  return time < new Date();
};

// #Computed exOptions
const _exOptions: ComputedRef<PaOptionType.Default> = computed(() => {
  const _outData: { [x: string]: { label: string; value: string }[] } = {};
  for (const key in exOptions.value) {
    if (Array.isArray(exOptions.value[key])) {
      _outData[key] = exOptions.value[key].map(item => {
        return {
          ...item,
          value: String(item.value)
        };
      });
    } else {
      const item = exOptions.value[key];
      _outData[key] = [];
      _outData[key].push({
        label: item.activeText || "on",
        value: item.activeValue || true
      });
      _outData[key].push({
        label: item.inActiveText || "off",
        value: item.inActiveValue || false
      });
    }
  }
  return _outData;
});

// #Function 打开筛选
function openVisible() {
  // state.visible = true;
  // nextTick(() => {
  //   if (selectRef.value) selectRef.value.dropdownMenuVisible = true;
  //   clearTimeout(openTime);
  //   openTime = setTimeout(() => {
  //     if (mPopoverRef.value?.popperRef?.contentRef) {
  //       const config = { attributes: true };
  //       const el = mPopoverRef.value?.popperRef?.contentRef;
  //       observer?.observe(el, config);
  //     }
  //   }, 300);
  // });
}

// #Function 确认条件并搜索
function FetchSaveAndFilter() {
  const element = props.item;
  let fieldValue = isSelectType(element, true) ? state.searchValue.join?.(",") || "" : state.searchValue;
  if (isSelectType(element, true)) {
    fieldValue = String(fieldValue).trim();
  }

  // if (isTimeType(element, true) && !!!state.searchValue[0]) {
  //   const data = {
  //     conditionalType: 3,
  //     props: element.prop
  //   };
  //   emits("handleRemoveQ", data);
  // }
  // if (isTimeType(element, true) && !!!state.searchValue[1]) {
  //   const data = {
  //     conditionalType: 5,
  //     props: element.prop
  //   };
  //   emits("handleRemoveQ", data);
  // }
  if (String(fieldValue).length <= 0) {
    // let conditionalType = 1;
    // if (isSelectType(element, true)) {
    //   conditionalType = 6;
    // } else if (isNumberType(element, true)) {
    //   conditionalType = 0;
    // }

    // const data = { conditionalType, props: element.prop };
    mPopoverRef.value.hidePopover();
    emits("saveAndFilter", []);
    // return emits("handleRemoveQ", data);
    return;
  }

  let filter: { fieldLabel?: string; fieldName: string; conditionalType: 0 | 1 | 3 | 5 | 6; fieldValue: string }[] = [];
  if (isTimeType(element, true)) {
    if (state.searchValue[0]) {
      filter.push({
        fieldLabel: element.label + `-${languagePackage.value["start"]}`,
        fieldName: String(element.prop),
        conditionalType: 3,
        fieldValue: state.searchValue[0] + " 00:00:00"
      });
    }
    if (state.searchValue[1]) {
      filter.push({
        fieldLabel: element.label + `-${languagePackage.value["end"]}`,
        fieldName: String(element.prop),
        conditionalType: 5,
        fieldValue: state.searchValue[1] + " 23:59:59"
      });
    }
    if (state.searchValue[0] && state.searchValue[1] && state.searchValue[0] > state.searchValue[1]) {
      return M_Message.danger(element.label + ` ${languagePackage.value["errorMessage"]}`);
    }
  } else {
    filter = [
      {
        fieldLabel: element.label,
        fieldName: String(element.prop),
        conditionalType: isSelectType(element, true) ? 6 : isNumberType(element, true) ? 0 : 1,
        fieldValue
      }
    ];
  }
  mPopoverRef.value.hidePopover();
  // fieldName: "BeforeName", conditionalType: 1, fieldValue: "111"
  emits("saveAndFilter", filter);
  // drawerVisible.value = false;
}

function closePopover() {
  mPopoverRef.value.hidePopover();
}

defineExpose({ closePopover });

// #Watch data
watch(
  () => props.data,
  value => {
    if (value?.fieldValue && String(value?.fieldValue)?.length) {
      state.searchValue = Array.isArray(value.fieldValue)
        ? value.fieldValue.map(item => (item == "true" ? true : item == "false" ? false : item))
        : value.fieldValue;
    } else {
      state.searchValue = isTimeType(props.item, true) ? [] : "";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.color-box {
  text-align: center;
  padding: 12px;
  margin-bottom: 2px;
  background-color: #fff;
  &:last-child {
    margin: 0;
  }
}
.padding-zero-popover {
  padding: 5px !important;
  z-index: 9999 !important;
  height: 200px;
  overflow: scroll;
}
.filter-body {
  position: relative;
  z-index: 10;
  > .pa-select {
    flex: 1;
    width: 1px;
  }
}
.hold-back {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 10%);
}

.pa-table-tag-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>

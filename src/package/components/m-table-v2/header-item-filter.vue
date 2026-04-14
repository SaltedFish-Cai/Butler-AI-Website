<template>
  <!-- 表头筛选 -->
  <m-popover-v2 ref="mPopoverRef" :id="_id" :popover-width="340">
    <template #reference>
      <div @click="openVisible"><slot name="default"></slot></div>
    </template>
    <div class="flex-center-between filter-body">
      <!-- select -->
      <m-select-v2
        v-if="isSelectType(item, true)"
        v-model="state.searchValue"
        :placeholder="languagePackage['selectPlaceholder']"
        type="multiple-select"
        :exOptions="_exOptions[String(item.prop)] as MOptionV2Type.SelectList"
        teleport-in-container
      >
        <template #optionLabel="row">
          <div class="flex-center-start">
            <div class="m-table-tag-v2-color mr-size-v2" :style="{ backgroundColor: row?.item?.tagStyle?.bgColor }"></div>
            {{ row?.item?.label }}
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
                class="m-table-tag-v2-color mr-size"
                v-if="opt.tagStyle?.bgColor"
                :style="{ backgroundColor: opt.tagStyle.bgColor }"
              ></div>
              <div :class="[size == 'small' ? 'm-table-select-label_small' : '']">{{ opt.label }}</div>
            </div>
          </slot>
        </el-option> -->
      </m-select-v2>

      <!-- time -->
      <div v-else-if="isTimeType(item, true)" class="flex-center my-date-picker">
        <m-time-v2
          v-model="state.searchValue[0]"
          type="date-picker"
          :placeholder="languagePackage['startTime']"
          :disabledDateFn="time => disabledStart(time)"
          teleport-in-container
          @keydown.enter="FetchSaveAndFilter"
        />
        <div class="ml5 mr5">/</div>
        <m-time-v2
          v-model="state.searchValue[1]"
          type="date-picker"
          :placeholder="languagePackage['endTime']"
          :disabledDateFn="time => disabledEnd(time)"
          teleport-in-container
          @keydown.enter="FetchSaveAndFilter"
        />
      </div>

      <!-- number -->
      <m-number-v2
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
      ></m-number-v2>

      <!-- input -->
      <m-input-v2
        v-else
        v-model="state.searchValue"
        :placeholder="languagePackage['inputPlaceholder']"
        @keydown.enter="FetchSaveAndFilter"
        style="width: 100%; min-width: 210px"
      />

      <!-- button -->
      <m-button-v2 class="ml-size-v2" style="flex: 0 0 89px" is="search" @click="FetchSaveAndFilter">
        {{ languagePackage["search"] }}
      </m-button-v2>
    </div>
    <slot name="exBtn"></slot>
    <!-- <div class="hold-back" @click="state.visible = false"></div> -->
  </m-popover-v2>
</template>

<script setup lang="ts" name="TableColumnFilter">
// # import
import { ref, inject, reactive, watch, computed, ComputedRef } from "vue";
import { ElMessage } from "element-plus";
import { isSelectType, isTimeType, isNumberType } from "./hooks/isType";
import { randChar } from "../tools/rand-char";
import { MTableV2ItemType, MTableV2UseItemType, MTableV2UseType } from "./type";
import { MOptionV2Type } from "../manager-type";

type TableColumnFilterType = {
  /**
   * **列筛选配置**
   * @type `TableColumnFilterType`
   * @description 列筛选配置
   * */
  item: MTableV2ItemType & MTableV2UseItemType;
  id: string;
  data: MTableV2UseType.FilterType;
};

// # Var
const props = withDefaults(defineProps<TableColumnFilterType>(), {});
const exOptions = inject("exOptions") as MOptionV2Type.Default;
const _id = randChar();
// const emits = defineEmits(["saveAndFilter", "handleRemoveQuery", "openSeniorFilter"]);
const emits = defineEmits(["saveAndFilter", "openSeniorFilter"]);

const languagePackage = inject("languagePackage") as Record<string, string>;

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
const _exOptions: ComputedRef<MOptionV2Type.Default> = computed(() => {
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
  //   emits("handleRemoveQuery", data);
  // }
  // if (isTimeType(element, true) && !!!state.searchValue[1]) {
  //   const data = {
  //     conditionalType: 5,
  //     props: element.prop
  //   };
  //   emits("handleRemoveQuery", data);
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
    // return emits("handleRemoveQuery", data);
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
      return ElMessage.error(element.label + ` ${languagePackage.value["errorMessage"]}`);
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
  > .m-select-v2 {
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

.m-table-tag-v2-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>

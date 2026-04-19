<template>
  <pa-dialog v-model="state.visible" :title="languagePackage?.['Advanced']" @closed="closeMenu" size="m">
    <section class="pa-table_filter-list" style="height: calc(100% - 90px)">
      <template v-for="(groupItem, groupItemIndex) in state.advancedFilter.relationshipGroup" :key="groupItem.groupName">
        <div class="group">
          <div class="flex-center-between mb-size border-bottom group_top">
            <div class="flex1 group__title" style="text-align: left">{{ groupItem.groupName }} {{ groupItemIndex + 1 }}</div>
            <pa-button v-if="groupItemIndex > 0" is="trash" size="small" @click="FilterFn.remove(groupItemIndex)">
              {{ languagePackage?.["clenGroup"] }}
            </pa-button>
          </div>
          <div class="group_bottom">
            <template v-for="(item, itemIndex) in groupItem.group" :key="item.key">
              <pa-form
                id="seniorFilter"
                :ref="el => setAllFormRef(el, item.key)"
                :data="item"
                :structure="_formBConfig"
                noLabel
                :deep-data="false"
                :ex-span="4"
                :ex-options="state.exOptions"
                labelPosition="top"
              >
                <template #label>
                  <div class="filter-item_name"># {{ propItem.label }}</div>
                </template>
                <template #Del>
                  <pa-button class="ml0" is="trash" style="width: 100%" @click="FilterFn.removeItem(item.key, groupItemIndex)">
                    {{ languagePackage?.["del"] }}
                  </pa-button>
                </template>
              </pa-form>
              <!-- <el-form
              :model="item"
              :ref="el => setAllFormRef(el, propItem.prop + groupItemIndex + itemIndex)"
              :rules="rulesArr[item.key]"
            >
              <section class="filter-item flex-center-start">
                <div class="filter-item_name"># {{ propItem.label }}</div>

                <div class="ml-size mr-size">
                  <pa-select
                    v-model="item.conditionalType"
                    :placeholder="languagePackage?.['selectConditional']"
                    @change="value => conditionalTypeChange(value, item.key)"
                    :ex-options="
                      seniorFilterOptions.LineConditional?.map(item => ({ label: item.Description, value: item.Value }))
                    "
                  ></pa-select>
                </div>

                <el-form-item prop="fieldValue" style="width: 60% !important; margin-bottom: 0">
                  <pa-input
                    class="mr-size"
                    style="width: 100%"
                    v-model="item.fieldValue"
                    :placeholder="languagePackage?.['inputAdvanced']"
                    :disabled="item.conditionalType == 11"
                  ></pa-input>
                </el-form-item>

                <pa-button
                  class="ml0"
                  is="trash"
                  style="width: 88px; flex: 0 0 88px"
                  @click="FilterFn.removeItem(groupItemIndex, itemIndex)"
                >
                  {{ languagePackage?.["del"] }}
                </pa-button>
              </section>

              <div class="flex-center" v-if="itemIndex < groupItem.group.length - 1">
                <span style="font-size: var(--pa-size-font, 16px)">{{ languagePackage?.["filterText"] }}：</span>
                <pa-radio
                  v-model="groupItem.groupLinkType"
                  :ex-options="seniorFilterOptions.linkOptions.map(item => ({ label: item.Description, value: item.Value }))"
                ></pa-radio>
              </div>
            </el-form> -->
              <div class="flex-center" v-if="itemIndex < groupItem.group.length - 1">
                <span style="font-size: var(--pa-size-font, 16px)">{{ languagePackage?.["filterText"] }}：</span>
                <pa-radio v-model="groupItem.groupLinkType" :ex-options="state.linkOptions"></pa-radio>
              </div>
            </template>

            <div class="flex-center mt-size">
              <pa-button font="add_circle_line" plain type="primary" @click="FilterFn.addFilter(groupItemIndex)">
                {{ languagePackage?.["addFilter"] }}
              </pa-button>
            </div>
          </div>
        </div>
        <div class="flex-center" v-if="groupItemIndex < state.advancedFilter.relationshipGroup.length - 1">
          <span style="font-size: var(--pa-size-font, 16px)">{{ languagePackage?.["groupText"] }}：</span>
          <pa-radio v-model="state.advancedFilter.relationshipGroupLinkType" :ex-options="state.linkOptions"></pa-radio>
        </div>
      </template>
      <div class="flex-center mt-size">
        <pa-button class="mb-size" font="goods_line" @click="FilterFn.addFilterGroup" plain type="warning">
          {{ languagePackage?.["addGroup"] }}
        </pa-button>
      </div>
    </section>

    <template #footer>
      <div class="flex-center">
        <pa-button is="search" @click="submitTabsForm">{{ languagePackage?.["endterSearch"] }}</pa-button>
      </div>
    </template>
  </pa-dialog>
</template>

<script lang="ts" setup>
// # Import
import { reactive, watch, nextTick, inject } from "vue";
import { PaTableUseType } from "./type";
import { PaOptionType, PaRefType } from "../manager-type";
import { PaFormItemType } from "../pa-form/type";
import { M_MessageBox } from "../feedback";

type SeniorFilterPropsType = {
  modelValue: boolean;
  propItem: Record<string, string>;
  seniorFilterOptions: { LineConditional: PaOptionType.SelectList; linkOptions: PaOptionType.SelectList };
  tableQuery: PaTableUseType.TableQueryType;
};
// # Var
const props = defineProps<SeniorFilterPropsType>();
const languagePackage = inject("languagePackage") as Record<string, string>;

const emits = defineEmits(["update:modelValue", "callback", "saveAndFilter"]);

let ruleTabsFormRef: Array<{ name: string; ref: PaRefType.FormV2 }> = [];
const setAllFormRef = (ref: any, name: string) => {
  const its = ruleTabsFormRef.filter(item => item.name == name);
  if (its.length == 0 && ref) {
    ruleTabsFormRef.push({ ref, name });
  }
};
const state = reactive({
  visible: false,

  advancedFilter: {
    fieldName: "",
    relationshipGroupLinkType: "1",
    relationshipGroup: [] as Array<PaTableUseType.RelationshipGroupType>
  },

  exOptions: {
    conditionalType: {}
  },
  linkOptions: [] as PaOptionType.SelectList
});

const _formBConfig: Array<PaFormItemType> = [
  { label: "Label-Text2", prop: "label", type: "slot", colSpan: 7, display: true },
  {
    label: "Label-Text2",
    prop: "conditionalType",
    type: "select",
    colSpan: 7,
    placeholder: languagePackage.value?.["selectConditional"]
  },
  { label: "Label-Text2", prop: "fieldValue", type: "input", colSpan: 7, placeholder: languagePackage.value?.["inputAdvanced"] },
  { label: "Label-Text2", prop: "Del", type: "slot", colSpan: 3, required: false }
];

const FilterFn = {
  // #Function 添加组
  addFilterGroup() {
    const key = String(Number(new Date()));
    const upData: PaTableUseType.RelationshipGroupType = {
      groupName: languagePackage.value?.["group"],
      group: [{ fieldValue: "", conditionalType: 0, key }],
      groupLinkType: "1"
    };
    state.advancedFilter.relationshipGroup.push(upData);
    // state.ItemList.push({ fieldName: props.propItem.prop, fieldValue: "", LinkNextType: "0", conditionalType: "0" });
  },

  // #Function 提交搜索条件
  addFilter(index: number) {
    const key = String(Number(new Date()));
    state.advancedFilter.relationshipGroup[index].group.push({
      fieldValue: "",
      conditionalType: 0,
      key
    });
  },

  // #Function 删除组
  remove(pIndex: number, tip = true) {
    if (tip) {
      M_MessageBox.confirm({
        message: languagePackage.value?.["isDelGroup"],
        title: languagePackage.value?.["tip"],
        type: "danger",
        confirmButtonText: languagePackage.value?.["enterDel"],
        onConfirm: () => {
          const item = state.advancedFilter.relationshipGroup[pIndex];
          for (let index = 0; index < item.group.length; index++) {
            const its = item.group[index];
            ruleTabsFormRef = ruleTabsFormRef.filter(item => item.name !== its.key);
          }
          state.advancedFilter.relationshipGroup.splice(pIndex, 1);
        }
      });
    } else {
      state.advancedFilter.relationshipGroup.splice(pIndex, 1);
    }
  },

  // #Function 删除搜索条件
  removeItem(key: string, pIndex: number) {
    ruleTabsFormRef = ruleTabsFormRef.filter(item => item.name !== key);
    const group = state.advancedFilter.relationshipGroup[pIndex].group;

    state.advancedFilter.relationshipGroup[pIndex].group = group.filter(item => item.key !== key);

    if (!state.advancedFilter.relationshipGroup[pIndex].group.length) {
      FilterFn.remove(pIndex, false);
    }
  }
};

// #Function 暴露表单校验方法
async function submitTabsForm() {
  const _ruleTabsFormRef: Array<PaRefType.FormV2> = ruleTabsFormRef.map(item => item.ref);
  if (_ruleTabsFormRef.length == 0) {
    return undefined;
  }
  const dataMap = {};
  let formResult = true;
  for (let index = 0; index < _ruleTabsFormRef.length; index++) {
    const element = _ruleTabsFormRef[index];
    if (!element) formResult = false;
    else {
      const valid = await element?.getSubmitForm();
      if (!valid) formResult = false;
      else if (valid != "no-change") {
        dataMap[valid.key] = valid;
      }
    }
  }
  if (!formResult) return;
  state.advancedFilter.fieldName = props.propItem.prop;

  for (let index = 0; index < state.advancedFilter.relationshipGroup.length; index++) {
    const _item = state.advancedFilter.relationshipGroup[index];
    for (let index = 0; index < _item.group.length; index++) {
      const key = _item.group[index].key;
      _item.group[index] = dataMap[key];
      if (_item.group[index].conditionalType == 11) _item.group[index].fieldValue = "";
    }
  }

  const _advancedFilter = {
    ...state.advancedFilter,
    label: props.propItem.label,
    props: props.propItem.prop
  };

  typeof window !== "undefined" && window.developLog.json(_advancedFilter, "高级搜索对象", "success");

  state.advancedFilter = {
    fieldName: "",
    relationshipGroupLinkType: "0",
    relationshipGroup: [] as Array<PaTableUseType.RelationshipGroupType>
  };
  emits("saveAndFilter", { AdvancedFilter: _advancedFilter });
  closeMenu();
}

// #Function 窗口关闭回调
function closeMenu() {
  emits("update:modelValue", false);
  nextTick(() => {
    ruleTabsFormRef.length = 0;
  });
}

// #Watch modelValue
watch(
  () => props.modelValue,
  visible => {
    state.visible = visible;

    if (visible) {
      const { AdvancedFilter } = props.tableQuery;
      const propItem = props.propItem;
      const item = AdvancedFilter?.find(item => item.fieldName == propItem.prop);
      if (!item) {
        FilterFn.addFilterGroup();
      } else {
        state.advancedFilter = item;
      }
    } else {
      state.advancedFilter = {
        fieldName: "",
        relationshipGroupLinkType: "0",
        relationshipGroup: [] as Array<PaTableUseType.RelationshipGroupType>
      };
    }
  },
  { deep: true }
);

watch(
  () => props.seniorFilterOptions,
  options => {
    state.exOptions = {
      conditionalType: options.LineConditional?.map((item: any) => ({ label: item.Description, value: item.Value }))
    };
    state.linkOptions = options.linkOptions?.map((item: any) => ({
      label: item.Description,
      value: item.Value
    })) as PaOptionType.SelectList;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.pa-table_filter-list {
  padding: calc(var(--pa-size-padding, 10px) / 1.5);
  .group {
    box-sizing: border-box;
    overflow-x: hidden;
    background-color: var(--pa-send-bg-color-lighter);
    border: 1px solid var(--pa-color-border);
    border-radius: var(--pa-size-radius);
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .group_top {
      padding: calc(var(--pa-size-padding, 10px) / 1.5);
      background-color: var(--pa-color-border);
    }
    .group_bottom {
      padding: calc(var(--pa-size-padding, 10px) / 1.5);
    }
    .group__title {
      position: relative;
      height: 1.7em;
      line-height: 1.7em;
      padding-left: 12px;
      font-size: calc(var(--pa-size-font, 16px) + 1px);
      color: var(--pa-color-primary);
      &::before {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        display: block;
        width: 4px;
        height: 15px;
        content: "";
        background-color: var(--pa-color-primary);
      }
    }
  }
  .filter-item {
    margin-bottom: var(--pa-size-padding, 10px);
    color: var(--pa-color-font);
  }
}

.filter-item_name {
  width: 210px;
  font-size: calc(var(--pa-size-font, 16px) + 2px);
  font-weight: bold;
  color: var(--pa-color-font);
}
</style>

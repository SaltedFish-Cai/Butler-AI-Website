<template>
  <sa-dialog v-model="state.visible" :title="languagePackage?.['Advanced']" @closed="closeMenu" size="m">
    <section class="sa-table_filter-list" style="height: calc(100% - 90px)">
      <template v-for="(groupItem, groupItemIndex) in state.advancedFilter.relationshipGroup" :key="groupItem.groupName">
        <div class="group">
          <div class="flex-center-between mb-size-v2 border-bottom group_top">
            <div class="flex1 group__title" style="text-align: left">{{ groupItem.groupName }} {{ groupItemIndex + 1 }}</div>
            <sa-button v-if="groupItemIndex > 0" is="trash" size="small" @click="FilterFn.remove(groupItemIndex)">
              {{ languagePackage?.["clenGroup"] }}
            </sa-button>
          </div>
          <div class="group_bottom">
            <template v-for="(item, itemIndex) in groupItem.group" :key="item.key">
              <sa-form
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
                  <sa-button
                    class="ml0"
                    is="trash"
                    style="width: 88px; flex: 0 0 88px"
                    @click="FilterFn.removeItem(item.key, groupItemIndex)"
                  >
                    {{ languagePackage?.["del"] }}
                  </sa-button>
                </template>
              </sa-form>
              <!-- <el-form
              :model="item"
              :ref="el => setAllFormRef(el, propItem.prop + groupItemIndex + itemIndex)"
              :rules="rulesArr[item.key]"
            >
              <section class="filter-item flex-center-start">
                <div class="filter-item_name"># {{ propItem.label }}</div>

                <div class="ml-size-v2 mr-size-v2">
                  <sa-select
                    v-model="item.conditionalType"
                    :placeholder="languagePackage?.['selectConditional']"
                    @change="value => conditionalTypeChange(value, item.key)"
                    :ex-options="
                      seniorFilterOptions.LineConditional?.map(item => ({ label: item.Description, value: item.Value }))
                    "
                  ></sa-select>
                </div>

                <el-form-item prop="fieldValue" style="width: 60% !important; margin-bottom: 0">
                  <sa-input
                    class="mr-size-v2"
                    style="width: 100%"
                    v-model="item.fieldValue"
                    :placeholder="languagePackage?.['inputAdvanced']"
                    :disabled="item.conditionalType == 11"
                  ></sa-input>
                </el-form-item>

                <sa-button
                  class="ml0"
                  is="trash"
                  style="width: 88px; flex: 0 0 88px"
                  @click="FilterFn.removeItem(groupItemIndex, itemIndex)"
                >
                  {{ languagePackage?.["del"] }}
                </sa-button>
              </section>

              <div class="flex-center" v-if="itemIndex < groupItem.group.length - 1">
                <span style="font-size: var(--sa-size-font, 13px)">{{ languagePackage?.["filterText"] }}：</span>
                <sa-radio
                  v-model="groupItem.groupLinkType"
                  :ex-options="seniorFilterOptions.linkOptions.map(item => ({ label: item.Description, value: item.Value }))"
                ></sa-radio>
              </div>
            </el-form> -->
              <div class="flex-center" v-if="itemIndex < groupItem.group.length - 1">
                <span style="font-size: var(--sa-size-font, 13px)">{{ languagePackage?.["filterText"] }}：</span>
                <sa-radio v-model="groupItem.groupLinkType" :ex-options="state.linkOptions"></sa-radio>
              </div>
            </template>

            <div class="flex-center mt-size-v2">
              <sa-button font="add_circle_line" plain type="primary" @click="FilterFn.addFilter(groupItemIndex)">
                {{ languagePackage?.["addFilter"] }}
              </sa-button>
            </div>
          </div>
        </div>
        <div class="flex-center" v-if="groupItemIndex < state.advancedFilter.relationshipGroup.length - 1">
          <span style="font-size: var(--sa-size-font, 13px)">{{ languagePackage?.["groupText"] }}：</span>
          <sa-radio v-model="state.advancedFilter.relationshipGroupLinkType" :ex-options="state.linkOptions"></sa-radio>
        </div>
      </template>
      <div class="flex-center mt-size-v2">
        <sa-button class="mb-size-v2" font="goods_line" @click="FilterFn.addFilterGroup" plain type="warning">
          {{ languagePackage?.["addGroup"] }}
        </sa-button>
      </div>
    </section>

    <template #footer>
      <div class="flex-center">
        <sa-button is="search" @click="submitTabsForm">{{ languagePackage?.["endterSearch"] }}</sa-button>
      </div>
    </template>
  </sa-dialog>
</template>

<script lang="ts" setup>
// # Import
import { reactive, watch, nextTick } from "vue";
import { SaTableUseType } from "./type";
import { MOptionV2Type, MRefV2Type } from "../manager-type";
import { SaFormItemType } from "../sa-form/type";
import { M_MessageBox } from "../feedback";

type SeniorFilterPropsType = {
  modelValue: boolean;
  propItem: Record<string, string>;
  seniorFilterOptions: { LineConditional: MOptionV2Type.SelectList; linkOptions: MOptionV2Type.SelectList };
  tableQuery: SaTableUseType.TableQueryType;
  languagePackage: Record<string, string>;
};
// # Var
const props = defineProps<SeniorFilterPropsType>();

const emits = defineEmits(["update:modelValue", "callback", "saveAndFilter"]);

let ruleTabsFormRef: Array<{ name: string; ref: MRefV2Type.FormV2 }> = [];
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
    relationshipGroup: [] as Array<SaTableUseType.RelationshipGroupType>
  },

  exOptions: {
    conditionalType: {}
  },
  linkOptions: [] as MOptionV2Type.SelectList
});

const _formBConfig: Array<SaFormItemType> = [
  { label: "Label-Text2", prop: "label", type: "slot", colSpan: 7, display: true },
  {
    label: "Label-Text2",
    prop: "conditionalType",
    type: "select",
    colSpan: 7,
    placeholder: props.languagePackage?.["selectConditional"]
  },
  { label: "Label-Text2", prop: "fieldValue", type: "input", colSpan: 7, placeholder: props.languagePackage?.["inputAdvanced"] },
  { label: "Label-Text2", prop: "Del", type: "slot", colSpan: 3, required: false }
];

const FilterFn = {
  // #Function 添加组
  addFilterGroup() {
    const key = String(Number(new Date()));
    const upData: SaTableUseType.RelationshipGroupType = {
      groupName: props.languagePackage?.["group"],
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
        message: props.languagePackage["isDelGroup"],
        title: props.languagePackage["tip"],
        type: "danger",
        confirmButtonText: props.languagePackage["enterDel"],
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
  const _ruleTabsFormRef: Array<MRefV2Type.FormV2> = ruleTabsFormRef.map(item => item.ref);
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

  window.developLog.json(_advancedFilter, "高级搜索对象", "success");

  state.advancedFilter = {
    fieldName: "",
    relationshipGroupLinkType: "0",
    relationshipGroup: [] as Array<SaTableUseType.RelationshipGroupType>
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
        relationshipGroup: [] as Array<SaTableUseType.RelationshipGroupType>
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
    })) as MOptionV2Type.SelectList;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.sa-table_filter-list {
  padding: calc(var(--sa-size-padding, 10px) / 1.5);
  .group {
    box-sizing: border-box;
    overflow-x: hidden;
    background-color: var(--sa-color-send-bg);
    border: 1px solid var(--sa-color-border);
    border-radius: 3px;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .group_top {
      padding: calc(var(--sa-size-padding, 10px) / 1.5);
      background-color: var(--sa-color-border);
    }
    .group_bottom {
      padding: calc(var(--sa-size-padding, 10px) / 1.5);
    }
    .group__title {
      position: relative;
      height: 1.7em;
      line-height: 1.7em;
      padding-left: 12px;
      font-size: calc(var(--sa-size-font, 13px) + 1px);
      color: var(--m-color-primary);
      &::before {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        display: block;
        width: 4px;
        height: 15px;
        content: "";
        background-color: var(--m-color-primary);
      }
    }
  }
  .filter-item {
    margin-bottom: var(--sa-size-padding, 10px);
    color: var(--sa-color-font);
  }
}

.filter-item_name {
  width: 210px;
  font-size: calc(var(--sa-size-font, 13px) + 2px);
  font-weight: bold;
  color: var(--sa-color-font);
}
</style>

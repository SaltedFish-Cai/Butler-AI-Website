<template>
  <template v-if="item.type == 'tabs-form' && item.prop">
    <m-form-v2-item :prop="item.prop">
      <!-- label -->
      <!-- <template #label v-if="computedLabel">
        <form-label
          :label="computedLabel"
          :tip="computedTip"
          :item="item"
          :data="injectConfigContext.data[String(props.item.prop)]"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </form-label>
      </template> -->
      <m-tabs-v2
        v-if="injectConfigContext.data[String(item.prop)]?.length || !injectConfigContext.display"
        ref="tabsFormRef"
        v-model="stepsIndex"
        align="edge"
        class="m-form-v2-tabs"
        @tab-change="clickToChange"
      >
        <template v-if="!injectConfigContext.display" #HeaderLeft>
          <m-button-v2
            is="add"
            style="width: 80px; --m-component-padding-size: 5px; --m-component-font-size: 12px; --m-component-height-size: 24px"
            :disabled="item.disabled"
            @click="addTabs"
            :debounced="false"
            :debouncedTime="0"
          >
            {{ injectConfigContext.languagePackage["add"] }}
          </m-button-v2>
        </template>

        <m-tabs-v2-item
          v-for="(tab, tabIndex) in injectConfigContext.data[String(item.prop)]"
          :key="tab.name"
          :label="tab.name"
          :name="tab.name"
        >
          <template #label>
            <!-- display -->
            <templage v-if="injectConfigContext.display || item.disabled">
              <div class="m-form-v2_tabs-title" :class="[tab.isError ? 'm-form-v2_tabs-title_error' : '']">
                <template v-if="item.titleLabel">
                  {{
                    typeof item.titleLabel == "string"
                      ? item.titleLabel
                      : item.titleLabel[injectConfigContext.language as "en-US" | "zh-CN"]
                  }}
                  ({{ tabIndex + 1 }})
                </template>
                <template v-else>
                  {{ titleArr[tabIndex] }}
                </template>
              </div>
            </templage>

            <template v-else-if="tab.name != editTitleIndex">
              <div :class="['flex-center-start', 'tabs-item-title', tab.isError ? 'm-form-v2_tabs-title_error' : '']">
                <div v-if="item.titleLabel">
                  {{
                    typeof item.titleLabel == "string"
                      ? item.titleLabel
                      : item.titleLabel[injectConfigContext.language as "en-US" | "zh-CN"]
                  }}
                  ({{ tabIndex + 1 }})
                </div>
                <div
                  v-else
                  class="m-form-v2_tabs-title"
                  @click.stop="
                    stepsIndex == tab.name ? (editTitleIndex = tab.name) : ((stepsIndex = tab.name), (editTitleIndex = ''))
                  "
                >
                  {{ titleArr[tabIndex] }}
                </div>
                <m-icon-v2
                  v-if="!injectConfigContext.display && !item.disabled"
                  class="remove-hand ml-size-v2"
                  name="close_circle_line"
                  @click.stop="removeTab(tab)"
                />
              </div>
            </template>

            <div v-else class="tab-edit-title-input">
              <m-input-v2
                v-model="tab[item.titleKey || baseTitleKey]"
                @blur="inputBlur(tab[item.titleKey || baseTitleKey], val => (tab[item.titleKey || baseTitleKey] = val))"
                autoWidth
                autofocus
                :clearable="false"
                placeholder=" "
              ></m-input-v2>
            </div>
          </template>

          <!-- form -->
          <section class="tabs-form-body flat-style">
            <m-form-v2-control
              :id="id + '-tabs-form'"
              :model="tab"
              @set-ref="el => setRuleTabsFormRef(el, tab)"
              :rules="rules?.[String(item.prop)] || {}"
              inTabsForm
              @validation-states="validateTabsForm"
            >
              <!-- v-show 防闪烁 -->
              <!-- v-show="stepsIndex == tab.name" -->
              <section class="tabs-form-item" v-for="tabGroupItem in item.inMultipleConfig" :key="tabGroupItem.unitName">
                <!-- 标题 -->
                <template v-if="tabGroupItem.unitName != 'default'">
                  <m-title-v2>
                    {{ tabGroupItem.unitName }}
                    <el-tooltip v-if="tabGroupItem.unitTip" :content="tabGroupItem.unitTip" placement="right">
                      <m-icon-v2 name="question_line" class="m-form-v2-title_label-icon"></m-icon-v2>
                    </el-tooltip>
                  </m-title-v2>
                </template>

                <m-row-v2 :gutter="'calc(var(--m-component-padding-size, 10px) / 4)'">
                  <template v-for="tabFormItem in tabGroupItem.configs" :key="String(tabFormItem.prop)">
                    <formItem
                      v-if="tabFormItem.prop != item.titleKey"
                      :id="id"
                      :item="tabFormItem"
                      :tabsProps="item.prop"
                      :tabsIndex="tabIndex"
                      :ruleFormRef="getRuleTabsFormRef(tab.name)"
                    >
                      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                        <slot :name="slot" v-bind="scope"></slot>
                      </template>
                    </formItem>
                  </template>
                </m-row-v2>
              </section>
            </m-form-v2-control>
          </section>
        </m-tabs-v2-item>

        <!-- 对比后被删除数据 -->
        <m-tabs-v2-item
          v-for="(tab, tabIndex) in contrastDeletedTab"
          :key="'contrastDeletedTab-' + tab.name"
          :label="'contrastDeletedTab-' + tab.name"
          :name="'contrastDeletedTab-' + tab.name"
        >
          <template #label>
            <div class="m-form-v2_tabs-title deleted">
              {{ injectConfigContext.languagePackage["isDelete"] }} -
              <template v-if="item.titleLabel">
                {{
                  typeof item.titleLabel == "string"
                    ? item.titleLabel
                    : item.titleLabel[injectConfigContext.language as "en-US" | "zh-CN"]
                }}
                ({{ tabIndex + 1 }})
              </template>
              <template v-else>
                {{ titleArr[tabIndex] }}
              </template>
            </div>
          </template>

          <!-- form -->
          <section class="tabs-form-body flat-style">
            <m-form-v2-control :id="id + '-tabs-form'" :model="tab" inTabsForm @validation-states="validateTabsForm">
              <!-- v-show 防闪烁 -->
              <!-- v-show="stepsIndex == tab.name" -->
              <section class="tabs-form-item deleted" v-for="tabGroupItem in item.inMultipleConfig" :key="tabGroupItem.unitName">
                <!-- 标题 -->
                <template v-if="tabGroupItem.unitName != 'default'">
                  <m-title-v2>
                    {{ tabGroupItem.unitName }}
                    <el-tooltip v-if="tabGroupItem.unitTip" :content="tabGroupItem.unitTip" placement="right">
                      <m-icon-v2 name="question_line" class="m-form-v2-title_label-icon"></m-icon-v2>
                    </el-tooltip>
                  </m-title-v2>
                </template>

                <m-row-v2 :gutter="'calc(var(--m-component-padding-size, 10px) / 4)'">
                  <template v-for="tabFormItem in tabGroupItem.configs" :key="String(tabFormItem.prop)">
                    <formItem
                      v-if="tabFormItem.prop != item.titleKey"
                      :id="id"
                      :item="tabFormItem"
                      :exData="tab[String(tabFormItem.prop)] || ''"
                      :tabsProps="item.prop"
                      :tabsIndex="tabIndex"
                      :enforcementDisplay="true"
                      :ruleFormRef="getRuleTabsFormRef(tab.name)"
                    >
                      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                        <slot :name="slot" v-bind="scope"></slot>
                      </template>
                    </formItem>
                  </template>
                </m-row-v2>
              </section>
            </m-form-v2-control>
          </section>
        </m-tabs-v2-item>
      </m-tabs-v2>

      <div v-else class="m-display-v2">
        {{ injectConfigContext.languagePackage["empyt"] }}
      </div>
    </m-form-v2-item>
  </template>
</template>

<script lang="ts" setup>
// # Import
import { ref, Ref, watch, nextTick, computed, inject } from "vue";
import { random } from "../hooks/random";
// import formLabel from "../form-label.vue";
import formItem from "../form-basics-element.vue";
import mFormV2Control from "../m-form-v2-control.vue";

import { ConfigContextType, ExMultipleConfigType, FormItemRule } from "../type";

export type TabsItemPropType = {
  id: string;
  item: ExMultipleConfigType;
  rules?: Record<string, Record<string, FormItemRule | FormItemRule[]>>;
};

const props = defineProps<TabsItemPropType>();

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
    useRequired: false,
    noLabel: false
  })
);

const emit = defineEmits(["setRef"]);

const tabsFormRef = ref();
const stepsIndex = ref("0");
const editTitleIndex = ref("");
const baseTitleKey = random();

// const computedLabel = computed(() => {
//   return typeof props.item.label == "object"
//     ? props.item.label?.[injectConfigContext.value.language || "zh-CN"] || props.item.label
//     : props.item.label;
// });

// const computedTip = computed(() => {
//   return typeof props.item.tip == "object"
//     ? props.item.tip?.[injectConfigContext.value.language || "zh-CN"] || props.item.tip
//     : props.item.tip;
// });

const titleArr = computed(() => {
  const data = injectConfigContext.value.data[String(props.item.prop)]?.map((item: Record<string, any>) => {
    return props.item.titleKey
      ? item[String(props.item.titleKey)] || injectConfigContext.value.languagePackage["information"]
      : item[baseTitleKey] || injectConfigContext.value.languagePackage["information"];
  });

  return data || [];
});

// const contrastDataArr = computed(() => {
//   const { contrastData } = injectConfigContext.value;
//   const { item } = props;
//   const arr: Record<string, string> = {};
//   if (item && item.contrastUse && contrastData && contrastData[String(item.prop)]) {
//     for (let index = 0; index < contrastData[String(item.prop)].length; index++) {
//       const element = contrastData[String(item.prop)][index];
//       arr[element[item.contrastUse]] = element;
//     }
//   }
//   return arr;
// });

const contrastDeletedTab = computed(() => {
  const { item } = props;
  const { data, contrastData } = injectConfigContext.value;
  const list: any = [];

  if (item && item.prop && item.contrastUse) {
    const _contrastData = contrastData[String(item.prop)] || [];
    const _data = data[item.prop]?.map(val => val[String(item.contrastUse)])?.filter(val => !!val);
    for (let index = 0; index < _contrastData.length; index++) {
      const element = _contrastData[index];
      if (element && !_data.includes(element[item.contrastUse])) {
        list.push({ ...element, name: random() || Date.now() });
      }
    }
  }
  return list;
});

let lock = false;

// #Function 设置 Tabs Form Ref
const ruleTabsFormRef: Record<string, { ref: any; prop: Record<string, boolean | string> }> = {};
function setRuleTabsFormRef(el: any, prop: Record<string, boolean | string>) {
  const key = prop.name;
  if (el) {
    ruleTabsFormRef[String(key)] = { ref: el, prop };
  }
}

// # function 处理输入框失去焦点事件
// #param {string} value 输入框的值
function inputBlur(value: string, callback: (value: string) => void) {
  editTitleIndex.value = "";
  if (value == "") {
    callback(props.item?.titleLabel?.[(injectConfigContext.value.language || "zh-CN") as "en-US" | "zh-CN"] || "标签");
  }
}

// # Function 获取 Tabs Form Ref
function getRuleTabsFormRef(name: string) {
  if (ruleTabsFormRef[name]) {
    return ruleTabsFormRef[name].ref;
  }
  return {};
}

// # Function 点击Tabs
function clickToChange({ name }: { name: string }) {
  if (editTitleIndex.value != name) {
    editTitleIndex.value = "";
  }
  stepsIndex.value = name || "0";
}

// # Function 新增Tabs
function addTabs() {
  const newData: Record<string, any> = { name: random() || Date.now() };
  const key = props?.item?.titleKey || baseTitleKey;
  newData[key] = props.item?.titleLabel?.[(injectConfigContext.value.language || "zh-CN") as "en-US" | "zh-CN"] || "标签";
  if (!Array.isArray(injectConfigContext.value.data[String(props.item.prop)])) {
    injectConfigContext.value.data[String(props.item.prop)] = [];
  }
  injectConfigContext.value.data[String(props.item.prop)].push(newData);

  stepsIndex.value =
    injectConfigContext.value.data[String(props.item.prop)][
      injectConfigContext.value.data[String(props.item.prop)].length - 1
    ].name;
}

// # Function 删除Tabs
function removeTab(row: Record<string, string>) {
  const data = injectConfigContext.value.data[String(props.item.prop)];
  const index = data.findIndex((item: Record<string, any>) => item.name == row.name);
  injectConfigContext.value.data[String(props.item.prop)].splice(index, 1);
  delete ruleTabsFormRef[row.name];
  setTimeout(() => {
    nextTick(() => {
      stepsIndex.value = injectConfigContext.value.data[String(props.item.prop)][0].name;
    });
  }, 10);
}

// # Expose 暴露表单校验方法
const submitTabsForm = async () => {
  if (!Object.keys(ruleTabsFormRef).length) return undefined;

  let formResult = true;
  lock = false;
  for (const index in ruleTabsFormRef) {
    const element = ruleTabsFormRef[index];

    const { valid } = await element?.ref?.validate?.();
    if (!valid) {
      formResult = false;
      element.prop.isError = true;
      if (!lock) {
        stepsIndex.value = String(element.prop.name);
        lock = true;
      }
    } else {
      element.prop.isError = false;
    }
  }
  lock = false;

  return formResult;
};
function validateTabsForm(data: boolean) {
  const itemData = injectConfigContext.value.data[String(props.item.prop)].filter(
    (item: Record<string, any>) => item.name == stepsIndex.value
  )[0];
  itemData.isError = !data;
  if (data) {
    nextTick(() => {
      const errorItemData = injectConfigContext.value.data[String(props.item.prop)].filter(
        (item: Record<string, any>) => item.isError == true
      );
      if (errorItemData.length > 0) stepsIndex.value = errorItemData[0].name;
    });
  }
}

defineExpose({ submitTabsForm });

emit("setRef", { submitTabsForm });

// #Watch data
watch(
  () => injectConfigContext.value.data[String(props.item.prop)],
  data => {
    if (data?.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const formData = data[index];
        data[index] = {
          ...formData,
          name: random() || Date.now(),
          isError: false
        };
        if (props.item.titleKey) {
          data[index][props.item.titleKey] =
            props.item?.titleLabel?.[(injectConfigContext.value.language || "zh-CN") as "en-US" | "zh-CN"] || "标签";
        }
      }
      stepsIndex.value = data[0]?.name;
    } else {
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "../index.scss";
</style>

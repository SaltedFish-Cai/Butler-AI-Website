<template>
  <template v-if="item.type == 'tabs-form' && item.prop">
    <pa-form-item :prop="item.prop">
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
      <pa-tabs
        v-if="injectConfigContext.data[String(item.prop)]?.length || !injectConfigContext.display"
        ref="tabsFormRef"
        v-model="stepsIndex"
        align="edge"
        class="pa-form-tabs"
        @tab-change="clickToChange"
      >
        <template v-if="!injectConfigContext.display" #HeaderLeft>
          <pa-button
            is="add"
            style="width: 80px; --pa-size-padding: 5px; --pa-size-font: 12px; --pa-size-height: 24px"
            :disabled="item.disabled"
            @click="addTabs"
            :debounced="false"
            :debouncedTime="0"
          >
            {{ injectConfigContext.languagePackage["add"] }}
          </pa-button>
        </template>

        <pa-tabs-item
          v-for="(tab, tabIndex) in injectConfigContext.data[String(item.prop)]"
          :key="tab.name"
          :label="tab.name"
          :name="tab.name"
        >
          <template #label>
            <!-- display -->
            <templage v-if="injectConfigContext.display || item.disabled">
              <div class="pa-form_tabs-title" :class="[tab.isError ? 'pa-form_tabs-title_error' : '']">
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
              <div :class="['flex-center-start', 'tabs-item-title', tab.isError ? 'pa-form_tabs-title_error' : '']">
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
                  class="pa-form_tabs-title"
                  @click.stop="
                    stepsIndex == tab.name ? (editTitleIndex = tab.name) : ((stepsIndex = tab.name), (editTitleIndex = ''))
                  "
                >
                  {{ titleArr[tabIndex] }}
                </div>
                <pa-icon
                  v-if="!injectConfigContext.display && !item.disabled"
                  class="remove-hand ml-size"
                  name="close_circle_line"
                  @click.stop="removeTab(tab)"
                />
              </div>
            </template>

            <div v-else class="tab-edit-title-input">
              <pa-input
                v-model="tab[item.titleKey || baseTitleKey]"
                @blur="inputBlur(tab[item.titleKey || baseTitleKey], val => (tab[item.titleKey || baseTitleKey] = val))"
                autoWidth
                autofocus
                :clearable="false"
                placeholder=" "
              ></pa-input>
            </div>
          </template>

          <!-- form -->
          <section class="tabs-form-body flat-style">
            <pa-form-control
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
                  <pa-title>
                    {{ tabGroupItem.unitName }}
                    <el-tooltip v-if="tabGroupItem.unitTip" :content="tabGroupItem.unitTip" placement="right">
                      <pa-icon name="question_line" class="pa-form-title_label-icon"></pa-icon>
                    </el-tooltip>
                  </pa-title>
                </template>

                <pa-row :gutter="'calc(var(--pa-size-padding, 10px) / 4)'">
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
                </pa-row>
              </section>
            </pa-form-control>
          </section>
        </pa-tabs-item>

        <!-- 对比后被删除数据 -->
        <pa-tabs-item
          v-for="(tab, tabIndex) in contrastDeletedTab"
          :key="'contrastDeletedTab-' + tab.name"
          :label="'contrastDeletedTab-' + tab.name"
          :name="'contrastDeletedTab-' + tab.name"
        >
          <template #label>
            <div class="pa-form_tabs-title deleted">
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
            <pa-form-control :id="id + '-tabs-form'" :model="tab" inTabsForm @validation-states="validateTabsForm">
              <!-- v-show 防闪烁 -->
              <!-- v-show="stepsIndex == tab.name" -->
              <section class="tabs-form-item deleted" v-for="tabGroupItem in item.inMultipleConfig" :key="tabGroupItem.unitName">
                <!-- 标题 -->
                <template v-if="tabGroupItem.unitName != 'default'">
                  <pa-title>
                    {{ tabGroupItem.unitName }}
                    <el-tooltip v-if="tabGroupItem.unitTip" :content="tabGroupItem.unitTip" placement="right">
                      <pa-icon name="question_line" class="pa-form-title_label-icon"></pa-icon>
                    </el-tooltip>
                  </pa-title>
                </template>

                <pa-row :gutter="'calc(var(--pa-size-padding, 10px) / 4)'">
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
                </pa-row>
              </section>
            </pa-form-control>
          </section>
        </pa-tabs-item>
      </pa-tabs>

      <div v-else class="pa-display-style">
        {{ injectConfigContext.languagePackage["empyt"] }}
      </div>
    </pa-form-item>
  </template>
</template>

<script lang="ts" setup>
/** @description Vue 核心响应式 API */
import { ref, Ref, watch, nextTick, computed, inject } from "vue";
/** @description 随机字符串生成工具 */
import { random } from "../hooks/random";
/** @description 基础表单项组件 */
import formItem from "../form-basics-element.vue";
/** @description 表单控制器组件 */
import mFormV2Control from "../pa-form-control.vue";
/** @description 表单类型定义 */
import { ConfigContextType, ExMultipleConfigType, FormItemRule } from "../types";

export type TabsItemPropType = {
  id: string;
  item: ExMultipleConfigType;
  rules?: Record<string, Record<string, FormItemRule | FormItemRule[]>>;
};

/** @description 组件属性 */
const props = defineProps<TabsItemPropType>();

/** @description 配置上下文注入 */
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

/** @description 组件事件 */
const emit = defineEmits<{ (e: "setRef", data: any): void }>();

/** @description Tab表单引用 */
const tabsFormRef = ref();
/** @description 当前步骤索引 */
const stepsIndex = ref("0");
/** @description 编辑中的标题索引 */
const editTitleIndex = ref("");
/** @description 基础标题键名 */
const baseTitleKey = random();

/** @description 标题数组 */
const titleArr = computed(() => {
  const data = injectConfigContext.value.data[String(props.item.prop)]?.map((item: Record<string, any>) => {
    return props.item.titleKey
      ? item[String(props.item.titleKey)] || injectConfigContext.value.languagePackage["information"]
      : item[baseTitleKey] || injectConfigContext.value.languagePackage["information"];
  });

  return data || [];
});

/** @description 对比中被删除的Tab */
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

/** @description 锁定状态 */
let lock = false;

/** @description Tab表单校验引用映射 */
const ruleTabsFormRef: Record<string, { ref: any; prop: Record<string, boolean | string> }> = {};
/**
 * 设置Tab表单校验引用
 * @param el - 组件实例
 * @param prop - 属性对象
 * @returns void
 * @description 将Tab表单校验引用存储到映射中
 */
function setRuleTabsFormRef(el: any, prop: Record<string, boolean | string>) {
  const key = prop.name;
  if (el) {
    ruleTabsFormRef[String(key)] = { ref: el, prop };
  }
}

/**
 * 输入框失焦处理
 * @param value - 输入值
 * @param callback - 回调函数
 * @returns void
 * @description 处理标题编辑失焦事件
 */
function inputBlur(value: string, callback: (value: string) => void) {
  editTitleIndex.value = "";
  if (value == "") {
    callback(props.item?.titleLabel?.[(injectConfigContext.value.language || "zh-CN") as "en-US" | "zh-CN"] || "标签");
  }
}

/**
 * 获取Tab表单校验引用
 * @param name - Tab名称
 * @returns 组件实例
 * @description 根据Tab名称获取对应的校验引用
 */
function getRuleTabsFormRef(name: string) {
  if (ruleTabsFormRef[name]) {
    return ruleTabsFormRef[name].ref;
  }
  return {};
}

/**
 * 点击切换Tab
 * @param name - Tab名称对象
 * @returns void
 * @description 处理Tab切换事件
 */
function clickToChange({ name }: { name: string }) {
  if (editTitleIndex.value != name) {
    editTitleIndex.value = "";
  }
  stepsIndex.value = name || "0";
}

/**
 * 添加Tab项
 * @returns void
 * @description 添加新的Tab表单项
 */
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

/**
 * 移除Tab项
 * @param row - Tab行数据
 * @returns void
 * @description 移除指定的Tab表单项
 */
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

/**
 * 提交Tab表单
 * @returns 验证结果
 * @description 验证所有Tab表单并返回验证结果
 */
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
/**
 * 验证Tab表单
 * @param data - 验证状态
 * @returns void
 * @description 处理Tab表单验证状态
 */
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

/** @description 监听Tab表单数据变化并初始化 */
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

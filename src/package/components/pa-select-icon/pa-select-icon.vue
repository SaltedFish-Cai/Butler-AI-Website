<template>
  <div
    v-if="!display"
    class="pa-select-icon"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
    ref="selectRef"
  >
    <pa-popover
      ref="popoverRef"
      :disabled="disabled"
      :popover-width="520"
      :teleport-to="teleportInContainer ? selectRef : 'body'"
      :closeByScroll="false"
    >
      <template #reference>
        <div class="flex-center-start">
          <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
            {{ typeof title === "string" ? title : title[languageValue] }}
          </div>
          <pa-button class="flex1" :icon-name="selectItem" type="default" :useStop="false">{{ inputPlaceholder }}</pa-button>
        </div>
      </template>

      <pa-tabs v-model="activeName" align="edge">
        <pa-tabs-item v-for="its in Config" :key="its.name" :label="`${its.title}(${its.icons.length})`" :name="its.name" scroll>
          <div class="pa-select-icon_popover">
            <template v-for="icon in its.icons" :key="icon.value">
              <pa-icon
                class="pop_icon"
                :class="[icon.value == selectItem ? 'selected' : '']"
                :name="icon.value"
                @click="selectedIcon(icon.value)"
                @mouseover="hoverIcon(icon)"
              />
            </template>
          </div>
        </pa-tabs-item>
      </pa-tabs>
    </pa-popover>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( <pa-icon :name="selectItem" class="pa-select-icon_select-icon" /> ) </template>
      <template v-else>
        <pa-icon v-if="!displayValue" :name="selectItem" class="pa-select-icon_select-icon" />
        <span v-else>{{ displayValue }}</span>
      </template>
    </div>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(selectItem, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( <pa-icon :name="contrastData" class="pa-select-icon_select-icon" /> ) </template>
    <template v-else>
      <pa-icon :name="contrastData" class="pa-select-icon_select-icon" />
    </template>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, computed, watch, inject, ComputedRef } from "vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";

/**
 * **模块导入**
 * @description 导入图标配置数据
 * */
import iconJson from "./config/icon.json";
import direction from "./config/direction.json";
import multiMedia from "./config/multi-media.json";
import office from "./config/office.json";
import shop from "./config/shop.json";
import cityJson from "./config/city.json";
import network from "./config/network.json";

/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";

/**
 * **模块导入**
 * @description 导入 lodash 工具函数
 * */
import _ from "lodash";
const { isEqual, isNil } = _;

/**
 * **图标配置列表**
 * @type `Array<{title: string, name: string, icons: Array<any>}>`
 * @description 所有图标分类配置
 * */
const Config = ref([
  {
    title: "全部图标",
    name: "all",
    icons: setIconOptions([...iconJson, ...network, ...multiMedia, ...office, ...shop, ...cityJson, ...direction])
  },
  { title: "网络图标", name: "network", icons: setIconOptions(network) },
  { title: "方向图标", name: "direction", icons: setIconOptions(direction) },
  { title: "办公图标", name: "fileType", icons: setIconOptions(office) },
  { title: "娱乐图标", name: "multiMedia", icons: setIconOptions(multiMedia) },
  { title: "商城图标", name: "shop", icons: setIconOptions(shop) },
  { title: "城市图标", name: "city", icons: setIconOptions(cityJson) },
  { title: "其他图标", name: "default", icons: setIconOptions(iconJson) }
]);

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = defineProps<ComponentProps>();

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits<ComponentEmits>();

/**
 * **选择器容器引用**
 * @type `any`
 * @description 选择器容器 DOM 元素引用
 * */
const selectRef = ref();

/**
 * **选中的图标**
 * @type `string`
 * @description 当前选中的图标名称
 * */
const selectItem = ref(props.modelValue || "finger_press_line");

/**
 * **悬停图标**
 * @type `string`
 * @description 鼠标悬停的图标名称
 * */
const hoverItem = ref("finger_press_line");

/**
 * **当前激活的标签页**
 * @type `string`
 * @description 当前显示的图标分类标签页
 * */
const activeName = ref("all");

/**
 * **旧值存储**
 * @type `string`
 * @description 存储上一次的值，用于变更事件
 * */
let oldValue = props.modelValue || "";

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **语言值**
 * @returns `string` 语言代码
 * @description 获取当前语言设置
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

/**
 * **语言包**
 * @returns `Record<string, string>` 语言包对象
 * @description 获取当前语言包配置
 * */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});

/**
 * **输入框占位符**
 * @returns `string` 占位符文本
 * @description 计算按钮显示的占位符文本
 * */
const inputPlaceholder = computed(() => {
  return typeof props.placeholder === "object"
    ? props.placeholder[languageValue.value] || languagePackage.value[`clickChangeIcon`]
    : props.placeholder || languagePackage.value[`clickChangeIcon`];
});

/**
 * **设置图标选项**
 * @description 将图标数据转换为选项格式
 * */
function setIconOptions(icons) {
  const iconOptions = icons.map(item => {
    return { label: item.font_class, value: item.font_class };
  });
  return iconOptions;
}

/**
 * **选择图标**
 * @description 选择图标并触发事件
 * */
function selectedIcon(value) {
  selectItem.value = value;
  emits("update:modelValue", value);
  emits("change", { value, oldValue });
  oldValue = value;
}

/**
 * **悬停图标**
 * @description 鼠标悬停图标时更新显示
 * */
function hoverIcon(iconText) {
  hoverItem.value = iconText.label;
}

/**
 * **监听 modelValue 变化**
 * @description 外部值变化时更新内部值
 * */
watch(
  () => props.modelValue,
  data => {
    if (data == undefined) {
      emits("update:modelValue", "finger_press_line");
    }
    selectItem.value = data || "finger_press_line";
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>

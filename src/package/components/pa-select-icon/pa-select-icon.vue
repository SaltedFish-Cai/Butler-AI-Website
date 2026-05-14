<template>
  <div
    v-if="!display"
    class="pa-select-icon"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="props.style"
    ref="selectRef"
  >
    <pa-popover
      ref="popoverRef"
      :disabled="props.disabled"
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
              />
            </template>
          </div>
        </pa-tabs-item>
      </pa-tabs>
    </pa-popover>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="props.style">
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
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, watch, inject, type ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入图标配置数据
 */
import iconJson from "./config/icon.json";
import direction from "./config/direction.json";
import multiMedia from "./config/multi-media.json";
import office from "./config/office.json";
import shop from "./config/shop.json";
import cityJson from "./config/city.json";
import network from "./config/network.json";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 工具函数
 * @description 导入 isNil 工具函数
 */
import isNil from "../tools/is-nil";
/**
 * 工具函数
 * @description 导入 isEqual 工具函数
 */
import isEqual from "../tools/is-equal";
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = defineProps<ComponentProps>();
/**
 * 组件事件定义
 * @type ComponentEmits
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 选择器容器引用
 * @type any
 * @description 选择器容器 DOM 元素引用
 */
const selectRef = ref();
/**
 * 选中的图标
 * @type string
 * @description 当前选中的图标值
 */
const selectItem = ref(props.modelValue || "finger_press_line");
/**
 * 当前激活的标签页
 * @type string
 * @description 当前激活的选项卡名称
 */
const activeName = ref("all");
/**
 * 旧值存储
 * @type string
 * @description 存储上一次的值，用于变更事件
 */
let oldValue: string = props.modelValue || "";
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 语言包
 * @type ComputedRef
 * @description 当前语言的文本配置
 */
const languagePackage = computed(() => {
  return languageValue.value === "zh-CN" ? { clickChangeIcon: "点击切换图标" } : { clickChangeIcon: "Click To Change Icon" };
});
/**
 * 输入框占位符
 * @returns string 占位符文本
 * @description 计算输入框的占位符文本
 */
const inputPlaceholder = computed(() => {
  return typeof props.placeholder === "object"
    ? props.placeholder[languageValue.value] || languagePackage.value[`clickChangeIcon`]
    : props.placeholder || languagePackage.value[`clickChangeIcon`];
});
/**
 * 设置图标选项
 * @param icons - 图标数据数组
 * @returns 处理后的图标选项数组
 * @description 将图标数据转换为选项格式
 */
const setIconOptions = (icons: Array<{ font_class: string }>): Array<{ label: string; value: string }> => {
  return icons.map(item => ({ label: item.font_class, value: item.font_class }));
};
/**
 * 图标配置列表
 * @type Array<object>
 * @description 所有图标分类配置
 */
const Config: Array<{ title: string; name: string; icons: Array<{ label: string; value: string }> }> = [
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
];
/**
 * 选择图标
 * @param value - 选中的图标值
 * @description 选择图标并触发事件
 */
function selectedIcon(value: string) {
  selectItem.value = value;
  emits("update:modelValue", value);
  emits("change", { value, oldValue });
  oldValue = value;
}
/**
 * 监听 modelValue 变化
 * @description 外部值变化时更新内部选中值
 */
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

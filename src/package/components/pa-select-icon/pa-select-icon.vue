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
import { ref, computed, watch, inject, ComputedRef } from "vue";
import { ComponentProps, ComponentEmits } from "./types";
import iconJson from "./config/icon.json";
import direction from "./config/direction.json";
import multiMedia from "./config/multi-media.json";
import office from "./config/office.json";
import shop from "./config/shop.json";
import cityJson from "./config/city.json";
import network from "./config/network.json";
import { PancakeGlobalConfigType } from "../pa-manager/type";

import _ from "lodash";
const { isEqual, isNil } = _;

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

const props = defineProps<ComponentProps>();
const emits = defineEmits<ComponentEmits>();

const selectRef = ref();
const selectItem = ref(props.modelValue || "finger_press_line");
const hoverItem = ref("finger_press_line");
const activeName = ref("all");

let oldValue = props.modelValue || "";

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});

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

<style lang="scss" scoped>
.pa-select-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .reference-btn {
    width: 100%;
    height: calc(var(--pa-size-height) + var(--pa-size-padding, 10px) / 3);
    line-height: calc(var(--pa-size-height) + var(--pa-size-padding, 10px) / 3);
    text-align: center;
    font-size: var(--pa-size-font);
    color: var(--pa-color-font);
    border: 1px solid var(--pa-color-border);
    border-radius: var(--pa-size-radius, 3px);
    background-color: var(--pa-color-bg);

    &:hover {
      cursor: pointer;
      background-color: var(--pa-color-primary-light-9);
      color: var(--pa-color-primary);
      border: 1px solid var(--pa-color-primary);
    }
  }

  .pa-select-icon_select-icon {
    padding: 4px;
    margin-right: calc(var(--pa-size-padding, 10px) / 2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--pa-size-font, 13px) * 1.2);
    color: #fff;
    background-color: var(--pa-color-primary);
    font-weight: 500;
    border-radius: 50%;
  }
}

.pa-select-icon_popover {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  max-height: 300px;

  .pop_icon {
    width: 100%;
    flex: 0 0 calc(100% / 10 - 2px);
    padding: calc(var(--pa-size-padding, 10px) / 2) 0;
    font-size: calc(var(--pa-size-font, 13px) * 1.8);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1px;
    border: 1px solid var(--pa-border-color);
    border-radius: 3px;
    box-sizing: border-box;

    &:hover {
      background-color: var(--pa-color-info-light-9);
      cursor: pointer;
    }

    &.selected {
      background-color: var(--pa-color-primary);
      color: #fff;
      font-weight: 500;
    }
  }
}
</style>

<style lang="scss">
.pa-select-icon {
  > .pa-popover-reference {
    width: 100%;
    transition: var(--pa-animation-time, 0.2s);

    &:hover {
      transition: var(--pa-animation-time, 0.2s);

      > .pa-button {
        transition: var(--pa-animation-time, 0.2s);

        border-color: var(--pa-color-primary);
        box-shadow: 0 0 0 2px var(--pa-color-primary-light-8);
      }
    }

    > .pa-button {
      width: 100%;

      &.hover {
        border-color: var(--pa-color-primary);
        box-shadow: 0 0 0 2px var(--pa-color-primary-light-8);
      }
    }
  }

  .pa-scrollbar:has(.scrollbar__bar.is-vertical) {
    & > .pa-scrollbar-content {
      .pa-select-icon_popover {
        padding-right: calc(var(--pa-size-padding, 10px) / 1.5);
      }
    }
  }
}

.pa-select-icon.is-disabled {
  > .pa-popover-reference {
    &:hover {
      > .pa-button {
        cursor: not-allowed;
        border-color: var(--pa-border-color);
        box-shadow: none;
      }
    }
  }
}
</style>

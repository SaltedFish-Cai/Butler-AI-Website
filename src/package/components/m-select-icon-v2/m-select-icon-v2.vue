<template>
  <div
    v-if="!display"
    class="m-select-icon-v2"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
    ref="selectRef"
  >
    <m-icon-v2 :name="selectItem" class="m-select-icon-v2_select-icon" />

    <m-popover-v2
      ref="popoverRef"
      :disabled="disabled"
      :popover-width="520"
      :teleport-to="teleportInContainer ? selectRef : 'body'"
    >
      <template #reference>
        <m-button-v2 is="import" :disabled="disabled" :name="selectItem" :use-font="false" position="left">
          {{ inputPlaceholder }}
        </m-button-v2>
      </template>

      <m-tabs-v2 v-model="activeName">
        <m-tabs-v2-item
          v-for="its in Config"
          :key="its.name"
          :label="`${its.title}(${its.icons.length})`"
          :name="its.name"
          scroll
        >
          <div class="m-select-icon-v2_popover">
            <template v-for="icon in its.icons" :key="icon.value">
              <m-icon-v2
                class="pop_icon"
                :class="[icon.value == selectItem ? 'selected' : '']"
                :name="icon.value"
                @click="selectedIcon(icon.value)"
                @mouseover="hoverIcon(icon)"
              />
            </template>
          </div>
        </m-tabs-v2-item>
      </m-tabs-v2>
    </m-popover-v2>
  </div>

  <div v-else class="m-display-v2">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( <m-icon-v2 :name="selectItem" class="m-select-icon-v2_select-icon" /> )</template>
    <template v-else><m-icon-v2 :name="selectItem" class="m-select-icon-v2_select-icon" /></template>
  </div>
  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(selectItem, contrastData))"
    :class="['m-contrast-v2']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( <m-icon-v2 :name="contrastData" class="m-select-icon-v2_select-icon" /> )</template>
    <template v-else><m-icon-v2 :name="contrastData" class="m-select-icon-v2_select-icon" /></template>
  </div>
</template>
<script lang="ts" setup>
// # Import
import { ref, computed, watch, inject, ComputedRef } from "vue";
import { MSelectIconV2Type } from "./type";
import iconJson from "./config/icon.json";
import direction from "./config/direction.json";
import multiMedia from "./config/multi-media.json";
import office from "./config/office.json";
import shop from "./config/shop.json";
import cityJson from "./config/city.json";
import network from "./config/network.json";
import lodashPkg from "lodash";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const { isEqual, isNil } = lodashPkg;

// # Var
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

const props = defineProps<MSelectIconV2Type>();
const emits = defineEmits(["update:modelValue", "change"]);

const selectRef = ref();

const selectItem = ref(props.modelValue || "finger_press_line");
const hoverItem = ref("finger_press_line");

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package?.["cell"] || {};
});

const inputPlaceholder = computed(() => {
  const language = ManagerGlobalConfig.value?.language?.value || "zh-CN";
  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`selectPlaceholder`]
    : props.placeholder || languagePackage.value[`selectPlaceholder`];
});

const activeName = ref("all");
let oldValue = props.modelValue;

// #Function 设置Icon选项
function setIconOptions(icons) {
  const iconOptions = icons.map(item => {
    return { label: item.font_class, value: item.font_class };
  });
  return iconOptions;
}

// #Function 选择Icon
function selectedIcon(value) {
  selectItem.value = value;
  emits("update:modelValue", value);
  emits("change", { value, oldValue });
  oldValue = value;
}

// #Function 悬停Icon
function hoverIcon(iconText) {
  hoverItem.value = iconText.label;
}

// #Watch modelValue
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
.m-select-icon-v2 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .m-select-icon-v2_select-icon {
    padding: 4px;
    margin-right: calc(var(--m-component-padding-size, 10px) / 2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--m-component-font-size, 13px) * 1.2);
    color: #fff;
    background-color: var(--m-color-primary);
    font-weight: 500;
    border-radius: 50%;
  }
}
.m-select-icon-v2_popover {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  max-height: 300px;
  .pop_icon {
    width: 100%;
    flex: 0 0 calc(100% / 10 - 2px);
    padding: calc(var(--m-component-padding-size, 10px) / 2) 0;
    font-size: calc(var(--m-component-font-size, 13px) * 1.8);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1px;
    border: 1px solid var(--m-border-color);
    border-radius: 3px;
    box-sizing: border-box;
    &:hover {
      background-color: var(--m-color-info-light-9);
      cursor: pointer;
    }

    &.selected {
      background-color: var(--m-color-primary);
      color: #fff;
      font-weight: 500;
    }
  }
}
</style>

<style lang="scss">
.m-select-icon-v2 {
  > .m-popover-v2-reference {
    width: 100%;
    transition: var(--m-animation-time, 0.2s);

    &:hover {
      transition: var(--m-animation-time, 0.2s);

      > .m-button-v2 {
        transition: var(--m-animation-time, 0.2s);

        border-color: var(--m-color-primary);
        box-shadow: 0 0 0 2px var(--m-color-primary-light-8);
      }
    }
    > .m-button-v2 {
      width: 100%;
      &.hover {
        border-color: var(--m-color-primary);
        box-shadow: 0 0 0 2px var(--m-color-primary-light-8);
      }
    }
  }
  .m-scrollbar-v2:has(.scrollbar__bar.is-vertical) {
    & > .m-scrollbar-v2-content {
      .m-select-icon-v2_popover {
        padding-right: calc(var(--m-component-padding-size, 10px) / 1.5);
      }
    }
  }
}
.m-select-icon-v2.is-disabled {
  > .m-popover-v2-reference {
    &:hover {
      > .m-button-v2 {
        cursor: not-allowed;
        border-color: var(--m-border-color);
        box-shadow: none;
      }
    }
  }
}
</style>

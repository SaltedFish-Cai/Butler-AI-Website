<template>
  <div
    v-if="!display"
    class="sa-select-icon"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
    ref="selectRef"
  >
    <sa-icon :name="selectItem" class="sa-select-icon_select-icon" />

    <sa-popover
      ref="popoverRef"
      :disabled="disabled"
      :popover-width="520"
      :teleport-to="teleportInContainer ? selectRef : 'body'"
    >
      <template #reference>
        <sa-button is="import" :disabled="disabled" :name="selectItem" :use-font="false" position="left">
          {{ inputPlaceholder }}
        </sa-button>
      </template>

      <sa-tabs v-model="activeName">
        <sa-tabs-item v-for="its in Config" :key="its.name" :label="`${its.title}(${its.icons.length})`" :name="its.name" scroll>
          <div class="sa-select-icon_popover">
            <template v-for="icon in its.icons" :key="icon.value">
              <sa-icon
                class="pop_icon"
                :class="[icon.value == selectItem ? 'selected' : '']"
                :name="icon.value"
                @click="selectedIcon(icon.value)"
                @mouseover="hoverIcon(icon)"
              />
            </template>
          </div>
        </sa-tabs-item>
      </sa-tabs>
    </sa-popover>
  </div>

  <div v-else class="m-display-v2">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( <sa-icon :name="selectItem" class="sa-select-icon_select-icon" /> )</template>
    <template v-else><sa-icon :name="selectItem" class="sa-select-icon_select-icon" /></template>
  </div>
  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(selectItem, contrastData))"
    :class="['m-contrast-v2']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( <sa-icon :name="contrastData" class="sa-select-icon_select-icon" /> )</template>
    <template v-else><sa-icon :name="contrastData" class="sa-select-icon_select-icon" /></template>
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
import { SaltedGlobalConfigType } from "../sa-content/type";

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

const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const languagePackage = computed(() => {
  return SaltedGlobalConfig.value?.language?.package?.["cell"] || {};
});

const inputPlaceholder = computed(() => {
  const language = SaltedGlobalConfig.value?.language?.value || "zh-CN";
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
.sa-select-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .sa-select-icon_select-icon {
    padding: 4px;
    margin-right: calc(var(--sa-size-padding, 10px) / 2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--sa-size-font, 13px) * 1.2);
    color: #fff;
    background-color: var(--m-color-primary);
    font-weight: 500;
    border-radius: 50%;
  }
}
.sa-select-icon_popover {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  max-height: 300px;
  .pop_icon {
    width: 100%;
    flex: 0 0 calc(100% / 10 - 2px);
    padding: calc(var(--sa-size-padding, 10px) / 2) 0;
    font-size: calc(var(--sa-size-font, 13px) * 1.8);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1px;
    border: 1px solid var(--sa-color-border);
    border-radius: 3px;
    box-sizing: border-box;
    &:hover {
      background-color: var(--sa-color-info-light-9);
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
.sa-select-icon {
  > .sa-popover-reference {
    width: 100%;
    transition: var(--sa-animation-time, 0.2s);

    &:hover {
      transition: var(--sa-animation-time, 0.2s);

      > .sa-button {
        transition: var(--sa-animation-time, 0.2s);

        border-color: var(--m-color-primary);
        box-shadow: 0 0 0 2px var(--m-color-primary-light-8);
      }
    }
    > .sa-button {
      width: 100%;
      &.hover {
        border-color: var(--m-color-primary);
        box-shadow: 0 0 0 2px var(--m-color-primary-light-8);
      }
    }
  }
  .sa-scrollbar:has(.scrollbar__bar.is-vertical) {
    & > .sa-scrollbar-content {
      .sa-select-icon_popover {
        padding-right: calc(var(--sa-size-padding, 10px) / 1.5);
      }
    }
  }
}
.sa-select-icon.is-disabled {
  > .sa-popover-reference {
    &:hover {
      > .sa-button {
        cursor: not-allowed;
        border-color: var(--sa-color-border);
        box-shadow: none;
      }
    }
  }
}
</style>

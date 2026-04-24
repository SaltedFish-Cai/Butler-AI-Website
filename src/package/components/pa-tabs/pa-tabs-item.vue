<template>
  <div
    :data-name="name"
    :data-label="label"
    class="pa-tabs-item flex-col"
    :class="[tabsContext.activeName === name ? 'active' : '', useBorder ? 'use-border' : '']"
    ref="ScrollbarRef"
  >
    <slot name="before"></slot>
    <div class="pa-tabs-item_body" v-if="init">
      <pa-scrollbar
        v-if="scroll && tabsContext.mode !== 'slider'"
        ref="scrollbarRef"
        :useScrollX="useScrollX"
        :padding="padding"
      >
        <slot></slot>
      </pa-scrollbar>

      <div
        v-else
        class="pa-tabs-item-body_fix"
        :class="{
          'padding-top': padding?.includes('top') || padding?.includes('all'),
          'padding-left': padding?.includes('left') || padding?.includes('all'),
          'padding-bottom': padding?.includes('bottom') || padding?.includes('all'),
          'padding-right': padding?.includes('right') || padding?.includes('all')
        }"
      >
        <!-- silder模式下显示标题 -->
        <div
          v-if="tabsContext.mode === 'slider'"
          ref="tabItemLine"
          class="pa-tabs-item_title"
          :class="['tab-item_line_' + tabsContext.tabsId]"
          :data-label="label"
          :data-name="name"
          :id="tabsContext.tabsId + '-' + name"
        >
          <pa-title :tips="tips">
            {{ typeof label === "string" ? label : label[languageValue] }}
            <template #tips v-if="$slots['tips']">
              <slot name="tips"></slot>
            </template>
          </pa-title>
        </div>
        <slot></slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
<script lang="ts" setup>
// #
import { ref, onMounted, inject, provide, watch, computed, ComputedRef } from "vue";
import { PaTabsItemType } from "./type";
import { PancakeGlobalConfigType } from "../pa-manager/type";
// import { randChar } from "../tools/rand-char";

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const scrollbarRef = ref();
provide("parentScrollbarRef", scrollbarRef);

const tabsContext = inject("TabsContext") as {
  mode: "default" | "portrait" | "slider" | "sticky";
  tabsId: string;
  activeName: string;
};
const initTitle: any = inject("initTitle");

// # Var
const props = withDefaults(defineProps<PaTabsItemType>(), {
  label: "",
  name: "",
  scroll: false,
  lazy: false,
  useScrollX: false,
  useBorder: false
});

const tabItemLine = ref();
const ScrollbarRef = ref();

const init = ref(false);

// # onMounted
onMounted(() => {
  if (props.lazy == true) {
    init.value = false;
  } else if (props.lazy == false) {
    init.value = true;
  } else {
    setTimeout(
      () => {
        init.value = true;
      },
      typeof props.lazy === "number" ? props.lazy : 3000
    );
  }
});

defineExpose({
  ScrollbarRef: ScrollbarRef
});

// #Watch modelValue
watch(
  () => props.name,
  () => {
    initTitle();
  },
  { immediate: true }
);
// #Watch modelValue
watch(
  () => props.label,
  () => {
    initTitle();
  },
  { immediate: true }
);
</script>

<style lang="scss">
.pa-tabs-item_title {
  position: relative;
  .tab-item_line_load {
    position: absolute;
    display: none;
  }
}
.pa-tabs-item_body {
  height: 1px;
  flex: 1;
}
.pa-tabs-item {
  display: flex;
  flex: 0 0 100%;
  width: 100%;
  visibility: hidden;

  .pa-tabs-item-body_fix {
    height: calc(100% - 0px);
    box-sizing: border-box;
    // padding-right: 9px;
    // padding-bottom: 7px;
    // padding-left: 9px;
  }
}

.pa-tabs-item-body_fix.padding-top {
  // height: calc(100% - calc(var(--pa-size-padding, 10px)));
  padding-top: calc(var(--pa-size-padding, 10px)) !important;
}
.pa-tabs-item-body_fix.padding-left {
  // width: calc(100% - calc(var(--pa-size-padding, 10px)));
  padding-left: calc(var(--pa-size-padding, 10px)) !important;
}
.pa-tabs-item-body_fix.padding-bottom {
  // height: calc(100% - calc(var(--pa-size-padding, 10px)));
  padding-bottom: calc(var(--pa-size-padding, 10px)) !important;
}
.pa-tabs-item-body_fix.padding-right {
  // width: calc(100% - calc(var(--pa-size-padding, 10px)));
  padding-right: calc(var(--pa-size-padding, 10px)) !important;
}
.pa-tabs-item-body_fix.padding-top.padding-bottom {
  // height: calc(100% - calc(var(--pa-size-padding, 10px)) * 2);
}
.pa-tabs-item-body_fix.padding-left.padding-right {
  // width: calc(100% - calc(var(--pa-size-padding, 10px)) * 2);
}

.pa-tabs-item.active {
  visibility: visible;
}
</style>

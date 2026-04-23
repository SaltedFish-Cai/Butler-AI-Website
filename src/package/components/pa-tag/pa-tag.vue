<template>
  <div
    class="pa-tag"
    ref="tagRef"
    :class="[useCollapse ? 'pa-tag-collapse' : '', props.class]"
    :style="{ ...props.style, opacity: isOpacity }"
  >
    <div class="pa-tag-text" v-for="item in inValue" :key="String(item.value)">
      <div class="pa-tag-text-content">
        {{ typeof item.label === "object" ? item.label[language] || item.label["zh-CN"] : item.label }}
      </div>
      <pa-icon v-if="!props.disabled" name="close_circle_line" class="close-icon" @click="e => removeTag(e, item)"></pa-icon>
    </div>
    <pa-popover ref="popoverRef" v-if="hideValue.length" :popoverWidth="popoverWidth" stopPropagation>
      <template #reference>
        <div class="pa-tag-text" style="width: initial">+{{ hideValue.length }}</div>
      </template>
      <div class="pa-tag">
        <div class="pa-tag-text" v-for="item in hideValue" :key="String(item.value)">
          <div class="pa-tag-text-content">
            {{ typeof item.label === "object" ? item.label[language] || item.label["zh-CN"] : item.label }}
          </div>
          <pa-icon v-if="!disabled" name="close_circle_line" class="close-icon" @click="e => removeTag(e, item)"></pa-icon>
        </div>
      </div>
    </pa-popover>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch, nextTick, inject, ComputedRef } from "vue";
import { ComponentProps, TagListType } from "./types";
import { getElementPosition } from "../utils/getElementPosition";

import { PancakeGlobalConfigType } from "../pa-manager/type";

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

const props = withDefaults(defineProps<ComponentProps>(), {
  useCollapse: true
});
const popoverRef = ref();
const inValue = ref(props.tagList || []);
const tagRef = ref<HTMLDivElement>();
const hideValue: Ref<TagListType> = ref([]);
const isOpacity = ref(0);
const emits = defineEmits(["removeTag"]);

function removeTag(e, data) {
  e.stopPropagation();
  emits("removeTag", data);
}

onMounted(() => {
  initPopover();
});

function initPopover() {
  if (!props.useCollapse) {
    isOpacity.value = 1;
  } else {
    nextTick(() => {
      const children = tagRef.value?.children;
      let spliceIndex = 0;
      if (children && Array.from(children).length) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const position = getElementPosition(child, tagRef.value as HTMLElement, { top: 0, left: 0, right: 40, bottom: 0 });
          console.log("++++++++++> child:", child, position?.isFullInParent);
          if (position?.isFullInParent) {
            spliceIndex++;
          }
        }
        if (spliceIndex) {
          hideValue.value = props.tagList.slice(spliceIndex);
          inValue.value = props.tagList.slice(0, spliceIndex);
        }
        isOpacity.value = 1;
      }
    });
  }
}

watch(
  () => props.tagList,
  data => {
    inValue.value = data;
    initPopover();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>

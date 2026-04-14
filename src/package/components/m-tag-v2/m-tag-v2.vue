<template>
  <div
    class="m-tag-v2"
    ref="tagRef"
    :class="[useCollapse ? 'm-tag-v2-collapse' : '', props.class]"
    :style="{ ...props.style, opacity: isOpacity }"
  >
    <div class="m-tag-v2-text" v-for="item in inValue" :key="String(item.value)">
      <div class="m-tag-v2-text-content">{{ item.label }}</div>
      <m-icon-v2 v-if="!props.disabled" name="close_circle_line" class="close-icon" @click="e => removeTag(e, item)"></m-icon-v2>
    </div>
    <m-popover-v2 ref="popoverRef" v-if="hideValue.length" :popoverWidth="popoverWidth" stopPropagation>
      <template #reference>
        <div class="m-tag-v2-text">+{{ hideValue.length }}</div>
      </template>
      <div class="m-tag-v2">
        <div class="m-tag-v2-text" v-for="item in hideValue" :key="String(item.value)">
          <div class="m-tag-v2-text-content">{{ item.label }}</div>
          <m-icon-v2
            v-if="!props.disabled"
            name="close_circle_line"
            class="close-icon"
            @click="e => removeTag(e, item)"
          ></m-icon-v2>
        </div>
      </div>
    </m-popover-v2>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch, nextTick } from "vue";
import { MTagV2Type, TagListType } from "./type";
import { getElementPosition } from "../utils/getElementPosition";

const props = withDefaults(defineProps<MTagV2Type>(), {
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

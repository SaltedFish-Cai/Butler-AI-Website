<script lang="ts" setup>
import { ref } from "vue";
import { useFlyout } from "../composables/flyout";
import VPIconChevronDown from "./icons/VPIconChevronDown.vue";
import VPIconMoreHorizontal from "./icons/VPIconMoreHorizontal.vue";
import VPMenu from "./VPMenu.vue";

defineProps<{
  icon?: string;
  button?: string;
  label?: string;
  items?: any[];
}>();

const open = ref(false);
const el = ref<HTMLElement>();

useFlyout({ el, onBlur });

function onBlur() {
  open.value = false;
}
</script>

<template>
  <div class="VPFlyout" ref="el">
    <slot name="reference">
      <button type="button" class="button" aria-haspopup="true" :aria-expanded="open" :aria-label="label" @click="open = !open">
        <span v-if="button || icon" class="text">
          <component v-if="icon" :is="icon" class="option-icon" />
          <span v-if="button" v-html="button"></span>
          <VPIconChevronDown class="text-icon" />
        </span>

        <VPIconMoreHorizontal v-else class="icon" />
      </button>
    </slot>

    <div class="menu">
      <VPMenu :items="items">
        <slot />
      </VPMenu>
    </div>
  </div>
</template>

<style scoped>
.VPFlyout {
  position: relative;
  transition: 0.3s;
  transform: scale(1);
}

.VPFlyout:hover {
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.VPFlyout:hover .icon {
  fill: var(--vp-c-text-2);
}

.VPFlyout.active .text {
  color: var(--vp-c-brand-1);
  font-weight: bold;
  transform: scale(1.2);
  transition: transform 0.25s;
}

.VPFlyout.active:hover .text {
  color: var(--vp-c-brand-2);
}

.VPFlyout:hover .menu,
.button[aria-expanded="true"] + .menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.button[aria-expanded="false"] + .menu {
  opacity: 0;
  visibility: hidden;
  transform: translateY(0);
}

.button {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: var(--vp-nav-height);
  color: var(--vp-c-text-1);
  transition: color 0.5s;
}

.text {
  display: flex;
  align-items: center;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.option-icon {
  margin-right: 0px;
  font-size: 16px;
}

.text-icon {
  margin-left: 4px;
  font-size: 14px;
}

.icon {
  font-size: 20px;
  transition: fill 0.25s;
}

.menu {
  position: absolute;
  top: calc(var(--vp-nav-height) / 2 + 20px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s, visibility 0.25s, transform 0.25s;
}
</style>

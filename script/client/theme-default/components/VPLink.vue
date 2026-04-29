<script lang="ts" setup>
import { computed } from "vue";
import { normalizeLink } from "../support/utils";
import { EXTERNAL_URL_RE } from "../../shared";

const props = defineProps<{
  tag?: string;
  href?: string;
  noIcon?: boolean;
  target?: string;
  rel?: string;
  iconName?: string;
}>();

const tag = computed(() => props.tag ?? (props.href ? "a" : "span"));
const isExternal = computed(() => (props.href && EXTERNAL_URL_RE.test(props.href)) || props.target === "_blank");
</script>

<template>
  <component
    :is="tag"
    class="VPLink"
    :class="{
      link: href,
      'vp-external-link-icon': isExternal,
      'no-icon': noIcon
    }"
    :href="href ? normalizeLink(href) : undefined"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
  >
    <span v-if="iconName" class="butler-icon_font" :class="'icon-' + iconName"></span>
    <slot />
  </component>
</template>

<style lang="scss">
@use "./iconfont/iconfont.css";

.butler-icon_font {
  position: relative;
  z-index: 0;
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: inherit;
  line-height: 1em;
  font-family: "butler-iconfont" !important;
}
</style>

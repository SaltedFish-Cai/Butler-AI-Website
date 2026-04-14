<template>
  <transition name="sa-animation">
    <div v-if="show">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts" setup>
// # Import
// import { ref, watch } from "vue";
import { SaAnimationType } from "./type";
// import { useBaseStore } from "../store/index";

// # Var
withDefaults(defineProps<SaAnimationType>(), {
  show: true
});
// const inValue = ref(true);
// const emits = defineEmits(["update:modelValue"]);

// watch(
//   () => props.modelValue,
//   data => {
//     inValue.value = data;
//   },
//   { immediate: true }
// );
// const globalState = useBaseStore();
</script>

<style lang="scss">
/* 过渡起始状态 */
.sa-animation-enter-from,
.sa-animation-leave-to {
  opacity: 0;
}

/*过渡结束状态*/
.sa-animation-enter-to,
.sa-animation-leave-from {
  opacity: 1;
}

/* 过渡阶段 */
.sa-animation-enter-active,
.sa-animation-leave-active {
  transition: opacity var(--m-component-animation, 0.3s) ease;
}
</style>

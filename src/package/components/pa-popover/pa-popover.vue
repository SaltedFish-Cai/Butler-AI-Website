<template>
  <div
    class="pa-popover-reference"
    :class="[props.class, { 'is-disabled': props.disabled, 'is-click': props.trigger == 'click' }]"
    :style="referenceStyle"
    ref="popoverReferenceRef"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot name="reference"></slot>
  </div>
  <template v-if="inRenderEnd && visible">
    <teleport :to="teleportTo || 'body'">
      <transition name="mo-animation-fadeIn">
        <div
          v-show="visible"
          :id="id"
          :class="['pa-popover', props.popoverClass]"
          :style="{ ...popoverStyle, zIndex: zIndex }"
          @mouseenter="handlePopoverEnter"
          @mouseleave="handlePopoverLeave"
        >
          <div class="pa-popover-content" ref="popoverRef" :class="contentClassName" :style="popoverContentStyle">
            <slot />
          </div>
          <div class="pa-popover-arrow" :style="popoverArrowStyle"></div>
        </div>
      </transition>
    </teleport>
  </template>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, useSlots, ref, Ref, inject, watch } from "vue";
import { ComponentProps, ComponentEmits } from "./types.d.ts";
import { getElementPosition } from "../utils/getElementPosition";

import _ from "lodash";
const { cloneDeep, throttle } = _;

const props = withDefaults(defineProps<ComponentProps>(), {
  trigger: "click",
  contentClassName: "",
  autoWidth: false,
  placement: "bottom",
  targetClose: true,
  sticky: undefined,
  closeByScroll: true
});

const emits = defineEmits<ComponentEmits>();

const id = ref(`popover-${Date.now()}`);
const inRenderEnd = ref(false);

const getPaAnagerGlobalZIndex = inject("getPaAnagerGlobalZIndex") as () => number;
const zIndex = ref(getPaAnagerGlobalZIndex());

const animationFrameId = ref<number | null>(null);

const popoverReferenceRef = ref<HTMLElement>();
const popoverRef = ref<HTMLElement>();

const popoverStyle: Ref<Record<string, string>> = ref({
  top: "auto",
  bottom: "auto",
  left: "auto",
  right: "auto"
});

const popoverContentStyle = ref({});

const popoverArrowStyle = ref({});

const visible = ref(false);
const hoverTimer = ref<any>(null);
const slots = useSlots();

/**
 * 处理点击事件
 * @param e 点击事件对象
 * */
function handleClick(e: MouseEvent) {
  if (props.stopPropagation) e.stopPropagation();
  if (props.disabled) return;
  const defaultSlots = slots?.reference?.();
  if (defaultSlots?.length) {
    for (let index = 0; index < defaultSlots.length; index++) {
      const vnode = defaultSlots[index];
      const clickMethod = vnode.props?.onClick;
      if (clickMethod) {
        clickMethod?.();
      }
    }
  }
  if (props.trigger !== "click") return;

  if (visible.value && props.targetClose) {
    if (!props.beforeClose?.()) return;
    hidePopover();
    return;
  }
  showPopover();
}

/**
 * 处理鼠标进入事件
 * */
function handleMouseEnter() {
  if (props.disabled) return;
  if (props.trigger !== "hover") return;

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }

  hoverTimer.value = setTimeout(() => {
    if (!visible.value) {
      showPopover();
    }
  }, 150);
}

/**
 * 处理鼠标离开事件
 * */
function handleMouseLeave() {
  if (props.disabled) return;
  if (props.trigger !== "hover") return;

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }

  hoverTimer.value = setTimeout(() => {
    if (visible.value) {
      hidePopover();
    }
  }, 300);
}

/**
 * 处理弹窗鼠标进入事件
 * */
function handlePopoverEnter() {
  if (props.trigger !== "hover") return;

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
}

/**
 * 处理弹窗鼠标离开事件
 * */
function handlePopoverLeave() {
  if (props.trigger !== "hover") return;

  hoverTimer.value = setTimeout(() => {
    if (visible.value) {
      hidePopover();
    }
  }, 300);
}

/**
 * 重新计算弹窗位置
 * */
function recalculatePosition() {
  if (!visible.value || !popoverReferenceRef.value) return;
  const ReferencePosition = getElementPosition(popoverReferenceRef.value);
  let popoverContentStyleValue = {};
  let popoverStyleValue = {};
  let popoverArrowStyleValue = {};

  if (ReferencePosition) {
    if (props.popoverWidth) {
      popoverContentStyleValue = { ...popoverContentStyleValue, width: props.popoverWidth + "px" };
    } else if (props.autoWidth) {
      const width = ReferencePosition.width < 200 ? 200 : ReferencePosition.width;
      popoverContentStyleValue = { ...popoverContentStyleValue, width: width + "px" };
    }
    popoverContentStyle.value = popoverContentStyleValue;

    popoverStyleValue = { ...popoverStyleValue, bottom: "unset", top: ReferencePosition.bottom + 9 + "px" };
    popoverStyle.value = popoverStyleValue;

    let anchorLeftPosition: Record<string, string> = { left: ReferencePosition.left + ReferencePosition.width / 2 + "px" };
    if (props.sticky === "left") {
      anchorLeftPosition = { left: ReferencePosition.windowLeft + 30 + "px" };
    } else if (props.sticky === "right") {
      anchorLeftPosition = { right: ReferencePosition.windowRight + 30 + "px" };
    }
    popoverArrowStyleValue = {
      ...popoverArrowStyleValue,
      bottom: "unset",
      top: ReferencePosition.bottom + 5 + "px",
      ...anchorLeftPosition
    };
    popoverArrowStyle.value = popoverArrowStyleValue;

    nextTick(() => {
      checkPositionOverOut();
    });
  }
}

/**
 * 检查弹窗是否超出视口
 * */
function checkPositionOverOut() {
  const ReferencePosition = getElementPosition(popoverReferenceRef.value);
  const popoverRefPosition = getElementPosition(popoverRef.value);
  if (!ReferencePosition || !popoverRefPosition) return;

  let popoverStyleValue = cloneDeep(popoverStyle.value);
  const popoverArrowStyleValue = cloneDeep(popoverArrowStyle.value);

  if (props.sticky === "left") {
    popoverStyleValue = { ...popoverStyleValue, right: "unset", left: ReferencePosition.windowLeft + "px" };
  } else if (props.sticky === "right") {
    popoverStyleValue = { ...popoverStyleValue, left: "unset", right: ReferencePosition.windowRight + "px" };
  } else {
    popoverStyleValue = {
      ...popoverStyleValue,
      right: "unset",
      left: ReferencePosition.left + ReferencePosition.width / 2 - popoverRefPosition.width / 2 + "px"
    };
  }

  popoverArrowStyle.value = popoverArrowStyleValue;
  popoverStyle.value = popoverStyleValue;

  nextTick(() => {
    const ReferencePosition = getElementPosition(popoverReferenceRef.value);
    const popoverRefPosition = getElementPosition(popoverRef.value);
    if (!ReferencePosition || !popoverRefPosition) return;

    const SAFE_DISTANCE = 10;
    let popoverStyleValue = cloneDeep(popoverStyle.value);
    let popoverArrowStyleValue = cloneDeep(popoverArrowStyle.value);

    if (popoverRefPosition.outLeft) {
      popoverStyleValue = {
        ...popoverStyleValue,
        right: "unset",
        left: SAFE_DISTANCE + "px"
      };
    }

    if (popoverRefPosition.outRight) {
      popoverStyleValue = {
        ...popoverStyleValue,
        left: "unset",
        right: SAFE_DISTANCE + "px"
      };
    }

    if (popoverRefPosition.outBottom || props.placement === "top") {
      popoverStyleValue = {
        ...popoverStyleValue,
        top: "unset",
        bottom: ReferencePosition.windowBottom + ReferencePosition.height + 9 + "px"
      };
      popoverArrowStyleValue = {
        ...popoverArrowStyleValue,
        top: "unset",
        bottom: ReferencePosition.windowBottom + ReferencePosition.height + 5 + "px"
      };
    }

    popoverArrowStyle.value = popoverArrowStyleValue;
    popoverStyle.value = popoverStyleValue;
  });
}

/**
 * 开始观察目标元素位置和尺寸变化
 * */
function startObserving() {
  if (!popoverReferenceRef.value || animationFrameId.value || !popoverRef.value) return;

  let lastPosition = getElementPosition(popoverReferenceRef.value);
  let lastPopoverPosition = getElementPosition(popoverRef.value);

  function listenTarget() {
    const currentPosition = getElementPosition(popoverReferenceRef.value);
    if (
      currentPosition &&
      lastPosition &&
      (currentPosition.top !== lastPosition.top || currentPosition.left !== lastPosition.left)
    ) {
      recalculatePosition();
    }

    lastPosition = currentPosition;
  }

  function listenPopover() {
    const popoverRefPosition = getElementPosition(popoverRef.value);
    if (
      popoverRefPosition &&
      lastPopoverPosition &&
      (popoverRefPosition.width !== lastPopoverPosition.width || popoverRefPosition.height !== lastPopoverPosition.height)
    ) {
      checkPositionOverOut();
    }

    lastPopoverPosition = popoverRefPosition;
  }

  const checkPosition = () => {
    if (!popoverReferenceRef.value || !popoverRef.value || !visible.value) {
      stopObserving();
      return;
    }

    listenTarget();
    listenPopover();

    if (visible.value) {
      animationFrameId.value = requestAnimationFrame(throttleCheckPosition);
    }
  };

  const throttleCheckPosition = throttle(checkPosition, 300, { trailing: true });

  animationFrameId.value = requestAnimationFrame(throttleCheckPosition);
}

/**
 * 停止观察目标元素
 * */
function stopObserving() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
}

/**
 * 显示弹窗
 * */
function showPopover() {
  popoverStyle.value = { top: "auto", bottom: "auto", left: "auto", right: "auto" };
  popoverContentStyle.value = {};
  popoverArrowStyle.value = {};
  const position = getElementPosition(popoverReferenceRef.value);

  if (position) {
    visible.value = true;
    emits("change", true);

    recalculatePosition();

    nextTick(() => {
      if (props.trigger === "click") {
        addGlobalClickListener();
      }

      nextTick(() => {
        startObserving();
        if (props.closeByScroll && typeof window !== "undefined") {
          window.PancakeGlobalConfig.PopoverList = window.PancakeGlobalConfig.PopoverList || {};
          window.PancakeGlobalConfig.PopoverList[id.value] = hidePopover;
        }
      });
    });
  }
}

/**
 * 隐藏弹窗
 * */
function hidePopover() {
  visible.value = false;
  emits("change", false);
  removeGlobalClickListener();
  stopObserving();
  if (typeof window !== "undefined" && window.PancakeGlobalConfig?.PopoverList?.[id.value]) {
    if (typeof window !== "undefined") delete window.PancakeGlobalConfig.PopoverList[id.value];
  }
}

/**
 * 全局点击事件处理
 * @param event 点击事件对象
 * */
function handleGlobalClick(event: MouseEvent) {
  if (!visible.value) return;

  const isClickOnReference =
    popoverReferenceRef.value && (popoverReferenceRef.value === event.target || popoverReferenceRef.value.contains(event.target as Node));

  const isClickOnPopover = popoverRef.value && (popoverRef.value === event.target || popoverRef.value.contains(event.target as Node));
  if (isClickOnReference || isClickOnPopover) {
    return;
  }
  hidePopover();
}

/**
 * 添加全局点击事件监听
 * */
function addGlobalClickListener() {
  document.addEventListener("click", handleGlobalClick);
}

/**
 * 移除全局点击事件监听
 * */
function removeGlobalClickListener() {
  document.removeEventListener("click", handleGlobalClick);
}

onMounted(() => {
  inRenderEnd.value = true;
});

onUnmounted(() => {
  removeGlobalClickListener();
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
  stopObserving();
  hidePopover();
});

defineExpose({ showPopover, hidePopover });

watch(
  () => props.autoWidth,
  newVal => {
    const ReferencePosition = getElementPosition(popoverReferenceRef.value);
    if (ReferencePosition) {
      let popoverContentStyleValue = {};
      if (props.popoverWidth) {
        popoverContentStyleValue = { ...popoverContentStyleValue, width: props.popoverWidth + "px" };
      } else if (newVal) {
        const width = ReferencePosition.width < 200 ? 200 : ReferencePosition.width;
        popoverContentStyleValue = { ...popoverContentStyleValue, width: width + "px" };
      }
      popoverContentStyle.value = popoverContentStyleValue;
    }
  }
);
</script>

<style lang="scss">
@use "../styles/animation.scss";
@use "./index.scss";
</style>

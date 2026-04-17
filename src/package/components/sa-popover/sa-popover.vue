<template>
  <div
    class="sa-popover-reference"
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
      <!-- <transition :name="!inTop ? 'mo-animation-fadeUp' : 'mo-animation-fadeDown'"> -->
      <transition name="mo-animation-fadeIn">
        <div
          v-show="visible"
          :id="id"
          :class="['sa-popover', props.popoverClass]"
          :style="{ ...popoverStyle, zIndex: zIndex }"
          @mouseenter="handlePopoverEnter"
          @mouseleave="handlePopoverLeave"
        >
          <div class="sa-popover-content" ref="popoverRef" :class="contentClassName" :style="popoverContentStyle">
            <slot />
          </div>
          <div class="sa-popover-arrow" :style="popoverArrowStyle"></div>
        </div>
      </transition>
    </teleport>
  </template>
</template>

<script lang="ts" setup>
// # Import
import { nextTick, onMounted, onUnmounted, useSlots, ref, Ref, inject, watch } from "vue";
import { SaPopoverType } from "./type";
import { getElementPosition } from "../utils/getElementPosition";

import _ from "lodash";
const { cloneDeep, throttle } = _;

const props = withDefaults(defineProps<SaPopoverType>(), {
  trigger: "click",
  contentClassName: "",
  autoWidth: false,
  placement: "bottom",
  targetClose: true,
  sticky: undefined,
  closeByScroll: true
});
const emits = defineEmits(["change"]);

const id = ref(`popover-${Date.now()}`);
const inRenderEnd = ref(false);

const getSaAnagerGlobalZIndex = inject("getSaAnagerGlobalZIndex") as () => number;
const zIndex = ref(getSaAnagerGlobalZIndex());

const animationFrameId = ref<number | null>(null);
// const observer = ref<MutationObserver | null>(null);

const popoverReferenceRef = ref<HTMLElement>();
const popoverRef = ref<HTMLElement>();

// @ 壳子
const popoverStyle: Ref<Record<string, string>> = ref({
  top: "auto",
  bottom: "auto",
  left: "auto",
  right: "auto"
});
// @ 内容
const popoverContentStyle = ref({});
// @ 标点
const popoverArrowStyle = ref({});

const visible = ref(false);
const hoverTimer = ref<any>(null);
const slots = useSlots();

// # 点击处理
function handleClick(e) {
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

// # 鼠标进入处理
function handleMouseEnter() {
  if (props.disabled) return;
  if (props.trigger !== "hover") return;

  // 清除之前的隐藏计时器
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }

  // 设置显示延迟，避免快速划过时频繁显示
  hoverTimer.value = setTimeout(() => {
    if (!visible.value) {
      showPopover();
    }
  }, 150);
}

// # 鼠标离开处理
function handleMouseLeave() {
  if (props.disabled) return;
  if (props.trigger !== "hover") return;

  // 清除显示计时器
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }

  // 设置隐藏延迟，避免鼠标在弹窗和目标元素之间移动时频繁隐藏
  hoverTimer.value = setTimeout(() => {
    if (visible.value) {
      hidePopover();
    }
  }, 300);
}

// # 弹窗鼠标进入处理
function handlePopoverEnter() {
  if (props.trigger !== "hover") return;

  // 清除隐藏计时器，防止鼠标移动到弹窗时关闭
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
}

// # 弹窗鼠标离开处理
function handlePopoverLeave() {
  if (props.trigger !== "hover") return;

  // 设置隐藏延迟
  hoverTimer.value = setTimeout(() => {
    if (visible.value) {
      hidePopover();
    }
  }, 300);
}

// # 初始化计算popover位置
function recalculatePosition() {
  if (!visible.value || !popoverReferenceRef.value) return;
  const ReferencePosition = getElementPosition(popoverReferenceRef.value);
  let popoverContentStyleValue = {};
  let popoverStyleValue = {};
  let popoverArrowStyleValue = {};

  if (ReferencePosition) {
    // @ 使用外部传入的宽度设置内容宽度
    if (props.popoverWidth) {
      popoverContentStyleValue = { ...popoverContentStyleValue, width: props.popoverWidth + "px" };
    }
    // @ 如果使用自动宽度适应设置内容宽度
    else if (props.autoWidth) {
      const width = ReferencePosition.width < 200 ? 200 : ReferencePosition.width;
      popoverContentStyleValue = { ...popoverContentStyleValue, width: width + "px" };
    }
    popoverContentStyle.value = popoverContentStyleValue;

    // @ 设置壳子的位置(下)
    popoverStyleValue = { ...popoverStyleValue, bottom: "unset", top: ReferencePosition.bottom + 9 + "px" };
    popoverStyle.value = popoverStyleValue;

    // @ 设置锚点
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

    // @ 补全定位(左右)
    nextTick(() => {
      checkPositionOverOut();
    });
  }
}

// # 检查位置是否超出视口
function checkPositionOverOut() {
  const ReferencePosition = getElementPosition(popoverReferenceRef.value);
  const popoverRefPosition = getElementPosition(popoverRef.value);
  if (!ReferencePosition || !popoverRefPosition) return;

  let popoverStyleValue = cloneDeep(popoverStyle.value);
  const popoverArrowStyleValue = cloneDeep(popoverArrowStyle.value);

  //  @ 设置锚点
  if (props.sticky === "left") {
    // 黏左侧 👈
    popoverStyleValue = { ...popoverStyleValue, right: "unset", left: ReferencePosition.windowLeft + "px" };
  } else if (props.sticky === "right") {
    // 黏右侧 👉
    popoverStyleValue = { ...popoverStyleValue, left: "unset", right: ReferencePosition.windowRight + "px" };
  } else {
    // 默认居中
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

    // @ 检查是否超出视口左侧
    if (popoverRefPosition.outLeft) {
      popoverStyleValue = {
        ...popoverStyleValue,
        right: "unset",
        left: SAFE_DISTANCE + "px"
      };
    }

    // @ 检查是否超出视口右侧
    if (popoverRefPosition.outRight) {
      popoverStyleValue = {
        ...popoverStyleValue,
        left: "unset",
        right: SAFE_DISTANCE + "px"
      };
    }

    // @ 检查是否超出视口底部
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

// # 开始观察目标元素位置和尺寸变化
function startObserving() {
  if (!popoverReferenceRef.value || animationFrameId.value || !popoverRef.value) return;

  let lastPosition = getElementPosition(popoverReferenceRef.value);
  let lastPopoverPosition = getElementPosition(popoverRef.value);

  // 使用MutationObserver监听元素尺寸变化
  // observer.value = new MutationObserver(() => {
  //   // 当元素尺寸变化时，重新计算popover位置
  //   recalculatePosition();
  // });

  // observer.value.observe(popoverRef.value, {
  //   attributes: true,
  //   attributeFilter: ["style", "class"], // 监听样式和类名变化
  //   childList: true,
  //   subtree: true
  // });

  function listenTarget() {
    const currentPosition = getElementPosition(popoverReferenceRef.value);
    if (
      currentPosition &&
      lastPosition &&
      (currentPosition.top !== lastPosition.top || currentPosition.left !== lastPosition.left)
    ) {
      // 当目标元素坐标位置发生变化时，关闭popover
      // hidePopover();
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
      // 当目标元素尺寸发生变化时，重新计算popover位置
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

    // 继续监听
    if (visible.value) {
      animationFrameId.value = requestAnimationFrame(throttleCheckPosition);
    }
  };

  const throttleCheckPosition = throttle(checkPosition, 300, { trailing: true });

  // 开始监听
  animationFrameId.value = requestAnimationFrame(throttleCheckPosition);
}

// # 停止观察目标元素
function stopObserving() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }

  // if (observer.value) {
  //   observer.value.disconnect();
  //   observer.value = null;
  // }
}

// # 显示弹窗
function showPopover() {
  // 初始化弹窗位置样式
  popoverStyle.value = { top: "auto", bottom: "auto", left: "auto", right: "auto" };
  popoverContentStyle.value = {};
  popoverArrowStyle.value = {};
  const position = getElementPosition(popoverReferenceRef.value);

  if (position) {
    visible.value = true;
    emits("change", true);

    // 初始计算popover位置
    recalculatePosition();

    nextTick(() => {
      // 如果是点击触发，添加全局点击事件监听
      if (props.trigger === "click") {
        addGlobalClickListener();
      }

      nextTick(() => {
        // 开始观察目标元素位置变化
        startObserving();
        if (props.closeByScroll) {
          window.SaltedGlobalConfig.PopoverList = window.SaltedGlobalConfig.PopoverList || {};
          window.SaltedGlobalConfig.PopoverList[id.value] = hidePopover;
        }
      });
    });
  }
}

// # 隐藏弹窗
function hidePopover() {
  visible.value = false;
  emits("change", false);
  // 移除全局点击事件监听
  removeGlobalClickListener();
  // 停止观察目标元素
  stopObserving();
  // 删除全局事件监听
  if (window.SaltedGlobalConfig?.PopoverList?.[id.value]) {
    delete window.SaltedGlobalConfig.PopoverList[id.value];
  }
}

// # 全局点击事件处理
function handleGlobalClick(event) {
  if (!visible.value) return;

  // 检查点击的是否是目标元素或其子元素
  const isClickOnReference =
    popoverReferenceRef.value && (popoverReferenceRef.value === event.target || popoverReferenceRef.value.contains(event.target));

  // 检查点击的是否是弹窗本身或其子元素
  const isClickOnPopover = popoverRef.value && (popoverRef.value === event.target || popoverRef.value.contains(event.target));
  // 如果点击的是目标元素或弹窗本身，不隐藏
  if (isClickOnReference || isClickOnPopover) {
    return;
  }
  // 点击了其他元素，隐藏弹窗
  hidePopover();
}

// # 添加全局点击事件监听
function addGlobalClickListener() {
  document.addEventListener("click", handleGlobalClick);
}

// # 移除全局点击事件监听
function removeGlobalClickListener() {
  document.removeEventListener("click", handleGlobalClick);
}

// # 组件挂载和卸载时的事件处理
onMounted(() => {
  // 组件挂载时不需要立即添加监听，等点击时再添加
  inRenderEnd.value = true;
});

onUnmounted(() => {
  // 组件卸载时确保移除事件监听
  removeGlobalClickListener();
  // 清除所有计时器
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
  // 停止观察目标元素
  stopObserving();
  hidePopover();
});

// # 暴露获取元素坐标和检查视口的方法给父组件
defineExpose({ showPopover, hidePopover });

watch(
  () => props.autoWidth,
  newVal => {
    const ReferencePosition = getElementPosition(popoverReferenceRef.value);
    if (ReferencePosition) {
      let popoverContentStyleValue = {};
      if (props.popoverWidth) {
        popoverContentStyleValue = { ...popoverContentStyleValue, width: props.popoverWidth + "px" };
      }
      // @ 如果使用自动宽度适应设置内容宽度
      else if (newVal) {
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

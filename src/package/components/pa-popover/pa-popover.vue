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
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { nextTick, onMounted, onUnmounted, useSlots, ref, Ref, inject, watch } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入元素位置计算工具
 */
import { getElementPosition } from "../utils/getElementPosition";
/**
 * 模块导入
 * @description 导入 lodash 工具函数
 */
import _ from "lodash";
const { throttle } = _;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  trigger: "click",
  contentClassName: "",
  autoWidth: false,
  placement: "bottom",
  targetClose: true,
  sticky: undefined,
  closeByScroll: true
});
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 弹窗唯一标识
 * @type Ref<string>
 * @description 弹窗的唯一标识符
 */
const id = ref(`popover-${Date.now()}`);
/**
 * 渲染结束标识
 * @type Ref<boolean>
 * @description 标识组件是否已完成渲染
 */
const inRenderEnd = ref(false);
/**
 * 获取全局ZIndex方法
 * @type () => number
 * @description 获取全局 ZIndex 的方法
 */
const getPaAnagerGlobalZIndex = inject("getPaAnagerGlobalZIndex") as () => number;
/**
 * 弹窗ZIndex
 * @type Ref<number>
 * @description 弹窗的 ZIndex 值
 */
const zIndex = ref(getPaAnagerGlobalZIndex());
/**
 * 动画帧ID
 * @type Ref<number | null>
 * @description requestAnimationFrame 返回的 ID
 */
const animationFrameId = ref<number | null>(null);
/**
 * 参考元素引用
 * @type Ref<HTMLElement | undefined>
 * @description 参考元素的 DOM 引用
 */
const popoverReferenceRef = ref<HTMLElement>();
/**
 * 弹窗元素引用
 * @type Ref<HTMLElement | undefined>
 * @description 弹窗的 DOM 引用
 */
const popoverRef = ref<HTMLElement>();
/**
 * 弹窗样式
 * @type Ref<Record<string, string>>
 * @description 弹窗的样式对象
 */
const popoverStyle: Ref<Record<string, string>> = ref({
  top: "auto",
  bottom: "auto",
  left: "auto",
  right: "auto"
});
/**
 * 弹窗内容样式
 * @type Ref<Record<string, string>>
 * @description 弹窗内容的样式对象
 */
const popoverContentStyle = ref({});
/**
 * 弹窗箭头样式
 * @type Ref<Record<string, string>>
 * @description 弹窗箭头的样式对象
 */
const popoverArrowStyle = ref({});
/**
 * 弹窗可见状态
 * @type Ref<boolean>
 * @description 弹窗是否可见
 */
const visible = ref(false);
/**
 * 悬停计时器
 * @type Ref<any>
 * @description 悬停延迟的计时器
 */
const hoverTimer = ref<any>(null);
/**
 * 插槽对象
 * @type Slots
 * @description 组件插槽
 */
const slots = useSlots();
/**
 * 处理点击事件
 * @param e - 点击事件对象
 * @description 处理点击参考元素的事件
 */
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
 * @description 处理鼠标进入参考元素的事件
 */
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
 * @description 处理鼠标离开参考元素的事件
 */
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
 * @description 处理鼠标进入弹窗的事件
 */
function handlePopoverEnter() {
  if (props.trigger !== "hover") return;
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
}
/**
 * 处理弹窗鼠标离开事件
 * @description 处理鼠标离开弹窗的事件
 */
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
 * @description 重新计算弹窗的显示位置
 */
function recalculatePosition() {
  if (!visible.value || !popoverReferenceRef.value) return;
  const ReferencePosition = getElementPosition(popoverReferenceRef.value);
  if (ReferencePosition) {
    let popoverContentStyleValue = {};
    if (props.popoverWidth) {
      popoverContentStyleValue = { ...popoverContentStyleValue, width: props.popoverWidth + "px" };
    } else if (props.autoWidth) {
      const width = ReferencePosition.width < 200 ? 200 : ReferencePosition.width;
      popoverContentStyleValue = { ...popoverContentStyleValue, width: width + "px" };
    }
    popoverContentStyle.value = popoverContentStyleValue;
    nextTick(checkPositionOverOut);
  }
}
/**
 * 检查弹窗是否超出视口
 * @description 检查弹窗是否超出浏览器视口边界
 */
function checkPositionOverOut() {
  const ReferencePosition = getElementPosition(popoverReferenceRef.value);
  const popoverRefPosition = getElementPosition(popoverRef.value);
  if (!ReferencePosition || !popoverRefPosition) return;

  const OFFSET = 9;
  const SAFE_DISTANCE = 10;
  const winH = window.innerHeight;
  const winW = window.innerWidth;

  const popH = popoverRefPosition.height;
  const popW = popoverRefPosition.width;

  // 优先级逻辑: 下 -> 上 -> 左 -> 右 -> 强制下方
  let placement = "bottom";
  if (ReferencePosition.bottom + popH + OFFSET <= winH) {
    placement = "bottom";
  } else if (ReferencePosition.top - popH - OFFSET >= 0) {
    placement = "top";
  } else if (ReferencePosition.left - popW - OFFSET >= 0) {
    placement = "left";
  } else if (ReferencePosition.right + popW + OFFSET <= winW) {
    placement = "right";
  } else {
    placement = "bottom"; // Forced fallback
  }

  if (props.placement === "top" && ReferencePosition.top - popH - OFFSET >= 0) placement = "top";

  const style: Record<string, string> = { top: "unset", bottom: "unset", left: "unset", right: "unset" };
  const arrowStyle: Record<string, string> = { top: "unset", bottom: "unset", left: "unset", right: "unset" };

  // 参考元素的中心点坐标
  const refCenterX = ReferencePosition.left + ReferencePosition.width / 2;
  const refCenterY = ReferencePosition.top + ReferencePosition.height / 2;

  if (placement === "bottom" || placement === "top") {
    // 1. 计算 Popover 的水平位置 (带有视口边界保护)
    let leftPos = refCenterX - popW / 2;
    if (props.sticky === "left") leftPos = ReferencePosition.left;
    else if (props.sticky === "right") leftPos = ReferencePosition.left + ReferencePosition.width - popW;

    leftPos = Math.max(SAFE_DISTANCE, Math.min(leftPos, winW - popW - SAFE_DISTANCE));

    if (placement === "bottom") {
      style.top = ReferencePosition.bottom + OFFSET + "px";
      arrowStyle.top = "0px"; // 定位在 Popover 顶边线
      arrowStyle.bottom = "unset";
    } else {
      style.bottom = winH - ReferencePosition.top + OFFSET + "px";
      arrowStyle.top = "100%"; // 定位在 Popover 底边线
      arrowStyle.bottom = "unset";
    }
    style.left = leftPos + "px";

    // 2. 计算箭头相对于 Popover 的水平位置
    // 箭头位置 = 参考元素中心 - Popover左侧距离
    const arrowRelativeLeft = refCenterX - leftPos;
    arrowStyle.left = arrowRelativeLeft + "px";
  } else if (placement === "left" || placement === "right") {
    // 1. 计算 Popover 的垂直位置 (带有视口边界保护)
    let topPos = refCenterY - popH / 2;
    topPos = Math.max(SAFE_DISTANCE, Math.min(topPos, winH - popH - SAFE_DISTANCE));

    if (placement === "left") {
      style.right = winW - ReferencePosition.left + OFFSET + "px";
      arrowStyle.left = "100%"; // 定位在 Popover 右边线
      arrowStyle.right = "unset";
    } else {
      style.left = ReferencePosition.right + OFFSET + "px";
      arrowStyle.left = "0px"; // 定位在 Popover 左边线
      arrowStyle.right = "unset";
    }
    style.top = topPos + "px";

    // 2. 计算箭头相对于 Popover 的垂直位置
    // 箭头位置 = 参考元素中心 - Popover顶部距离
    const arrowRelativeTop = refCenterY - topPos;
    arrowStyle.top = arrowRelativeTop + "px";
  }

  popoverStyle.value = style;
  popoverArrowStyle.value = arrowStyle;
}
/**
 * 开始观察目标元素
 * @description 开始观察目标元素位置和尺寸变化
 */
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
 * @description 停止观察目标元素位置和尺寸变化
 */
function stopObserving() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
}
/**
 * 显示弹窗
 * @description 显示弹出框
 */
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
 * @description 隐藏弹出框
 */
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
 * @param event - 点击事件对象
 * @description 处理全局点击事件
 */
function handleGlobalClick(event: MouseEvent) {
  if (!visible.value) return;
  const isClickOnReference =
    popoverReferenceRef.value &&
    (popoverReferenceRef.value === event.target || popoverReferenceRef.value.contains(event.target as Node));
  const isClickOnPopover =
    popoverRef.value && (popoverRef.value === event.target || popoverRef.value.contains(event.target as Node));
  if (isClickOnReference || isClickOnPopover) {
    return;
  }
  hidePopover();
}
/**
 * 添加全局点击事件监听
 * @description 添加全局点击事件监听器
 */
function addGlobalClickListener() {
  document.addEventListener("click", handleGlobalClick);
}
/**
 * 移除全局点击事件监听
 * @description 移除全局点击事件监听器
 */
function removeGlobalClickListener() {
  document.removeEventListener("click", handleGlobalClick);
}
/**
 * 组件挂载生命周期
 * @description 组件挂载时的初始化操作
 */
onMounted(() => {
  inRenderEnd.value = true;
});
/**
 * 组件卸载生命周期
 * @description 组件卸载时的清理操作
 */
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
/**
 * 监听 autoWidth 属性变化
 * @description 监听 autoWidth 属性变化并更新样式
 */
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

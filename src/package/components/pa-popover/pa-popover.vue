<template>
  <div
    class="pa-popover-reference"
    :class="[props.class, { 'is-disabled': props.disabled, 'is-click': props.trigger == 'click' }]"
    :style="[props.style, props.referenceStyle]"
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
        <div v-show="visible" :id="id" :class="['pa-popover', props.popoverClass]" :style="{ ...popoverStyle, zIndex: zIndex }" @mouseenter="handlePopoverEnter" @mouseleave="handlePopoverLeave">
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
import { inject, nextTick, onBeforeUnmount, onMounted, ref, type Ref, useSlots, watch } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentEmits, ComponentProps } from "./types";
/**
 * 模块导入
 * @description 导入元素位置计算工具
 */
import { getElementPosition } from "../utils/getElementPosition";
/**
 * 位置偏移常量
 * @description 弹窗与参考元素之间的像素偏移
 */
const OFFSET = 9;
/**
 * 安全距离常量
 * @description 弹窗距离视口边界的最小安全距离
 */
const SAFE_DISTANCE = 10;
/**
 * ID 计数器
 * @description 用于生成唯一 ID 的递增计数器
 */
let idCounter = 0;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  disabled: false,
  teleportTo: "body",
  trigger: "click",
  contentClassName: "",
  stopPropagation: false,
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
const id = ref(`popover-${++idCounter}`);
/**
 * 渲染结束标识
 * @type Ref<boolean>
 * @description 标识组件是否已完成首次渲染
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
const popoverContentStyle = ref<Record<string, string>>({});
/**
 * 弹窗箭头样式
 * @type Ref<Record<string, string>>
 * @description 弹窗箭头的样式对象
 */
const popoverArrowStyle = ref<Record<string, string>>({});
/**
 * 弹窗可见状态
 * @type Ref<boolean>
 * @description 弹窗是否可见
 */
const visible = ref(false);
/**
 * 悬停计时器
 * @type Ref<ReturnType<typeof setTimeout> | null>
 * @description 悬停延迟的计时器
 */
const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null);
/**
 * 插槽对象
 * @description 组件插槽
 */
const slots = useSlots();
/**
 * ResizeObserver 实例
 * @type ResizeObserver | null
 * @description 监听参考元素和弹窗元素尺寸变化的观察器
 */
let resizeObserver: ResizeObserver | null = null;
/**
 * 滚动动画帧 ID
 * @type number | null
 * @description 用于滚动事件 RAF 防抖的 ID
 */
let scrollRafId: number | null = null;

/**
 * 获取弹窗内容宽度
 * @returns Record<string, string> 宽度样式对象
 * @description 根据 autoWidth 或 popoverWidth 计算弹窗内容宽度
 */
function getContentWidth(): Record<string, string> {
  if (props.popoverWidth) {
    return { width: props.popoverWidth + "px" };
  }
  if (props.autoWidth) {
    const refPos = getElementPosition(popoverReferenceRef.value);
    if (refPos) {
      const width = refPos.width < 200 ? 200 : refPos.width;
      return { width: width + "px" };
    }
  }
  return {};
}
/**
 * 计算弹窗位置和箭头样式
 * @returns void
 * @description 计算弹窗相对于参考元素的显示位置和箭头样式，包含视口边界保护
 */
function calculatePosition(): void {
  if (!visible.value || !popoverReferenceRef.value) return;
  const ReferencePosition = getElementPosition(popoverReferenceRef.value);
  const popoverRefPosition = getElementPosition(popoverRef.value);
  if (!ReferencePosition || !popoverRefPosition) return;

  popoverContentStyle.value = getContentWidth();

  const winH = window.innerHeight;
  const winW = window.innerWidth;
  const popH = popoverRefPosition.height;
  const popW = popoverRefPosition.width;

  const canFit = (p: string) => {
    if (p === "bottom") return ReferencePosition.bottom + popH + OFFSET <= winH;
    if (p === "top") return ReferencePosition.top - popH - OFFSET >= 0;
    if (p === "left") return ReferencePosition.left - popW - OFFSET >= 0;
    if (p === "right") return ReferencePosition.right + popW + OFFSET <= winW;
    return false;
  };

  let placement = props.placement;
  if (!canFit(placement)) {
    if (canFit("bottom")) placement = "bottom";
    else if (canFit("top")) placement = "top";
    else if (canFit("left")) placement = "left";
    else if (canFit("right")) placement = "right";
    else placement = "bottom";
  }

  const style: Record<string, string> = { top: "unset", bottom: "unset", left: "unset", right: "unset" };
  const arrowStyle: Record<string, string> = { top: "unset", bottom: "unset", left: "unset", right: "unset" };

  const refCenterX = ReferencePosition.left + ReferencePosition.width / 2;
  const refCenterY = ReferencePosition.top + ReferencePosition.height / 2;

  if (placement === "bottom" || placement === "top") {
    let leftPos = refCenterX - popW / 2;
    if (props.sticky === "left") leftPos = ReferencePosition.left;
    else if (props.sticky === "right") leftPos = ReferencePosition.left + ReferencePosition.width - popW;

    leftPos = Math.max(SAFE_DISTANCE, Math.min(leftPos, winW - popW - SAFE_DISTANCE));

    if (placement === "bottom") {
      style.top = ReferencePosition.bottom + OFFSET + "px";
      arrowStyle.top = "0px";
      arrowStyle.bottom = "unset";
    } else {
      style.bottom = winH - ReferencePosition.top + OFFSET + "px";
      arrowStyle.top = "100%";
      arrowStyle.bottom = "unset";
    }
    style.left = leftPos + "px";

    const arrowRelativeLeft = refCenterX - leftPos;
    arrowStyle.left = arrowRelativeLeft + "px";
  } else if (placement === "left" || placement === "right") {
    let topPos = refCenterY - popH / 2;
    topPos = Math.max(SAFE_DISTANCE, Math.min(topPos, winH - popH - SAFE_DISTANCE));

    if (placement === "left") {
      style.right = winW - ReferencePosition.left + OFFSET + "px";
      arrowStyle.left = "100%";
      arrowStyle.right = "unset";
    } else {
      style.left = ReferencePosition.right + OFFSET + "px";
      arrowStyle.left = "0px";
      arrowStyle.right = "unset";
    }
    style.top = topPos + "px";

    const arrowRelativeTop = refCenterY - topPos;
    arrowStyle.top = arrowRelativeTop + "px";
  }

  popoverStyle.value = style;
  popoverArrowStyle.value = arrowStyle;
}
/**
 * 处理滚动事件
 * @returns void
 * @description 滚动时使用 RAF 防抖重新计算弹窗位置
 */
function handleScroll(): void {
  if (!visible.value) return;
  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    scrollRafId = null;
    if (visible.value) {
      calculatePosition();
    }
  });
}
/**
 * 开始观察元素变化
 * @returns void
 * @description 使用 ResizeObserver 和滚动事件监听元素变化
 */
function startObserving(): void {
  if (!popoverReferenceRef.value || resizeObserver) return;
  resizeObserver = new ResizeObserver(() => {
    if (!visible.value) return;
    calculatePosition();
  });
  resizeObserver.observe(popoverReferenceRef.value);
  if (popoverRef.value) {
    resizeObserver.observe(popoverRef.value);
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
}
/**
 * 停止观察元素变化
 * @returns void
 * @description 停止 ResizeObserver 和滚动监听并释放资源
 */
function stopObserving(): void {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  window.removeEventListener("scroll", handleScroll);
  if (scrollRafId) {
    cancelAnimationFrame(scrollRafId);
    scrollRafId = null;
  }
}
/**
 * 处理点击事件
 * @param e - 点击事件对象
 * @returns void
 * @description 处理点击参考元素的事件，触发弹窗显示或隐藏
 */
function handleClick(e: MouseEvent): void {
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
 * @returns void
 * @description 处理鼠标进入参考元素的事件
 */
function handleMouseEnter(): void {
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
 * @returns void
 * @description 处理鼠标离开参考元素的事件
 */
function handleMouseLeave(): void {
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
 * @returns void
 * @description 处理鼠标进入弹窗的事件，取消隐藏定时器
 */
function handlePopoverEnter(): void {
  if (props.trigger !== "hover") return;
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
}
/**
 * 处理弹窗鼠标离开事件
 * @returns void
 * @description 处理鼠标离开弹窗的事件，启动隐藏定时器
 */
function handlePopoverLeave(): void {
  if (props.trigger !== "hover") return;
  hoverTimer.value = setTimeout(() => {
    if (visible.value) {
      hidePopover();
    }
  }, 300);
}
/**
 * 显示弹窗
 * @returns void
 * @description 显示弹出框并计算位置
 */
function showPopover(): void {
  popoverStyle.value = { top: "auto", bottom: "auto", left: "auto", right: "auto" };
  popoverContentStyle.value = {};
  popoverArrowStyle.value = {};
  const position = getElementPosition(popoverReferenceRef.value);
  if (position) {
    visible.value = true;
    emits("change", true);
    nextTick(() => {
      calculatePosition();
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
 * @returns void
 * @description 隐藏弹出框并清理资源
 */
function hidePopover(): void {
  visible.value = false;
  emits("change", false);
  removeGlobalClickListener();
  stopObserving();
  if (typeof window !== "undefined" && window.PancakeGlobalConfig?.PopoverList?.[id.value]) {
    delete window.PancakeGlobalConfig.PopoverList[id.value];
  }
}
/**
 * 全局点击事件处理
 * @param event - 点击事件对象
 * @returns void
 * @description 处理全局点击事件，点击弹窗外部时关闭
 */
function handleGlobalClick(event: MouseEvent): void {
  if (!visible.value) return;
  const isClickOnReference = popoverReferenceRef.value && (popoverReferenceRef.value === event.target || popoverReferenceRef.value.contains(event.target as Node));
  const isClickOnPopover = popoverRef.value && (popoverRef.value === event.target || popoverRef.value.contains(event.target as Node));
  if (isClickOnReference || isClickOnPopover) {
    return;
  }
  hidePopover();
}
/**
 * 添加全局点击事件监听
 * @returns void
 * @description 添加全局点击事件监听器
 */
function addGlobalClickListener(): void {
  document.addEventListener("click", handleGlobalClick);
}
/**
 * 移除全局点击事件监听
 * @returns void
 * @description 移除全局点击事件监听器
 */
function removeGlobalClickListener(): void {
  document.removeEventListener("click", handleGlobalClick);
}
/**
 * 组件挂载生命周期
 * @description 组件挂载时设置渲染完成标识
 */
onMounted(() => {
  inRenderEnd.value = true;
});
/**
 * 组件卸载生命周期
 * @description 组件卸载时清理事件监听和定时器
 */
onBeforeUnmount(() => {
  removeGlobalClickListener();
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
  stopObserving();
  hidePopover();
});
/**
 * 监听 autoWidth 属性变化
 * @description 监听 autoWidth 属性变化并更新弹窗内容宽度
 */
watch(
  () => props.autoWidth,
  () => {
    if (popoverRef.value) {
      popoverContentStyle.value = getContentWidth();
    }
  }
);
/**
 * 监听 popoverWidth 属性变化
 * @description 监听 popoverWidth 属性变化并更新弹窗内容宽度
 */
watch(
  () => props.popoverWidth,
  () => {
    if (popoverRef.value) {
      popoverContentStyle.value = getContentWidth();
    }
  }
);
/**
 * 组件暴露方法
 * @description 暴露组件方法供外部调用
 */
defineExpose({ showPopover, hidePopover });
</script>

<style lang="scss">
@use "../styles/animation.scss";
@use "./index.scss";
</style>

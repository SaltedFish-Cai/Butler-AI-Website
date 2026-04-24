<template>
  <section
    :id="id"
    class="pa-scrollbar"
    :class="[prop.class, prop.styleMode === 'color' ? 'color-scrollbar' : '']"
    :style="{
      ...style,
      '--pa-size-padding_use': prop.paddingWidth
        ? typeof prop.paddingWidth === 'number'
          ? prop.paddingWidth + 'px'
          : prop.paddingWidth
        : ''
    }"
  >
    <div class="pa-scrollbar-content">
      <div v-if="useShadow" class="is-scroll-top" :style="{ opacity: scrollVerticalThumb > 5 ? '1' : '0' }"></div>
      <div
        :id="id + '_scrollbar_body'"
        class="scrollbar-body"
        :class="{ 'scrollbar-body-y': prop.useScrollY, 'scrollbar-body-x': prop.useScrollX }"
        :style="{ ...contentStyle }"
        ref="scrollbarBodyRef"
      >
        <div
          class="scrollbar-body-content"
          :class="{
            'padding-top': padding?.includes('top') || padding?.includes('all'),
            'padding-left': padding?.includes('left') || padding?.includes('all'),
            'padding-bottom': padding?.includes('bottom') || padding?.includes('all'),
            'padding-right': padding?.includes('right') || padding?.includes('all')
          }"
          :style="{
            '--border-padding-top':
              padding?.includes('top') || padding?.includes('all') ? `var(--pa-size-padding_use, 10px)` : '',
            '--border-padding-left':
              padding?.includes('left') || padding?.includes('all') ? `var(--pa-size-padding_use, 10px)` : '',
            '--border-padding-bottom':
              padding?.includes('bottom') || padding?.includes('all') ? `var(--pa-size-padding_use, 10px)` : '',
            '--border-padding-right':
              padding?.includes('right') || padding?.includes('all') ? `var(--pa-size-padding_use, 10px)` : ''
          }"
          ref="scrollbarBodyContentRef"
        >
          <div v-if="border?.includes('top') || border?.includes('all')" class="pa-border_top"></div>
          <div v-if="border?.includes('left') || border?.includes('all')" class="pa-border_left"></div>
          <div v-if="border?.includes('bottom') || border?.includes('all')" class="pa-border_bottom"></div>
          <div v-if="border?.includes('right') || border?.includes('all')" class="pa-border_right"></div>
          <div v-if="paddingBorder?.includes('top') || paddingBorder?.includes('all')" class="pa-border_padding_top"></div>
          <div v-if="paddingBorder?.includes('left') || paddingBorder?.includes('all')" class="pa-border_padding_left"></div>
          <div v-if="paddingBorder?.includes('bottom') || paddingBorder?.includes('all')" class="pa-border_padding_bottom"></div>
          <div v-if="paddingBorder?.includes('right') || paddingBorder?.includes('all')" class="pa-border_padding_right"></div>
          <slot></slot>
        </div>
      </div>
      <div v-if="useShadow" class="is-scroll-end" :style="{ opacity: !isScrollEnd ? '1' : '0' }"></div>
    </div>
    <div v-if="useVertical && prop.useScrollY && prop.showThumb" class="scrollbar__bar is-vertical">
      <div class="scrollbar__thumb" ref="verticalThumbRef" :style="{ height: verticalThumb + 'px' }"></div>
    </div>
    <div v-if="useHorizontal && prop.useScrollX && prop.showThumb" class="scrollbar__bar is-horizontal">
      <div class="scrollbar__thumb" ref="horizontalThumbRef" :style="{ width: horizontalThumb + 'px' }"></div>
    </div>
    <pa-icon
      v-if="useBackTop && prop.useScrollY"
      :style="{ opacity: scrollVerticalValue > 10 ? '1' : '0', right: `${scrollVerticalValue > 10 ? '24px' : '-20px'}` }"
      name="arow_to_up_line"
      class="pa-scrollbar-back-top m-hand"
      @click="setScrollTop(0)"
    />
    <div v-if="$slots['footer']" class="pa-scrollbar-content_footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, Ref, onMounted, onBeforeUnmount, nextTick, watch, provide } from "vue";

/**
 * **模块导入**
 * @description 导入随机字符生成工具
 * */
import { randChar } from "../tools/rand-char";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps } from "./types";

/**
 * **模块导入**
 * @description 导入滚动监听相关工具
 * */
import { startDrag, listenElementScroll, observeElementResize, ScrollUserInfo } from "./scrollListener";

/**
 * **模块导入**
 * @description 导入交叉观察器工具
 * */
import { useIntersectionObserver } from "./useIntersectionObserver";

/**
 * **模块导入**
 * @description 导入元素位置计算工具
 * */
import { getElementPosition } from "../utils/getElementPosition";

/**
 * **模块导入**
 * @description 导入 lodash 工具库
 * */
import _ from "lodash";
const { debounce } = _;

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits([
  "renderEnd",
  "bodySizeXChange",
  "bodySizeYChange",
  "scroll",
  "scrollEnd",
  "scrollStart",
  "scrollLeft",
  "scrollRight",
  "intersecting",
  "directlyScroll",
  "scrollChildChange",
  "directlyScrollEnd",
  "directlyScrollStart",
  "directlyScrollLeft",
  "directlyScrollRight"
]);

/**
 * **滚动条主体引用**
 * @type `Ref<HTMLElement | undefined>`
 * @description 滚动条主体 DOM 引用
 * */
const scrollbarBodyRef = ref();

/**
 * **滚动条内容引用**
 * @type `Ref<HTMLElement | undefined>`
 * @description 滚动条内容 DOM 引用
 * */
const scrollbarBodyContentRef = ref();

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const prop = withDefaults(defineProps<ComponentProps>(), {
  useShadow: true,
  useBackTop: true,
  useScrollY: true,
  useScrollX: true,
  showThumb: true,
  useClosePopover: true,
  styleMode: "default",
  defaultScrollHorizontalThumb: 0,
  defaultScrollVerticalThumb: 0,
  paddingWidth: "var(--pa-size-padding, 10px)"
});

/**
 * **组件唯一标识**
 * @type `Ref<string>`
 * @description 组件的唯一标识
 * */
const id = ref(randChar());

/**
 * **垂直滑块引用**
 * @type `Ref<HTMLElement | undefined>`
 * @description 垂直滚动条滑块 DOM 引用
 * */
const verticalThumbRef = ref();

/**
 * **水平滑块引用**
 * @type `Ref<HTMLElement | undefined>`
 * @description 水平滚动条滑块 DOM 引用
 * */
const horizontalThumbRef = ref();

/**
 * **垂直滚动值**
 * @type `Ref<number>`
 * @description 垂直滚动位置值
 * */
const scrollVerticalValue = ref(0);

/**
 * **水平滚动值**
 * @type `Ref<number>`
 * @description 水平滚动位置值
 * */
const scrollHorizontalValue = ref(0);

/**
 * **是否滚动到底部**
 * @type `Ref<boolean>`
 * @description 标识是否已滚动到底部
 * */
const isScrollEnd = ref(true);

/**
 * **移除监听函数**
 * @type `Function | undefined`
 * @description 移除滚动监听的函数
 * */
let removeListen: (() => void) | undefined;

/**
 * **更新监听函数**
 * @type `Function | undefined`
 * @description 更新滚动监听的函数
 * */
let updateListen: (parentBoxRef: HTMLElement | undefined) => ScrollUserInfo;

/**
 * **垂直滑块缩放比例**
 * @type `number`
 * @description 垂直滚动条滑块缩放比例
 * */
let _verticalThumbScale = 1;

/**
 * **水平滑块缩放比例**
 * @type `number`
 * @description 水平滚动条滑块缩放比例
 * */
let _horizontalThumbScale = 1;

/**
 * **垂直拖拽控制器**
 * @type `any`
 * @description 垂直滚动条拖拽控制器
 * */
let verticalDragController: any;

/**
 * **水平拖拽控制器**
 * @type `any`
 * @description 水平滚动条拖拽控制器
 * */
let horizontalDragController: any;

/**
 * **水平滑块高度**
 * @type `Ref<number>`
 * @description 水平滚动条滑块高度
 * */
const horizontalThumb = ref(0);

/**
 * **垂直滑块高度**
 * @type `Ref<number>`
 * @description 垂直滚动条滑块高度
 * */
const verticalThumb = ref(0);

/**
 * **水平滑块位置**
 * @type `Ref<number>`
 * @description 水平滚动条滑块位置
 * */
const scrollHorizontalThumb = ref(prop.defaultScrollHorizontalThumb);

/**
 * **垂直滑块位置**
 * @type `Ref<number>`
 * @description 垂直滚动条滑块位置
 * */
const scrollVerticalThumb = ref(prop.defaultScrollVerticalThumb);

/**
 * **监听器实例**
 * @type `Ref<any>`
 * @description 滚动监听器实例
 * */
const listener = ref();

/**
 * **是否使用水平滚动**
 * @type `Ref<boolean>`
 * @description 标识是否启用水平滚动
 * */
const useHorizontal = ref(false);

/**
 * **是否使用垂直滚动**
 * @type `Ref<boolean>`
 * @description 标识是否启用垂直滚动
 * */
const useVertical = ref(false);

/**
 * **滚动主体高度**
 * @type `Ref<number>`
 * @description 滚动主体的高度值
 * */
const scrollBodyHeight = ref(0);

/**
 * **交叉观察列表**
 * @type `Ref<Array<{ isIntersecting: Ref<boolean>; stopObserving: () => void; el: Element }>>`
 * @description 交叉观察器列表
 * */
const isIntersectingList = ref([] as unknown as Ref<{ isIntersecting: Ref<boolean>; stopObserving: () => void; el: Element }[]>);

/**
 * **组件挂载生命周期**
 * @description 初始化滚动监听
 * */
onMounted(() => {
  nextTick(() => {
    const {
      listener: listenerVal,
      bodyHeight,
      bodyWidth,
      remove,
      update,
      useHorizontal: useHorizontalValue,
      useVertical: useVerticalValue
    } = listenElementScroll(
      scrollbarBodyRef.value,
      scrollData => {
        if (!useVertical.value && !useHorizontal.value) {
          return;
        }
        emits("scroll", { scrollTop: scrollData.scrollTop, scrollLeft: scrollData.scrollLeft });
        if (scrollData.isAtBottom) {
          isScrollEnd.value = true;
          emits("scrollEnd", true);
        } else {
          isScrollEnd.value = false;
          emits("scrollEnd", false);
        }
        if (scrollData.isAtTop) {
          emits("scrollStart", true);
        } else {
          emits("scrollStart", false);
        }
        if (scrollData.isAtLeft) {
          emits("scrollLeft", true);
        } else {
          emits("scrollLeft", false);
        }
        if (scrollData.isAtRight) {
          emits("scrollRight", true);
        } else {
          emits("scrollRight", false);
        }
        if (
          Object.keys((typeof window !== "undefined" && window.PancakeGlobalConfig?.PopoverList) || {}).length &&
          prop.useClosePopover
        ) {
          Object.values((typeof window !== "undefined" && window.PancakeGlobalConfig.PopoverList) || {}).forEach((item: any) =>
            item?.()
          );
        }
      },
      ({ scrollTop, scrollLeft, scrollData }) => {
        scrollVerticalValue.value = scrollTop;
        scrollHorizontalValue.value = scrollLeft;
        const scrollVerticalThumbValue = prop.defaultScrollVerticalThumb + scrollTop * _verticalThumbScale;
        const scrollHorizontalThumbValue = prop.defaultScrollHorizontalThumb + scrollLeft * _horizontalThumbScale;
        horizontalThumbRef.value &&
          (horizontalThumbRef.value.style.transform = `translateX(${scrollHorizontalThumbValue}px) translateZ(1px)`);
        verticalThumbRef.value &&
          (verticalThumbRef.value.style.transform = `translateY(${scrollVerticalThumbValue}px) translateZ(1px)`);
        scrollVerticalThumb.value = scrollVerticalThumbValue;
        scrollHorizontalThumb.value = scrollHorizontalThumbValue;
        const scrollDirectionY = scrollTop > scrollVerticalThumbValue ? "down" : "up";
        const scrollDirectionX = scrollLeft > scrollHorizontalThumbValue ? "right" : "left";
        if (scrollData.isAtBottom) {
          emits("directlyScrollEnd", true);
        } else {
          emits("directlyScrollEnd", false);
        }
        if (scrollData.isAtTop) {
          emits("directlyScrollStart", true);
        } else {
          emits("directlyScrollStart", false);
        }
        if (scrollData.isAtLeft) {
          emits("directlyScrollLeft", true);
        } else {
          emits("directlyScrollLeft", false);
        }
        if (scrollData.isAtRight) {
          emits("directlyScrollRight", true);
        } else {
          emits("directlyScrollRight", false);
        }
        emits("directlyScroll", { ...scrollData, scrollTop, scrollLeft, scrollDirectionY, scrollDirectionX });
      },
      {
        debounceTime: 80,
        defaultScrollHorizontalThumb: prop.defaultScrollHorizontalThumb,
        defaultScrollVerticalThumb: prop.defaultScrollVerticalThumb
      }
    );
    listener.value = listenerVal;
    useHorizontal.value = useHorizontalValue;
    useVertical.value = useVerticalValue;
    updateListen = update;
    nextTick(() => {
      debounceSetUpdate();
    });
    const { stop } = observeElementResize(scrollbarBodyContentRef.value, () => {
      nextTick(() => {
        debounceSetUpdate();
      });
    });
    removeListen = () => {
      stop();
      remove();
    };
    nextTick(() => {
      emits("renderEnd", { bodyWidth, bodyHeight });
      if (prop.intersectClassName) {
        createObserver(prop.intersectClassName);
      }
    });
  });
});

/**
 * **创建观察器**
 * @param `intersectClassName` `string` 监听元素的类名
 * @description 创建交叉观察器监听指定元素
 * */
function createObserver(intersectClassName: string) {
  const Els = document.querySelectorAll(`${intersectClassName}`);
  if (Els.length) {
    for (let i = 0; i < Els.length; i++) {
      const el: Element = Els[i];
      const { isIntersecting, stopObserving } = useIntersectionObserver(el, {
        rootMargin: `0px 0px`,
        threshold: [1],
        root: scrollbarBodyRef.value
      });
      isIntersectingList.value.push({ isIntersecting: isIntersecting, stopObserving, el });
    }
  }
}

/**
 * **关闭观察器**
 * @description 关闭所有交叉观察器
 * */
function closeObserver() {
  if (isIntersectingList.value.length) {
    isIntersectingList.value.forEach((item: any) => {
      item.stopObserving();
    });
    isIntersectingList.value.length = 0;
  }
}

/**
 * **设置滚动左边距**
 * @param `value` `number` 滚动位置值
 * @param `callback` `() => void` 回调函数
 * @param `behavior` `ScrollBehavior` 滚动行为
 * @param `options` `{ offsetX?: number; offsetY?: number }` 偏移选项
 * @description 设置滚动条的水平位置
 * */
function setScrollLeft(
  value: number,
  callback?: () => void,
  behavior: ScrollBehavior = "smooth",
  { offsetX = 0, offsetY = 0 } = {}
) {
  listener.value.setElementScrollPosition(scrollbarBodyRef.value, { scrollLeft: value, behavior, callback, offsetX, offsetY });
}

/**
 * **设置滚动顶边距**
 * @param `value` `number` 滚动位置值
 * @param `callback` `() => void` 回调函数
 * @param `behavior` `ScrollBehavior` 滚动行为
 * @param `options` `{ offsetX?: number; offsetY?: number }` 偏移选项
 * @description 设置滚动条的垂直位置
 * */
function setScrollTop(
  value: number,
  callback?: () => void,
  behavior: ScrollBehavior = "smooth",
  { offsetX = 0, offsetY = 0 } = {}
) {
  listener.value.setElementScrollPosition(scrollbarBodyRef.value, { scrollTop: value, behavior, callback, offsetX, offsetY });
}

/**
 * **设置滚动到交叉位置**
 * @param `el` `Element` 目标元素
 * @param `callback` `() => void` 回调函数
 * @param `options` `{ offsetX?: number; offsetY?: number }` 偏移选项
 * @description 滚动到指定元素位置
 * */
function setScrollToIntersect(el: Element, callback?: () => void, { offsetX = 0, offsetY = 0 } = {}) {
  closeObserver();
  const rect = getElementPosition(el, scrollbarBodyContentRef.value);
  if (rect) {
    if (rect.parentTop !== null) {
      setScrollTop(
        0 - rect.parentTop - offsetY,
        () => {
          setTimeout(() => {
            if (rect.parentLeft !== null) {
              setScrollLeft(
                0 - rect.parentLeft - offsetX,
                () => {
                  if (prop.intersectClassName) {
                    createObserver(prop.intersectClassName);
                  }
                  callback?.();
                },
                "smooth",
                { offsetX, offsetY }
              );
            }
          }, 600);
        },
        "smooth",
        { offsetX, offsetY }
      );
    }
  }
}

provide("setScrollToIntersect", setScrollToIntersect);

/**
 * **重置观察器**
 * @description 重置交叉观察器
 * */
function resetObserver() {
  closeObserver();
  if (prop.intersectClassName) createObserver(prop.intersectClassName);
}

/**
 * **防抖更新函数**
 * @type `Function`
 * @description 防抖处理后的更新函数
 * */
const debounceSetUpdate = debounce(setUpdate, 110);

/**
 * **更新滚动状态**
 * @description 更新滚动条状态和尺寸
 * */
function setUpdate() {
  if (updateListen) {
    const {
      horizontalThumb: horizontalThumbVal,
      verticalThumb: verticalThumbVal,
      horizontalThumbScale,
      verticalThumbScale,
      useHorizontal: useHorizontalValue,
      useVertical: useVerticalValue
    } = updateListen(prop.parentBoxRef);
    horizontalThumb.value = horizontalThumbVal;
    verticalThumb.value = verticalThumbVal;
    _horizontalThumbScale = horizontalThumbScale;
    _verticalThumbScale = verticalThumbScale;
    useHorizontal.value = useHorizontalValue;
    useVertical.value = useVerticalValue;
    scrollBodyHeight.value = scrollbarBodyRef.value?.clientHeight;
    nextTick(() => {
      if (useVertical.value) {
        verticalDragController = startDrag(verticalThumbRef.value, scrollbarBodyRef.value, "vertical");
      } else {
        verticalDragController?.stop?.();
      }
      if (useHorizontal.value) {
        horizontalDragController = startDrag(horizontalThumbRef.value, scrollbarBodyRef.value, "horizontal");
      } else {
        horizontalDragController?.stop?.();
      }
      const _scrollbarBodyRef = scrollbarBodyRef.value;
      if (_scrollbarBodyRef && _scrollbarBodyRef.scrollWidth > _scrollbarBodyRef.clientWidth) {
        emits("scrollRight", false);
      }
      if (
        (_scrollbarBodyRef && _scrollbarBodyRef.scrollHeight > _scrollbarBodyRef.clientHeight) ||
        (prop.parentBoxRef && prop.parentBoxRef?.clientHeight < _scrollbarBodyRef.scrollHeight)
      ) {
        isScrollEnd.value = false;
      } else {
        isScrollEnd.value = true;
      }
      emits("scrollChildChange", {
        bodyWidth: _scrollbarBodyRef.clientWidth,
        bodyHeight: _scrollbarBodyRef.clientHeight,
        useScrollX: useHorizontal.value,
        useScrollY: useVertical.value
      });
    });
  }
}

/**
 * **组件卸载前生命周期**
 * @description 清理监听器和控制器
 * */
onBeforeUnmount(() => {
  closeObserver();
  removeListen?.();
  verticalDragController?.stop?.();
  horizontalDragController?.stop?.();
});

/**
 * **监听交叉观察列表**
 * @description 监听元素交叉状态变化
 * */
watch(
  () => isIntersectingList.value,
  newVal => {
    for (let i = 0; i < newVal.length; i++) {
      const isIntersecting = newVal[i].isIntersecting;
      const el = newVal[i].el;
      if (isIntersecting) {
        emits("intersecting", el);
      }
    }
  },
  { deep: true }
);

defineExpose({
  update: debounceSetUpdate,
  setScrollTop,
  setScrollLeft,
  setScrollToIntersect,
  resetObserver,
  bodyEl: scrollbarBodyRef
});
</script>

<style lang="scss">
@use "./index.scss";
</style>

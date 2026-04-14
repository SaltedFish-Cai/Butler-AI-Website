<template>
  <section
    :id="id"
    class="m-scrollbar-v2"
    :class="[prop.class, prop.styleMode === 'color' ? 'color-scrollbar' : '']"
    :style="{
      ...style,
      '--scroll-vertical-thumb': scrollVerticalThumb + 'px',
      '--scroll-horizontal-thumb': scrollHorizontalThumb + 'px',
      '--m-size-v2-padding-base': prop.paddingWidth
        ? typeof prop.paddingWidth === 'number'
          ? prop.paddingWidth + 'px'
          : prop.paddingWidth
        : ''
    }"
  >
    <div class="m-scrollbar-v2-content">
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
              padding?.includes('top') || padding?.includes('all') ? `var(--m-size-v2-padding-base, 10px)` : '',
            '--border-padding-left':
              padding?.includes('left') || padding?.includes('all') ? `var(--m-size-v2-padding-base, 10px)` : '',
            '--border-padding-bottom':
              padding?.includes('bottom') || padding?.includes('all') ? `var(--m-size-v2-padding-base, 10px)` : '',
            '--border-padding-right':
              padding?.includes('right') || padding?.includes('all') ? `var(--m-size-v2-padding-base, 10px)` : ''
          }"
          ref="scrollbarBodyContentRef"
        >
          <div v-if="border?.includes('top') || border?.includes('all')" class="m-border-v2_top"></div>
          <div v-if="border?.includes('left') || border?.includes('all')" class="m-border-v2_left"></div>
          <div v-if="border?.includes('bottom') || border?.includes('all')" class="m-border-v2_bottom"></div>
          <div v-if="border?.includes('right') || border?.includes('all')" class="m-border-v2_right"></div>

          <div v-if="paddingBorder?.includes('top') || paddingBorder?.includes('all')" class="m-border-v2_padding_top"></div>
          <div v-if="paddingBorder?.includes('left') || paddingBorder?.includes('all')" class="m-border-v2_padding_left"></div>
          <div
            v-if="paddingBorder?.includes('bottom') || paddingBorder?.includes('all')"
            class="m-border-v2_padding_bottom"
          ></div>
          <div v-if="paddingBorder?.includes('right') || paddingBorder?.includes('all')" class="m-border-v2_padding_right"></div>
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
    <!-- back-top-icon -->
    <m-icon-v2
      v-if="useBackTop && prop.useScrollY"
      :style="{ opacity: scrollVerticalValue > 10 ? '1' : '0', right: `${scrollVerticalValue > 10 ? '24px' : '-20px'}` }"
      name="arow_to_up_line"
      class="m-scrollbar-v2-back-top m-hand"
      @click="setScrollTop(0)"
    />
    <div v-if="$slots['footer']" class="m-scrollbar-v2-content_footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script lang="ts" setup>
// # import
import { ref, Ref, onMounted, onBeforeUnmount, nextTick, watch, provide, computed } from "vue";
import { randChar } from "../tools/rand-char";
import { ScrollbarV2Type } from "./type";
import { startDrag, listenElementScroll, observeElementResize } from "./scrollListener";
import { useIntersectionObserver } from "../m-scrollbar-list/useIntersectionObserver";
import { getElementPosition } from "../utils/getElementPosition";
import { debounce, isNil } from "lodash";

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
const scrollbarBodyRef = ref();
const scrollbarBodyContentRef = ref();
const prop = withDefaults(defineProps<ScrollbarV2Type>(), {
  useScrollY: true,
  useScrollX: true,
  showThumb: true,
  useClosePopover: true,
  styleMode: "default",
  defaultScrollHorizontalThumb: 0,
  defaultScrollVerticalThumb: 0,
  useBackTop: undefined,
  useShadow: undefined,
  paddingWidth: "var(--m-component-padding-size, 10px)"
});
const id = ref(randChar());
const verticalThumbRef = ref();
const horizontalThumbRef = ref();

// const mScrollbarRef = ref();

const scrollVerticalValue = ref(0);
const scrollHorizontalValue = ref(0);
const isScrollEnd = ref(true);

let removeListen;
let updateListen;
let _verticalThumbScale = 1;
let _horizontalThumbScale = 1;

let verticalDragController;
let horizontalDragController;

const horizontalThumb = ref(0);
const verticalThumb = ref(0);
const scrollHorizontalThumb = ref(prop.defaultScrollHorizontalThumb);
const scrollVerticalThumb = ref(prop.defaultScrollVerticalThumb);
const listener = ref();
const useHorizontal = ref(false);
const useVertical = ref(false);
const scrollBodyHeight = ref(0);

const isIntersectingList = ref([] as unknown as Ref<{ isIntersecting: Ref<boolean>; stopObserving: () => void; el: Element }[]>);

const useShadow = computed(() => {
  if (!isNil(prop.useShadow)) {
    return prop.useShadow;
  }
  return prop.styleMode !== "color";
});
const useBackTop = computed(() => {
  if (!isNil(prop.useBackTop)) {
    return prop.useBackTop;
  }
  return prop.styleMode !== "color";
});

// # onMounted
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
        // console.log("滚动位置:", scrollData.scrollTop);
        // console.log("滚动方向:", scrollData.scrollDirectionY);
        // console.log("滚动方向:", scrollData.scrollDirectionX);
        // console.log("是否到底部:", scrollData.isAtBottom);
        if (!useVertical.value && !useHorizontal.value) {
          return;
        }

        emits("scroll", {
          scrollTop: scrollData.scrollTop,
          scrollLeft: scrollData.scrollLeft
        });

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

        // 关闭所有popover
        if (Object.keys(window.ManagerGlobalConfig?.PopoverList || {}).length && prop.useClosePopover) {
          Object.values(window.ManagerGlobalConfig.PopoverList || {}).forEach((item: any) => item?.());
        }
      },
      ({ scrollTop, scrollLeft, scrollData }) => {
        const scrollDirectionY = scrollTop > scrollVerticalValue.value ? "down" : "up";
        const scrollDirectionX = scrollLeft > scrollHorizontalValue.value ? "right" : "left";

        scrollVerticalValue.value = scrollTop;
        scrollHorizontalValue.value = scrollLeft;
        scrollVerticalThumb.value = prop.defaultScrollVerticalThumb + scrollTop * _verticalThumbScale;
        scrollHorizontalThumb.value = prop.defaultScrollHorizontalThumb + scrollLeft * _horizontalThumbScale;
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

        emits("directlyScroll", { scrollTop, scrollLeft, scrollDirectionY, scrollDirectionX });
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

    // 开始监听元素尺寸变化
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

  // watchDom();
  // if (window.MScrollbarObject) {
  //   window.MScrollbarObject[id.value] = mScrollbarRef.value;
  // } else {
  //   window.MScrollbarObject = {};
  //   window.MScrollbarObject[id.value] = mScrollbarRef.value;
  // }
  // if (!window.MScrollbarToError) {
  //   window.MScrollbarToError = () => {
  //     if (window.MScrollbarObject) {
  //       for (const key in window.MScrollbarObject) {
  //         const errorElBox = document.querySelector(`#${key}`);
  //         const errorEl = document.querySelector(`#${key} .el-form-item.is-error`);
  //         const errorElBoxRect = errorElBox?.getBoundingClientRect?.();
  //         const errorElRect = errorEl?.getBoundingClientRect?.();
  //         if (errorEl && errorElBoxRect && errorElRect) {
  //           window.MScrollbarObject[key]?.scrollTo({
  //             top: errorElRect.top - (errorElBoxRect.top - scrollValue.value),
  //             behavior: "smooth"
  //           });
  //         }
  //       }
  //     }
  //   };
  // }
  // console.dir(mScrollbarRef.value?.wrapRef);
  // emits("bodyHeight", mScrollbarRef.value?.wrapRef?.clientHeight - 1);
});

// # Function 开始监听
function createObserver(intersectClassName: string) {
  const Els = document.querySelectorAll(`${intersectClassName}`);
  if (Els.length) {
    for (let i = 0; i < Els.length; i++) {
      const el: Element = Els[i];
      const { isIntersecting, stopObserving } = useIntersectionObserver(el, {
        // 配置选项
        rootMargin: `0px 0px`,
        // threshold: [0, 0.25, 0.5, 0.75, 1],
        threshold: [1],
        root: scrollbarBodyRef.value // 使用视窗作为根元素
      });
      isIntersectingList.value.push({ isIntersecting: isIntersecting, stopObserving, el });
    }
  }
}

// # Function 关闭监听
function closeObserver() {
  if (isIntersectingList.value.length) {
    isIntersectingList.value.forEach((item: any) => {
      item.stopObserving();
    });
    isIntersectingList.value.length = 0;
  }
}

// # Function 设置左距离
function setScrollLeft(
  value: number,
  callback?: () => void,
  behavior: ScrollBehavior = "smooth",
  { offsetX = 0, offsetY = 0 } = {}
) {
  listener.value.setElementScrollPosition(scrollbarBodyRef.value, { scrollLeft: value, behavior, callback, offsetX, offsetY });
}

// # Function 设置高距离
function setScrollTop(
  value: number,
  callback?: () => void,
  behavior: ScrollBehavior = "smooth",
  { offsetX = 0, offsetY = 0 } = {}
) {
  listener.value.setElementScrollPosition(scrollbarBodyRef.value, { scrollTop: value, behavior, callback, offsetX, offsetY });
}

// # Function 设置元素到相交位置
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

function resetObserver() {
  closeObserver();
  if (prop.intersectClassName) createObserver(prop.intersectClassName);
}

// # Function 更新
const debounceSetUpdate = debounce(setUpdate, 110);
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
      // 启动垂直滑块拖拽
      if (useVertical.value) {
        verticalDragController = startDrag(verticalThumbRef.value, scrollbarBodyRef.value, "vertical");
      } else {
        verticalDragController?.stop?.();
      }

      // 启动水平滑块拖拽
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
      }

      emits("scrollChildChange", { bodyWidth: _scrollbarBodyRef.clientWidth, bodyHeight: _scrollbarBodyRef.clientHeight });
    });
  }
}

onBeforeUnmount(() => {
  closeObserver();
  removeListen();
  verticalDragController?.stop?.();
  horizontalDragController?.stop?.();
});

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

// if (!prop.useScrollY) {
//   watch(
//     () => injectScrollVerticalThumb,
//     newVal => {
//       if (prop.parentBodyTopValue) {
//         const val = prop.parentBodyTopValue * inject_verticalThumbScale.value;
//         if (prop.parentBodyTopValue && newVal.value > val) {
//           // setScrollTop((newVal.value - val) / inject_verticalThumbScale.value, undefined, "instant");
//           console.log("===========> ", (newVal.value - val) / inject_verticalThumbScale.value);
//           scrollbarBodyRef.value.scrollTop = (newVal.value - val) / inject_verticalThumbScale.value;
//         }
//       }
//     },
//     { deep: true }
//   );
// }

// if (!prop.useScrollX) {
//   watch(
//     () => injectScrollHorizontalThumb,
//     newVal => {
//       console.log("===========> newVal", newVal);
//     },
//     { deep: true }
//   );
// }

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

<template>
  <div
    :class="[props.class, `pa-tabs-mode-${mode}`, `pa-tabs-style_mode-${styleMode}`, `pa-tabs-style_align-${align}`]"
    :style="{
      ...props.style,
      '--pa-tabs-label-left': useLabelLeft - headerScroll + 'px',
      '--pa-tabs-label-width': useLabelWidth + 'px'
    }"
    :id="tabsId"
    ref="tabsRef"
  >
    <div :class="['pa-tabs-content', mode === 'portrait' || mode === 'slider' ? 'flex' : 'flex-col']">
      <div
        :class="['pa-tabs-header', useHeaderLine ? 'pa-tabs-header_line' : '']"
        :style="{ '--tab-header-over-width': overFixWidth + 'px' }"
      >
        <div v-if="$slots['HeaderLeft']" style="margin-right: calc(var(--pa-size-padding, 10px) / 2)">
          <slot name="HeaderLeft"></slot>
        </div>
        <pa-icon
          v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')"
          :class="['icons', 'top-icon', headerScroll === 0 ? 'disabled' : '']"
          name="up_small_fill"
          @click="minusScroll"
        />
        <pa-icon
          v-else-if="useScrollX > 0"
          :class="['icons', 'left-icon', headerScroll === 0 ? 'disabled' : '']"
          name="left_small"
          @click="minusScroll"
        />

        <div
          class="pa-tabs-title-list"
          :id="tabsId + '-tab-titles'"
          ref="tabsTitleRef"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div
            :id="'pa-tabs-box_' + tabsId"
            class="pa-tabs-box"
            :class="[mode === 'portrait' || mode === 'slider' ? 'flex-col' : '']"
            :style="{ '--tab-header-scroll': '-' + headerScroll + 'px' }"
          >
            <title-item
              :slots="slotsTitle"
              :activeName="activeName"
              :changeTabs="changeTabs"
              :portrait="mode === 'portrait' || mode === 'slider'"
            ></title-item>
          </div>
        </div>

        <pa-icon
          v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')"
          :class="['icons', 'down-icon', headerScrollEnd ? 'disabled' : '']"
          name="down_small"
          @click="addScroll"
        />
        <pa-icon
          v-else-if="useScrollX > 0"
          :class="['icons', 'right-icon', headerScrollEnd ? 'disabled' : '']"
          name="right_small_fill"
          @click="addScroll"
        />

        <div v-if="$slots['HeaderRight']" class="ml5"><slot name="HeaderRight"></slot></div>
      </div>

      <div v-if="mode === 'slider'" class="pa-tabs-scroll">
        <slot name="afterLabel"></slot>

        <div :id="tabsId + '-tab-contents-slider'" class="pa-tabs-contents">
          <pa-scrollbar ref="mScrollRef" :intersectClassName="'.tab-item_line_' + tabsId" @intersecting="handleIntersecting">
            <slot></slot>
          </pa-scrollbar>
        </div>
      </div>
      <div v-else class="pa-tabs-scroll">
        <slot name="afterLabel"></slot>

        <div
          :id="tabsId + '-tab-contents'"
          class="pa-tabs-contents"
          :style="{ position: 'relative', left: `-${visibleMode == 'visible' ? slotIndex : 0}00%` }"
        >
          <slot></slot>
        </div>
      </div>

      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, onMounted, onUnmounted, useSlots, watch, nextTick, provide, computed } from "vue";
/**
 * **模块导入**
 * @description 导入随机字符生成工具
 * */
import { randChar } from "../tools/rand-char";
/**
 * **模块导入**
 * @description 导入标签页标题子组件
 * */
import titleItem from "./pa-tabs-label.vue";
/**
 * **模块导入**
 * @description 导入组件属性和事件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * **模块导入**
 * @description 导入浏览器环境判断工具
 * */
import inBrowser from "../tools/inBrowser";
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
/**
 * **解构赋值**
 * @description 从 lodash 中解构出 debounce 函数
 * */
const { debounce } = _;

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  visibleMode: "visible",
  mode: "default",
  styleMode: "card",
  align: "default",
  useShadow: true
});

/**
 * **随机 ID**
 * @type {string}
 * @description 生成组件唯一标识
 * */
const randId = String(randChar());
/**
 * **标签页容器引用**
 * @type {Ref<any>}
 * @description 标签页容器的 DOM 引用
 * */
const tabsRef: any = ref();
/**
 * **标签页标题容器引用**
 * @type {Ref<any>}
 * @description 标签页标题区域的 DOM 引用
 * */
const tabsTitleRef = ref();
/**
 * **插槽数据**
 * @type {Ref<any>}
 * @description 存储子组件插槽信息
 * */
const slots: any = ref({});
/**
 * **溢出固定宽度**
 * @type {Ref<number>}
 * @description 标签页标题溢出时的固定宽度
 * */
const overFixWidth = ref(0);
/**
 * **默认插槽**
 * @type {ReturnType<typeof useSlots>['default']}
 * @description 获取默认插槽内容
 * */
const defaultSlot = useSlots().default;
/**
 * **标题插槽列表**
 * @type {Ref<Array<Record<string, Record<string, string>>>}
 * @description 存储所有标签页标题的插槽数据
 * */
const slotsTitle = ref([] as Array<Record<string, Record<string, string>>>);
/**
 * **当前插槽索引**
 * @type {Ref<number>}
 * @description 当前激活的标签页索引
 * */
const slotIndex = ref(0);
/**
 * **标签页 ID**
 * @type {Ref<string>}
 * @description 组件实例的唯一标识
 * */
const tabsId = ref(randId);
/**
 * **水平滚动位置**
 * @type {Ref<number>}
 * @description 标签页水平滚动距离
 * */
const useScrollX = ref(0);
/**
 * **垂直滚动位置**
 * @type {Ref<number>}
 * @description 标签页垂直滚动距离
 * */
const useScrollY = ref(0);
/**
 * **标题滚动位置**
 * @type {Ref<number>}
 * @description 标题区域的滚动偏移量
 * */
const headerScroll = ref(0);
/**
 * **标题滚动结束标志**
 * @type {Ref<boolean>}
 * @description 标题区域是否滚动到末尾
 * */
const headerScrollEnd = ref(false);
/**
 * **当前激活标签名**
 * @type {Ref<string>}
 * @description 当前选中标签页的标识
 * */
const activeName = ref("");
/**
 * **标签左侧位置**
 * @type {Ref<number>}
 * @description 激活标签的左侧位置
 * */
const useLabelLeft = ref(0);
/**
 * **标签宽度**
 * @type {Ref<number>}
 * @description 激活标签的宽度
 * */
const useLabelWidth = ref(0);
/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emit = defineEmits<ComponentEmits>();

/**
 * **防抖函数**
 * @description 防抖处理标签页尺寸计算
 * */
const _debounce = debounce(setTabsBoxSize, 10, { trailing: true });

/**
 * **标题防抖函数**
 * @description 防抖处理标题数据更新
 * */
const _debounceTitle = debounce(
  () => {
    createSlotData(true);
  },
  500,
  { trailing: true }
);

/**
 * **DOM 观察器**
 * @type {MutationObserver | undefined}
 * @description 监听 DOM 变化的观察器实例
 * */
let observer: MutationObserver | undefined;
/**
 * **标题容器尺寸**
 * @type {{ scrollWidth: number; clientWidth: number; scrollHeight: number; clientHeight: number }}
 * @description 标题区域的滚动尺寸信息
 * */
let tabsTitle: {
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
} = {
  scrollWidth: 0,
  clientWidth: 0,
  scrollHeight: 0,
  clientHeight: 0
};

/**
 * **滚动容器引用**
 * @type {Ref<any>}
 * @description 滚动容器的 DOM 引用
 * */
const mScrollRef = ref();

provide(
  "TabsContext",
  computed(() => ({
    mode: props.mode,
    tabsId: tabsId.value,
    activeName: activeName.value
  }))
);

provide("initTitle", () => {
  _debounceTitle();
});

/**
 * **组件挂载生命周期**
 * @description 初始化组件状态
 * */
onMounted(() => {
  createSlotData();
  const defaultValue = props.modelValue;
  observer?.disconnect && observer?.disconnect();
  nextTick(() => {
    watchDom();
    if (props.mode === "slider") {
      changeTabs(defaultValue, 0);
    }
  });
});

/**
 * **组件卸载生命周期**
 * @description 清理观察器和事件监听
 * */
onUnmounted(() => {
  observer?.disconnect && observer?.disconnect();
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.removeEventListener("wheel", handleWheel);
  }
});

/**
 * **变更 Tab**
 * @param `name` `string` 标签页标识
 * @param `index` `number` 标签页索引
 * @param `scrollToIntersect` `boolean` 是否滚动到可见区域
 * @returns `void`
 * @description 切换当前激活的标签页
 * */
function changeTabs(name, index, scrollToIntersect = true) {
  slotIndex.value = index;
  activeName.value = name;
  emit("update:modelValue", name);
  emit("tabChange", name, index);

  if (props.mode === "slider" && scrollToIntersect) {
    const targetEl = document.querySelector(`#${tabsId.value} #${tabsId.value}-${name}`);
    if (targetEl) mScrollRef.value?.setScrollToIntersect(targetEl);
  }
  setTabItemPosition();
}

/**
 * **更新 Tab 按钮位置**
 * @returns `void`
 * @description 计算并更新当前激活标签的位置
 * */
function setTabItemPosition() {
  nextTick(() => {
    const targetEl = document.querySelector(`#${tabsId.value} .pa-tabs-title_action_${tabsId.value}`);
    const parentElement = document.querySelector(`#${tabsId.value} #pa-tabs-box_${tabsId.value}`);
    if (targetEl && parentElement) {
      const data = getElementPosition(targetEl, parentElement as HTMLElement);
      if ((props.mode == "portrait" || props.mode == "slider") && data?.parentTop && data?.height) {
        const { scrollHeight, clientHeight } = tabsTitle;
        const chr = 0 - data.parentTop - clientHeight / 2 + data.height / 2;
        headerScroll.value = chr <= 0 ? 0 : chr > scrollHeight - clientHeight ? scrollHeight - clientHeight : chr;
      } else if (data?.parentLeft && data?.width) {
        const { scrollWidth, clientWidth } = tabsTitle;
        const chr = 0 - data.parentLeft - clientWidth / 2 + data.width / 2;
        headerScroll.value = chr <= 0 ? 0 : chr > scrollWidth - clientWidth ? scrollWidth - clientWidth : chr;
      }
    }
  });
}

/**
 * **初始化 Slot 数据**
 * @param `Mandatory` `boolean` 是否强制更新
 * @returns `void`
 * @description 解析插槽内容生成标签页数据
 * */
function createSlotData(Mandatory = false) {
  if (tabsRef.value) {
    if (defaultSlot) {
      slots.value = defaultSlot();
    }

    const arr: any = [];
    function setChild(arrayData) {
      for (let index = 0; index < arrayData.length; index++) {
        const element = arrayData[index];
        if (element.props) {
          arr.push(element);
        } else if (String(element.type) == "Symbol(v-fgt)" && !!element.children?.length) {
          setChild(element.children);
        } else if (element.type?.__file?.includes("pa-tabs-item-")) {
          const component = element.type.render(
            { ...element.ctx, $t: window.$t },
            {},
            {},
            element.type.setup(
              {},
              {
                expose: () => ({})
              }
            )
          );
          arr.push(component);
        }
      }
    }
    setChild(slots.value);

    if (arr.length != slotsTitle.value.length || Mandatory) {
      slotsTitle.value = arr;
      const _index = slotsTitle.value.findIndex(item => item?.props?.name == props.modelValue);
      slotIndex.value = _index < 0 ? 0 : _index;
      const name = slotsTitle.value[slotIndex.value]?.props?.name;
      activeName.value = name;
      emit("update:modelValue", name);
      _debounce();
    }
  }
}

/**
 * **监听元素节点**
 * @returns `void`
 * @description 使用 MutationObserver 监听 DOM 变化
 * */
function watchDom() {
  if (tabsRef.value) {
    const config = { childList: true, subtree: true };

    observer = new MutationObserver(() => createSlotData());

    observer.observe(tabsRef.value, config);
  }
}

/**
 * **设置 Tabs 标题宽度**
 * @returns `void`
 * @description 计算并更新标签标题区域的滚动信息
 * */
function setTabsBoxSize() {
  if (!inBrowser) return;
  nextTick(() => {
    const tabId = tabsRef?.value?.id;
    const _id = `${tabId}-tab-titles`;
    const tabsTitleEl = typeof window !== "undefined" && window.document?.getElementById(_id);
    if (tabsTitleEl) {
      tabsTitle = {
        scrollWidth: tabsTitleEl.scrollWidth,
        clientWidth: tabsTitleEl.clientWidth,
        scrollHeight: tabsTitleEl.scrollHeight,
        clientHeight: tabsTitleEl.clientHeight
      };
      useScrollX.value = tabsTitleEl.scrollWidth - tabsTitleEl.clientWidth;
      useScrollY.value = tabsTitleEl.scrollHeight - tabsTitleEl.clientHeight;
    }
  });
}

/**
 * **处理滚动到可见区域**
 * @param `el` `HTMLElement` 可见区域元素
 * @returns `void`
 * @description 当标签页滚动到可见区域时切换标签
 * */
function handleIntersecting(el) {
  const name = el?.dataset?.name;
  if (name) {
    changeTabs(
      name,
      slotsTitle.value.findIndex(item => item?.props?.name == name),
      false
    );
  }
}

/**
 * **超出标题（左/上）**
 * @returns `void`
 * @description 标题区域向左或向上滚动
 * */
function minusScroll() {
  const chr = headerScroll.value - 50;
  headerScroll.value = chr <= 0 ? 0 : chr;
  headerScrollEnd.value = false;
}

/**
 * **超出标题（右/下）**
 * @returns `void`
 * @description 标题区域向右或向下滚动
 * */
function addScroll() {
  if (props.mode == "portrait" || props.mode == "slider") {
    const { scrollHeight, clientHeight } = tabsTitle;
    const chr = headerScroll.value + 50;
    if (chr >= scrollHeight - clientHeight) {
      headerScroll.value = scrollHeight - clientHeight;
      headerScrollEnd.value = true;
    } else {
      headerScroll.value = chr;
      headerScrollEnd.value = false;
    }
  } else {
    const { scrollWidth, clientWidth } = tabsTitle;
    const chr = headerScroll.value + 50;
    if (chr >= scrollWidth - clientWidth) {
      headerScroll.value = scrollWidth - clientWidth;
      headerScrollEnd.value = true;
    } else {
      headerScroll.value = chr;
      headerScrollEnd.value = false;
    }
  }
}

/**
 * **滚轮事件时间戳**
 * @type {number}
 * @description 上一次滚轮事件的时间戳
 * */
let lastWheelTime = 0;

/**
 * **滚轮事件累积滚动量**
 * @type {number}
 * @description 滚轮事件累积的滚动量，用于判断是否触发标签切换
 * */
let wheelDelta = 0;

/**
 * **处理滚轮事件**
 * @param `event` `WheelEvent` 滚轮事件对象
 * @returns `void`
 * @description 监听鼠标滚轮事件，控制标签页滚动切换
 * */
const handleWheel = (event: WheelEvent) => {
  event.preventDefault();

  const now = Date.now();
  wheelDelta += Math.abs(event.deltaY);

  if (wheelDelta < 25) {
    return;
  }

  if (now - lastWheelTime < 50) {
    return;
  }

  wheelDelta = 0;
  lastWheelTime = now;

  if (event.deltaY < 0) {
    minusScroll();
  } else {
    addScroll();
  }
};

/**
 * **处理鼠标悬停事件**
 * @returns `void`
 * @description 添加滚轮事件监听
 * */
function handleMouseEnter() {
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.addEventListener("wheel", handleWheel, { passive: false });
  }
}

/**
 * **处理鼠标离开事件**
 * @returns `void`
 * @description 移除滚轮事件监听
 * */
function handleMouseLeave() {
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.removeEventListener("wheel", handleWheel);
  }
}

/**
 * **监听 modelValue 变化**
 * @description 同步激活标签页状态
 * */
watch(
  () => props.modelValue,
  data => {
    nextTick(() => {
      activeName.value = data || "";
      if (slotsTitle.value) {
        const index = slotsTitle.value.findIndex(item => item?.props?.name == props.modelValue);
        slotIndex.value = index;
      }
      setLabelPosition();
    });
  },
  { immediate: true }
);

/**
 * **设置标签位置**
 * @returns `void`
 * @description 计算并设置激活标签的左侧位置和宽度
 * */
function setLabelPosition() {
  if (props.styleMode != "border-card") return;
  setTimeout(() => {
    const el: any = typeof window !== "undefined" && window.document?.querySelector(`.pa-tabs-title_action_${tabsId.value}`);
    if (el) {
      const { width } = el.getBoundingClientRect();
      useLabelLeft.value = el.offsetLeft + 1;
      useLabelWidth.value = width;
    }
  }, 90);
}

/**
 * **监听 activeName 变化**
 * @description 更新标签位置
 * */
watch(
  () => activeName.value,
  () => setLabelPosition()
);

defineExpose({
  el: tabsRef
});
</script>

<style lang="scss">
@use "./index.scss";
</style>

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
        <!-- 上更多 -->
        <pa-icon
          v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')"
          :class="['icons', 'top-icon', headerScroll === 0 ? 'disabled' : '']"
          name="up_small_fill"
          @click="minusScroll"
        />
        <!-- 左更多 -->
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

        <!-- 下更多 -->
        <pa-icon
          v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')"
          :class="['icons', 'down-icon', headerScrollEnd ? 'disabled' : '']"
          name="down_small"
          @click="addScroll"
        />
        <!-- 右更多 -->
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
const { debounce } = _;

const props = withDefaults(defineProps<ComponentProps>(), {
  modelValue: "",
  visibleMode: "visible",
  mode: "default",
  styleMode: "card",
  align: "default",
  useHeaderLine: false,
  useShadow: true
});

const randId = String(randChar());
const tabsRef: any = ref();
const tabsTitleRef = ref();
const slots: any = ref({});
const overFixWidth = ref(0);
const defaultSlot = useSlots().default;
const slotsTitle = ref([] as Array<Record<string, Record<string, string>>>);
const slotIndex = ref(0);
const tabsId = ref(randId);
const useScrollX = ref(0);
const useScrollY = ref(0);
const headerScroll = ref(0);
const headerScrollEnd = ref(false);
const activeName = ref("");
const useLabelLeft = ref(0);
const useLabelWidth = ref(0);
/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emit = defineEmits<ComponentEmits>();

const _debounce = debounce(setTabsBoxSize, 10, { trailing: true });

const _debounceTitle = debounce(
  () => {
    createSlotData(true);
  },
  500,
  { trailing: true }
);

let observer;
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
    // 观察器的配置（需要观察什么变动）
    const config = { childList: true, subtree: true };

    // 创建一个观察器实例并传入回调函数
    observer = new MutationObserver(() => createSlotData());

    // 开始观察目标节点
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
 * **处理滚动事件**
 * @description 鼠标滚轮事件处理函数
 * */
let lastWheelTime = 0;
let wheelDelta = 0;
const handleWheel = (event: WheelEvent) => {
  event.preventDefault();

  const now = Date.now();
  wheelDelta += Math.abs(event.deltaY);

  // 降低敏感度：只有当滚动量达到阈值时才触发月份切换
  if (wheelDelta < 25) {
    // 滚动量阈值，可以根据需要调整
    return;
  }

  // 防抖处理：避免快速连续滚动
  if (now - lastWheelTime < 50) {
    // 200ms防抖时间
    return;
  }

  // 重置滚动量和时间
  wheelDelta = 0;
  lastWheelTime = now;

  // 根据滚动方向增减值，使用更精确的计算方法
  if (event.deltaY < 0) {
    // 向上滚动
    minusScroll();
  } else {
    // 向下滚动
    addScroll();
  }
};

/**
 * **处理鼠标悬停事件**
 * @returns `void`
 * @description 添加滚轮事件监听
 * */
function handleMouseEnter() {
  // 添加滚动事件监听
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
 * **组件卸载时移除事件监听**
 * @description 清理滚轮事件监听器
 * */
onUnmounted(() => {
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.removeEventListener("wheel", handleWheel);
  }
});

/**
 * **监听 modelValue 变化**
 * @description 值变化时更新当前激活标签
 * */
watch(
  () => props.modelValue,
  data => {
    nextTick(() => {
      activeName.value = data;
      if (slotsTitle.value) {
        const index = slotsTitle.value.findIndex(item => item?.props?.name == props.modelValue);
        slotIndex.value = index;
      }
      setLabelPosition();
    });
  },
  { immediate: true }
);

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

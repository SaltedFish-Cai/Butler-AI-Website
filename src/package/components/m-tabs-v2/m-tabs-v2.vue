<template>
  <div
    :class="[props.class, `m-tabs-v2-mode-${mode}`, `m-tabs-v2-style_mode-${styleMode}`, `m-tabs-v2-style_align-${align}`]"
    :style="{ ...props.style }"
    :id="tabsId"
    ref="tabsRef"
  >
    <div :class="['m-tabs-v2-content', mode === 'portrait' || mode === 'slider' ? 'flex' : 'flex-col']">
      <div
        :class="['m-tabs-v2-header', useHeaderLine ? 'm-tabs-v2-header_line' : '']"
        :style="{ '--tab-header-over-width': overFixWidth + 'px' }"
      >
        <div v-if="$slots['HeaderLeft']" style="margin-right: calc(var(--m-component-padding-size, 10px) / 2)">
          <slot name="HeaderLeft"></slot>
        </div>
        <!-- 上更多 -->
        <m-icon-v2
          v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')"
          :class="['icons', 'top-icon', headerScroll === 0 ? 'disabled' : '']"
          name="up_small_fill"
          @click="minusScroll"
        />
        <!-- 左更多 -->
        <m-icon-v2
          v-else-if="useScrollX > 0"
          :class="['icons', 'left-icon', headerScroll === 0 ? 'disabled' : '']"
          name="left_small"
          @click="minusScroll"
        />

        <div
          class="m-tabs-v2-title-list"
          :id="tabsId + '-tab-titles'"
          ref="tabsTitleRef"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div
            :id="'m-tabs-v2-box_' + tabsId"
            class="m-tabs-v2-box"
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
        <m-icon-v2
          v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')"
          :class="['icons', 'down-icon', headerScrollEnd ? 'disabled' : '']"
          name="down_small"
          @click="addScroll"
        />
        <!-- 右更多 -->
        <m-icon-v2
          v-else-if="useScrollX > 0"
          :class="['icons', 'right-icon', headerScrollEnd ? 'disabled' : '']"
          name="right_small_fill"
          @click="addScroll"
        />

        <div v-if="$slots['HeaderRight']" class="ml5"><slot name="HeaderRight"></slot></div>
      </div>

      <div v-if="mode === 'slider'" class="m-tabs-v2-scroll">
        <slot name="afterLabel"></slot>

        <div :id="tabsId + '-tab-contents-slider'" class="m-tabs-v2-contents">
          <m-scrollbar-v2 ref="mScrollRef" :intersectClassName="'.tab-item_line_' + tabsId" @intersecting="handleIntersecting">
            <slot></slot>
          </m-scrollbar-v2>
        </div>
      </div>
      <div v-else class="m-tabs-v2-scroll">
        <slot name="afterLabel"></slot>

        <div
          :id="tabsId + '-tab-contents'"
          class="m-tabs-v2-contents"
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
// # Import
import { ref, onMounted, onUnmounted, useSlots, watch, nextTick, provide, computed } from "vue";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import titleItem from "./m-tabs-v2-label.vue";
import { MTabsV2Type } from "./type";
import inBrowser from "../tools/inBrowser";
import { getElementPosition } from "../utils/getElementPosition";

// # Var
const { debounce } = lodashPkg;

const props = withDefaults(defineProps<MTabsV2Type>(), {
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
// const lineStyle = ref({ width: 0, left: 0 });
const tabsId = ref(randId);
const useScrollX = ref(0);
const useScrollY = ref(0);
const headerScroll = ref(0);
const headerScrollEnd = ref(false);
const activeName = ref("");
const emits = defineEmits(["update:modelValue", "tab-change"]);

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

// # Vue onMounted
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

// # Vue onUnmounted
onUnmounted(() => {
  observer?.disconnect && observer?.disconnect();
});

// # Function 变更Tab
function changeTabs(name, index, scrollToIntersect = true) {
  slotIndex.value = index;
  activeName.value = name;
  emits("update:modelValue", name);
  emits("tab-change", { name, index });

  if (props.mode === "slider" && scrollToIntersect) {
    const targetEl = document.querySelector(`#${tabsId.value} #${tabsId.value}-${name}`);
    if (targetEl) mScrollRef.value?.setScrollToIntersect(targetEl);
  }
  setTabItemPosition();
}

// # 更新Tab按钮位置
function setTabItemPosition() {
  nextTick(() => {
    const targetEl = document.querySelector(`#${tabsId.value} .m-tabs-v2-title_action_${tabsId.value}`);
    const parentElement = document.querySelector(`#${tabsId.value} #m-tabs-v2-box_${tabsId.value}`);
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

// # Function 初始化Slot数据
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
        } else if (element.type?.__file?.includes("m-tabs-v2-item-")) {
          const component = element.type.render(
            { ...element.ctx, $t: window.$t },
            {},
            {},
            element.type.setup({}, { expose: () => {} })
          );
          console.log("++++++++++> :", component);
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
      emits("update:modelValue", name);
      _debounce();
    }
  }
}

// # Function 监听元素节点
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

// # Function 设置Tabs标题宽度
function setTabsBoxSize() {
  if (!inBrowser) return;
  nextTick(() => {
    const tabId = tabsRef?.value?.id;
    const _id = `${tabId}-tab-titles`;
    const tabsTitleEl = window.document?.getElementById(_id);
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

// # Function 处理滚动到可见区域
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

// # Function 超出标题（左/上）
function minusScroll() {
  const chr = headerScroll.value - 50;
  headerScroll.value = chr <= 0 ? 0 : chr;
  headerScrollEnd.value = false;
}

// # Function 超出标题（右/下）
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

// # 处理滚动事件
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

// # Function 处理鼠标悬停事件
function handleMouseEnter() {
  // 添加滚动事件监听
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.addEventListener("wheel", handleWheel, { passive: false });
  }
}

// # Function 处理鼠标离开事件
function handleMouseLeave() {
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.removeEventListener("wheel", handleWheel);
  }
}

// # 在组件卸载时移除事件监听
onUnmounted(() => {
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.removeEventListener("wheel", handleWheel);
  }
});

// #Watch modelValue
watch(
  () => props.modelValue,
  data => {
    activeName.value = data;
    setTabItemPosition();
    if (slotsTitle.value) {
      const index = slotsTitle.value.findIndex(item => item?.props?.name == props.modelValue);
      slotIndex.value = index;
    }
  },
  { immediate: true }
);

defineExpose({
  el: tabsRef
});
</script>

<style lang="scss">
@use "./index.scss";
</style>

<template>
  <div
    :class="[props.class, 'pa-tabs', `mode-${mode}`, `style_mode-${styleMode}`, `style_align-${align}`]"
    :style="{
      ...props.style,
      '--pa-tabs-label-left': useLabelLeft - headerScroll + 'px',
      '--pa-tabs-label-width': useLabelWidth + 'px'
    }"
    :id="tabsId"
    ref="tabsRef"
  >
    <div :class="['pa-tabs-content', mode === 'portrait' || mode === 'slider' ? 'flex' : 'flex-col']">
      <div :class="['pa-tabs-header', useHeaderLine ? 'pa-tabs-header_line' : '']">
        <div v-if="$slots['HeaderLeft']" style="margin-right: calc(var(--pa-size-padding, 10px) / 2)">
          <slot name="HeaderLeft"></slot>
        </div>
        <pa-icon v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')" :class="['icons', 'top-icon', headerScroll === 0 ? 'disabled' : '']" name="up_small_fill" @click="minusScroll" />
        <pa-icon v-else-if="useScrollX > 0" :class="['icons', 'left-icon', headerScroll === 0 ? 'disabled' : '']" name="left_small" @click="minusScroll" />

        <div class="pa-tabs-title-list" :id="tabsId + '-tab-titles'" ref="tabsTitleRef" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <div :id="'pa-tabs-box_' + tabsId" class="pa-tabs-box" :class="[mode === 'portrait' || mode === 'slider' ? 'flex-col' : '']" :style="{ '--tab-header-scroll': '-' + headerScroll + 'px' }">
            <title-item :slots="slotsTitle" :activeName="activeName" :changeTabs="changeTabs" :portrait="mode === 'portrait' || mode === 'slider'" :onDragReorder="handleLabelDragReorder"></title-item>
          </div>
        </div>

        <pa-icon v-if="useScrollY > 0 && (mode === 'portrait' || mode === 'slider')" :class="['icons', 'down-icon', headerScrollEnd ? 'disabled' : '']" name="down_small" @click="addScroll" />
        <pa-icon v-else-if="useScrollX > 0" :class="['icons', 'right-icon', headerScrollEnd ? 'disabled' : '']" name="right_small_fill" @click="addScroll" />

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

        <div :id="tabsId + '-tab-contents'" class="pa-tabs-contents" :style="{ position: 'relative', left: `-${visibleMode == 'visible' ? slotIndex : 0}00%` }">
          <slot></slot>
        </div>
      </div>

      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, onMounted, onUnmounted, useSlots, watch, nextTick, provide, computed } from "vue";
/**
 * 模块导入
 * @description 导入随机字符生成工具
 */
import { randChar } from "../tools/rand-char";
/**
 * 模块导入
 * @description 导入标签页标题子组件
 */
import titleItem from "./pa-tabs-label.vue";
/**
 * 模块导入
 * @description 导入组件属性和事件类型定义
 */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入浏览器环境判断工具
 */
import inBrowser from "../tools/inBrowser";
/**
 * 模块导入
 * @description 导入元素位置计算工具
 */
import { getElementPosition } from "../utils/getElementPosition";
/**
 * 模块导入
 * @description 导入全局状态
 */
import { useBaseStore } from "../store/index";
/**
 * 模块导入
 * @description 导入防抖函数工具
 */
import debounce from "../tools/debounce";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  visibleMode: "visible",
  mode: "default",
  styleMode: "card",
  align: "default",
  useShadow: true
});
/**
 * 随机 ID
 * @type {string}
 * @description 生成组件唯一标识
 */
const randId = String(props.id || randChar());
/**
 * 全局状态
 * @description 用于缓存 label 顺序
 */
const baseStore = props.cacheLabel ? useBaseStore() : null;
/**
 * 标签页容器引用
 * @type {Ref<HTMLElement | undefined>}
 * @description 标签页容器的 DOM 引用
 */
const tabsRef = ref<HTMLElement>();
/**
 * 标签页标题容器引用
 * @type {Ref<HTMLElement | undefined>}
 * @description 标签页标题区域的 DOM 引用
 */
const tabsTitleRef = ref<HTMLElement>();
/**
 * 插槽数据
 * @type {Ref<any>}
 * @description 存储子组件插槽信息
 */
const slots = ref<any>({});
/**
 * 默认插槽
 * @type {ReturnType<typeof useSlots>['default']}
 * @description 获取默认插槽内容
 */
const defaultSlot = useSlots().default;
/**
 * 标题插槽列表
 * @type {Ref<Array<Record<string, Record<string, string>>>>}
 * @description 存储所有标签页标题的插槽数据
 */
const slotsTitle = ref([] as Array<Record<string, Record<string, string>>>);
/**
 * 当前插槽索引
 * @type {Ref<number>}
 * @description 当前激活的标签页索引
 */
const slotIndex = ref(0);
/**
 * 原始 DOM 顺序
 * @type {string[]}
 * @description 记录 tab-item 在 DOM 中的原始 name 顺序（不受缓存重排影响），用于内容面板位移计算
 */
const domOrder: string[] = [];
/**
 * 标签页 ID
 * @type {Ref<string>}
 * @description 组件实例的唯一标识
 */
const tabsId = ref(randId);
/**
 * 水平滚动位置
 * @type {Ref<number>}
 * @description 标签页水平滚动距离
 */
const useScrollX = ref(0);
/**
 * 垂直滚动位置
 * @type {Ref<number>}
 * @description 标签页垂直滚动距离
 */
const useScrollY = ref(0);
/**
 * 标题滚动位置
 * @type {Ref<number>}
 * @description 标题区域的滚动偏移量
 */
const headerScroll = ref(0);
/**
 * 标题滚动结束标志
 * @type {Ref<boolean>}
 * @description 标题区域是否滚动到末尾
 */
const headerScrollEnd = ref(false);
/**
 * 当前激活标签名
 * @type {Ref<string>}
 * @description 当前选中标签页的标识
 */
const activeName = ref("");
/**
 * 标签左侧位置
 * @type {Ref<number>}
 * @description 激活标签的左侧位置
 */
const useLabelLeft = ref(0);
/**
 * 标签宽度
 * @type {Ref<number>}
 * @description 激活标签的宽度
 */
const useLabelWidth = ref(0);
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emit = defineEmits<ComponentEmits>();
/**
 * 防抖函数
 * @description 防抖处理标签页尺寸计算
 */
const _debounce = debounce(setTabsBoxSize, 10);
/**
 * 标题防抖函数
 * @description 防抖处理标题数据更新
 */
const _debounceTitle = debounce(() => {
  createSlotData(true);
}, 500);
/**
 * DOM 观察器
 * @type {MutationObserver | undefined}
 * @description 监听 DOM 变化的观察器实例
 */
let observer: MutationObserver | undefined;
/**
 * 标题容器尺寸
 * @type {{ scrollWidth: number; clientWidth: number; scrollHeight: number; clientHeight: number }}
 * @description 标题区域的滚动尺寸信息
 */
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
 * 滚轮事件时间戳
 * @type {number}
 * @description 上一次滚轮事件的时间戳
 */
let lastWheelTime = 0;
/**
 * 滚轮事件累积滚动量
 * @type {number}
 * @description 滚轮事件累积的滚动量，用于判断是否触发标签切换
 */
let wheelDelta = 0;
/**
 * 防抖定时器 ID
 * @type {ReturnType<typeof setTimeout> | undefined}
 * @description 用于清理 setLabelPosition 中的防抖定时器
 */
let labelPositionTimer: ReturnType<typeof setTimeout> | undefined;
/**
 * 滚动容器引用
 * @type {Ref<any>}
 * @description 滚动容器的 DOM 引用
 */
const mScrollRef = ref<any>();
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
 * 获取缓存 key
 * @returns string | null
 * @description 缓存 label 顺序的 store key，格式为 `tabs-cache:{id}`
 */
function getCacheKey(): string | null {
  if (!props.cacheLabel || !props.id) return null;
  return `tabs-cache:${props.id}`;
}

/**
 * 应用 label 顺序缓存
 * @param arr - 当前 slotsTitle 数据
 * @returns void
 * @description 根据缓存重新排序 arr，缓存项在前、剩余传入项在后、缓存中不存在于传入的项不显示
 */
function applyLabelCache(arr: any[]): void {
  const cacheKey = getCacheKey();
  if (!cacheKey || !baseStore) return;
  const cached = baseStore.tabsCache[cacheKey];
  if (!cached?.length) {
    // 无缓存时初始化
    baseStore.setTabsCache(
      cacheKey,
      arr.map(item => item?.props?.name)
    );
    return;
  }
  // 按缓存顺序重排：先显示缓存中存在且在传入数组中的 label，再将剩余传入 label 追加到最后
  const arrByName = new Map<string, any>();
  const unnamedItems: any[] = [];
  for (const item of arr) {
    const name = item?.props?.name;
    if (name != null) arrByName.set(String(name), item);
    else unnamedItems.push(item);
  }
  const ordered: any[] = [];
  const remaining: any[] = [];
  for (const cachedName of cached) {
    if (arrByName.has(cachedName)) {
      ordered.push(arrByName.get(cachedName));
      arrByName.delete(cachedName);
    }
  }
  for (const [, item] of arrByName) {
    remaining.push(item);
  }
  arr.splice(0, arr.length, ...ordered, ...remaining, ...unnamedItems);
}

/**
 * 处理 label 拖动排序
 * @param fromIndex - 拖动的起始索引
 * @param toIndex - 放置的目标索引
 * @returns void
 * @description 更新 slotsTitle 顺序，保存缓存并触发事件
 */
function handleLabelDragReorder(fromIndex: number, toIndex: number): void {
  const arr = [...slotsTitle.value];
  const [moved] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, moved);
  slotsTitle.value = arr;
  // 保存缓存
  const cacheKey = getCacheKey();
  if (cacheKey && baseStore) {
    const names = arr.map(item => item?.props?.name);
    baseStore.setTabsCache(cacheKey, names);
  }
  emit("labelDragEnd", arr.map(item => item?.props?.name));
  // 重新计算激活项 — slotIndex 基于 DOM 顺序
  const _name = props.modelValue || activeName.value;
  const domIndex = _name ? domOrder.indexOf(String(_name)) : -1;
  slotIndex.value = domIndex >= 0 ? domIndex : 0;
  setTabItemPosition();
  setLabelPosition();
}

/**
 * 变更 Tab
 * @param name - 标签页标识
 * @param index - 标签页索引
 * @param scrollToIntersect - 是否滚动到可见区域
 * @returns void
 * @description 切换当前激活的标签页
 */
function changeTabs(name: string, index: number, scrollToIntersect = true): void {
  // slotIndex 使用 DOM 顺序，而非 slotsTitle 索引（缓存可能重排过 slotsTitle）
  const domIndex = name != null ? domOrder.indexOf(String(name)) : -1;
  slotIndex.value = domIndex >= 0 ? domIndex : index;
  activeName.value = name;
  emit("update:modelValue", name);
  emit("tabChange", { name, index });
  if (props.mode === "slider" && scrollToIntersect) {
    const targetEl = document.querySelector(`#${tabsId.value} #${tabsId.value}-${name}`);
    if (targetEl) mScrollRef.value?.setScrollToIntersect(targetEl);
  }
  setTabItemPosition();
  setLabelPosition();
}
/**
 * 更新 Tab 按钮位置
 * @returns void
 * @description 计算并更新当前激活标签的位置
 */
function setTabItemPosition(): void {
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
 * 初始化 Slot 数据
 * @param Mandatory - 是否强制更新
 * @returns void
 * @description 解析插槽内容生成标签页数据
 */
function createSlotData(Mandatory = false): void {
  if (tabsRef.value) {
    if (defaultSlot) {
      slots.value = defaultSlot();
    }
    const arr: any = [];
    /**
     * 设置子组件数据
     * @param arrayData - 子组件数组数据
     * @returns void
     * @description 递归解析插槽中的子组件
     */
    function setChild(arrayData: any[]): void {
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
      // 保存原始 DOM 顺序（在缓存重排之前）
      domOrder.length = 0;
      for (const item of arr) {
        const name = item?.props?.name;
        if (name != null) domOrder.push(String(name));
      }
      // 应用 label 顺序缓存
      applyLabelCache(slotsTitle.value);
      const _index = slotsTitle.value.findIndex(item => item?.props?.name == props.modelValue);
      const name = slotsTitle.value[_index < 0 ? 0 : _index]?.props?.name;
      // slotIndex 基于 DOM 顺序（内容面板位移），而非缓存重排后的 slotsTitle 顺序
      const domIndex = name != null ? domOrder.indexOf(String(name)) : -1;
      slotIndex.value = domIndex >= 0 ? domIndex : (_index < 0 ? 0 : _index);
      activeName.value = name;
      emit("update:modelValue", name);
      _debounce();
    }
  }
}
/**
 * 监听元素节点
 * @returns void
 * @description 使用 MutationObserver 监听 DOM 变化
 */
function watchDom(): void {
  if (tabsRef.value) {
    const config = { childList: true, subtree: true };
    observer = new MutationObserver(() => createSlotData());
    observer.observe(tabsRef.value, config);
  }
}
/**
 * 设置 Tabs 标题宽度
 * @returns void
 * @description 计算并更新标签标题区域的滚动信息
 */
function setTabsBoxSize(): void {
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
 * 处理滚动到可见区域
 * @param el - 可见区域元素
 * @returns void
 * @description 当标签页滚动到可见区域时切换标签
 */
function handleIntersecting(el: HTMLElement): void {
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
 * 超出标题（左/上）
 * @returns void
 * @description 标题区域向左或向上滚动
 */
function minusScroll(): void {
  const chr = headerScroll.value - 50;
  headerScroll.value = chr <= 0 ? 0 : chr;
  headerScrollEnd.value = false;
}
/**
 * 超出标题（右/下）
 * @returns void
 * @description 标题区域向右或向下滚动
 */
function addScroll(): void {
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
 * 处理鼠标悬停事件
 * @returns void
 * @description 添加滚轮事件监听
 */
function handleMouseEnter(): void {
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.addEventListener("wheel", handleWheel, { passive: false });
  }
}
/**
 * 处理鼠标离开事件
 * @returns void
 * @description 移除滚轮事件监听
 */
function handleMouseLeave(): void {
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.removeEventListener("wheel", handleWheel);
  }
}
/**
 * 设置标签位置
 * @returns void
 * @description 计算并设置激活标签的左侧位置和宽度
 */
function setLabelPosition(): void {
  if (props.styleMode != "border-card") return;
  if (labelPositionTimer) {
    clearTimeout(labelPositionTimer);
  }
  labelPositionTimer = setTimeout(() => {
    const el: HTMLElement | null = typeof window !== "undefined" ? window.document?.querySelector(`.pa-tabs-title_action_${tabsId.value}`) : null;
    if (el) {
      const { width } = el.getBoundingClientRect();
      useLabelLeft.value = el.offsetLeft + 1;
      useLabelWidth.value = width;
    }
  }, 90);
}
/**
 * 处理滚轮事件
 * @param event - 滚轮事件对象
 * @returns void
 * @description 监听鼠标滚轮事件控制标签页滚动切换
 */
function handleWheel(event: WheelEvent): void {
  event.preventDefault();
  const now = Date.now();
  wheelDelta += Math.abs(event.deltaY);
  if (wheelDelta < 25) return;
  if (now - lastWheelTime < 50) return;
  wheelDelta = 0;
  lastWheelTime = now;
  if (event.deltaY < 0) {
    minusScroll();
  } else {
    addScroll();
  }
}
/**
 * 组件挂载生命周期
 * @description 初始化组件状态
 */
onMounted(() => {
  if (props.cacheLabel && !props.id) {
    console.warn("[PaTabs] cacheLabel 为 true 时必须传入 id prop，否则缓存无法持久化");
  }
  createSlotData();
  const defaultValue = props.modelValue;
  observer?.disconnect();
  nextTick(() => {
    watchDom();
    if (props.mode === "slider") {
      changeTabs(defaultValue as string, 0);
    }
  });
});
/**
 * 组件卸载生命周期
 * @description 清理观察器和事件监听
 */
onUnmounted(() => {
  observer?.disconnect();
  const tabsTitleElement = tabsTitleRef.value;
  if (tabsTitleElement) {
    tabsTitleElement.removeEventListener("wheel", handleWheel);
  }
  if (labelPositionTimer) {
    clearTimeout(labelPositionTimer);
  }
});
/**
 * 监听 modelValue 变化
 * @param data - | undefined 当前 modelValue 值
 * @description 同步激活标签页状态和标签位置
 */
watch(
  () => props.modelValue,
  (data: string | undefined) => {
    nextTick(() => {
      activeName.value = data || "";
      if (data && domOrder.length) {
        const domIndex = domOrder.indexOf(data);
        slotIndex.value = domIndex >= 0 ? domIndex : 0;
      }
      setLabelPosition();
    });
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

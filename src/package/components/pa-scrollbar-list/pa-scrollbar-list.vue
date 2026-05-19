<template>
  <section :id="id" class="pa-scrollbar-list flex-col" ref="scrollBarList">
    <pa-scrollbar
      ref="mScrollbarListRef"
      v-bind="props"
      :styleMode="styleMode"
      useShadow
      :padding="padding"
      :use-scroll-x="false"
      :intersectClassName="`#${id} .pa-scrollbar-more`"
      @intersecting="handleIntersecting"
      @directly-scroll-end="handleScrollEnd"
    >
      <template v-if="renderList.length > 0">
        <template v-for="item in renderList" :key="item.__key">
          <div v-if="item.__type === 'more'" class="pa-scrollbar-more" :id="`${id}-more-${item.__page}`" :data-name="`more-${item.__page}`"></div>
          <slot v-else :row="item.__data" />
        </template>
      </template>
      <template v-else-if="!state.tableLoad">
        <slot name="empty"><pa-empty /></slot>
      </template>
      <div v-if="state.tableLoad" class="pa-loading">
        <pa-icon class="loading_font" name="loading_line" />
      </div>
      <div v-if="state.tableLoadEnd && renderList.length > 0" class="no-more">
        {{ languageValue === "zh-CN" ? "没有更多了" : "No more" }}
      </div>
    </pa-scrollbar>
    <slot name="footer">
      <div
        class="flex-center-between pa-scrollbar-list_footer padding-top"
        :class="{
          'padding-left': padding?.includes('left') || padding?.includes('all'),
          'padding-right': padding?.includes('right') || padding?.includes('all')
        }"
      >
        <div>
          <slot name="footerLeft" />
        </div>
        <pa-pagination
          v-model:current-page="state.pageNum"
          :total="state.pageable.total"
          :page-size="state.pageable.pageSize"
          :page-sizes="state.pageable.pageSizes"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </slot>
  </section>
</template>

<script lang="ts" setup name="PaScrollBarList">
/**
 * Vue 核心响应式 API
 * @description 导入 Vue 组合式 API
 */
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed, inject, markRaw, type ComputedRef } from "vue";
/**
 * 随机字符生成工具
 * @description 导入随机字符生成函数
 */
import { randChar } from "../tools/rand-char";
/**
 * 滚动列表组件 Props 类型
 * @description 导入组件 Props 类型定义
 */
import type { ComponentProps, ComponentEmits } from "./types";
/**
 * 全局配置类型
 * @description 导入 Pancake 全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 渲染项类型
 * @description 扁平化渲染列表中的单个项类型
 */
type RenderItem = {
  /**
   * 项类型标记
   * @description "more" 表示分页占位符，"data" 表示数据行
   */
  __type: "data" | "more";
  /**
   * Vue v-for key
   * @description 用于 Vue 虚拟 DOM 的稳定 key
   */
  __key: string;
  /**
   * 页码
   * @description 仅 __type 为 "more" 时存在，表示当前分页页码
   */
  __page?: number;
  /**
   * 行数据
   * @description 仅 __type 为 "data" 时存在，表示实际数据行
   */
  __data?: Record<string, any>;
};
/**
 * 对象类型
 * @description 通用对象类型别名
 */
type objectType = Record<string, any>;
/**
 * 全局配置注入
 * @description 获取 Pancake 全局配置
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 语言值
 * @description 获取当前语言设置
 */
const languageValue = computed<string>(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 扁平渲染列表
 * @description 将二维分页数据扁平化为一维渲染列表，减少模板 v-for 嵌套层级
 */
const renderList = computed<RenderItem[]>(() => {
  const flat: RenderItem[] = [];
  const pages = state.tableData;
  for (let p = 0; p < pages.length; p++) {
    const page = pages[p];
    if (!page) continue;
    for (let r = 0; r < page.length; r++) {
      const row = page[r];
      if (row.type === "more") {
        flat.push({ __type: "more", __key: `p${p}-m${row.name}`, __page: row.name });
      } else {
        flat.push({ __type: "data", __key: `p${p}-r${r}`, __data: row });
      }
    }
  }
  return flat;
});
/**
 * 根元素引用
 * @description 组件根 DOM 元素引用
 */
const scrollBarList = ref();
/**
 * 组件 Props
 * @description 组件 Props 属性
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  showPagination: true,
  styleMode: "default",
  padding: () => ["left", "right"]
});
/**
 * 组件事件
 * @description 组件事件类型定义
 */
const emit = defineEmits<ComponentEmits>();
/**
 * 组件唯一标识
 * @description 组件唯一标识
 */
const id = ref(randChar());
/**
 * 滚动条组件引用
 * @description pa-scrollbar 子组件引用
 */
const mScrollbarListRef = ref();
/**
 * 自动加载定时器 ID
 * @description 用于取消待执行的自动加载
 */
let autoLoadTimer: ReturnType<typeof setTimeout> | undefined;
/**
 * 数据总量计数器
 * @description 已加载的数据条目总数，用于判断后端数据是否全部加载完毕
 */
let _totalLoaded = 0;
/**
 * 分页每页条数选项
 * @description 分页器可选的每页条数
 */
const PAGE_SIZES: number[] = [50, 100, 150];
/**
 * 表格状态
 * @description 组件核心响应式状态
 */
const state = reactive({
  /**
   * 表格数据
   * @description 按分页组织的二维数据数组
   */
  tableData: [] as objectType[][],
  /**
   * 当前页码
   * @description 当前显示的页码
   */
  pageNum: 1,
  /**
   * 分页数据
   * @description 分页器配置信息
   */
  pageable: {
    pageNum: 1,
    pageSize: 50,
    pageSizes: PAGE_SIZES,
    total: 0
  },
  /**
   * 查询参数
   * @description 发送给后端的查询参数
   */
  tableQuery: {
    Filter: [] as any[],
    AdvancedFilter: [] as any[],
    Page: {} as Record<string, any>,
    Params: {} as Record<string, any>,
    Sort: [] as any[]
  },
  /**
   * 是否正在加载
   * @description 标识当前是否正在请求数据
   */
  tableLoad: false,
  /**
   * 是否加载完毕
   * @description 标识所有数据是否已加载完毕
   */
  tableLoadEnd: false
});
/**
 * 处理滚动到可见区域
 * @param el - 进入可见区域的 DOM 元素
 * @returns void
 * @description 当 more 标记元素进入可见区域时更新当前页码
 */
function handleIntersecting(el: HTMLElement): void {
  const name = el?.dataset?.name;
  if (name) {
    state.pageNum = parseInt(name.slice(5), 10);
    emit("intersecting", el);
  }
}
/**
 * 处理滚动到底部
 * @param data - 滚动到底部标识
 * @returns void
 * @description 当滚动到底部时加载下一页数据
 */
function handleScrollEnd(data: any): void {
  if (state.tableLoadEnd || state.tableLoad) return;
  if (data) getTableList(++state.pageable.pageNum);
}
/**
 * 获取表格数据
 * @param pageNum - 目标页码
 * @returns Promise<void>
 * @description 请求分页数据并更新组件状态
 */
async function getTableList(pageNum?: number): Promise<void> {
  const currentPage = pageNum || state.pageable.pageNum;
  const _pageNum = currentPage - 1;
  if (state.tableLoadEnd || state.tableData[_pageNum]?.length) return;
  if (state.tableLoad) return;
  state.tableLoad = true;
  const _query = {
    ...state.tableQuery,
    Page: {
      PageNum: currentPage,
      PageSize: state.pageable.pageSize
    }
  };
  state.tableQuery = _query;
  const { Data } = await props?.requestApi?.(_query);
  const deepData = Data;
  const _data: objectType[] = props.showPagination ? deepData.List || deepData : deepData;
  if (_data.length) {
    const markedData = _data.map((item: objectType) => markRaw(item));
    const ar: objectType[] = [{ type: "more", name: currentPage } as objectType, ...markedData];
    state.tableData[_pageNum] = ar;
    _totalLoaded += markedData.length;
  }
  props.showPagination && updatePageable({ total: deepData.TotalCount });
  state.tableLoad = false;
  nextTick(() => {
    mScrollbarListRef.value?.resetObserver();
  });
  if (_totalLoaded >= deepData.TotalCount) {
    state.tableLoadEnd = true;
  } else {
    autoLoadTimer = setTimeout(() => {
      getTableList(++state.pageable.pageNum);
    }, 300);
  }
}
/**
 * 更新分页信息
 * @param resPageable - 分页参数
 * @returns void
 * @description 更新分页器状态
 */
function updatePageable(resPageable: { pageNum?: number; pageSize?: number; pageSizes?: number[]; total: number }): void {
  Object.assign(state.pageable, resPageable);
}
/**
 * 分页锁
 * @description 防止分页器重复触发滚动
 */
let lock = false;
/**
 * 处理当前页码变化
 * @param value - 新页码
 * @returns void
 * @description 分页器页码变化时滚动到对应位置
 */
function handleCurrentChange(value: number): void {
  if (lock) {
    lock = false;
    return;
  }
  if (state.tableLoad) return;
  const mpreEl: HTMLElement | null = document.querySelector(`#${id.value} #${id.value}-more-${value}`);
  if (mpreEl) setScrollTop(mpreEl);
}
/**
 * 设置滚动距离
 * @param value - 滚动距离值
 * @returns void
 * @description 调用滚动条组件的滚动方法
 */
function setScrollTop(value: HTMLElement): void {
  mScrollbarListRef?.value?.setScrollToIntersect(value);
}
/**
 * 组件挂载时获取数据
 * @description 组件挂载时自动请求第一页数据
 */
onMounted(() => {
  getTableList();
});
/**
 * 组件卸载前清理资源
 * @description 清理定时器和加载状态
 */
onBeforeUnmount(() => {
  if (autoLoadTimer) clearTimeout(autoLoadTimer);
});
/**
 * 刷新列表
 * @returns void
 * @description 重置所有状态并重新获取第一页数据
 */
function refresh(): void {
  if (autoLoadTimer) clearTimeout(autoLoadTimer);
  state.tableLoadEnd = false;
  _totalLoaded = 0;
  state.tableData.length = 0;
  state.pageable.pageNum = 1;
  getTableList(1);
}
defineExpose({ refresh, setScrollTop, el: mScrollbarListRef });
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>

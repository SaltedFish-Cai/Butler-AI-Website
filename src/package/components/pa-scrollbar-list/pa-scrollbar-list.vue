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
      <template v-if="state.tableData.length > 0">
        <template v-for="(item, index) in state.tableData" :key="index">
          <template v-for="(row, i) in item" :key="props.rowKey || 'key-' + i">
            <template v-if="row.type == 'more'">
              <div class="pa-scrollbar-more" :id="`${id}-more-${row.name}`" :data-name="`more-${row.name}`"></div>
            </template>
            <slot v-else :row="row"></slot>
          </template>
        </template>
      </template>
      <template v-else-if="!state.tableLoad">
        <slot name="empty"><pa-empty></pa-empty></slot>
      </template>
      <div v-if="state.tableLoad" class="pa-loading">
        <pa-icon class="loading_font" name="loading_line"></pa-icon>
      </div>
      <div v-if="state.tableLoadEnd && state.tableData.length > 0" class="no-more">
        {{ languageValue == "zh-CN" ? "没有更多了" : "No more" }}
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
          <slot name="footerLeft"></slot>
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
 * @description Vue 核心响应式 API
 */
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed, inject, ComputedRef } from "vue";
/**
 * 随机字符生成工具
 * @description 随机字符生成工具
 */
import { randChar } from "../tools/rand-char";
/**
 * 滚动列表组件 Props 类型
 * @description 滚动列表组件 Props 类型
 */
import type { ComponentProps, ComponentEmits } from "./types";
/**
 * 全局配置类型
 * @description 全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 对象类型
 * @description 对象类型
 */
type objectType = Record<string, any>;
/**
 * 全局配置注入
 * @description 全局配置注入
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 语言值
 * @returns string 语言代码
 * @description 获取当前语言设置
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 根元素引用
 * @description 根元素引用
 */
const scrollBarList = ref();
/**
 * 组件 Props
 * @description 组件 Props
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
 * @description 滚动条组件引用
 */
const mScrollbarListRef = ref();
/**
 * IntersectionObserver 实例
 * @description IntersectionObserver 实例
 */
let observer: IntersectionObserver | undefined;
/**
 * 自动加载定时器 ID
 * @description 用于取消待执行的自动加载
 */
let autoLoadTimer: ReturnType<typeof setTimeout> | undefined;
/**
 * 分页每页条数选项
 * @description 分页器可选的每页条数
 */
const PAGE_SIZES: number[] = [50, 100, 150];
/**
 * 表格状态
 * @description 表格状态
 */
const state = reactive({
  /**
   * 表格数据
   * @description 表格数据
   */
  tableData: [] as objectType[][],
  /**
   * 扁平化表格数据
   * @description 扁平化表格数据
   */
  flatTableData: [] as objectType[],
  /**
   * 当前页码
   * @description 当前页码
   */
  pageNum: 1,
  /**
   * 分页数据
   * @description 分页数据
   */
  pageable: {
    /**
     * 当前页数
     * @description 当前页数
     */
    pageNum: 1,
    /**
     * 每页显示条数
     * @description 每页显示条数
     */
    pageSize: 50,
    /**
     * 每页选择页数列表
     * @description 每页选择页数列表
     */
    pageSizes: PAGE_SIZES,
    /**
     * 总条数
     * @description 总条数
     */
    total: 0
  },
  /**
   * 查询参数
   * @description 查询参数
   */
  searchParam: {} as Record<string, any>,
  /**
   * 初始化默认的查询参数
   * @description 初始化默认的查询参数
   */
  searchInitParam: {} as Record<string, any>,
  /**
   * 总参数
   * @description 总参数
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
   * @description 是否正在加载
   */
  tableLoad: false,
  /**
   * 是否加载完毕
   * @description 是否加载完毕
   */
  tableLoadEnd: false,
  /**
   * 是否使用选择表格
   * @description 是否使用选择表格
   */
  useSelectionTable: false,
  /**
   * 排序属性
   * @description 排序属性
   */
  orderProp: "",
  /**
   * 是否初始显示
   * @description 是否初始显示
   */
  initShow: false
});
/**
 * 处理滚动到可见区域
 * @param el - 进入可见区域的元素
 * @returns void
 * @description 当 more 标记元素进入可见区域时，更新当前页码
 */
function handleIntersecting(el: HTMLElement): void {
  const name = el?.dataset?.name;
  if (name) {
    state.pageNum = Number(name.replace("more-", ""));
    emit("intersecting", el);
  }
}
/**
 * 处理滚动到底部
 * @param data - 滚动到底部的数据
 * @returns void
 * @description 当滚动到底部时，加载下一页数据
 */
function handleScrollEnd(data: any): void {
  if (state.tableLoadEnd || state.tableLoad) return;
  if (data) getTableList(++state.pageable.pageNum);
}
/**
 * 获取表格数据
 * @param pageNum - 页码
 * @returns void
 * @description 请求表格数据并更新状态
 */
async function getTableList(pageNum?: number): Promise<void> {
  const currentPage = pageNum || state.pageable.pageNum;
  const _pageNum = currentPage - 1;
  if (state.tableLoadEnd || state.tableData[_pageNum]?.length) {
    return;
  }
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
  const _data = props.showPagination ? deepData.List || deepData : deepData;
  if (_data.length) {
    const ar = [{ type: "more", name: currentPage }, ..._data];
    state.flatTableData = [...state.flatTableData, ..._data];
    state.tableData[_pageNum] = ar;
  }
  props.showPagination && updatePageable({ total: deepData.TotalCount });
  state.tableLoad = false;
  nextTick(() => {
    mScrollbarListRef.value?.resetObserver();
  });
  if (state.flatTableData.length >= deepData.TotalCount) {
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
 * @description 分页锁
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
  const mpreEl: any = document.querySelector(`#${id.value} #${id.value}-more-${value}`);
  if (mpreEl) setScrollTop(mpreEl);
}
/**
 * 组件挂载时获取表格数据
 * @description 组件挂载时获取表格数据
 */
onMounted(() => {
  getTableList();
});
/**
 * 组件卸载前清理资源
 * @description 组件卸载前清理定时器和观察器
 */
onBeforeUnmount(() => {
  if (autoLoadTimer) clearTimeout(autoLoadTimer);
  if (observer?.disconnect) observer?.disconnect();
});
/**
 * 设置滚动距离
 * @param value - 滚动距离值
 * @returns void
 * @description 调用滚动条组件的滚动方法
 */
function setScrollTop(value: number): void {
  mScrollbarListRef?.value?.setScrollToIntersect(value);
}
/**
 * 刷新列表
 * @returns void
 * @description 重置状态并重新获取数据
 */
function refresh(): void {
  if (autoLoadTimer) clearTimeout(autoLoadTimer);
  state.tableLoadEnd = false;
  state.flatTableData.length = 0;
  state.tableData.length = 0;
  state.pageable.pageNum = 1;
  getTableList(1);
}
defineExpose({ refresh, setScrollTop, el: mScrollbarListRef });
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>

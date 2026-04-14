<template>
  <section :id="id" class="flex-col" style="width: 100%; height: 100%; box-sizing: border-box" ref="scrollBarList">
    <m-scrollbar-v2
      ref="mScrollbarListRef"
      v-bind="props"
      :styleMode="styleMode"
      :padding="padding"
      :paddingWidth="paddingWidth"
      :intersectClassName="`#${id} .m-scrollbar-more`"
      @intersecting="handleIntersecting"
      @directly-scroll-end="handleScrollEnd"
    >
      <template v-if="state.tableData.length > 0">
        <template v-for="(item, index) in state.tableData" :key="index">
          <template v-for="(row, i) in item" :key="props.rowKey || 'key-' + i">
            <template v-if="row.type == 'more'">
              <div class="m-scrollbar-more" :id="`${id}-more-${row.name}`" :data-name="`more-${row.name}`">
                <!-- {{ id }} -more- {{ row.name }} -->
              </div>
            </template>
            <slot v-else :row="row"></slot>
          </template>
        </template>
      </template>
      <template v-else-if="!state.tableLoad">
        <slot name="empty"><m-empty-v2></m-empty-v2></slot>
      </template>

      <!-- loading -->
      <div v-if="state.tableLoad" class="m-loading-v2">
        <m-icon class="loading_font" name="loading_line"></m-icon>
      </div>

      <!-- more -->
      <div v-if="state.tableLoadEnd && state.tableData.length > 0" class="no-more-v2">{{ languagePackage.noMore }}</div>
    </m-scrollbar-v2>

    <slot name="footer">
      <div
        class="flex-center-between m-scrollbar-list-v2_footer padding-top"
        :class="{
          'padding-left': padding?.includes('left') || padding?.includes('all'),
          'padding-right': padding?.includes('right') || padding?.includes('all')
        }"
      >
        <div>
          <slot name="footerLeft"></slot>
        </div>

        <m-pagination-v2
          v-model:current-page="state.pageNum"
          :total="state.pageable.total"
          background
          :page-size="state.pageable.pageSize"
          :page-sizes="state.pageable.pageSizes"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </slot>
  </section>
</template>

<script lang="ts" setup>
// # import
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed, inject, ComputedRef } from "vue";
import { randChar } from "../tools/rand-char";
import { MScrollbarListV2Type } from "./type";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const languagePackage = computed(() => ManagerGlobalConfig.value?.language?.package?.["cell"] || {});

const scrollBarList = ref();
// const emits = defineEmits(["scroll"]);

const props = withDefaults(defineProps<MScrollbarListV2Type>(), {
  showPagination: true,
  styleMode: "default"
});
const id = ref(randChar());
const mScrollbarListRef = ref();

let observer;

// # State 表格状态
const state = reactive({
  // 表格数据
  tableData: [] as objectType[],
  flatTableData: [] as objectType[],
  pageNum: 1,
  // 分页数据
  pageable: {
    // 当前页数
    pageNum: 1,
    // 每页显示条数
    pageSize: 50,
    // 每页选择页数列表
    pageSizes: [50, 100, 150],
    // 总条数
    total: 0
  },
  // 查询参数(只包括查询)
  searchParam: {},
  // 初始化默认的查询参数
  searchInitParam: {},
  // 总参数(包含分页和查询参数)
  tableQuery: { Filter: [], AdvancedFilter: [], Page: {}, Params: {}, Sort: [] },

  tableLoad: false,

  tableLoadEnd: false,

  useSelectionTable: false,

  orderProp: "",

  initShow: false
});

// # onMounted
onMounted(() => {
  getTableList();
});

// # Function 处理滚动到可见区域
function handleIntersecting(el) {
  const name = el?.dataset?.name;
  if (name) {
    const index = name.replace("more-", "");
    state.pageNum = Number(index);
  }
}

// # Function 处理滚动到底部
function handleScrollEnd(data) {
  if (state.tableLoadEnd || state.tableLoad) return;
  if (data) getTableList(++state.pageable.pageNum);
}

async function getTableList(pageNum?: number) {
  const _pageNum = (pageNum || state.pageable.pageNum) - 1;
  if (state.tableLoadEnd || state.tableData[_pageNum]?.length) {
    return;
  }
  if (state.tableLoad) return;
  state.tableLoad = true;

  // let { data } = await api({ ...state.searchInitParam, ...state.totalParam });
  const _query = {
    ...state.tableQuery,
    Page: {
      PageNum: pageNum || state.pageable.pageNum,
      PageSize: state.pageable.pageSize
    }
  };

  state.tableQuery = _query;
  const Data = await props.requestApi(_query);
  // tableRef?.value?.scrollTo(0, 0);

  // const deepData = lodash.cloneDeep(Data);
  const deepData = Data;

  const _data = props.showPagination ? deepData.List || deepData : deepData;
  if (_data.length) {
    const ar = [{ type: "more", name: pageNum || state.pageable.pageNum }, ..._data];
    state.flatTableData = [...state.flatTableData, ..._data];
    state.tableData[_pageNum] = ar;
  }

  props.showPagination && updatePageable({ total: deepData.TotalCount });
  state.tableLoad = false;

  nextTick(() => {
    mScrollbarListRef.value?.resetObserver();
  });

  // setTimeout(() => {
  //   if (pageNum && !next) {
  //     const mpreEl: any = document.querySelector(`#${id.value} #${id.value}-more-${state.pageable.pageNum}`);
  //     if (mpreEl) setScrollTop(Number(mpreEl?.offsetTop) || 0);

  //     setTimeout(() => {
  //       if (pageNum) {
  //         getTableList(pageNum - 1, true);
  //       }
  //     }, 1000);
  //   } else {
  //     if (pageNum) {
  //       getTableList(pageNum - 1, true);
  //     }
  //   }
  // }, 0);

  if (state.flatTableData.length >= deepData.TotalCount) {
    state.tableLoadEnd = true;
  } else {
    getTableList(++state.pageable.pageNum);
  }
}

// #Function  更新分页信息
function updatePageable(resPageable: { pageNum?: number; pageSize?: number; pageSizes?: number[]; total: number }) {
  Object.assign(state.pageable, resPageable);
}

// # onBeforeUnmount
onBeforeUnmount(() => {
  if (observer?.disconnect) observer?.disconnect();
});

// #Function 设置高距离
function setScrollTop(value) {
  mScrollbarListRef?.value?.setScrollToIntersect(value);
}

let lock = false;
function handleCurrentChange(value) {
  if (lock) return (lock = false);
  if (state.tableLoad) return;
  const mpreEl: any = document.querySelector(`#${id.value} #${id.value}-more-${value}`);
  if (mpreEl) setScrollTop(mpreEl);
  // state.pageable.pageNum = value;
  // getTableList(state.pageable.pageNum);
}

// #Function 刷新列表
function refresh() {
  state.tableLoadEnd = false;
  state.flatTableData.length = 0;
  state.tableData.length = 0;
  state.pageable.pageNum = 1;
  getTableList(1);
}

defineExpose({ refresh, setScrollTop, el: mScrollbarListRef });
</script>

<style lang="scss" scoped>
.m-scrollbar-list-v2_footer {
  min-width: 100%;

  &.padding-top {
    padding-top: var(--m-size-v2-padding-base, 10px);
  }
  &.padding-left {
    padding-left: var(--m-size-v2-padding-base, 10px);
    width: calc(100% - calc(var(--m-size-v2-padding-base, 10px)));
    min-width: calc(100% - calc(var(--m-size-v2-padding-base, 10px)));
  }
  &.padding-right {
    padding-right: var(--m-size-v2-padding-base, 10px);
    width: calc(100% - calc(var(--m-size-v2-padding-base, 10px)));
    min-width: calc(100% - calc(var(--m-size-v2-padding-base, 10px)));
  }

  &.padding-left.padding-right {
    width: calc(100% - calc(var(--m-size-v2-padding-base, 10px)) * 2);
    min-width: calc(100% - calc(var(--m-size-v2-padding-base, 10px)) * 2);
  }
}
</style>

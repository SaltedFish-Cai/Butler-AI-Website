<template>
  <div class="pa-pagination" :class="[props.class]" :style="{ ...props.style }">
    <span v-if="showTotal" class="m-pagination-total">
      {{ languagePackage["total"] }} <span>{{ total }}</span> {{ languagePackage["records"] }}
    </span>
    <div v-if="showSizes" class="m-pagination-sizes">
      <pa-select
        style="width: 80px; --pa-size-padding: 5px; --pa-size-font: 12px; --pa-size-height: 24px"
        v-model="internalPageSize"
        @change="handleSizeChange"
        :clearable="false"
        :exOptions="exOptions"
      ></pa-select>
    </div>
    <button
      class="m-pagination-btn m-pagination-prev"
      :disabled="internalCurrentPage <= 1"
      @click="goToPage(internalCurrentPage - 1)"
    >
      <pa-icon name="left_line"></pa-icon>
    </button>
    <template v-if="showPager">
      <button
        v-if="showFirstPage"
        class="m-pagination-btn"
        :class="{ 'is-active': internalCurrentPage == 1 }"
        @click="goToPage(1)"
      >
        1
      </button>
      <span v-if="showPrevMore" class="m-pagination-more" @click="jumpPrevMore"> ••• </span>
      <button
        v-for="page in pagerPages"
        :key="page"
        class="m-pagination-btn"
        :class="{ 'is-active': internalCurrentPage == page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <span v-if="showNextMore" class="m-pagination-more" @click="jumpNextMore"> ••• </span>
      <button
        v-if="showLastPage"
        class="m-pagination-btn"
        :class="{ 'is-active': internalCurrentPage == pageCount }"
        @click="goToPage(pageCount)"
      >
        {{ pageCount }}
      </button>
    </template>
    <button
      class="m-pagination-btn m-pagination-next"
      :disabled="internalCurrentPage >= pageCount"
      @click="goToPage(internalCurrentPage + 1)"
    >
      <pa-icon name="right_line"></pa-icon>
    </button>
    <div v-if="showJumper" class="m-pagination-jumper">
      <span>{{ languagePackage["jumpTo"] }}</span>
      <pa-number
        :min="1"
        :max="pageCount"
        class="m-pagination-jumper-input"
        style="width: 40px; --pa-size-padding: 5px; --pa-size-font: 12px; --pa-size-height: 24px"
        v-model="internalCurrentPage"
        placeholder=" "
        :controls="false"
        :clearable="false"
        :precision="0"
        @change="handleJumperEnter"
      ></pa-number>
      <span>{{ languagePackage["records3"] }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 响应式 API
 * */
import { ref, computed, watch, inject } from "vue";
/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * **组件属性**
 * @description 组件的 props 定义
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 30, 40, 50, 100],
  pagerCount: 3,
  background: false,
  layout: "total, sizes, prev, pager, next, jumper",
  disabled: false
});
/**
 * **组件事件**
 * @description 组件的 emits 定义
 * */
const emit = defineEmits<ComponentEmits>();
/**
 * **语言包**
 * @description 注入的语言包
 * */
const languagePackage = inject("languagePackage") as Record<string, string>;
/**
 * **内部当前页码**
 * @description 内部维护的当前页码状态
 * */
const internalCurrentPage = ref(props.currentPage);
/**
 * **内部每页数量**
 * @description 内部维护的每页数量状态
 * */
const internalPageSize = ref(props.pageSize);
/**
 * **每页数量选项**
 * @description 计算每页数量选择器的选项
 * */
const exOptions = computed(() => {
  return props.pageSizes.map(size => ({
    label: ` ${size}${languagePackage.value["records2"]}`,
    value: size
  }));
});
/**
 * **总页数**
 * @description 计算总页数
 * */
const pageCount = computed(() => {
  const data = Math.max(1, Math.ceil(props.total / internalPageSize.value));
  emit("change-max-page", data);
  return data;
});
/**
 * **布局配置**
 * @description 解析 layout 配置
 * */
const layoutParts = computed(() => {
  return props.layout.split(",").map(part => part.trim());
});
/**
 * **是否显示总数**
 * @description 是否显示总数
 * */
const showTotal = computed(() => layoutParts.value.includes("total"));
/**
 * **是否显示每页数量选择器**
 * @description 是否显示每页数量选择器
 * */
const showSizes = computed(() => layoutParts.value.includes("sizes"));
/**
 * **是否显示页码**
 * @description 是否显示页码
 * */
const showPager = computed(() => layoutParts.value.includes("pager"));
/**
 * **是否显示跳转器**
 * @description 是否显示跳转器
 * */
const showJumper = computed(() => layoutParts.value.includes("jumper"));
/**
 * **页码列表**
 * @description 计算显示的页码列表
 * */
const pagerPages = computed(() => {
  const halfPagerCount = (props.pagerCount - 1) / 2;
  let start = Math.max(1, internalCurrentPage.value - halfPagerCount);
  const end = Math.min(pageCount.value, start + props.pagerCount - 1);
  if (end - start + 1 < props.pagerCount) {
    start = Math.max(1, end - props.pagerCount + 1);
  }
  const pages: Array<number> = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
/**
 * **是否显示第一页**
 * @description 是否显示第一页按钮
 * */
const showFirstPage = computed(() => {
  return pagerPages.value[0] > 1;
});
/**
 * **是否显示最后一页**
 * @description 是否显示最后一页按钮
 * */
const showLastPage = computed(() => {
  return pagerPages.value[pagerPages.value.length - 1] < pageCount.value;
});
/**
 * **是否显示左侧更多**
 * @description 是否显示左侧更多按钮
 * */
const showPrevMore = computed(() => {
  return pagerPages.value[0] > 2;
});
/**
 * **是否显示右侧更多**
 * @description 是否显示右侧更多按钮
 * */
const showNextMore = computed(() => {
  return pagerPages.value[pagerPages.value.length - 1] < pageCount.value - 1;
});
/**
 * **监听当前页码变化**
 * @description 同步 props.currentPage 到内部状态
 * */
watch(
  () => props.currentPage,
  newVal => {
    internalCurrentPage.value = newVal;
  }
);
/**
 * **监听每页数量变化**
 * @description 同步 props.pageSize 到内部状态
 * */
watch(
  () => props.pageSize,
  newVal => {
    internalPageSize.value = newVal;
  }
);
/**
 * **跳转到指定页**
 * @param `page` `number` 目标页码
 * @description 跳转到指定的页码
 * */
const goToPage = (page: number): void => {
  if (props.disabled) return;
  const validPage = Math.max(1, Math.min(page, pageCount.value));
  if (validPage !== internalCurrentPage.value) {
    internalCurrentPage.value = validPage;
    emit("update:currentPage", validPage);
    emit("current-change", validPage);
    if (validPage < internalCurrentPage.value) {
      emit("prev-click", validPage);
    } else if (validPage > internalCurrentPage.value) {
      emit("next-click", validPage);
    }
  }
};
/**
 * **处理每页数量变化**
 * @param `data` `{ value: number }` 选择的数据
 * @description 每页数量变化时的处理
 * */
const handleSizeChange = (data: { value: number }): void => {
  if (props.disabled) return;
  internalPageSize.value = data.value;
  emit("update:pageSize", data.value);
  emit("size-change", data.value);
  const newPageCount = Math.ceil(props.total / data.value);
  if (internalCurrentPage.value > newPageCount) {
    goToPage(newPageCount);
  }
};
/**
 * **处理跳转器输入**
 * @description 跳转器输入确认时的处理
 * */
const handleJumperEnter = (): void => {
  if (props.disabled) return;
  const page = internalCurrentPage.value;
  if (!isNaN(page) && page >= 1 && page <= pageCount.value) {
    goToPage(page);
  }
  internalCurrentPage.value = page;
};
/**
 * **跳转到左侧更多页**
 * @description 点击左侧更多按钮
 * */
const jumpPrevMore = (): void => {
  if (props.disabled) return;
  goToPage(Math.max(1, internalCurrentPage.value - props.pagerCount));
};
/**
 * **跳转到右侧更多页**
 * @description 点击右侧更多按钮
 * */
const jumpNextMore = (): void => {
  if (props.disabled) return;
  goToPage(Math.min(pageCount.value, internalCurrentPage.value + props.pagerCount));
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

<style lang="scss">
.m-pagination-jumper-input {
  .pa-number-input-inner {
    text-align: center;
  }
}
</style>

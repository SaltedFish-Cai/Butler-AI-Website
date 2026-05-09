<template>
  <div class="pa-pagination" :class="[props.class, { 'is-disabled': props.disabled }]" :style="{ ...props.style }">
    <span v-if="showTotal" class="m-pagination-total">
      {{ languagePackage?.["total"] }} <span>{{ total }}</span> {{ languagePackage?.["records2"] }}
    </span>
    <div v-if="showSizes" class="m-pagination-sizes">
      <pa-select
        style="width: 100px; --pa-size-padding: 8px; --pa-size-font: 14px; --pa-size-height: 28px"
        v-model="internalPageSize"
        @change="handleSizeChange"
        :clearable="false"
        :exOptions="exOptions"
        :disabled="props.disabled"
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
      <span>{{ languagePackage?.["jumpTo"] }}</span>
      <pa-number
        :min="1"
        :max="pageCount"
        class="m-pagination-jumper-input"
        style="width: 40px; --pa-size-padding: 8px; --pa-size-font: 14px; --pa-size-height: 28px"
        v-model="internalCurrentPage"
        placeholder=" "
        :controls="false"
        :clearable="false"
        :precision="0"
        @change="handleJumperEnter"
        :disabled="props.disabled"
      ></pa-number>
      <span>{{ languagePackage?.["records3"] || "" }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { ref, computed, watch, inject, ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 30, 40, 50, 100],
  pagerCount: 3,
  background: false,
  layout: "total,sizes,prev,pager,next,jumper",
  disabled: false
});
/**
 * 组件事件
 * @description 组件的 emits 定义
 */
const emit = defineEmits<ComponentEmits>();
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 语言值
 * @type ComputedRef<string>
 * @description 获取当前语言设置
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 语言包
 * @type ComputedRef<Record<string, string>>
 * @description 根据当前语言获取对应的语言包
 */
const languagePackage = computed(() => {
  const data: Record<string, Record<string, string>> = {
    "en-US": {
      total: "Total",
      records: "records/page",
      records2: "records",
      jumpTo: "Jump to",
      records3: "page"
    },
    "zh-CN": {
      total: "共",
      records2: "条",
      records: "条/页",
      records3: "页",
      jumpTo: "跳转"
    }
  };
  return data[languageValue.value];
});
/**
 * 内部当前页码
 * @type Ref<number>
 * @description 内部维护的当前页码状态
 */
const internalCurrentPage = ref(props.currentPage);
/**
 * 内部每页数量
 * @type Ref<number>
 * @description 内部维护的每页数量状态
 */
const internalPageSize = ref(props.pageSize);
/**
 * 跳转到指定页
 * @param page - 目标页码
 * @returns void
 * @description 跳转到指定的页码
 */
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
 * 处理每页数量变化
 * @param data - 选择的数据
 * @returns void
 * @description 每页数量变化时的处理
 */
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
 * 处理跳转器输入
 * @returns void
 * @description 跳转器输入确认时的处理
 */
const handleJumperEnter = (): void => {
  if (props.disabled) return;
  const page = internalCurrentPage.value;
  if (!isNaN(page) && page >= 1 && page <= pageCount.value) {
    goToPage(page);
  }
  internalCurrentPage.value = page;
};
/**
 * 跳转到左侧更多页
 * @returns void
 * @description 点击左侧更多按钮
 */
const jumpPrevMore = (): void => {
  if (props.disabled) return;
  goToPage(Math.max(1, internalCurrentPage.value - props.pagerCount));
};
/**
 * 跳转到右侧更多页
 * @returns void
 * @description 点击右侧更多按钮
 */
const jumpNextMore = (): void => {
  if (props.disabled) return;
  goToPage(Math.min(pageCount.value, internalCurrentPage.value + props.pagerCount));
};
/**
 * 每页数量选项
 * @type ComputedRef<Array<{ label: string; value: number }>>
 * @description 计算每页数量选择器的选项
 */
const exOptions = computed(() => {
  return props.pageSizes.map(size => ({
    label: ` ${size}${languagePackage.value?.["records"] || ""}`,
    value: size
  }));
});
/**
 * 总页数
 * @type ComputedRef<number>
 * @description 计算总页数
 */
const pageCount = computed(() => {
  const data = Math.max(1, Math.ceil(props.total / internalPageSize.value));
  emit("change-max-page", data);
  return data;
});
/**
 * 布局配置
 * @type ComputedRef<Array<string>>
 * @description 解析 layout 配置
 */
const layoutParts = computed(() => {
  return props.layout.split(",").map(part => part.trim());
});
/**
 * 是否显示总数
 * @type ComputedRef<boolean>
 * @description 是否显示总数
 */
const showTotal = computed(() => layoutParts.value.includes("total"));
/**
 * 是否显示每页数量选择器
 * @type ComputedRef<boolean>
 * @description 是否显示每页数量选择器
 */
const showSizes = computed(() => layoutParts.value.includes("sizes"));
/**
 * 是否显示页码
 * @type ComputedRef<boolean>
 * @description 是否显示页码
 */
const showPager = computed(() => layoutParts.value.includes("pager"));
/**
 * 是否显示跳转器
 * @type ComputedRef<boolean>
 * @description 是否显示跳转器
 */
const showJumper = computed(() => layoutParts.value.includes("jumper"));
/**
 * 页码列表
 * @type ComputedRef<Array<number>>
 * @description 计算显示的页码列表
 */
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
 * 是否显示第一页
 * @type ComputedRef<boolean>
 * @description 是否显示第一页按钮
 */
const showFirstPage = computed(() => {
  return pagerPages.value[0] > 1;
});
/**
 * 是否显示最后一页
 * @type ComputedRef<boolean>
 * @description 是否显示最后一页按钮
 */
const showLastPage = computed(() => {
  return pagerPages.value[pagerPages.value.length - 1] < pageCount.value;
});
/**
 * 是否显示左侧更多
 * @type ComputedRef<boolean>
 * @description 是否显示左侧更多按钮
 */
const showPrevMore = computed(() => {
  return pagerPages.value[0] > 2;
});
/**
 * 是否显示右侧更多
 * @type ComputedRef<boolean>
 * @description 是否显示右侧更多按钮
 */
const showNextMore = computed(() => {
  return pagerPages.value[pagerPages.value.length - 1] < pageCount.value - 1;
});
/**
 * 监听当前页码变化
 * @description 同步 props.currentPage 到内部状态
 */
watch(
  () => props.currentPage,
  newVal => {
    internalCurrentPage.value = newVal;
  }
);
/**
 * 监听每页数量变化
 * @description 同步 props.pageSize 到内部状态
 */
watch(
  () => props.pageSize,
  newVal => {
    internalPageSize.value = newVal;
  }
);
</script>
<style lang="scss">
@use "./index.scss";
</style>

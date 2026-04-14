<template>
  <div class="m-pagination-v2" :class="[props.class]" :style="{ ...props.style }">
    <!-- 总条数 -->
    <span v-if="showTotal" class="m-pagination-total">
      {{ languagePackage["total"] }} <span>{{ total }}</span> {{ languagePackage["records"] }}
    </span>

    <!-- 每页显示数量选择器 -->
    <div v-if="showSizes" class="m-pagination-sizes">
      <m-select-v2
        style="width: 80px; --m-component-padding-size: 5px; --m-component-font-size: 12px; --m-component-height-size: 24px"
        v-model="internalPageSize"
        @change="handleSizeChange"
        :clearable="false"
        :exOptions="exOptions"
      ></m-select-v2>
    </div>

    <!-- 上一页按钮 -->
    <button
      class="m-pagination-btn m-pagination-prev"
      :disabled="internalCurrentPage <= 1"
      @click="goToPage(internalCurrentPage - 1)"
    >
      <m-icon-v2 name="left_line"></m-icon-v2>
    </button>

    <!-- 页码按钮 -->
    <template v-if="showPager">
      <!-- 第一页 -->
      <button
        v-if="showFirstPage"
        class="m-pagination-btn"
        :class="{ 'is-active': internalCurrentPage == 1 }"
        @click="goToPage(1)"
      >
        1
      </button>

      <!-- 更多页（左侧） -->
      <span v-if="showPrevMore" class="m-pagination-more" @click="jumpPrevMore"> ••• </span>

      <!-- 中间页码 -->
      <button
        v-for="page in pagerPages"
        :key="page"
        class="m-pagination-btn"
        :class="{ 'is-active': internalCurrentPage == page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <!-- 更多页（右侧） -->
      <span v-if="showNextMore" class="m-pagination-more" @click="jumpNextMore"> ••• </span>

      <!-- 最后一页 -->
      <button
        v-if="showLastPage"
        class="m-pagination-btn"
        :class="{ 'is-active': internalCurrentPage == pageCount }"
        @click="goToPage(pageCount)"
      >
        {{ pageCount }}
      </button>
    </template>

    <!-- 下一页按钮 -->
    <button
      class="m-pagination-btn m-pagination-next"
      :disabled="internalCurrentPage >= pageCount"
      @click="goToPage(internalCurrentPage + 1)"
    >
      <m-icon-v2 name="right_line"></m-icon-v2>
    </button>

    <!-- 跳转到指定页 -->
    <div v-if="showJumper" class="m-pagination-jumper">
      <span>{{ languagePackage["jumpTo"] }}</span>
      <m-number-v2
        :min="1"
        :max="pageCount"
        class="m-pagination-jumper-input"
        style="width: 40px; --m-component-padding-size: 5px; --m-component-font-size: 12px; --m-component-height-size: 24px"
        v-model="internalCurrentPage"
        placeholder=" "
        :controls="false"
        :clearable="false"
        :precision="0"
        @change="handleJumperEnter"
      ></m-number-v2>
      <span>{{ languagePackage["records3"] }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, withDefaults, inject } from "vue";
import { MPaginationV2Type } from "./type";

const props = withDefaults(defineProps<MPaginationV2Type>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 30, 40, 50, 100],
  pagerCount: 3,
  background: false,
  layout: "total, sizes, prev, pager, next, jumper",
  disabled: false
});

const emit = defineEmits<{
  "update:currentPage": [page: number];
  "update:pageSize": [size: number];
  "size-change": [size: number];
  "current-change": [currentPage: number];
  "change-max-page": [maxPage: number];
  "prev-click": [currentPage: number];
  "next-click": [currentPage: number];
}>();

// 内部状态
const languagePackage = inject("languagePackage") as Record<string, string>;
const internalCurrentPage = ref(props.currentPage);
const internalPageSize = ref(props.pageSize);

const exOptions = computed(() => {
  return props.pageSizes.map(size => ({
    label: ` ${size}${languagePackage.value["records2"]}`,
    value: size
  }));
});
// 计算总页数
const pageCount = computed(() => {
  const data = Math.max(1, Math.ceil(props.total / internalPageSize.value));
  emit("change-max-page", data);
  return data;
});

// 解析layout配置
const layoutParts = computed(() => {
  return props.layout.split(",").map(part => part.trim());
});

const showTotal = computed(() => layoutParts.value.includes("total"));
const showSizes = computed(() => layoutParts.value.includes("sizes"));
// const showPrev = computed(() => layoutParts.value.includes("prev"));
const showPager = computed(() => layoutParts.value.includes("pager"));
// const showNext = computed(() => layoutParts.value.includes("next"));
const showJumper = computed(() => layoutParts.value.includes("jumper"));

// 计算页码显示逻辑
const pagerPages = computed(() => {
  const halfPagerCount = (props.pagerCount - 1) / 2;
  let start = Math.max(1, internalCurrentPage.value - halfPagerCount);
  const end = Math.min(pageCount.value, start + props.pagerCount - 1);

  // 调整起始位置
  if (end - start + 1 < props.pagerCount) {
    start = Math.max(1, end - props.pagerCount + 1);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const showFirstPage = computed(() => {
  return pagerPages.value[0] > 1;
});

const showLastPage = computed(() => {
  return pagerPages.value[pagerPages.value.length - 1] < pageCount.value;
});

const showPrevMore = computed(() => {
  return pagerPages.value[0] > 2;
});

const showNextMore = computed(() => {
  return pagerPages.value[pagerPages.value.length - 1] < pageCount.value - 1;
});

// 监听props变化
watch(
  () => props.currentPage,
  newVal => {
    internalCurrentPage.value = newVal;
  }
);

watch(
  () => props.pageSize,
  newVal => {
    internalPageSize.value = newVal;
  }
);

// 事件处理
const goToPage = (page: number) => {
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

const handleSizeChange = ({ value }) => {
  if (props.disabled) return;

  internalPageSize.value = value;
  emit("update:pageSize", value);
  emit("size-change", value);

  // 重新计算当前页码
  const newPageCount = Math.ceil(props.total / value);
  if (internalCurrentPage.value > newPageCount) {
    goToPage(newPageCount);
  }
};

const handleJumperEnter = () => {
  if (props.disabled) return;

  const page = internalCurrentPage.value;
  if (!isNaN(page) && page >= 1 && page <= pageCount.value) {
    goToPage(page);
  }
  internalCurrentPage.value = page;
};

const jumpPrevMore = () => {
  if (props.disabled) return;
  goToPage(Math.max(1, internalCurrentPage.value - props.pagerCount));
};

const jumpNextMore = () => {
  if (props.disabled) return;
  goToPage(Math.min(pageCount.value, internalCurrentPage.value + props.pagerCount));
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

<style lang="scss">
.m-pagination-jumper-input {
  .m-number-v2-input-inner {
    text-align: center;
  }
}
</style>

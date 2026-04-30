<template>
  <pa-pagination
    v-model:current-page="props.pageNum"
    :page-size="exPagination.pageSize || pageable.PageSize"
    :total="pageable.total"
    :page-sizes="exPagination.pageSizes || pageable.pageSizes"
    background
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @change-max-page="handleChangeMaxPage"
  />
</template>

<script setup lang="ts" name="Pagination">
// # Import
import { PaTableUseType } from "./types";

interface PaginationPropsType {
  pageable: PaTableUseType.Pageable;
  pageNum: number;
  exPagination: {
    pageNum?: number;
    pageSize?: number;
    pageSizes?: number[];
    layout?: string;
    pagerCount?: number;
  };
  useFooterCenter?: boolean;
  handleSizeChange: (size: number) => void;
  handleCurrentChange: (currentPage: number) => void;
  handleChangeMaxPage: (maxPage: number) => void;
}

const props = defineProps<PaginationPropsType>();
</script>

<style lang="scss"></style>

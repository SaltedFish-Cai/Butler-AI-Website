---
title: Row E2E Test
---

## Basic Row
<pa-row data-testid="row-basic">
  <pa-col data-testid="col-1" :span="12">Col 1</pa-col>
  <pa-col data-testid="col-2" :span="12">Col 2</pa-col>
</pa-row>

## Row with Gutter
<pa-row data-testid="row-gutter" :gutter="20">
  <pa-col data-testid="col-gutter-1" :span="8">Gutter Col 1</pa-col>
  <pa-col data-testid="col-gutter-2" :span="8">Gutter Col 2</pa-col>
  <pa-col data-testid="col-gutter-3" :span="8">Gutter Col 3</pa-col>
</pa-row>

## Row with Justify Center
<pa-row data-testid="row-justify-center" justify="center">
  <pa-col data-testid="col-justify-center" :span="6">Center</pa-col>
</pa-row>

## Row with Justify End
<pa-row data-testid="row-justify-end" justify="end">
  <pa-col data-testid="col-justify-end" :span="6">End</pa-col>
</pa-row>

## Row with Justify Space Between
<pa-row data-testid="row-justify-between" justify="space-between">
  <pa-col data-testid="col-justify-between-1" :span="4">Between 1</pa-col>
  <pa-col data-testid="col-justify-between-2" :span="4">Between 2</pa-col>
</pa-row>

## Row with Justify Space Around
<pa-row data-testid="row-justify-around" justify="space-around">
  <pa-col data-testid="col-justify-around-1" :span="4">Around 1</pa-col>
  <pa-col data-testid="col-justify-around-2" :span="4">Around 2</pa-col>
</pa-row>

## Row with Align Center
<pa-row data-testid="row-align-center" align="center" style="min-height: 80px;">
  <pa-col data-testid="col-align-center" :span="8">Center Align</pa-col>
</pa-row>

## Row with Align Bottom
<pa-row data-testid="row-align-bottom" align="bottom" style="min-height: 80px;">
  <pa-col data-testid="col-align-bottom" :span="8">Bottom Align</pa-col>
</pa-row>

## Row with All Props
<pa-row 
  data-testid="row-all-props" 
  :gutter="16" 
  justify="space-between" 
  align="center"
  style="min-height: 60px;"
>
  <pa-col data-testid="col-all-props-1" :span="10">All Props 1</pa-col>
  <pa-col data-testid="col-all-props-2" :span="10">All Props 2</pa-col>
</pa-row>

<style scoped>
div {
  margin: 8px 0;
}
</style>

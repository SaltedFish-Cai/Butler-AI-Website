<template>
  <m-title-v2 :padding="['bottom']">Display</m-title-v2>
  <m-time-v2 v-model="value1" type="date-picker-group" display></m-time-v2>

  <m-title-v2 :padding="['bottom']">基础使用(类型：date-picker-group)</m-title-v2>
  <m-time-v2 v-model="value1" type="date-picker-group"></m-time-v2>

  <m-title-v2 :padding="['bottom']">类型：date-picker</m-title-v2>
  <m-time-v2 v-model="value2" type="date-picker"></m-time-v2>

  <m-title-v2 :padding="['bottom']">date-time-picker-group</m-title-v2>
  <m-time-v2 v-model="value3" type="date-time-picker-group"></m-time-v2>

  <m-title-v2 :padding="['bottom']">date-time-picker</m-title-v2>
  <m-time-v2 v-model="value4" type="date-time-picker"></m-time-v2>

  <m-title-v2 :padding="['bottom']">类型：month-picker-group</m-title-v2>
  <m-time-v2 v-model="value5" type="month-picker-group"></m-time-v2>

  <m-title-v2 :padding="['bottom']">类型：month-picker</m-title-v2>
  <m-time-v2 v-model="value6" type="month-picker"></m-time-v2>

  <m-title-v2 :padding="['bottom']">类型：time-picker-group</m-title-v2>
  <m-time-v2 v-model="value7" type="time-picker-group"></m-time-v2>

  <m-title-v2 :padding="['bottom']">类型：time-picker</m-title-v2>
  <m-time-v2 v-model="value8" type="time-picker"></m-time-v2>

  <m-title-v2 :padding="['bottom']">类型：year-picker-group</m-title-v2>
  <m-time-v2 v-model="value9" type="year-picker-group"></m-time-v2>

  <m-title-v2 :padding="['bottom']">类型：year-picker</m-title-v2>
  <m-time-v2 v-model="value10" type="year-picker"></m-time-v2>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value1 = ref(["2024-04-23 00:00:00", "2024-04-28 00:00:01"]);
const value2 = ref("2024-04-23 00:00:00");
const value3 = ref(["2024-04-23 00:00:00", "2024-04-28 00:00:01"]);
const value4 = ref("2024-04-23 00:00:00");
const value5 = ref(["2025-08", "2025-08"]);
const value6 = ref("2024-04");
const value7 = ref(["2024-04-23 20:00:00", "2024-04-28 00:00:01"]);
const value8 = ref("2024-04-23 20:32:00");
const value9 = ref(["2014", "2024"]);
const value10 = ref("2024");
</script>

<style></style>

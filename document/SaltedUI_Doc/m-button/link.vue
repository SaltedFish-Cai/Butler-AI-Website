<template>
  <div class="mb-4">
    <m-button-v2 iconName="star_arc_line" useLine :plain="false" type="primary">Primary</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine :plain="false" type="success">Success</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine :plain="false" type="info">Info</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine :plain="false" type="warning">Warning</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine :plain="false" type="danger">Danger</m-button-v2>
  </div>

  <div class="mb-4">
    <m-button-v2 iconName="star_arc_line" useLine disabled type="primary">Primary</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine disabled type="success">Success</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine disabled type="info">Info</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine disabled type="warning">Warning</m-button-v2>
    <m-button-v2 iconName="star_arc_line" useLine disabled type="danger">Danger</m-button-v2>
  </div>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>

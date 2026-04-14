<template>
  <div class="mb-4">
    <sa-button iconName="star_arc_line" disabled :plain="false" type="primary">Primary</sa-button>
    <sa-button iconName="star_arc_line" disabled :plain="false" type="success">Success</sa-button>
    <sa-button iconName="star_arc_line" disabled :plain="false" type="info">Info</sa-button>
    <sa-button iconName="star_arc_line" disabled :plain="false" type="warning">Warning</sa-button>
    <sa-button iconName="star_arc_line" disabled :plain="false" type="danger">Danger</sa-button>
  </div>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>

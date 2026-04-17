<template>
  <div class="mb-4">
    <sa-button iconName="star_arc_line" useLine :plain="false" type="primary">Primary</sa-button>
    <sa-button iconName="star_arc_line" useLine :plain="false" type="success">Success</sa-button>
    <sa-button iconName="star_arc_line" useLine :plain="false" type="info">Info</sa-button>
    <sa-button iconName="star_arc_line" useLine :plain="false" type="warning">Warning</sa-button>
    <sa-button iconName="star_arc_line" useLine :plain="false" type="danger">Danger</sa-button>
  </div>

  <div class="mb-4">
    <sa-button iconName="star_arc_line" useLine disabled type="primary">Primary</sa-button>
    <sa-button iconName="star_arc_line" useLine disabled type="success">Success</sa-button>
    <sa-button iconName="star_arc_line" useLine disabled type="info">Info</sa-button>
    <sa-button iconName="star_arc_line" useLine disabled type="warning">Warning</sa-button>
    <sa-button iconName="star_arc_line" useLine disabled type="danger">Danger</sa-button>
  </div>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>

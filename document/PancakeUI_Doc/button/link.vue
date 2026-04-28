<template>
  <div class="mb-4">
    <pa-button useLine :plain="false" type="primary">Primary</pa-button>
    <pa-button useLine :plain="false" type="success">Success</pa-button>
    <pa-button useLine :plain="false" type="info">Info</pa-button>
    <pa-button useLine :plain="false" type="warning">Warning</pa-button>
    <pa-button useLine :plain="false" type="danger">Danger</pa-button>
  </div>

  <div class="mb-4">
    <pa-button useLine disabled type="primary">Primary</pa-button>
    <pa-button useLine disabled type="success">Success</pa-button>
    <pa-button useLine disabled type="info">Info</pa-button>
    <pa-button useLine disabled type="warning">Warning</pa-button>
    <pa-button useLine disabled type="danger">Danger</pa-button>
  </div>
</template>

<script lang="ts" setup></script>

<style>
.mb-4 {
  margin-bottom: 1rem;
}
</style>

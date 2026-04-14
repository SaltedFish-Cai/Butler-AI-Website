<template>
  <div class="mo-refresh-pull-to-refresh-indicator scroll-view-pull-to-refresh-indicator">
    <div style="position: absolute; left: 50%; transform: translateX(-50%)">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.mo-refresh-pull-to-refresh-content {
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.mo-refresh-pull-to-refresh-content-wrapper {
  min-height: 100%;
}
.mo-refresh-pull-to-refresh-transition {
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
}

.mo-refresh-pull-to-refresh-indicator {
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.mo-refresh-pull-to-refresh-indicator > div > div {
  background-color: var(--m-scrollbar-thumb-color);
  border-radius: 50%;
  width: 7px;
  height: 7px;
  margin: 3px 5px;
  -webkit-animation: 1s linear infinite both mo-refresh-pull-to-refresh-indicator;
  animation: 1s linear infinite both mo-refresh-pull-to-refresh-indicator;
  display: inline-block;
}

.mo-refresh-pull-to-refresh-indicator > div > div:nth-child(1) {
  -webkit-animation-delay: 0.3s !important;
  animation-delay: 0.3s !important;
}
.mo-refresh-pull-to-refresh-indicator > div > div:nth-child(2) {
  -webkit-animation-delay: 0.6s !important;
  animation-delay: 0.6s !important;
}
.mo-refresh-pull-to-refresh-down .mo-refresh-pull-to-refresh-indicator {
  margin-top: -25px;
}

@-webkit-keyframes mo-refresh-pull-to-refresh-indicator {
  90% {
    opacity: 0.2;
  }

  to {
    opacity: 1;
  }
}
@keyframes mo-refresh-pull-to-refresh-indicator {
  90% {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>

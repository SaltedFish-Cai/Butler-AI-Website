<template>
  <div class="background-paths">
    <svg class="background-paths__svg" viewBox="0 0 696 316" fill="none" aria-hidden="true">
      <path
        v-for="path in paths"
        :key="path.id"
        :d="path.d"
        pathLength="1"
        stroke="currentColor"
        :stroke-width="path.width"
        :opacity="BASE_OPACITY"
        class="background-paths__svg-path"
        :style="{
          animationDuration: `${path.duration}s`,
          animationDelay: `${path.delay}s`
        }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
const BASE_OPACITY = 0.18;

interface PathItem {
  id: number;
  d: string;
  width: number;
  duration: number;
  delay: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generatePaths(): PathItem[] {
  return Array.from({ length: 36 }, (_, i) => {
    const seed = i * 7919;
    const charA = 120 + i * 6;
    const charB = -150;
    const d = `M-${380 - charB} -${189 + charA}
    C-${380 - charB} -${189 + charA}
    -${312 - charB} ${216 - charA}
    ${152 - charB} ${343 - charA}
    C${616 - charB} ${470 - charA}
    ${684 - charB} ${875 - charA}
    ${684 - charB} ${875 - charA}`;
    console.log("++++++++++> d:", d);
    return {
      id: i,
      d,
      width: 0.6,
      duration: 12,
      delay: seededRandom(seed + 1) * 6
    };
  });
}

const paths = generatePaths();
</script>

<style scoped lang="scss">
@keyframes background-paths-flow {
  0% {
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dashoffset: 1;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.background-paths {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-paths-bg);
  color: var(--bg-paths-color);
}

.background-paths__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.background-paths__svg-path {
  fill: none;
  stroke: currentColor;
  stroke-dasharray: 0.15 1;
  animation: background-paths-flow ease-in-out infinite;
  will-change: stroke-dashoffset;
}
</style>

<style lang="scss">
:root {
  --bg-paths-bg: #ffffff;
  --bg-paths-color: #0f172a;
}
.dark {
  --bg-paths-bg: #0a0a0a;
  --bg-paths-color: #ffffff;
}
</style>

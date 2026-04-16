<template>
  <div class="container" :title="switchTitle">
    <div class="inPlugs" @click="toggleAppearance" ref="inPlugsBtn">
      <svg class="inPlugs__img" viewBox="0 0 70 35" width="700px" height="350px" aria-hidden="true">
        <g fill="none" stroke="currentcolor" stroke-linecap="round" stroke-width="1">
          <g class="inPlugs__img-left" transform="translate(13,10)">
            <polyline points="0 0,0 1" />
            <g class="inPlugs__img-left-seg" transform="translate(0,1)">
              <polyline points="0 0,0 1" />
              <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                <polyline points="0 0,0 1" />
                <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                  <polyline points="0 0,0 1" />
                  <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                    <polyline points="0 0,0 1" />
                    <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                      <polyline points="0 0,0 1" />
                      <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                        <polyline points="0 0,0 1" />
                        <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                          <polyline points="0 0,0 1" />
                          <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                            <polyline points="0 0,0 1" />
                            <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                              <polyline points="0 0,0 1" />
                              <g class="inPlugs__img-left-seg" transform="translate(0,1)">
                                <polyline points="0 0,0 1" />
                                <g class="inPlugs__img-left-seg inPlugs__img-left-seg--flip" transform="translate(0,1)">
                                  <polyline points="0 0,0 1" />
                                  <g class="inPlugs__img-left-seg inPlugs__img-left-seg--flip" transform="translate(0,1)">
                                    <polyline points="0 0,0 1" />
                                    <g class="inPlugs__img-left-seg inPlugs__img-left-seg--flip" transform="translate(0,1)">
                                      <polyline points="0 0,0 1" />
                                      <g class="inPlugs__img-left-seg inPlugs__img-left-seg--flip" transform="translate(0,1)">
                                        <polyline points="0 0,0 1" />
                                        <g class="inPlugs__img-left-seg inPlugs__img-left-seg--flip" transform="translate(0,1)">
                                          <polyline points="0 0,0 1" />
                                          <g class="inPlugs__img-left-head" transform="translate(-2.5,1)">
                                            <rect rx="1" ry="1" x="0" y="0" width="5" height="6" />
                                            <polyline class="inPlugs__img-prong" points="1 6,1 8" stroke-dasharray="2 2" />
                                            <polyline class="inPlugs__img-prong" points="4 6,4 8" stroke-dasharray="2 2" />
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
          <g class="inPlugs__img-right" transform="translate(57,10)">
            <polyline points="0 0,0 1" />
            <g class="inPlugs__img-right-seg" transform="translate(0,1)">
              <polyline points="0 0,0 1" />
              <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                <polyline points="0 0,0 1" />
                <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                  <polyline points="0 0,0 1" />
                  <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                    <polyline points="0 0,0 1" />
                    <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                      <polyline points="0 0,0 1" />
                      <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                        <polyline points="0 0,0 1" />
                        <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                          <polyline points="0 0,0 1" />
                          <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                            <polyline points="0 0,0 1" />
                            <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                              <polyline points="0 0,0 1" />
                              <g class="inPlugs__img-right-seg" transform="translate(0,1)">
                                <polyline points="0 0,0 1" />
                                <g class="inPlugs__img-right-seg inPlugs__img-right-seg--flip" transform="translate(0,1)">
                                  <polyline points="0 0,0 1" />
                                  <g class="inPlugs__img-right-seg inPlugs__img-right-seg--flip" transform="translate(0,1)">
                                    <polyline points="0 0,0 1" />
                                    <g class="inPlugs__img-right-seg inPlugs__img-right-seg--flip" transform="translate(0,1)">
                                      <polyline points="0 0,0 1" />
                                      <g class="inPlugs__img-right-seg inPlugs__img-right-seg--flip" transform="translate(0,1)">
                                        <polyline points="0 0,0 1" />
                                        <g class="inPlugs__img-right-seg inPlugs__img-right-seg--flip" transform="translate(0,1)">
                                          <polyline points="0 0,0 1" />
                                          <g class="inPlugs__img-right-head" transform="translate(-2.5,1)">
                                            <rect rx="1" ry="1" x="0" y="0" width="5" height="6" />
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g fill="currentcolor" transform="translate(35,10)">
          <g class="inPlugs__img-spark-1-y"><circle class="inPlugs__img-spark-1-x" r="0" cy="-1" /></g>
          <g class="inPlugs__img-spark-2-y"><circle class="inPlugs__img-spark-2-x" r="0" cy="0" /></g>
          <g class="inPlugs__img-spark-3-y"><circle class="inPlugs__img-spark-3-x" r="0" cy="1" /></g>
        </g>
      </svg>
      <span class="inPlugs__label">Power</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inBrowser } from "vitepress";
import { ref, inject, computed, nextTick } from "vue";
import { useData } from "../composables/data";

const { isDark, theme, themeColor } = useData();

const switchTitle = computed(() => {
  const value = isDark.value ? theme.value.lightModeSwitchTitle || "切换至浅色" : theme.value.darkModeSwitchTitle || "切换至深色";
  inPlugsBtn?.value?.setAttribute("aria-pressed", `${!isDark.value}`);
  return value;
});

const inPlugsBtn = ref();
const enableTransitions = () =>
  "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

function updateMetaThemeColor() {
  if (inBrowser) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')!;
    metaThemeColor.setAttribute("content", isDark.value ? "#1b1b1f" : "#ffffff");
    const _window: any = typeof window == "undefined" ? global : window;
    _window.setManagerTheme(themeColor.value, isDark.value);
  }
}

const toggleAppearance = inject("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    updateMetaThemeColor();
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`
  ];

  // @ts-expect-error
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    updateMetaThemeColor();
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 550,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
      fill: "forwards" // 保持最后一帧
    }
  );
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  --hue: 223;
  --primary: hsl(var(--hue), 90%, 50%);
  --primary2: hsl(var(--hue), 90%, 70%);
  --primary2-t: hsla(var(--hue), 90%, 70%, 0);
  --border: hsl(var(--hue), 10%, 30%);
  --border-hover: hsl(var(--hue), 10%, 50%);
  --trans-dur: 0.3s;
  --trans-timing: cubic-bezier(0.65, 0, 0.35, 1);
  font-size: calc(14px + (70 - 14) * (100vw - 280px) / (3840 - 280));
}

.inPlugs {
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: auto;
  outline: transparent;
  position: relative;
  -webkit-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  color: var(--vp-c-text-1);
  font: 1em/1.5 sans-serif;
  transition: background-color calc(var(--trans-dur) * 0.5) steps(1, end), box-shadow var(--trans-dur) var(--trans-timing),
    color calc(var(--trans-dur) * 0.5) steps(1, end);
  transition: 0.3s;
}

.inPlugs__img {
  display: block;
  position: relative;
  top: 10px;
  left: -3px;
  width: 65px;
  height: auto;
  transform: scale(1.5);
}
.inPlugs__img-left,
.inPlugs__img-left-seg,
.inPlugs__img-left-head,
.inPlugs__img-right,
.inPlugs__img-right-seg,
.inPlugs__img-right-head,
.inPlugs__img-prong,
.inPlugs__img-spark-1-x,
.inPlugs__img-spark-1-y,
.inPlugs__img-spark-2-x,
.inPlugs__img-spark-2-y,
.inPlugs__img-spark-3-x,
.inPlugs__img-spark-3-y {
  animation-duration: calc(var(--trans-dur) * 3);
  animation-timing-function: var(--trans-timing);
}
.inPlugs__img-left-head,
.inPlugs__img-right-head {
  transform-origin: 2px 0;
}
.inPlugs__img-left {
  transform: translate(13px, 10px) rotate(0);
}
.inPlugs__img-right {
  transform: translate(57px, 10px) rotate(0);
}
.inPlugs__img-prong {
  stroke-dashoffset: 0;
}
.inPlugs__img-spark-1-x,
.inPlugs__img-spark-2-x,
.inPlugs__img-spark-3-x {
  animation-timing-function: linear;
}
.inPlugs__img-spark-1-y,
.inPlugs__img-spark-2-y,
.inPlugs__img-spark-3-y {
  animation-timing-function: cubic-bezier(0.35, 1, 0.65, 1);
}
.inPlugs[aria-pressed="false"] .inPlugs__img-left {
  animation-name: left-swing-tail-off;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-left-seg {
  animation-name: left-swing-seg-off;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-left-seg--flip {
  animation-name: left-swing-seg-off-2;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-left-head {
  animation-name: left-swing-head-off;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-right {
  animation-name: right-swing-tail-off;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-right-seg {
  animation-name: right-swing-seg-off;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-right-seg--flip {
  animation-name: right-swing-seg-off-2;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-right-head {
  animation-name: right-swing-head-off;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-prong {
  animation-name: prongs-off;
  animation-timing-function: cubic-bezier(0.35, 0, 0.65, 0);
}
.inPlugs[aria-pressed="false"] .inPlugs__img-spark-1-x {
  animation-name: spark-1-x;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-spark-1-y {
  animation-name: spark-1-y;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-spark-2-x {
  animation-name: spark-2-x;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-spark-2-y {
  animation-name: spark-2-y;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-spark-3-x {
  animation-name: spark-3-x;
}
.inPlugs[aria-pressed="false"] .inPlugs__img-spark-3-y {
  animation-name: spark-3-y;
}
.inPlugs[aria-pressed="true"] .inPlugs__img-left {
  animation-name: left-swing-tail-on;
  transform: translate(13px, 10px) rotate(-90deg);
}
.inPlugs[aria-pressed="true"] .inPlugs__img-left-seg {
  animation-name: left-swing-seg-on;
}
.inPlugs[aria-pressed="true"] .inPlugs__img-left-seg--flip {
  animation-name: right-swing-seg-on;
}
.inPlugs[aria-pressed="true"] .inPlugs__img-left-head {
  animation-name: left-swing-head-on;
}
.inPlugs[aria-pressed="true"] .inPlugs__img-right {
  animation-name: right-swing-tail-on;
  transform: translate(57px, 10px) rotate(90deg);
}
.inPlugs[aria-pressed="true"] .inPlugs__img-right-seg {
  animation-name: right-swing-seg-on;
}
.inPlugs[aria-pressed="true"] .inPlugs__img-right-seg--flip {
  animation-name: left-swing-seg-on;
}
.inPlugs[aria-pressed="true"] .inPlugs__img-right-head {
  animation-name: right-swing-head-on;
}
.inPlugs[aria-pressed="true"] .inPlugs__img-prong {
  animation-name: prongs-on;
  animation-timing-function: cubic-bezier(0.35, 1, 0.65, 1);
  stroke-dashoffset: 2;
}
.inPlugs__label {
  overflow: hidden;
  position: absolute;
  width: 0;
  height: 0;
}

[data-dark="false"] body,
[data-dark="false"] button {
  transition-duration: calc(var(--trans-dur) * 2.25), var(--trans-dur), calc(var(--trans-dur) * 2.25);
}
@keyframes prongs-off {
  from {
    stroke-dashoffset: 2;
  }
  17.5%,
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes left-swing-tail-off {
  from {
    transform: translate(13px, 10px) rotate(-90deg);
  }
  25% {
    transform: translate(13px, 10px) rotate(-32deg);
  }
  50% {
    transform: translate(13px, 10px) rotate(2deg);
  }
  75% {
    transform: translate(13px, 10px) rotate(-1deg);
  }
  to {
    transform: translate(13px, 10px) rotate(0);
  }
}
@keyframes left-swing-seg-off {
  from {
    transform: translate(0, 1px) rotate(0);
  }
  25% {
    transform: translate(0, 1px) rotate(-10deg);
  }
  50% {
    transform: translate(0, 1px) rotate(2deg);
  }
  75% {
    transform: translate(0, 1px) rotate(-1deg);
  }
  to {
    transform: translate(0, 1px) rotate(0);
  }
}
@keyframes left-swing-seg-off-2 {
  from {
    transform: translate(0, 1px) rotate(0);
  }
  25% {
    transform: translate(0, 1px) rotate(10deg);
  }
  50% {
    transform: translate(0, 1px) rotate(2deg);
  }
  75% {
    transform: translate(0, 1px) rotate(-1deg);
  }
  to {
    transform: translate(0, 1px) rotate(0);
  }
}
@keyframes left-swing-head-off {
  from {
    transform: translate(-2.5px, 1px) rotate(0);
  }
  25% {
    transform: translate(-2.5px, 1px) rotate(-10deg);
  }
  50% {
    transform: translate(-2.5px, 1px) rotate(2deg);
  }
  75% {
    transform: translate(-2.5px, 1px) rotate(-1deg);
  }
  to {
    transform: translate(-2.5px, 1px) rotate(0);
  }
}
@keyframes right-swing-tail-off {
  from {
    transform: translate(57px, 10px) rotate(90deg);
  }
  25% {
    transform: translate(57px, 10px) rotate(32deg);
  }
  50% {
    transform: translate(57px, 10px) rotate(-2deg);
  }
  75% {
    transform: translate(57px, 10px) rotate(1deg);
  }
  to {
    transform: translate(57px, 10px) rotate(0);
  }
}
@keyframes right-swing-seg-off {
  from {
    transform: translate(0, 1px) rotate(0);
  }
  25% {
    transform: translate(0, 1px) rotate(10deg);
  }
  50% {
    transform: translate(0, 1px) rotate(-2deg);
  }
  75% {
    transform: translate(0, 1px) rotate(1deg);
  }
  to {
    transform: translate(0, 1px) rotate(0);
  }
}
@keyframes right-swing-seg-off-2 {
  from {
    transform: translate(0, 1px) rotate(0);
  }
  25% {
    transform: translate(0, 1px) rotate(-10deg);
  }
  50% {
    transform: translate(0, 1px) rotate(-2deg);
  }
  75% {
    transform: translate(0, 1px) rotate(1deg);
  }
  to {
    transform: translate(0, 1px) rotate(0);
  }
}
@keyframes right-swing-head-off {
  from {
    transform: translate(-2.5px, 1px) rotate(0);
  }
  25% {
    transform: translate(-2.5px, 1px) rotate(10deg);
  }
  50% {
    transform: translate(-2.5px, 1px) rotate(-2deg);
  }
  75% {
    transform: translate(-2.5px, 1px) rotate(1deg);
  }
  to {
    transform: translate(-2.5px, 1px) rotate(0);
  }
}
@keyframes prongs-on {
  from,
  70% {
    stroke-dashoffset: 0;
  }
  90%,
  to {
    stroke-dashoffset: 2;
  }
}
@keyframes left-swing-tail-on {
  from {
    transform: translate(13px, 10px) rotate(0);
  }
  50% {
    transform: translate(13px, 10px) rotate(-32deg);
  }
  to {
    transform: translate(13px, 10px) rotate(-90deg);
  }
}
@keyframes left-swing-seg-on {
  from {
    transform: translate(0, 1px) rotate(0);
  }
  50% {
    transform: translate(0, 1px) rotate(-10deg);
  }
  to {
    transform: translate(0, 1px) rotate(0);
  }
}
@keyframes left-swing-head-on {
  from {
    transform: translate(-2.5px, 1px) rotate(0);
  }
  50% {
    transform: translate(-2.5px, 1px) rotate(-10deg);
  }
  to {
    transform: translate(-2.5px, 1px) rotate(0);
  }
}
@keyframes right-swing-tail-on {
  from {
    transform: translate(57px, 10px) rotate(0);
  }
  50% {
    transform: translate(57px, 10px) rotate(32deg);
  }
  to {
    transform: translate(57px, 10px) rotate(90deg);
  }
}
@keyframes right-swing-seg-on {
  from {
    transform: translate(0, 1px) rotate(0);
  }
  50% {
    transform: translate(0, 1px) rotate(10deg);
  }
  to {
    transform: translate(0, 1px) rotate(0);
  }
}
@keyframes right-swing-head-on {
  from {
    transform: translate(-2.5px, 1px) rotate(0);
  }
  50% {
    transform: translate(-2.5px, 1px) rotate(10deg);
  }
  to {
    transform: translate(-2.5px, 1px) rotate(0);
  }
}
@keyframes spark-1-x {
  from,
  12.5% {
    r: 1px;
    transform: translate(0, 0);
  }
  37.5%,
  to {
    r: 0;
    transform: translate(-10px, 0);
  }
}
@keyframes spark-1-y {
  from {
    animation-timing-function: steps(1, end);
    transform: translate(0, 0);
    visibility: hidden;
  }
  12.5% {
    animation-timing-function: linear;
    transform: translate(0, 0);
    visibility: visible;
  }
  37.5%,
  to {
    transform: translate(0, -9px);
  }
}
@keyframes spark-2-x {
  from,
  12.5% {
    r: 1px;
    transform: translate(0, 0);
  }
  37.5%,
  to {
    r: 0;
    transform: translate(4px, 0);
  }
}
@keyframes spark-2-y {
  from {
    animation-timing-function: steps(1, end);
    transform: translate(0, 0);
    visibility: hidden;
  }
  12.5% {
    animation-timing-function: linear;
    transform: translate(0, 0);
    visibility: visible;
  }
  37.5%,
  to {
    transform: translate(0, -8px);
  }
}
@keyframes spark-3-x {
  from,
  12.5% {
    r: 1px;
    transform: translate(0, 0);
  }
  37.5%,
  to {
    r: 0;
    transform: translate(-1px, 0);
  }
}
@keyframes spark-3-y {
  from {
    animation-timing-function: steps(1, end);
    transform: translate(0, 0);
    visibility: hidden;
  }
  12.5% {
    animation-timing-function: linear;
    transform: translate(0, 0);
    visibility: visible;
  }
  37.5%,
  to {
    transform: translate(0, 8px);
  }
}
</style>

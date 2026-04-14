<script setup lang="ts">
import { Obj } from "@/package/global";
import { computed, ref, onMounted } from "vue";

const props = defineProps<{
  text?: string[] | string;
}>();

const els: Obj = ref({});
const morphTime = 1;
const coolDownTime = 0.25;
const texts = props.text || [];
let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let coolDown = coolDownTime;

// 判断是否是移动端
const isMobile = computed(() => {
  const _window: any = typeof window == "undefined" ? global : window;
  const _navigator = _window?.navigator || {};
  const agent = _navigator?.userAgent || "";
  return /mobile/i.test(agent);
});

onMounted(() => {
  setTimeout(() => {
    if (isMobile.value) {
      return;
    }
    els.value = {
      VPSvgTextText1: document.getElementById("VPSvgTextText1"),
      VPSvgTextText2: document.getElementById("VPSvgTextText2")
    };
    els.value.VPSvgTextText1.textContent = texts[textIndex % texts.length];
    els.value.VPSvgTextText2.textContent = texts[(textIndex + 1) % texts.length];

    animate();
  }, 300);
});

function doMorph() {
  morph -= coolDown;
  coolDown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
    coolDown = coolDownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

function setMorph(fraction) {
  els.value.VPSvgTextText2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  els.value.VPSvgTextText2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  els.value.VPSvgTextText1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  els.value.VPSvgTextText1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  els.value.VPSvgTextText1.textContent = texts[textIndex % texts.length];
  els.value.VPSvgTextText2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCoolDown() {
  morph = 0;

  els.value.VPSvgTextText2.style.filter = "";
  els.value.VPSvgTextText2.style.opacity = "100%";

  els.value.VPSvgTextText1.style.filter = "";
  els.value.VPSvgTextText1.style.opacity = "0%";
}

function animate() {
  requestAnimationFrame(animate);

  const newTime = new Date();

  const shouldIncrementIndex = coolDown > 0;
  const dt = 10 / 1000;
  time = newTime;

  coolDown -= dt;

  if (coolDown <= 0) {
    if (shouldIncrementIndex) {
      textIndex++;
    }
    doMorph();
  } else {
    doCoolDown();
  }
}
</script>

<template>
  <div v-if="isMobile"></div>
  <template v-else>
    <div id="VPSvgText" class="VPSvgText">
      <span id="VPSvgTextText1" class="VPSvgTextText1"></span>
      <span id="VPSvgTextText2" class="VPSvgTextText2"></span>
    </div>
    <svg id="filters" class="VPSvgDefs">
      <defs>
        <filter id="threshold">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
         0 1 0 0 0
         0 0 1 0 0
         0 0 0 250 -140"
          />
        </filter>
      </defs>
    </svg>
  </template>
</template>

<style scoped>
.VPSvgText {
  position: relative;
  margin: auto;
  width: 100%;
  height: 50px;
  padding-top: 20px;
  margin-bottom: 40px;
  top: 0;
  bottom: 0;
  filter: url(/#threshold) blur(0.6px);
  color: var(--mo-text-color);

  .VPSvgTextText1,
  .VPSvgTextText2 {
    left: 0;
    position: absolute;
    text-align: left;
    width: 100%;
    height: 100%;
    display: inline-block;
    font-weight: 700;
    font-size: 30pt;
    user-select: none;
  }
}

@media (max-width: 960px) {
  .VPSvgTextText1,
  .VPSvgTextText2 {
    text-align: center !important;
  }
}
.VPSvgDefs {
  display: none;
}
</style>

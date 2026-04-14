<template>
  <div class="box" :style="{ top: topX + 'px', left: leftX + 'px' }">
    <div class="box__ghost">
      <div class="symbol"></div>
      <div class="symbol"></div>
      <div class="symbol"></div>
      <div class="symbol"></div>
      <div class="symbol"></div>
      <div class="symbol"></div>
      <div class="box__ghost-container">
        <div class="vp__ghost-eyes">
          <div class="box__eye-left"></div>
          <div class="box__eye-right"></div>
        </div>
        <div class="box__ghost-bottom">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="box__ghost-shadow"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import inBrowser from "@/package/components/tools/inBrowser";

let move;
const topX = ref(-110);
const leftX = ref(-310);
const moveTopX = ref(0);
const moveLeftX = ref(0);
if (inBrowser) {
  setTimeout(() => {
    document.addEventListener("mousemove", function (event) {
      const { clientX, clientY } = event;
      moveTopX.value = clientY + 25;
      moveLeftX.value = clientX + 25;

      const yAxis = ((clientY - topX.value) / 15) * 25;
      const xAxis = ((clientX - leftX.value) / 30) * 3;

      const boxGhostEyes: any = document.querySelector(".vp__ghost-eyes");
      if (boxGhostEyes && boxGhostEyes.style) boxGhostEyes.style.transform = `translate(${xAxis}%,${yAxis}%)`;
    });

    move = setInterval(() => {
      topX.value = topX.value + (moveTopX.value - topX.value) / 20;
      leftX.value = leftX.value + (moveLeftX.value - leftX.value) / 20;
    }, 30);
  }, 4000);
}

onUnmounted(() => {
  clearInterval(move);
});
</script>

<style scoped>
.box {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 9999;
  transform: translateZ(1px) scale(0.3);
}

.box .box__ghost {
  padding: 15px 25px 25px;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -30%);
}
.box .box__ghost .symbol:nth-child(1) {
  opacity: 0.2;
  animation: shine 4s ease-in-out 3s infinite;
}
.box .box__ghost .symbol:nth-child(1):before,
.box .box__ghost .symbol:nth-child(1):after {
  content: "";
  width: 12px;
  height: 4px;
  background: var(--vp-c-text-1);
  position: absolute;
  border-radius: 5px;
  bottom: 65px;
  left: 0;
}
.box .box__ghost .symbol:nth-child(1):before {
  transform: rotate(45deg);
}
.box .box__ghost .symbol:nth-child(1):after {
  transform: rotate(-45deg);
}
.box .box__ghost .symbol:nth-child(2) {
  position: absolute;
  left: -5px;
  top: 30px;
  height: 18px;
  width: 18px;
  border: 4px solid;
  border-radius: 50%;
  border-color: var(--vp-c-text-1);
  opacity: 0.2;
  animation: shine 4s ease-in-out 1.3s infinite;
}
.box .box__ghost .symbol:nth-child(3) {
  opacity: 0.2;
  animation: shine 3s ease-in-out 0.5s infinite;
}
.box .box__ghost .symbol:nth-child(3):before,
.box .box__ghost .symbol:nth-child(3):after {
  content: "";
  width: 12px;
  height: 4px;
  background: var(--vp-c-text-1);
  position: absolute;
  border-radius: 5px;
  top: 5px;
  left: 40px;
}
.box .box__ghost .symbol:nth-child(3):before {
  transform: rotate(90deg);
}
.box .box__ghost .symbol:nth-child(3):after {
  transform: rotate(180deg);
}
.box .box__ghost .symbol:nth-child(4) {
  opacity: 0.2;
  animation: shine 6s ease-in-out 1.6s infinite;
}
.box .box__ghost .symbol:nth-child(4):before,
.box .box__ghost .symbol:nth-child(4):after {
  content: "";
  width: 15px;
  height: 4px;
  background: var(--vp-c-text-1);
  position: absolute;
  border-radius: 5px;
  top: 10px;
  right: 30px;
}
.box .box__ghost .symbol:nth-child(4):before {
  transform: rotate(45deg);
}
.box .box__ghost .symbol:nth-child(4):after {
  transform: rotate(-45deg);
}
.box .box__ghost .symbol:nth-child(5) {
  position: absolute;
  right: 5px;
  top: 40px;
  height: 12px;
  width: 12px;
  border: 3px solid;
  border-radius: 50%;
  border-color: var(--vp-c-text-1);
  opacity: 0.2;
  animation: shine 1.7s ease-in-out 7s infinite;
}
.box .box__ghost .symbol:nth-child(6) {
  opacity: 0.2;
  animation: shine 2s ease-in-out 6s infinite;
}
.box .box__ghost .symbol:nth-child(6):before,
.box .box__ghost .symbol:nth-child(6):after {
  content: "";
  width: 15px;
  height: 4px;
  background: var(--vp-c-text-1);
  position: absolute;
  border-radius: 5px;
  bottom: 65px;
  right: -5px;
}
.box .box__ghost .symbol:nth-child(6):before {
  transform: rotate(90deg);
}
.box .box__ghost .symbol:nth-child(6):after {
  transform: rotate(180deg);
}
.box .box__ghost .box__ghost-container {
  background: var(--sa-color-primary);
  width: 100px;
  height: 100px;
  border-radius: 100px 100px 0 0;
  position: relative;
  margin: 0 auto;
  animation: upndown 3s ease-in-out infinite;
}

.vp__ghost-eyes {
  overflow: hidden;
  -webkit-animation: float 5s infinite linear;
  animation: float 5s infinite linear;
}

.box .box__ghost .box__ghost-container .vp__ghost-eyes {
  position: absolute;
  left: 16%;
  top: 45%;
  height: 12px;
  width: 70px;
}
.box .box__ghost .box__ghost-container .vp__ghost-eyes .box__eye-left {
  width: 12px;
  height: 12px;
  background: #332f63;
  border-radius: 50%;
  margin: 0 10px;
  position: absolute;
  left: 0;
}
.box .box__ghost .box__ghost-container .vp__ghost-eyes .box__eye-right {
  width: 12px;
  height: 12px;
  background: #332f63;
  border-radius: 50%;
  margin: 0 10px;
  position: absolute;
  right: 0;
}
.box .box__ghost .box__ghost-container .box__ghost-bottom {
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
}
.box .box__ghost .box__ghost-container .box__ghost-bottom div {
  flex-grow: 1;
  position: relative;
  top: -10px;
  height: 20px;
  border-radius: 100%;
  background-color: var(--sa-color-primary);
}
.box .box__ghost .box__ghost-container .box__ghost-bottom div:nth-child(2n) {
  top: -12px;
  margin: 0 0px;
  border-top: 15px solid #332f63;
  background: transparent;
}
.box .box__ghost .box__ghost-shadow {
  height: 20px;
  box-shadow: 0 50px 15px 5px #3b3769;
  border-radius: 50%;
  margin: 0 auto;
  animation: smallnbig 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    height: 12px;
  }
  45% {
    height: 12px;
  }
  50% {
    height: 2px;
  }
  55% {
    height: 12px;
  }
  100% {
    height: 12px;
  }
}

@keyframes upndown {
  0% {
    transform: translateY(5px);
  }
  50% {
    transform: translateY(15px);
  }
  100% {
    transform: translateY(5px);
  }
}
@keyframes smallnbig {
  0% {
    width: 90px;
  }
  50% {
    width: 100px;
  }
  100% {
    width: 90px;
  }
}
@keyframes shine {
  0% {
    opacity: 0.2;
  }
  25% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.2;
  }
}
</style>

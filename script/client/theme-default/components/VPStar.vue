<script lang="ts" setup>
import { ref } from "vue";
const isShow = ref(true);
setTimeout(() => {
  isShow.value = false;
}, 4000);
</script>

<template>
  <div class="container" v-if="isShow">
    <div class="container_body" v-if="false">
      <div class="comet">
        <div class="head"><span></span> <span></span></div>
        <span class="tail"> <span></span> <span></span> </span>
        <span class="tail"> <span></span> <span></span> <span></span> </span>
        <span class="tail"> <span></span><span></span> </span>
        <span class="tail"> <span></span> <span></span> <span></span> </span>
      </div>
    </div>
    <!-- <div class="typewriter">欢迎来到 PancakeFish 站点</div> -->
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(70px);
  background-color: rgba(255, 255, 255, 0.7);
  // filter: saturate(120%) blur(20px);
  // &::before {
  //   content: "";
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background-image: inherit; /* 继承容器的背景图片 */
  //   filter: blur(10px); /* 应用模糊效果 */
  //   opacity: 0.7; /* 控制透明度 */
  //   z-index: -1; /* 置于内容之下 */
  //   backdrop-filter: blur(5px);
  //   background-color: rgba(255, 255, 255, 0.7);
  // }
  animation: startBackdrop 3.5s;
  animation-fill-mode: forwards;
  transform: translateZ(5px);
}
@keyframes startBackdrop {
  0% {
    background-color: rgba(255, 255, 255, 1);
    backdrop-filter: blur(70px);
  }
  100% {
    background-color: rgba(255, 255, 255, 0);
    backdrop-filter: blur(0px);
  }
}
.blurred-box {
  /* 设置一个半透明的背景色，可选 */
  background-color: rgba(255, 255, 255, 0.1);

  /* 应用模糊效果 */
  backdrop-filter: blur(10px);

  /* 其他样式，如定位和尺寸 */
  position: absolute;
  width: 300px;
  height: 200px;
}

.container_body {
  position: relative;
  left: -120px;
  top: -0px;
  // animation: startAnimation 8s forwards;
  transform: translateZ(1px);
}

.comet {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  position: absolute;
  padding-right: 2.5rem;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 6.25rem;
  width: 12.5rem;
  z-index: 2;
  animation: cometAnimate 4s ease-in-out infinite;
}
.comet .head {
  overflow: hidden;
  height: 6.25rem;
  width: 6.25rem;
  border: 0.625rem solid #304e8a;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  border-radius: 31.25rem;
  box-sizing: border-box;
  background-color: #19c6ff;
  z-index: 3;
}
.comet .head::before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  bottom: 20%;
  right: 20%;
  z-index: 2;
  border-radius: inherit;
  background-color: rgba(178, 236, 255, 0.5);
}
.comet .head span {
  height: 1.25rem;
  width: 1.25rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border: 0.25rem solid #00ace5;
  box-shadow: 0px 0px 20px white;
  border-radius: 31.25rem;
  opacity: 0;
  animation: cometParticles 1s linear infinite;
}
.comet .head span:nth-child(1) {
  top: 50%;
  height: 0.625rem;
  width: 0.625rem;
}
.comet .head span:nth-child(2) {
  bottom: 50%;
  animation-delay: 0.5s;
}
.comet .tail {
  position: relative;
  height: 0.625rem;
  overflow: hidden;
  z-index: 2;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 0.625rem;
}
.comet .tail span {
  display: inline-flex;
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #304e8a;
  border-radius: inherit;
  opacity: 0;
  animation: tailAnimation 0.6666666667s linear infinite;
}
.comet .tail:nth-of-type(1) {
  width: 64%;
}
.comet .tail:nth-of-type(1) span {
  margin: 0 4%;
  animation-delay: 0.1666666667s;
}
.comet .tail:nth-of-type(2) {
  width: 53%;
}
.comet .tail:nth-of-type(2) span {
  margin: 0 4%;
  animation-delay: 0.3333333333s;
}
.comet .tail:nth-of-type(3) {
  width: 85%;
}
.comet .tail:nth-of-type(3) span {
  margin: 0 6%;
  animation-delay: 0.5s;
}
.comet .tail:nth-of-type(4) {
  width: 52%;
}
.comet .tail:nth-of-type(4) span {
  margin: 0 5%;
  animation-delay: 0.6666666667s;
}

.typewriter {
  position: absolute;
  top: 60%;
  text-align: center;
  color: var(--sa-color-primary);
  font-family: var(--vp-font-family-base);
  white-space: nowrap;
  margin: 0 auto;
  overflow: hidden;
  line-height: 150px;
  font-weight: bold;
  font-size: 82px;
  color: transparent;
  background-image: linear-gradient(
    45deg,
    var(--sa-color-primary),
    var(--el-color-danger-light-4),
    var(--sa-color-primary),
    var(--el-color-danger-light-4),
    var(--sa-color-primary)
  );
  background-clip: text;
  animation: type 5s, ran 7s;
  animation-fill-mode: forwards;
}

@keyframes ran {
  from {
    background-position: 1px 0;
  }
  to {
    background-position: 500px 0;
  }
}

/* 定义打字机动画 */
@keyframes type {
  0% {
    width: 0;
  }
  70% {
    width: 100%;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}

@keyframes startAnimation {
  0% {
    left: -50%;
    top: -50%;
  }
  50% {
    left: -120px;
    top: -0px;
  }
  100% {
    left: 50%;
    top: 50%;
  }
}

@keyframes tailAnimation {
  0% {
    right: -100%;
    opacity: 1;
  }
  50% {
    opacity: 1;
    background-color: #304e8a;
  }
  100% {
    right: 100%;
    opacity: 0;
    background-color: #19c6ff;
  }
}

@keyframes tailAnimation {
  0% {
    right: -100%;
    opacity: 1;
  }
  50% {
    opacity: 1;
    background-color: #304e8a;
  }
  100% {
    right: 100%;
    opacity: 0;
    background-color: #19c6ff;
  }
}

@keyframes cometParticles {
  0% {
    transform: translateX(-250%);
    opacity: 1;
  }
  100% {
    transform: translateX(250%);
    opacity: 1;
  }
}

@keyframes cometAnimate {
  0%,
  100% {
    transform: rotate(45deg) translateX(20px) translateY(0px);
  }
  25%,
  75% {
    transform: rotate(45deg) translateX(-20px) translateY(10px);
  }
  50% {
    transform: rotate(45deg) translateX(20px) translateY(0px);
  }
}
</style>

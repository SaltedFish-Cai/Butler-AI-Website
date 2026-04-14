<template>
  <div class="container">
    <div class="clock">
      <div class="time-box">
        <div class="numbers" id="vp-hours-first">
          <li>0</li>
          <li>1</li>
          <li>2</li>
        </div>
      </div>
      <div class="time-box">
        <div class="numbers" id="vp-hours-second">
          <li>0</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
        </div>
      </div>
      <div class="time-box-m">:</div>
      <div class="time-box">
        <div class="numbers" id="vp-minutes-first">
          <li>0</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </div>
      </div>
      <div class="time-box">
        <div class="numbers" id="vp-minutes-second">
          <li>0</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
        </div>
      </div>
      <div class="time-box-m">:</div>
      <div class="time-box">
        <div class="numbers" id="vp-seconds-first">
          <li>0</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </div>
      </div>
      <div class="time-box">
        <div class="numbers" id="vp-seconds-second">
          <li>0</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted } from "vue";
import inBrowser from "@/package/components/tools/inBrowser";

let time;
if (inBrowser) {
  setTimeout(() => {
    const h1 = document.getElementById("vp-hours-first");
    const h2 = document.getElementById("vp-hours-second");
    const m1 = document.getElementById("vp-minutes-first");
    const m2 = document.getElementById("vp-minutes-second");
    const s1 = document.getElementById("vp-seconds-first");
    const s2 = document.getElementById("vp-seconds-second");
    let hour1 = 0,
      hour2 = 0,
      minute1 = 0,
      minute2 = 0,
      second1 = 0;

    function handleNumber(num) {
      if (num < 10) {
        return [0, num];
      } else {
        return [Math.floor(num / 10), num % 10];
      }
    }

    function changeTime() {
      const time = new Date();
      const [h_1, h_2] = handleNumber(time.getHours());
      const [m_1, m_2] = handleNumber(time.getMinutes());
      const [s_1, s_2] = handleNumber(time.getSeconds());
      if (h1 && h_1 !== hour1) {
        hour1 = h_1;
        h1.style.transform = `translateY(-${hour1 * 30}px)`;
      }
      if (h2 && h_2 !== hour2) {
        hour2 = h_2;
        h2.style.transform = `translateY(-${hour2 * 30}px)`;
      }
      if (m1 && m_1 !== minute1) {
        minute1 = m_1;
        m1.style.transform = `translateY(-${minute1 * 30}px)`;
      }
      if (m2 && m_2 !== minute2) {
        minute2 = m_2;
        m2.style.transform = `translateY(-${minute2 * 30}px)`;
      }
      if (s1 && s_1 !== second1) {
        second1 = s_1;
        s1.style.transform = `translateY(-${second1 * 30}px)`;
      }
      if (s2) s2.style.transform = `translateY(-${s_2 * 30}px)`;
    }
    time = setInterval(changeTime, 1000);
  }, 4000);
}
onUnmounted(() => {
  clearInterval(time);
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}

li {
  list-style: none;
  height: 30px;
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 30px;
  color: var(--el-color-primary);
}

.clock {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 135px;
  padding: 0 10px;
  overflow: hidden;
  height: 30px;
  margin: 0 auto;
  background-color: var(--vp-c-bg-alt);
  border-radius: 20px;
}

.time-box {
  width: 20px;
  height: 100%;
}

.numbers {
  background-color: var(--vp-c-bg-alt);
  text-align: center;
  border-radius: 10px;
  transition: all 0.5s;
}

.time-box-m {
  padding: 0 5px;
  transform: translateY(-2px);
  -webkit-animation: float 2s infinite linear;
  animation: float 2s infinite linear;
}

@keyframes float {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

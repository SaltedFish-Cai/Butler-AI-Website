<template>
  <div class="container">
    <div class="clock">
      <div class="time-box">
        <div class="numbers" id="hours-first">
          <li>0</li>
          <li>1</li>
          <li>2</li>
        </div>
      </div>
      <div class="time-box">
        <div class="numbers" id="hours-second">
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
      <div class="time-box">
        <div class="numbers" id="minutes-first">
          <li>0</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </div>
      </div>
      <div class="time-box">
        <div class="numbers" id="minutes-second">
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
      <div class="time-box">
        <div class="numbers" id="seconds-first">
          <li>0</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </div>
      </div>
      <div class="time-box">
        <div class="numbers" id="seconds-second">
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
import inBrowser from "../../../../src/package/components/tools/inBrowser";

let time;
if (inBrowser) {
  setTimeout(() => {
    const h1 = document.getElementById("hours-first");
    const h2 = document.getElementById("hours-second");
    const m1 = document.getElementById("minutes-first");
    const m2 = document.getElementById("minutes-second");
    const s1 = document.getElementById("seconds-first");
    const s2 = document.getElementById("seconds-second");
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
      let time = new Date();
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
  }, 0);
}
onUnmounted(() => {
  clearInterval(time);
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  list-style: none;
  height: 30px;
  width: 30px;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 30px;
  color: #bbbbbb;
}

.clock {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 400px;
  height: 30px;
  margin: 250px auto;
  background-color: #3b3b3b;
  box-shadow: 2px 2px 10px 3px #2f2f2f;
  transform: translateY(-50%);
  border-radius: 20px;
}

.time-box {
  width: 30px;
  height: 100%;
}

.numbers {
  background-color: #272727;
  box-shadow: 2px 2px 10px 3px #2f2f2f;
  text-align: center;
  border-radius: 10px;
  transition: all 0.5s;
}
</style>

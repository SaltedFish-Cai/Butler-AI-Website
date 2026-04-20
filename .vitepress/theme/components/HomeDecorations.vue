<script setup lang="ts">
import { ref, onMounted } from "vue";

// 动态计数
const componentCount = ref(0);
const targetCount = 53;

// GitHub Stars
const stars = ref("---");

// 最新更新时间
const lastUpdate = ref("");

onMounted(() => {
  // 动态计数动画
  const duration = 2000;
  const steps = 60;
  const increment = targetCount / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetCount) {
      componentCount.value = targetCount;
      clearInterval(timer);
    } else {
      componentCount.value = Math.floor(current);
    }
  }, duration / steps);

  // 设置更新时间
  const now = new Date();
  lastUpdate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(
    2,
    "0"
  )}`;

  // 获取 GitHub Stars (模拟数据，实际可调用API)
  fetch("https://api.github.com/repos/SaltedFish-Cai/Butler-AI-Website")
    .then(res => res.json())
    .then(data => {
      if (data.stargazers_count) {
        stars.value =
          data.stargazers_count >= 1000 ? (data.stargazers_count / 1000).toFixed(1) + "k" : data.stargazers_count.toString();
      }
    })
    .catch(() => {
      stars.value = "50+";
    });
});
</script>

<template>
  <div class="home-decorations">
    <!-- 浮动代码块 -->
    <div class="floating-code">
      <div class="code-block">
        <span class="prompt">$</span>
        <span class="command">git clone</span>
        <span class="package">https://github.com/SaltedFish-Cai/Butler-AI-Website.git</span>
      </div>
    </div>

    <!-- 技术图标墙 -->
    <div class="tech-icons">
      <div class="tech-icon vue" title="Vue.js">
        <svg viewBox="0 0 128 128">
          <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" />
          <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" />
        </svg>
      </div>
      <div class="tech-icon typescript" title="TypeScript">
        <svg viewBox="0 0 128 128">
          <path fill="#3178c6" d="M2,63.91v62.5h125v-125H2Z" />
          <path
            fill="#fff"
            d="M84.42,79.57v7.11H67.31V122H58.52V86.68H41.39V79.57ZM111.12,101a10.5,10.5,0,0,1,2.91,3.11l-3.37,2.2a8.6,8.6,0,0,0-7.35-3.92c-3.81,0-6.18,1.93-6.18,4.71,0,2.31,1.57,3.72,5.15,4.61l2.86.71c5.63,1.38,8.31,4,8.31,8.34,0,5.39-4.15,8.88-10.68,8.88a14.4,14.4,0,0,1-9.11-2.85,11.3,11.3,0,0,1-3.25-4.2l3.77-2.11a9.13,9.13,0,0,0,8.51,5c4,0,6.48-1.93,6.48-5.06,0-2.66-1.69-4.22-5.37-5.15l-3-.74c-5.22-1.28-7.79-3.84-7.79-8,0-5,4-8.31,9.88-8.31A12.78,12.78,0,0,1,111.12,101Z"
          />
        </svg>
      </div>
      <div class="tech-icon vite" title="Vite">
        <svg viewBox="0 0 128 128">
          <defs>
            <linearGradient id="vite-a" x1="13%" x2="100%" y1="12%" y2="88%">
              <stop offset="0%" stop-color="#41d1ff" />
              <stop offset="100%" stop-color="#bd34fe" />
            </linearGradient>
            <linearGradient id="vite-b" x1="19%" x2="68%" y1="20%" y2="90%">
              <stop offset="0%" stop-color="#ffbd4f" />
              <stop offset="100%" stop-color="#ff980e" />
            </linearGradient>
          </defs>
          <path
            fill="url(#vite-a)"
            d="M124.77,18.21L67.5,123.81c-1.18,2.11-4.24,1.19-4.24-1.26V70.53H13.24c-2.25,0-3.29-2.77-1.68-4.31L121.09,14.32C122.84,12.64,125.59,15.31,124.77,18.21Z"
          />
          <path
            fill="url(#vite-b)"
            d="M124.77,18.21L67.5,123.81c-1.18,2.11-4.24,1.19-4.24-1.26V70.53L121.09,14.32C122.84,12.64,125.59,15.31,124.77,18.21Z"
          />
        </svg>
      </div>
    </div>

    <!-- 数据展示区 -->
    <div class="stats-section">
      <div class="stat-item">
        <span class="stat-value">{{ componentCount }}+</span>
        <span class="stat-label">组件</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stars }}</span>
        <span class="stat-label">GitHub Stars</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ lastUpdate }}</span>
        <span class="stat-label">最新更新</span>
      </div>
    </div>

    <!-- 装饰线条 -->
    <svg class="decoration-lines" viewBox="0 0 1200 400" preserveAspectRatio="none">
      <path class="deco-line line-1" d="M0,100 Q300,50 600,100 T1200,100" />
      <path class="deco-line line-2" d="M0,200 Q300,250 600,200 T1200,200" />
      <circle class="deco-dot" cx="300" cy="100" r="4" />
      <circle class="deco-dot" cx="600" cy="100" r="4" />
      <circle class="deco-dot" cx="900" cy="100" r="4" />
    </svg>
  </div>
</template>

<style scoped>
.home-decorations {
  position: relative;
  width: 100%;
  padding: 40px 0;
}

/* 浮动代码块 */
.floating-code {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.code-block {
  background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
  padding: 16px 28px;
  border-radius: 12px;
  font-family: "Fira Code", "Monaco", monospace;
  font-size: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: floatCode 3s ease-in-out infinite;
}

.prompt {
  color: #6c7086;
  margin-right: 8px;
}
.command {
  color: #89b4fa;
}
.package {
  color: #a6e3a1;
  font-weight: 600;
  margin-left: 8px;
}

@keyframes floatCode {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 技术图标墙 */
.tech-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 40px;
}

.tech-icon {
  width: 48px;
  height: 48px;
  padding: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.tech-icon:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.tech-icon svg {
  width: 100%;
  height: 100%;
}

/* 数据展示区 */
.stats-section {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1.2;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}

/* 装饰线条 */
.decoration-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.3;
  z-index: -1;
}

.deco-line {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 1;
  stroke-dasharray: 8 4;
}

.deco-dot {
  fill: var(--vp-c-brand-1);
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-section {
    gap: 24px;
  }
  .stat-value {
    font-size: 24px;
  }
  .tech-icon {
    width: 40px;
    height: 40px;
  }
}
</style>

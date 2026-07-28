<template>
  <div :id="randId" ref="containerRef" class="ai-loading" :class="{ 'ai-loading--done': !loading }">
    <canvas ref="canvasRef" class="ai-loading__canvas" />

    <div class="ai-loading__overlay">
      <div v-if="loading" class="ai-loading__content">
        <div class="ai-loading__spinner">
          <span v-for="i in 3" :key="i" class="ai-loading__dot" />
        </div>
        <p v-if="text" class="ai-loading__text">{{ text }}</p>
        <p v-if="subtext" class="ai-loading__subtext">{{ subtext }}</p>
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import useRenderId from "../tools/render-id";

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    text?: string;
    subtext?: string;
    xScale?: number;
    yScale?: number;
    distortion?: number;
    /** 背景色（CSS 色值），默认从 --pa-color-bg 自动读取 */
    bgColor?: string;
    /** 扫描线颜色（CSS 色值），默认根据主题自动适配 */
    lineColor?: string;
    /** 扫描线亮度倍率 */
    lineIntensity?: number;
    /** 组件唯一标识 */
    id?: string;
  }>(),
  {
    subtext: "",
    xScale: 1.0,
    yScale: 0.5,
    distortion: 0.05,
    lineIntensity: 1.0
  }
);

/**
 * render-id
 * @description 组件唯一标识
 */
const randId = ref((props.id ? props.id + "_" : "") + "pa-ai-loading_" + useRenderId());

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// ─── Three.js refs ──────────────────────────────────────────────────

let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let mesh: THREE.Mesh | null = null;
let uniforms: {
  resolution: { value: [number, number] };
  time: { value: number };
  xScale: { value: number };
  yScale: { value: number };
  distortion: { value: number };
  bgColor: { value: THREE.Color };
  lineColor: { value: THREE.Color };
  lineIntensity: { value: number };
} | null = null;
let animationId: number | null = null;

// ─── 主题颜色读取 ──────────────────────────────────────────────────

function cssToThreeColor(css: string, fallback: THREE.Color): THREE.Color {
  try {
    const c = new THREE.Color(css);
    return isFinite(c.r) && isFinite(c.g) && isFinite(c.b) ? c : fallback;
  } catch {
    return fallback;
  }
}

function isLightColor(css: string): boolean {
  const c = new THREE.Color(css);
  return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b > 0.5;
}

function resolveThemeColors(el: HTMLElement) {
  const themeBg = props.bgColor || getComputedStyle(el).getPropertyValue("--pa-color-bg").trim() || "#282828";
  const bgColor = cssToThreeColor(themeBg, new THREE.Color(0x282828));

  if (props.lineColor) {
    return { bgColor, lineColor: cssToThreeColor(props.lineColor, new THREE.Color(1, 1, 1)) };
  }

  if (isLightColor(themeBg)) {
    // light 主题：深蓝色扫描线，重叠区域合成深蓝
    const lineColor = new THREE.Color(0x1a3a8a);
    return { bgColor, lineColor };
  }

  // dark 主题：白色高亮扫描线（经典 neon 效果）
  return { bgColor, lineColor: new THREE.Color(1, 1, 1) };
}

// ─── Shader ─────────────────────────────────────────────────────────

const vertexShader = `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2  resolution;
  uniform float time;
  uniform float xScale;
  uniform float yScale;
  uniform float distortion;
  uniform vec3  bgColor;
  uniform vec3  lineColor;
  uniform float lineIntensity;

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float d = length(p) * distortion;

    float rx = p.x * (1.0 + d);
    float gx = p.x;
    float bx = p.x * (1.0 - d);

    float rIntensity = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
    float gIntensity = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
    float bIntensity = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

    vec3 scanline = vec3(rIntensity, gIntensity, bIntensity);
    vec3 color = mix(bgColor, lineColor, clamp(scanline * lineIntensity, 0.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Init / cleanup ─────────────────────────────────────────────────

function initScene() {
  if (!canvasRef.value || !containerRef.value) return;

  const canvas = canvasRef.value;
  const { bgColor, lineColor } = resolveThemeColors(containerRef.value);

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(bgColor);

  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

  uniforms = {
    resolution: { value: [window.innerWidth, window.innerHeight] as [number, number] },
    time: { value: 0.0 },
    xScale: { value: props.xScale },
    yScale: { value: props.yScale },
    distortion: { value: props.distortion },
    bgColor: { value: bgColor },
    lineColor: { value: lineColor },
    lineIntensity: { value: props.lineIntensity }
  };

  const positions = new THREE.BufferAttribute(
    new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, 1.0, 0.0]),
    3
  );
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", positions);

  const material = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: THREE.DoubleSide
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  handleResize();
}

function animate() {
  if (uniforms) {
    uniforms.time.value += 0.005;
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  animationId = requestAnimationFrame(animate);
}

function handleResize() {
  if (!renderer || !uniforms) return;
  const container = containerRef.value;
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width === 0 || height === 0) return;
  renderer.setSize(width, height, false);
  uniforms.resolution.value = [width, height];
}

/** 重新读取 CSS 变量并更新 Three.js uniforms */
function updateThemeColors() {
  if (!containerRef.value || !uniforms || !renderer) return;
  const { bgColor, lineColor } = resolveThemeColors(containerRef.value);
  uniforms.bgColor.value = bgColor;
  uniforms.lineColor.value = lineColor;
  renderer.setClearColor(bgColor);
}

function disposeScene() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (mesh) {
    scene?.remove(mesh);
    mesh.geometry.dispose();
    if (mesh.material instanceof THREE.Material) {
      mesh.material.dispose();
    }
  }
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  mesh = null;
  uniforms = null;
}

// ─── Lifecycle ──────────────────────────────────────────────────────

let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;

onMounted(() => {
  initScene();
  animate();

  resizeObserver = new ResizeObserver(() => {
    handleResize();
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  // 监听 <html> 属性变化（PancakeUI 切换主题时会在 html 上加 dark class）
  themeObserver = new MutationObserver(() => {
    updateThemeColors();
  });
  themeObserver.observe(document.documentElement, { attributes: true });

  // bgColor / lineColor prop 变化时也更新主题色
  watch(
    () => [props.bgColor, props.lineColor],
    () => {
      updateThemeColors();
    }
  );
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  themeObserver?.disconnect();
  themeObserver = null;
  window.removeEventListener("resize", handleResize);
  disposeScene();
});
</script>

<style scoped lang="scss">
.ai-loading {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--pa-color-bg, #282828);
}

.ai-loading__canvas {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.ai-loading__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}

.ai-loading__content {
  text-align: center;
  padding: 40px 20px;
}

.ai-loading__spinner {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 24px;
}

.ai-loading__dot {
  width: 10px;
  height: 10px;
  background: var(--pa-color-success, #67c23a);
  border-radius: 50%;
  animation: ai-loading-dot-bounce 1.4s ease-in-out infinite both;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes ai-loading-dot-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.ai-loading__text {
  font-size: 15px;
  color: var(--pa-color-font, rgba(255, 255, 255, 0.85));
  margin: 0 0 8px;
  font-weight: 500;
  letter-spacing: 0.02em;
  animation: ai-loading-text-pulse 1.8s ease-in-out infinite;
}

.ai-loading__subtext {
  font-size: 13px;
  color: var(--pa-color-send-font, rgba(255, 255, 255, 0.45));
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.01em;
}

@keyframes ai-loading-text-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>

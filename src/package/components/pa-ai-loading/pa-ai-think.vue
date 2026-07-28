<template>
  <div ref="containerRef" class="ai-think" :class="{ 'ai-think--done': !thinking }">
    <canvas ref="canvasRef" class="ai-think__canvas" />

    <div class="ai-think__overlay">
      <div v-if="thinking" class="ai-think__content">
        <p v-if="text" class="ai-think__text">{{ text }}</p>
        <p v-if="subtext" class="ai-think__subtext">{{ subtext }}</p>
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const props = withDefaults(
  defineProps<{
    thinking?: boolean;
    text?: string;
    subtext?: string;
    /** 动画速度 */
    speed?: number;
    /** 线条密度 (2-10) */
    density?: number;
    /** 马赛克分块 X */
    mosaicX?: number;
    /** 马赛克分块 Y */
    mosaicY?: number;
    /** 线条颜色（CSS 色值），不传则 dark 模式白色、light 模式黑色 */
    lineColor?: string;
    /** 是否使用 RGB 分色 */
    colorSplit?: boolean;
  }>(),
  {
    subtext: "",
    speed: 0.005,
    density: 5,
    mosaicX: 4.0,
    mosaicY: 2.0,
    colorSplit: true
  }
);

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
  density: { value: number };
  mosaicX: { value: number };
  mosaicY: { value: number };
  colorSplit: { value: boolean };
  lineColor: { value: THREE.Color };
} | null = null;
let animationId: number | null = null;

// ─── 线条颜色解析 ──────────────────────────────────────────────────

function isDark(el: HTMLElement): boolean {
  const bg = getComputedStyle(el).getPropertyValue("--pa-color-bg").trim();
  if (!bg) return true; // 无主题变量时默认 dark
  try {
    const c = new THREE.Color(bg);
    return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b <= 0.5;
  } catch {
    return true;
  }
}

function resolveLineColor(el: HTMLElement): THREE.Color {
  if (props.lineColor) {
    try {
      const c = new THREE.Color(props.lineColor);
      return isFinite(c.r) && isFinite(c.g) && isFinite(c.b)
        ? c
        : isDark(el)
        ? new THREE.Color(1, 1, 1)
        : new THREE.Color(0, 0, 0);
    } catch {
      return isDark(el) ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0);
    }
  }
  return isDark(el) ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0);
}

// ─── Shader ──────────────────────────────────────────────────────────

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
  uniform float density;
  uniform float mosaicX;
  uniform float mosaicY;
  uniform bool  colorSplit;
  uniform vec3  lineColor;

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / max(resolution.x, resolution.y);

    // 马赛克效果
    vec2 screenSize = vec2(256.0, 256.0);
    vec2 mosaic = vec2(mosaicX, mosaicY);
    uv.x = floor(uv.x * screenSize.x / mosaic.x) / (screenSize.x / mosaic.x);
    uv.y = floor(uv.y * screenSize.y / mosaic.y) / (screenSize.y / mosaic.y);

    float t = time + random(vec2(uv.x, 0.0)) * 0.4;
    float lineWidth = 0.0008;

    vec3 color = vec3(0.0);

    if (colorSplit) {
      // RGB 分色扫描线
      for (int j = 0; j < 3; j++) {
        for (int i = 0; i < 5; i++) {
          float fi = float(i);
          float fj = float(j);
          float phase = t - 0.01 * fj + fi * 0.01;
          float intensity = lineWidth * (fi * fi) / abs(fract(phase) * 1.0 - length(uv));
          color[j] += intensity;
        }
      }
    } else {
      // 单色扫描线
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float intensity = lineWidth * (fi * fi) / abs(fract(t + fi * 0.01) * 1.0 - length(uv));
        color += intensity * 0.33;
      }
    }

    vec3 raw = clamp(color, 0.0, 1.0);
    float a = clamp(max(raw.r, max(raw.g, raw.b)), 0.0, 1.0);
    vec3 finalColor = mix(vec3(0.0), lineColor, raw);
    gl_FragColor = vec4(finalColor * a, a);
  }
`;

// ─── Init / cleanup ─────────────────────────────────────────────────

function initScene() {
  if (!canvasRef.value || !containerRef.value) return;

  const canvas = canvasRef.value;
  const lineColor = resolveLineColor(containerRef.value);

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setClearColor(0x000000, 0); // 完全透明

  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

  uniforms = {
    resolution: { value: [window.innerWidth, window.innerHeight] as [number, number] },
    time: { value: 0.0 },
    density: { value: props.density },
    mosaicX: { value: props.mosaicX },
    mosaicY: { value: props.mosaicY },
    colorSplit: { value: props.colorSplit },
    lineColor: { value: lineColor }
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
    uniforms.time.value += props.speed;
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

onMounted(() => {
  initScene();
  animate();

  resizeObserver = new ResizeObserver(() => {
    handleResize();
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  window.removeEventListener("resize", handleResize);
  disposeScene();
});
</script>

<style scoped lang="scss">
.ai-think {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

.ai-think__canvas {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.ai-think__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}

.ai-think__content {
  text-align: center;
  padding: 40px 20px;
}

.ai-think__text {
  font-size: calc(var(--pa-size-font, 20px) * 1.2);
  color: var(--pa-color-font, rgba(255, 255, 255, 0.85));
  margin: 0 0 8px;
  font-weight: 500;
  letter-spacing: 0.02em;
  animation: ai-think-fade 2s ease-in-out infinite;
}

.ai-think__subtext {
  font-size: 13px;
  color: var(--pa-color-send-font, rgba(255, 255, 255, 0.45));
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.01em;
}

@keyframes ai-think-fade {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

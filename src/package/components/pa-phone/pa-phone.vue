<template>
  <div :id="randId" ref="rootRef" :class="['pa-phone', `pa-phone--${model}`]">
    <div class="pa-phone__scaled" :style="scaledStyle">
      <div class="pa-phone__bezel" :style="[bezelStyle, { transform: `scale(${autoScale})`, transformOrigin: '0 0' }]">
        <div class="pa-phone__screen" :style="screenStyle">
          <!-- Wallpaper -->
          <div v-if="wallpaper" class="pa-phone__wallpaper" :style="wallpaperStyle" />

          <!-- Notch / Dynamic Island -->
          <div v-if="useIsland" class="pa-phone__cutout pa-phone__cutout--island" :style="cutoutStyle" />
          <div v-else-if="useNotch" class="pa-phone__cutout pa-phone__cutout--notch" :style="cutoutStyle" />

          <!-- Status Bar -->
          <div class="pa-phone__status-bar">
            <span class="pa-phone__status-time">{{ hours }}<span class="pa-phone__time-colon">:</span>{{ minutes }}</span>
            <div>
              <slot name="statusIcons">
                <pa-icon name="butler-wifi" />
              </slot>
            </div>
          </div>

          <!-- Nav Bar -->
          <slot name="navTitle">
            <div v-if="hasNavBar" class="pa-phone__nav-bar" :style="navBarStyle">
              <span class="pa-phone__nav-title" :style="{ color: navTitleColorComputed }">
                {{ navTitleComputed }}
              </span>
            </div>
          </slot>

          <!-- Content -->
          <div ref="contentRef" class="pa-phone__content">
            <!-- 组件工作台模式 -->
            <template v-if="workshopMode && workshopComponents">
              <div
                v-for="(comp, index) in workshopComponents"
                :key="comp.id || index"
                class="pa-phone__comp"
                :class="{
                  'pa-phone__comp--selected': comp.id === workshopSelectedId,
                  'pa-phone__comp--dragging': draggedIndex === index,
                  'pa-phone__comp--drop-before': dragOverIndex === index
                }"
                draggable="true"
                @click="emit('workshopSelect', comp.id)"
                @dragstart="onCompDragStart(index, $event)"
                @dragover.prevent="onCompDragOver(index, $event)"
                @dragleave="onCompDragLeave($event)"
                @drop.prevent.stop="onCompDrop(index)"
                @dragend="onCompDragEnd"
              >
                <div class="pa-phone__comp-label">{{ getCompLabel(comp.type) }}</div>
                <component :is="getCompRenderer(comp.type)" :component="comp" />
              </div>
              <div
                class="pa-phone__comp-end-zone"
                :class="{ 'pa-phone__comp-end-zone--active': dragOverIndex === (workshopComponents?.length ?? 0) }"
                @dragover.prevent="dragOverIndex = workshopComponents?.length ?? 0"
                @dragenter.prevent="dragOverIndex = workshopComponents?.length ?? 0"
                @drop.prevent.stop="onCompDrop(workshopComponents?.length ?? 0)"
              />
            </template>
            <!-- 动态组件模式（编译后的 Vue 组件） -->
            <template v-else-if="dynamicComp">
              <div class="pa-phone__dynamic">
                <component :is="dynamicComp" />
              </div>
            </template>
            <!-- SFC 源码模式（传入 .vue 源码字符串，自动编译渲染） -->
            <template v-else-if="sfcSource">
              <div
                class="pa-phone__dynamic"
                :class="{ 'pa-phone__dynamic--streaming': sfcStreaming }"
                @contextmenu="handleContentContextmenu"
              >
                <!-- <Transition name="pa-phone__typewriter" mode="out-in"> -->
                <component :is="sfcCompiled" :key="sfcVersion" v-if="sfcCompiled" />
                <div v-else class="pa-phone__sfc-pending" :key="'pending'">
                  <pa-ai-siri v-if="sfcStreaming" variant="fluid-dots" :size="240" />
                  <span v-else class="pa-phone__sfc-pending-text">暂无内容</span>
                </div>
                <!-- </Transition> -->
              </div>
            </template>
            <!-- 默认内容插槽 -->
            <slot v-else />
          </div>

          <!-- Bottom Slot -->
          <div v-if="$slots.bottom" class="pa-phone__bottom">
            <slot name="bottom" />
          </div>

          <!-- Loading Overlay -->
          <div v-if="loading" class="pa-phone__loading-overlay">
            <slot name="loading">
              <pa-ai-siri variant="fluid-dots" :size="400" />
            </slot>
          </div>

          <!-- Home Indicator -->
          <div v-if="showHomeIndicator" class="pa-phone__home-bar">
            <div class="pa-phone__home-indicator" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch, nextTick, onMounted, onUnmounted, type Component } from "vue";
import * as Vue from "vue";
import { useRoute, useRouter } from "vue-router";
import type { PhoneModel, DeviceSpec } from "./types";
import { apiFetch } from "./api";
import useRenderId from "../tools/render-id";

// WorkshopComponent 类型定义（轻量内联，避免耦合 workshop 模块）
interface WorkshopComponent {
  id: string;
  type: string;
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    model?: PhoneModel;
    color?: string;
    wallpaper?: string;
    bezel?: number;
    radius?: number;
    showIsland?: boolean | null;
    showNotch?: boolean | null;
    showHomeIndicator?: boolean;
    screenBg?: string;
    navTitle?: string | false;
    navBg?: string;
    navTitleColor?: string;
    loading?: boolean;
    // 工作台组件渲染模式
    workshopMode?: boolean;
    workshopComponents?: WorkshopComponent[];
    workshopSelectedId?: string | null;
    workshopRenderer?: (type: string) => Component | undefined;
    workshopLabel?: (type: string) => string;
    // 动态组件模式（编译后的 Vue 组件实例）
    dynamicComp?: Component | null;
    // SFC 源码模式（.vue 源码字符串，自动编译渲染）
    sfcSource?: string;
    // SFC 上下文：向动态 SFC 注入自定义方法和数据，通过 ctx.xxx 访问
    sfcContext?: Record<string, unknown>;
    // SFC 刷新键：变化时强制重新编译（即使 sfcSource 未变），用于同页面 _route_id 变化
    sfcRefreshKey?: number;
    /** 组件唯一标识 */
    id?: string;
  }>(),
  {
    model: "14-pro",
    color: "space-black",
    wallpaper: "",
    bezel: 12,
    radius: 56,
    showIsland: null,
    showNotch: null,
    showHomeIndicator: true,
    screenBg: "#000",
    loading: false,
    workshopMode: false,
    workshopComponents: () => [],
    workshopSelectedId: null,
    workshopRenderer: undefined,
    workshopLabel: undefined,
    dynamicComp: null,
    sfcContext: undefined,
    sfcRefreshKey: 0
  }
);

const emit = defineEmits<{
  workshopSelect: [id: string];
  workshopMove: [fromIndex: number, toIndex: number];
  contextmenu: [event: MouseEvent, target: HTMLElement];
}>();

/**
 * render-id
 * @description 组件唯一标识
 */
const randId = ref((props.id ? props.id + "_" : "") + "pa-phone_" + useRenderId());

// ─── SFC 源码编译（支持流式渲染） ──────────────────────

/** SFC 编译后的组件实例 */
const sfcCompiled = shallowRef<Component | null>(null);
/** 流式渲染中（源码正在累积，等待防抖编译） */
const sfcStreaming = ref(false);
/** 版本计数器，每次重新编译时递增，用于触发 Transition 动画 */
const sfcVersion = ref(0);
/** 注入到 document.head 中的样式元素 */
let sfcStyleEl: HTMLStyleElement | null = null;
/** 防抖定时器 */
let sfcDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 提取 .vue 源码中的绑定名（const/let/var/function 声明）
 */
function extractBindings(code: string): string[] {
  const names = new Set<string>();

  // 1. 先移除字符串字面量（必须放在注释移除之前！否则 // 正则会误匹配 URL 中的 // 如 https://xxx）
  let sanitized = code
    .replace(/'[^']*'/g, '""')
    .replace(/"[^"]*"/g, '""')
    .replace(/`[^`]*`/g, '""');

  // 2. 再移除注释
  sanitized = sanitized.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

  // 3. 计算指定位置的花括号嵌套深度，用于过滤非顶层声明
  function depthAt(pos: number): number {
    let d = 0;
    for (let i = 0; i < pos; i++) {
      const c = sanitized[i];
      if (c === "{") d++;
      else if (c === "}") d = Math.max(0, d - 1);
    }
    return d;
  }

  // 4. 抓取顶层变量声明：const xxx = 、let yyy = 、const xxx: Type = 等
  //    只捕获 depth === 0 的声明，忽略函数/块内部的局部变量
  const declRe = /(?:const|let|var)\s+(\w+)(?:\s*:\s*[^=]+?)?\s*=/g;
  let m: RegExpExecArray | null;
  while ((m = declRe.exec(sanitized)) !== null) {
    if (depthAt(m.index) > 0) continue;
    const t = m[1].trim();
    if (t && /^\w+$/.test(t)) {
      names.add(t);
    }
  }

  // 5. 顶层解构赋值：const { a, b, c } = ... 或 const [a, b] = ...
  const destructureRe = /(?:const|let|var)\s*([{[])([\s\S]*?)\1\s*=/g;
  let dm: RegExpExecArray | null;
  while ((dm = destructureRe.exec(sanitized)) !== null) {
    if (depthAt(dm.index) > 0) continue;
    const inner = dm[2];
    // 提取解构中的所有标识符：处理 a, b: c, d: { e }, ...rest
    const idRe = /(\w+)\s*(?:\s*[,}:]|\s*$)/g;
    let im: RegExpExecArray | null;
    while ((im = idRe.exec(inner)) !== null) {
      names.add(im[1]);
    }
  }

  // 6. 顶层函数声明
  const fnRe = /function\s+(\w+)\s*\(/g;
  let fm: RegExpExecArray | null;
  while ((fm = fnRe.exec(sanitized)) !== null) {
    if (depthAt(fm.index) > 0) continue;
    const fName = fm[1].trim();
    if (fName && /^\w+$/.test(fName)) {
      names.add(fName);
    }
  }

  return [...names].filter(n => n !== "__returned__");
}

/**
 * 清理 <script setup> 内容，移除 new Function() 无法执行的 Vue 特有语法
 * 包括：多行 import、Vue 编译器宏、TypeScript 类型注解、接口/类型声明
 */
function sanitizeScriptSetup(code: string): string {
  let s = code;

  // 1. 移除跨多行的 import 块 (import 声明可能跨行: \n 在 { 和 } 之间)
  s = s.replace(/^\s*import\s+(?:type\s+)?\{[\s\S]*?\}\s+from\s+['"][^'"]*['"];?\s*$/gm, "");

  // 2. 移除单行 import（兼容缩进空格）
  s = s.replace(/^\s*import\b.*$/gm, "");

  // 2b. line-by-line 彻底清除 regex 可能遗漏的 import 行（边缘格式）
  s = s
    .split("\n")
    .filter(line => !/^\s*import\b/.test(line))
    .join("\n");

  // 3. 移除 interface / type 声明
  //    interface X { ... } 或 type X = ...
  //    注意：生成的 SFC 中 interface 前有缩进空格，需用 ^\s* 匹配
  s = s.replace(/^\s*interface\s+\w+[\s\S]*?\{[^}]*\}\s*$/gm, "");
  s = s.replace(/^\s*type\s+\w+\s*=.*$/gm, "");

  // 4. 移除 Vue 编译器宏调用及其参数
  //    defineProps({ ... }) 或 defineProps<{ ... }>()
  //    defineEmits<{ ... }>() 或 defineEmits(['...'])
  //    defineExpose({ ... })
  //    withDefaults(defineProps<{ ... }>(), { ... })
  //    defineModel<string>('modelValue')
  s = s.replace(/withDefaults\s*\([\s\S]*?\)\s*\)\s*,?\s*/g, "");
  s = s.replace(/defineProps\s*(?:<[\s\S]*?>)?\s*\([\s\S]*?\)\s*,?\s*/g, "");
  s = s.replace(/defineEmits\s*(?:<[\s\S]*?>)?\s*\([\s\S]*?\)\s*,?\s*/g, "");
  s = s.replace(/defineExpose\s*\([\s\S]*?\)\s*,?\s*/g, "");
  s = s.replace(/defineModel\s*(?:<[\s\S]*?>)?\s*\([\s\S]*?\)\s*,?\s*/g, "");
  s = s.replace(/defineSlots\s*(?:<[\s\S]*?>)?\s*\([\s\S]*?\)\s*,?\s*/g, "");

  // 5. 移除 TypeScript 类型注解
  //    const x: Type = ... → const x = ...
  //    const x: Type<T> = ... → const x = ...
  //    注意：避免误匹配三元表达式 ? : 中的冒号
  s = s.replace(/(const|let|var)(\s+\w+)\s*:\s*[A-Z]\w*(?:<[^>]*>)?\s*(?==)/g, "$1$2");

  // 6. 移除函数参数的类型注解 (param: Type → param)
  s = s.replace(/\(\s*(\w+)\s*:\s*\w+(?:<[^>]*>)?\s*(?=[,)])/g, "($1");

  // 7. 移除 as Type 表达式
  s = s.replace(/\s+as\s+\w+(?:<[^>]*>)?/g, "");

  // 8. 移除 .vue 后缀的组件导入残留
  s = s.replace(/^.*\.vue['"];?\s*$/gm, "");

  // 9. 移除函数调用上的泛型类型参数（如 ref<DataMap>({}) → ref({})）
  //    htmlToVueSFC 生成的代码中有 ref<DataMap>({})，TypeScript 泛型在 new Function() 中
  //    会被解析为比较运算符（ref < DataMap > ({})），导致 ReferenceError
  s = s.replace(/<([A-Za-z_]\w*(?:\s*<[^>]*>)?)>\s*(?=\()/g, "");

  return s.trim();
}

/**
 * 提取标签体内容，考虑嵌套情况
 * 从 source 中查找 open tag，用深度计数匹配正确的闭合位置
 */
function extractTagContent(source: string, openRegex: RegExp): { content: string; closed: boolean } {
  const openMatch = source.match(openRegex);
  if (!openMatch) return { content: "", closed: false };

  const openTag = openMatch[0];
  const startIdx = openMatch.index! + openTag.length;

  // 提取 open 标签名用于嵌套计数（如 template、script、style）
  const tagNameMatch = openTag.match(/<\/?(\w+)/);
  const tagName = tagNameMatch ? tagNameMatch[1] : "";
  const openPattern = new RegExp(`<${tagName}[\\s>]`, "g");
  const closePattern = new RegExp(`</${tagName}[\\s>]`, "g");

  // 在剩余字符串中逐个查找，用深度计数定位正确闭合
  const rest = source.substring(startIdx);
  const tokens: { index: number; isClose: boolean }[] = [];

  let m: RegExpExecArray | null;
  while ((m = openPattern.exec(rest)) !== null) {
    tokens.push({ index: m.index, isClose: false });
  }
  while ((m = closePattern.exec(rest)) !== null) {
    tokens.push({ index: m.index, isClose: true });
  }

  tokens.sort((a, b) => a.index - b.index);

  let depth = 1;
  for (const token of tokens) {
    if (token.isClose) {
      depth--;
      if (depth === 0) {
        const content = source.substring(startIdx, startIdx + token.index);
        return { content: content.trim(), closed: true };
      }
    } else {
      depth++;
    }
  }

  // 未找到匹配的闭合 → 取剩余全部
  return { content: rest.trim(), closed: false };
}

/**
 * 解析 SFC 源码（流式安全）
 * 提取 template/script/style 内容，并标记各段是否闭合
 */
function parseSFCPartial(source: string): {
  template: string;
  script: string;
  css: string;
  templateClosed: boolean;
  scriptClosed: boolean;
  styleClosed: boolean;
} {
  const tmpl = extractTagContent(source, /<template[^>]*>/);
  const scr = extractTagContent(source, /<script[^>]*>/);
  const stl = extractTagContent(source, /<style[^>]*>/);

  return {
    template: tmpl.content,
    script: scr.content,
    css: stl.content,
    templateClosed: tmpl.closed,
    scriptClosed: scr.closed,
    styleClosed: stl.closed
  };
}

/**
 * 编译 SFC 源码，返回组件和 CSS（无副作用）
 * 流式安全：仅当 script/style 完全闭合后才执行对应处理
 * 模板预编译兜底：拒绝残缺模板，避免 Vue 运行时编译器崩溃
 */
function compileSFC(source: string, context?: Record<string, unknown>): { component: Component | null; css: string } {
  const { template, script, css, scriptClosed, styleClosed } = parseSFCPartial(source);

  console.log("[pa-phone] compileSFC debug:", {
    hasTemplate: !!template,
    templateLen: template?.length,
    hasScript: !!script,
    scriptLen: script?.length,
    scriptClosed,
    styleClosed,
    scriptPreview: script?.substring(0, 500)
  });

  // 模板无内容 → 返回 null，保留上次状态
  if (!template) {
    return { component: null, css: "" };
  }

  const templateStr = `<div class="pa-phone__sfc-wrap">${template}</div>`;

  // 无脚本 或 script 未闭合 → 只渲染模板
  if (!script || !scriptClosed) {
    console.log("[pa-phone] template-only mode (no setup)");
    return { component: { template: templateStr }, css: styleClosed ? css : "" };
  }

  // script 已闭合 → 编译完整组件
  let processedScript = sanitizeScriptSetup(script);

  // ── useRoute 覆写：让编译后的 SFC 始终能通过 useRoute().query.id
  //    获取正确的 __routeId__（来自 handleSwitchToPage 设置的同步变量）
  //    避免依赖 Vue Router 的 reactive 状态（history.replaceState 不会触发它）
  //    仅在脚本调用了 useRoute 时注入，避免不必要的覆写
  if (processedScript.includes("useRoute")) {
    processedScript =
      `
// [pa-phone] useRoute override — 确保 query.id 始终反映当前 _route_id
const __pa_useRoute = useRoute;
useRoute = () => {
  const __r = __pa_useRoute();
  const __id = (typeof window !== "undefined" && window.__phone_route_id) || ctx.__routeId__ || __r.query.id || '';
  return __id ? { ...__r, query: { ...__r.query, id: __id } } : __r;
};
` + processedScript;
  }

  // 兼容已保存的旧页面：注入 __routeId__ 读取逻辑
  // 使旧页面 SFC 中的 fetchBindData() 也能获取 _route_id 参数并传给 API
  if (!processedScript.includes("__routeId__") && /fetch\(`\/api\/apps\/[^`]+\/data`/.test(processedScript)) {
    processedScript =
      "const __routeId__ = (typeof window !== \"undefined\" && window.__phone_route_id) || ctx.__routeId__ || new URL(window.location.href).searchParams.get('id') || '';\n" +
      processedScript;
    processedScript = processedScript.replace(
      /fetch\(`(\/api\/apps\/[^`]+\/data)`/g,
      "fetch(__routeId__ ? `$1?id=${encodeURIComponent(__routeId__)}` : `$1`"
    );
  }

  const bindings = extractBindings(processedScript);
  const returnProps = bindings.map(n => `  ${n}`).join(",\n");

  console.log("[pa-phone] script + template mode, bindings:", bindings);
  console.log("[pa-phone] raw script (first 500):", script.substring(0, 500));
  console.log("[pa-phone] cleaned script (first 500):", processedScript.substring(0, 500));

  // 若用户脚本已声明 ctx（如 const ctx = inject('ctx')），则不再重复注入
  const hasCtxDecl = /\b(const|let|var)\s+ctx\b/.test(processedScript);
  const ctxDecl = hasCtxDecl ? "" : "const ctx = sfcContext || {};";
  const fnBody = `
      const { ref, reactive, computed, watch, onMounted, onUnmounted, inject } = Vue;
      ${ctxDecl}
      ${processedScript}
      return typeof __returned__ !== 'undefined' ? __returned__ : {
${returnProps}
      };
    `;

  try {
    const setupFn = new Function("Vue", "apiFetch", "useRoute", "useRouter", "sfcContext", fnBody) as (
      vue: typeof Vue,
      apiFetch: typeof import("@/shared/api")["apiFetch"],
      useRoute: typeof import("vue-router")["useRoute"],
      useRouter: typeof import("vue-router")["useRouter"],
      sfcContext: Record<string, unknown> | undefined
    ) => Record<string, unknown>;

    return {
      component: {
        template: templateStr,
        setup() {
          return setupFn(Vue, apiFetch, useRoute, useRouter, context);
        }
      },
      css: styleClosed ? css : ""
    };
  } catch (e) {
    console.error("[pa-phone] SFC script compile error:", e);
    console.error("[pa-phone] Failed fnBody (first 2000 chars):", fnBody.substring(0, 2000));
    // JS 编译失败 → 退回纯模板渲染
    return { component: { template: templateStr }, css: styleClosed ? css : "" };
  }
}

/** 清理注入的样式 */
function clearSfcStyles() {
  if (sfcStyleEl) {
    document.head.removeChild(sfcStyleEl);
    sfcStyleEl = null;
  }
}

/** 注入/更新样式 */
function applySfcStyles(css: string) {
  if (!css) return;
  if (sfcStyleEl) {
    sfcStyleEl.textContent = css;
  } else {
    const id = "pa-phone-sfc-styles";
    sfcStyleEl = document.getElementById(id) as HTMLStyleElement;
    if (!sfcStyleEl) {
      sfcStyleEl = document.createElement("style");
      sfcStyleEl.id = id;
      document.head.appendChild(sfcStyleEl);
    }
    sfcStyleEl.textContent = css;
  }
}

/** 尝试编译，成功则更新组件和样式。返回是否编译成功 */
function tryCompile(source: string, context?: Record<string, unknown>): boolean {
  const { component, css } = compileSFC(source, context);
  if (component) {
    sfcCompiled.value = component;
    sfcVersion.value++;
    if (css) applySfcStyles(css);
    return true;
  }
  return false;
}

// 监听 sfcSource — 流式模式（loading=true 时保留 streaming 状态让打字机动画持续）
watch(
  () => props.sfcSource,
  source => {
    if (sfcDebounceTimer) {
      clearTimeout(sfcDebounceTimer);
      sfcDebounceTimer = null;
    }

    if (!source) {
      sfcStreaming.value = false;
      sfcCompiled.value = null;
      clearSfcStyles();
      return;
    }

    // 流式加载中 → 跳过编译，避免内容更新导致遮罩层后的内容闪烁
    if (props.loading) {
      sfcStreaming.value = true;
      return;
    }

    sfcStreaming.value = true;

    // 立即尝试编译
    if (tryCompile(source, props.sfcContext)) {
      sfcStreaming.value = false;
      return;
    }

    // 编译失败 → 防抖重试（等源码稳定后再试）
    sfcDebounceTimer = setTimeout(() => {
      tryCompile(source, props.sfcContext);
      sfcStreaming.value = false;
    }, 200);
  },
  { immediate: true }
);

// 监听 loading — loading 从 true 变为 false 时，说明流式生成已结束
// 编译最终的 sfcSource 并移除 streaming 状态
watch(
  () => props.loading,
  (loading, prevLoading) => {
    if (prevLoading === true && loading === false) {
      // 编译最终的 sfcSource（之前加载中跳过的编译）
      if (props.sfcSource) {
        tryCompile(props.sfcSource, props.sfcContext);
      }
      // 延迟一帧，确保最新的 sfcSource 已经编译完成
      nextTick(() => {
        sfcStreaming.value = false;
      });
    }
  }
);

// 监听 sfcRefreshKey — 强制重新编译 SFC（即使 sfcSource 未变）
// 用于同页面不同 _route_id 导航时重新触发 fetchBindData
watch(
  () => props.sfcRefreshKey,
  (key, prevKey) => {
    if (key !== prevKey && props.sfcSource) {
      if (tryCompile(props.sfcSource, props.sfcContext)) {
        sfcStreaming.value = false;
      }
    }
  }
);

// ─── 工作台组件渲染 ────────────────────────────────────

const draggedIndex = ref(-1);
const dragOverIndex = ref(-1);

function getCompLabel(type: string): string {
  return props.workshopLabel?.(type) || type;
}

function getCompRenderer(type: string): Component | undefined {
  return props.workshopRenderer?.(type);
}

function onCompDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index;
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("text/plain", String(index));
}

function onCompDragOver(index: number, event: DragEvent) {
  if (draggedIndex.value < 0) return;
  event.dataTransfer!.dropEffect = "move";
  dragOverIndex.value = index;
}

function onCompDragLeave(event: DragEvent) {
  const related = event.relatedTarget as Node | null;
  const current = event.currentTarget as Node;
  if (related && current.contains(related)) return;
  if (draggedIndex.value < 0) return;
  dragOverIndex.value = -1;
}

function onCompDrop(dropIndex: number) {
  if (draggedIndex.value < 0) return;
  const from = draggedIndex.value;
  const to = from < dropIndex ? dropIndex - 1 : dropIndex;
  if (from !== to) {
    emit("workshopMove", from, to);
  }
  draggedIndex.value = -1;
  dragOverIndex.value = -1;
}

function onCompDragEnd() {
  draggedIndex.value = -1;
  dragOverIndex.value = -1;
}

// ─── SFC 内容区右键事件 ──────────────────────────────

/** 处理 SFC 动态内容区域的右键点击，将事件和目标元素发出供父级使用 */
function handleContentContextmenu(event: MouseEvent) {
  const target = event.target as HTMLElement;
  // 只对内容区域的子元素（非容器本身）触发
  if (target && target !== event.currentTarget) {
    emit("contextmenu", event, target);
  }
}

const DEVICE_SPECS: Record<string, DeviceSpec> = {
  x: { w: 375, h: 812, radius: 50, bezel: 12, topSafe: 47, bottomSafe: 34, notch: { w: 210, h: 35, r: 18 } },
  "14": { w: 390, h: 844, radius: 56, bezel: 12, topSafe: 47, bottomSafe: 34, notch: { w: 225, h: 33, r: 18 } },
  "14-pro": { w: 393, h: 852, radius: 56, bezel: 12, topSafe: 59, bottomSafe: 34, island: { w: 126, h: 37, r: 20 } },
  "15": { w: 393, h: 852, radius: 56, bezel: 12, topSafe: 59, bottomSafe: 34, island: { w: 126, h: 37, r: 20 } },
  "15-pro": { w: 393, h: 852, radius: 56, bezel: 12, topSafe: 59, bottomSafe: 34, island: { w: 126, h: 37, r: 20 } },
  plain: { w: 390, h: 844, radius: 56, bezel: 12, topSafe: 16, bottomSafe: 16 }
};

const PRESET_COLORS: Record<string, string> = {
  black: "#0b0b0d",
  midnight: "#0b0c10",
  silver: "#d7d8dc",
  starlight: "#f1eee9",
  "space-black": "#1c1e22",
  gold: "#f2dfb3",
  blue: "#2b4fa8",
  pink: "#ffbfd1",
  titanium: "#837a72",
  "natural-titanium": "#a69a8a",
  green: "#2b622e",
  red: "#c81f2f"
};

function shade(hex: string, pct: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  const [r, g, b] = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  const k = (100 + pct) / 100;
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${to(r).toString(16).padStart(2, "0")}${to(g).toString(16).padStart(2, "0")}${to(b).toString(16).padStart(2, "0")}`;
}

const spec = computed(() => DEVICE_SPECS[props.model] || DEVICE_SPECS["14-pro"]);

const outerWidth = computed(() => spec.value.w + props.bezel * 2);
const outerHeight = computed(() => spec.value.h + props.bezel * 2);
const outerRadius = computed(() => props.radius + props.bezel);

const colorHex = computed(() => PRESET_COLORS[props.color] || props.color);
const frameGradient = computed(
  () => `linear-gradient(135deg, ${shade(colorHex.value, 8)} 0%, ${colorHex.value} 40%, ${shade(colorHex.value, -14)} 100%)`
);

// ─── Auto Scale ──────────────────────────────────────────
const SCALE_PADDING = 0.04;

const rootRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const autoScale = ref(1);

let resizeObserver: ResizeObserver | null = null;
let contentMutationObserver: MutationObserver | null = null;
let contentScrollTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleScrollPoll() {
  contentScrollTimer = setTimeout(() => {
    const el = contentRef.value;
    if (el && props.loading) {
      el.scrollTop = el.scrollHeight;
      scheduleScrollPoll();
    }
  }, 150);
}

watch(
  () => props.loading,
  val => {
    if (val) {
      scheduleScrollPoll();
    } else {
      if (contentScrollTimer !== null) {
        clearTimeout(contentScrollTimer);
        contentScrollTimer = null;
      }
      const el = contentRef.value;
      if (el) el.scrollTop = 0;
    }
  },
  { immediate: true }
);

function updateAutoScale() {
  const el = rootRef.value;
  if (!el) return;
  const parent = el.parentElement;
  if (!parent) return;
  const pw = parent.clientWidth;
  const ph = parent.clientHeight;
  if (pw <= 0 || ph <= 0) return;
  const scaleW = (pw * (1 - SCALE_PADDING)) / (outerWidth.value + 50);
  const scaleH = (ph * (1 - SCALE_PADDING)) / (outerHeight.value + 50);
  autoScale.value = Math.min(scaleW, scaleH, 1);
}

onMounted(() => {
  const el = rootRef.value;
  if (el?.parentElement) {
    resizeObserver = new ResizeObserver(() => {
      updateAutoScale();
    });
    resizeObserver.observe(el.parentElement);
  }
  requestAnimationFrame(() => updateAutoScale());

  const contentEl = contentRef.value;
  if (contentEl) {
    let scrollPending = false;
    contentMutationObserver = new MutationObserver(() => {
      if (!props.loading) return;
      if (scrollPending) return;
      scrollPending = true;
      requestAnimationFrame(() => {
        scrollPending = false;
        contentEl.scrollTop = contentEl.scrollHeight;
      });
    });
    contentMutationObserver.observe(contentEl, { subtree: true, childList: true });
  }

  timer = setInterval(() => {
    currentTime.value = formatTime();
  }, 1000);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  contentMutationObserver?.disconnect();
  if (contentScrollTimer !== null) clearTimeout(contentScrollTimer);
  clearInterval(timer);
  if (sfcDebounceTimer !== null) clearTimeout(sfcDebounceTimer);
  // 清理 SFC 注入的样式
  if (sfcStyleEl) {
    document.head.removeChild(sfcStyleEl);
    sfcStyleEl = null;
  }
});

const scaledStyle = computed(() => ({
  width: `${outerWidth.value * autoScale.value}px`,
  height: `${outerHeight.value * autoScale.value}px`,
  position: "relative" as const
}));

const useIsland = computed(() => {
  if (props.showIsland !== null) return props.showIsland;
  return Boolean(spec.value.island);
});

const useNotch = computed(() => {
  if (props.showNotch !== null) return props.showNotch;
  return Boolean(spec.value.notch) && !useIsland.value;
});

const cutoutSpec = computed(() => {
  if (useIsland.value && spec.value.island) return spec.value.island;
  if (useNotch.value && spec.value.notch) return spec.value.notch;
  return null;
});

const bezelStyle = computed(() => ({
  width: `${outerWidth.value}px`,
  height: `${outerHeight.value}px`,
  borderRadius: `${outerRadius.value}px`,
  background: frameGradient.value,
  padding: `${props.bezel}px`
}));

const screenStyle = computed(() => ({
  borderRadius: `${props.radius}px`,
  background: props.screenBg
}));

const wallpaperStyle = computed(() => {
  if (!props.wallpaper) return {};
  return {
    backgroundImage: `url(${props.wallpaper})`,
    backgroundSize: "cover" as const,
    backgroundPosition: "center" as const,
    backgroundRepeat: "no-repeat" as const
  };
});

const cutoutStyle = computed(() => {
  if (!cutoutSpec.value) return { display: "none" };
  return {
    width: `${cutoutSpec.value.w}px`,
    height: `${cutoutSpec.value.h}px`,
    borderRadius: `${cutoutSpec.value.r}px`
  };
});

const hasNavBar = computed(() => {
  return props.navTitle !== false && props.navTitle !== undefined;
});

const navTitleComputed = computed(() => {
  return props.navTitle || "";
});

const navBarStyle = computed(() => ({
  background: props.navBg || "#fff",
  color: props.navTitleColor || "#000"
}));

const navTitleColorComputed = computed(() => props.navTitleColor || "#000");

function formatTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

const currentTime = ref(formatTime());
const hours = computed(() => currentTime.value.split(":")[0]);
const minutes = computed(() => currentTime.value.split(":")[1]);
let timer: ReturnType<typeof setInterval>;
</script>

<style scoped lang="scss">
.pa-phone {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .pa-phone__scaled {
    flex-shrink: 0;
    overflow: hidden;
  }

  .pa-phone__bezel {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }

  .pa-phone__screen {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateZ(0px);
  }

  // -------- Wallpaper --------
  .pa-phone__wallpaper {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  // -------- Cutout (Island / Notch) --------
  .pa-phone__cutout {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    z-index: 3;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  }

  .pa-phone__cutout--island {
    top: 12px;
  }

  .pa-phone__cutout--notch {
    top: 8px;
  }

  // -------- Status Bar --------
  .pa-phone__status-bar {
    position: relative;
    z-index: 2;
    height: 60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    font-size: var(--pa-size-font);
    background: var(--pa-color-bg);
    color: var(--pa-color-font);
    .pa-icon {
      font-size: calc(var(--pa-size-font) + 4px);
    }
  }

  .pa-phone__status-time {
    font-weight: 600;
  }

  // -------- Nav Bar --------
  .pa-phone__nav-bar {
    position: relative;
    z-index: 2;
    height: 44px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .pa-phone__nav-title {
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // -------- Content --------
  .pa-phone__content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  // -------- Bottom Slot --------
  .pa-phone__bottom {
    flex-shrink: 0;
    width: 100%;
    position: relative;
    z-index: 2;
  }

  // -------- Loading Overlay --------
  .pa-phone__loading-overlay {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
    gap: 12px;
  }

  // -------- Home Indicator --------
  .pa-phone__home-bar {
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 3;
    pointer-events: none;
  }

  .pa-phone__home-indicator {
    width: 134px;
    max-width: 34%;
    height: 5px;
    border-radius: 3px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.35));
    opacity: 0.9;
  }

  // -------- Workshop Component Renderer --------
  .pa-phone__comp {
    position: relative;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.15s, opacity 0.2s;
    user-select: none;

    &:hover {
      border-color: var(--pa-color-send-font, #c0c4cc);
    }
  }

  .pa-phone__comp--selected {
    border-color: var(--pa-color-primary, #409eff);
    background: rgba(64, 158, 255, 0.03);
  }

  .pa-phone__comp--dragging {
    opacity: 0.35;
  }

  .pa-phone__comp--drop-before::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--pa-color-primary, #409eff);
    border-radius: 2px;
    z-index: 3;
    pointer-events: none;
  }

  .pa-phone__comp-label {
    position: absolute;
    top: -1px;
    right: -1px;
    font-size: 10px;
    padding: 1px 6px;
    background: var(--pa-color-primary, #409eff);
    color: #fff;
    border-radius: 0 6px 0 6px;
    line-height: 1.6;
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .pa-phone__comp--selected .pa-phone__comp-label,
  .pa-phone__comp:hover .pa-phone__comp-label {
    opacity: 1;
  }

  .pa-phone__comp-end-zone {
    min-height: 4px;
    border: 2px dashed transparent;
    border-radius: 6px;
    transition: min-height 0.2s, background 0.2s, border-color 0.2s;
  }

  .pa-phone__comp-end-zone--active {
    min-height: 40px;
    background: rgba(64, 158, 255, 0.06);
    border-color: var(--pa-color-primary, #409eff);
  }
}

// -------- 动态组件 --------
.pa-phone__dynamic {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pa-phone__dynamic--streaming {
  opacity: 0.7;
  transition: opacity 0.2s;
}

// -------- Typewriter Transition（打字机渐进效果） --------
.pa-phone__typewriter-enter-active {
  transition: opacity 0.35s ease-in-out, transform 0.35s ease-in-out;
}

.pa-phone__typewriter-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.pa-phone__typewriter-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.pa-phone__typewriter-leave-to {
  opacity: 0;
}

.pa-phone__sfc-pending {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pa-phone__sfc-pending-text {
  font-size: 14px;
  color: #999;
}

.pa-phone__sfc-wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style lang="scss">
.pa-phone__sfc-wrap {
  > .content-area {
    height: 100%;
    max-width: initial !important;
    overflow-x: initial !important;
    background: initial !important;
    font-family: initial !important;
    padding: initial !important;
  }
}
</style>

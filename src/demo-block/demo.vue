<template>
  <div :class="['demo', hover && 'demo-hover']" @mouseenter="hover = true" @mouseleave="hover = false">
    <!-- 组件展示 -->
    <div class="demo-slot">
      <slot v-if="hasSlot"></slot>
      <component :is="demoSlot" v-else-if="codePath" />
      <div v-html="decodedCodeStr" v-else></div>
    </div>
    <!-- 代码展示 -->
    <div class="demo-show" v-show="isExpanded">
      <!-- 描述 -->
      <div class="demo-show_desc" v-show="decodedDesc" v-html="decodedDesc"></div>
      <!-- 复制 -->
      <div class="demo-show-copy" @click.stop="onCopy"></div>
      <!-- 代码 -->
      <div :class="['demo-show-code', 'language-' + language]" v-html="decodedHtmlStr"></div>
    </div>
    <!-- 按钮控制 -->
    <div
      :class="['demo-control', isExpanded ? 'demo-control-expanded' : '']"
      v-if="useControl != 'false'"
      @click="onClickControl"
    >
      <i :class="['demo-control-icon', isExpanded ? 'demo-control-icon_up' : 'demo-control-icon_down']"></i>
      <span class="demo-control-tip">{{ isExpanded ? "隐藏代码" : "显示代码" }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, useSlots } from "vue";

const modules: any = import.meta.glob("../../**/*.vue");
const timeoutIdMap = new Map();

// >-------------> interface <------------<
interface ProTableProps {
  codeStr: string;
  htmlStr: string;
  description: string;
  codePath: string;
  language?: string;
  useControl: string;
}

const props = withDefaults(defineProps<ProTableProps>(), {
  codeStr: "",
  htmlStr: "",
  description: "",
  codePath: "",
  language: "vue",
  useControl: ""
});

const slots = useSlots();
const { codePath, codeStr, htmlStr, description } = props;
const hover = ref(false); //鼠标是否悬浮之上
const hasSlot = computed(() => (slots?.default ? true : false));
const decodedCodeStr = computed(() => decodeURIComponent(codeStr ?? ""));
const decodedHtmlStr = computed(() => decodeURIComponent(htmlStr ?? ""));
const decodedDesc = computed(() => decodeURIComponent(description ?? ""));
// 注册演示组件
const demoSlot = codePath && modules[codePath] ? defineAsyncComponent(modules[codePath]) : null;
// 展开or收起代码
const isExpanded = ref(false);
const onClickControl = () => {
  isExpanded.value = !isExpanded.value;
  hover.value = isExpanded.value;
};
// 复制代码
const onCopy = async e => {
  try {
    navigator.clipboard.writeText(decodedCodeStr.value);
    const el = e.target;
    el.classList.add("demo-show-copied");
    clearTimeout(timeoutIdMap.get(el));
    const timeoutId = setTimeout(() => {
      el.classList.remove("demo-show-copied");
      el.blur();
      timeoutIdMap.delete(el);
    }, 2000);
    timeoutIdMap.set(el, timeoutId);
  } catch (err) {
    console.log("复制代码失败");
  }
};
</script>

<style lang="scss" scoped>
.demo {
  margin: 10px 0;
  box-shadow: 0 0 10px 0 var(--pa-color-send-font);
  overflow: hidden;
  border-radius: var(--pa-size-radius);
  transition: 0.2s;
}

/* .demo-hover {
  box-shadow: 0 0px 12px #6f6e6e;
  .demo-slot {
    border: none;
  }
} */
.demo-hover .demo-control,
.demo-control-expanded {
  background-color: var(--pa-color-primary) !important;
}
.demo-slot {
  box-sizing: border-box;
  padding: 12px;
  overflow: auto;

  /* border: 1px solid var(--vp-c-divider); */
  border-radius: 5px;
  transition: 0.2s;
}
.demo-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  align-items: center;
}
.demo-show {
  position: relative;
  background-color: var(--vp-code-block-bg);
}
.demo-show_desc {
  box-sizing: border-box;
  padding: 20px;
  margin: 10px 10px 6px;
  line-height: 26px;
  color: var(--vp-c-text-2);
  word-break: break-word;
  background-color: var(--vp-c-bg-soft);
  border: solid 1px var(--vp-c-divider-light);
  border-radius: 3px;
}
.demo-show-code {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  border-radius: 0 !important;
}
.demo-show-copy {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: block;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: var(--vp-code-block-bg);
  background-image: var(--vp-icon-copy);
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 20px;
  border-radius: 4px;
  transition: opacity 0.25s;
  display: flex;
  justify-content: center;
  align-items: center;

  .pa-icon {
    font-size: 25px;
  }
}
.demo-show-copied {
  background-color: var(--vp-code-copy-code-hover-bg);
  background-image: var(--vp-icon-copied);
  border-radius: 4px;
  width: 105px;
}
.demo-show-copied::before {
  position: relative;
  display: block;
  width: 64px;
  height: 40px;
  padding-top: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-code-copy-code-active-text);
  text-align: center;
  white-space: nowrap;
  content: "Copied";
  background-color: var(--vp-code-copy-code-hover-bg);
  border-radius: 4px 0 0 4px;
}
.demo-show pre {
  padding: 1.25rem 1.5rem;
  margin: 0;
  background-color: inherit !important;
}
.demo-control {
  position: relative;
  box-sizing: border-box;
  height: 40px;
  margin-top: -1px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  background-color: var(--vp-c-divider);
  border-top: 1px solid var(--vp-c-divider-light);
  transition: 0.3s;
}
.demo-control-icon {
  position: absolute;
  top: 50%;
  display: inline-block;
  font-size: 16px;
  transition: 0.3s;
  transform: translateX(-40px);
}
.demo-control-icon_up::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  margin-top: -8.5px;
  margin-left: -6px;
  content: "";
  border: 6px solid transparent;
  border-bottom: 7px solid;
}
.demo-control-icon_down::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  margin-top: -2px;
  margin-left: -6px;
  content: "";
  border: 6px solid transparent;
  border-top: 7.5px solid;
}
.demo-control-tip {
  position: absolute;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  line-height: 40px;
  transition: 0.3s;
  transform: translateX(-30px);
}
.demo .text-slide-enter,
.demo .text-slide-leave-active {
  opacity: 0;
  transform: translateX(10px);
}
</style>

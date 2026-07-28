<template>
  <Teleport to="body">
    <div v-if="props.visible" class="pa-menu__backdrop" @click="handleClose" @contextmenu.prevent="handleBackdropContextmenu"></div>
    <Transition name="pa-menu-fade">
      <div v-if="props.visible" :id="randId" ref="menuRef" class="pa-menu" :class="[pointClass, props.class]" :style="[menuStyle, props.style]">
        <div class="pa-menu__content">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch, provide } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits, MenuContext, MenuGroupContext, MenuItemConfig } from "./types";
/**
 * 模块导入
 * @description 导入 render-id 工具函数
 */
import useRenderId from "../tools/render-id";

/**
 * 组件属性
 * @type ComponentProps
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  visible: false,
  triggerEvent: undefined,
  point: "tl",
  closeOnBackdropContextmenu: true
});

/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emit = defineEmits<ComponentEmits>();
/**
 * render-id
 * @description 组件唯一标识
 */
const randId = ref((props.id ? props.id + "_" : "") + "pa-menu_" + useRenderId());

/**
 * 菜单元素引用
 * @type Ref<HTMLElement | null>
 */
const menuRef = ref<HTMLElement | null>(null);

const adjustedLeft = ref(0);
const adjustedTop = ref(0);
const adjustedPoint = ref<"bl" | "br" | "tl" | "tr">("tl");

const pointClass = computed(() => {
  if (!props.point) return "";
  return "pa-menu--point-" + adjustedPoint.value;
});

const menuStyle = computed(() => {
  if (!props.visible) return { display: "none" };
  return {
    position: "fixed" as const,
    left: adjustedLeft.value + "px",
    top: adjustedTop.value + "px"
  };
});

function updatePosition() {
  if (!props.visible || !props.triggerEvent) return;

  const baseX = props.triggerEvent.clientX;
  const baseY = props.triggerEvent.clientY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const basePoint: "bl" | "br" | "tl" | "tr" = props.point === true || !props.point ? "tl" : (props.point as "bl" | "br" | "tl" | "tr");

  if (!menuRef.value) {
    adjustedLeft.value = baseX;
    adjustedTop.value = baseY;
    adjustedPoint.value = basePoint;
    return;
  }

  const menuWidth = menuRef.value.offsetWidth;
  const menuHeight = menuRef.value.offsetHeight;

  let left = baseX;
  let top = baseY;
  let flipX = false;
  let flipY = false;

  if (basePoint.includes("r")) {
    left = baseX - menuWidth;
  }
  if (basePoint.includes("b")) {
    top = baseY - menuHeight;
  }

  if (left + menuWidth > viewportWidth) {
    left = baseX - menuWidth;
    flipX = true;
  }
  if (left < 0) {
    left = baseX;
    flipX = true;
  }

  if (top + menuHeight > viewportHeight) {
    top = baseY - menuHeight;
    flipY = true;
  }
  if (top < 0) {
    top = baseY;
    flipY = true;
  }

  left = Math.max(0, Math.min(left, viewportWidth - menuWidth));
  top = Math.max(0, Math.min(top, viewportHeight - menuHeight));

  adjustedLeft.value = left;
  adjustedTop.value = top;

  const hFlip = flipX ? (basePoint.includes("l") ? "r" : "l") : basePoint.includes("l") ? "l" : "r";
  const vFlip = flipY ? (basePoint.includes("t") ? "b" : "t") : basePoint.includes("t") ? "t" : "b";
  adjustedPoint.value = (vFlip + hFlip) as "bl" | "br" | "tl" | "tr";
}

watch(
  () => [props.visible, props.triggerEvent],
  () => {
    if (props.visible) {
      if (props.triggerEvent) {
        adjustedLeft.value = props.triggerEvent.clientX;
        adjustedTop.value = props.triggerEvent.clientY;
        adjustedPoint.value = props.point === true || !props.point ? "tl" : (props.point as "bl" | "br" | "tl" | "tr");
      }
      nextTick(() => {
        updatePosition();
      });
    }
  },
  { immediate: true }
);

function handleResize() {
  if (props.visible) {
    updatePosition();
  }
}

/**
 * 顶级菜单项同级协调（点击模式）
 * @description 记录当前哪个顶级菜单项的子菜单处于打开状态，
 *              点击同级其他项时自动关闭已打开的子菜单
 */
const topActiveSubmenuId = ref<symbol | null>(null);

/**
 * 菜单上下文（provide/inject）
 * @description 提供选中事件和关闭方法给子菜单组件
 */
const menuContext: MenuContext = {
  closeAll: () => {
    topActiveSubmenuId.value = null;
    emit("close");
  },
  onSelect: (item: MenuItemConfig) => emit("select", item),
  resetActiveSubmenu: () => {
    topActiveSubmenuId.value = null;
  }
};
provide("pa-menu-context", menuContext);

/**
 * 顶级菜单组上下文
 * @description 顶级菜单项之间通过此上下文协调子菜单的打开/关闭
 */
const topGroupContext: MenuGroupContext = {
  activeSubmenuId: topActiveSubmenuId,
  notifyClick: (id: symbol) => {
    topActiveSubmenuId.value = id;
  }
};
provide("pa-menu-group", topGroupContext);

/**
 * 关闭菜单
 * @description 触发 close 事件
 */
function handleClose() {
  emit("close");
}

/**
 * 递归穿透 Shadow DOM 获取指定坐标下的最内层元素
 * @param x - 横坐标
 * @param y - 纵坐标
 * @returns 最内层目标元素
 */
function getElementFromPointDeep(x: number, y: number): Element | null {
  let el: Element | null = document.elementFromPoint(x, y);
  while (el?.shadowRoot) {
    const inner = el.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === el) break;
    el = inner;
  }
  return el;
}

/**
 * 遮罩层右键处理
 * @description 根据 closeOnBackdropContextmenu 配置决定行为：
 *              - true（默认）：关闭菜单并穿透右键事件到下方元素
 *              - false：仅触发 backdrop-contextmenu 事件，由父组件自行处理（可实现无缝切换）
 * @param event - 鼠标右键事件
 */
function handleBackdropContextmenu(event: MouseEvent) {
  const backdrop = event.currentTarget as HTMLElement;
  const originalDisplay = backdrop.style.display;
  backdrop.style.display = "none";
  const target = getElementFromPointDeep(event.clientX, event.clientY);
  backdrop.style.display = originalDisplay;

  const payload = { event, target };
  emit("backdrop-contextmenu", payload);

  if (props.closeOnBackdropContextmenu) {
    emit("close");
    if (target) {
      const newEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        button: 2,
        buttons: 2,
        view: window
      });
      target.dispatchEvent(newEvent);
    }
  }
}

/**
 * 监听 ESC 键关闭
 * @param event - 键盘事件
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.visible) {
    handleClose();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss">
@use "../styles/default/pa-menu.scss";
</style>

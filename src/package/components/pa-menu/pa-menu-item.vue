<template>
  <div ref="menuItemRef" class="pa-menu-item" :class="itemClasses" :style="props.style" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div v-if="props.divided" class="pa-menu-item__divider"></div>
    <pa-icon v-if="props.icon" :name="props.icon" class="pa-menu-item__icon"></pa-icon>
    <slot name="label">
      <span class="pa-menu-item__label">{{ resolvedLabel }}</span>
    </slot>
    <span v-if="hasSubmenu" class="pa-menu-item__arrow">&#x276F;</span>

    <!-- Submenu (position: fixed 脱离文档流，不受父级 overflow: hidden 裁剪；
         作为 DOM 子节点确保 mouseleave 不会在移入子菜单时误触发) -->
    <Transition name="pa-menu-fade">
      <div v-if="submenuVisible" ref="submenuRef" class="pa-menu__submenu" :style="submenuStyle">
        <div class="pa-menu__content">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
/**
 * 默认语言
 * @description 默认语言标识
 */
const DEFAULT_LANGUAGE = "zh-CN";
</script>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, inject, ref, nextTick, onUnmounted, ComputedRef, useSlots, watch, provide } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ItemComponentProps, ItemComponentEmits, MenuContext, MenuGroupContext } from "../pa-menu/types";
/**
 * 模块导入
 * @description 导入全局配置类型定义
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";

/**
 * 组件名称（递归必需）
 * @description 使组件支持在模板中引用自身以实现递归子菜单渲染
 */
defineOptions({ name: "PaMenuItem" });

/**
 * 插槽
 * @description 检测是否有插槽内容（嵌套的 pa-menu-item 组件），决定是否显示子菜单箭头
 */
const slots = useSlots();

/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 从父组件注入的全局配置对象，包含语言设置
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 当前语言
 * @type ComputedRef<string>
 * @description 当前语言标识
 */
const language = computed(() => PancakeGlobalConfig.value?.language || DEFAULT_LANGUAGE);

/**
 * 组件属性
 * @type ItemComponentProps
 */
const props = withDefaults(defineProps<ItemComponentProps>(), {
  danger: false,
  divided: false,
  disabled: false,
  command: undefined,
  submenuTrigger: "click"
});

/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emit = defineEmits<ItemComponentEmits>();

/**
 * 菜单上下文注入
 * @description 从根 pa-menu 注入的上下文，用于关闭和选中事件传递
 */
const menuContext = inject<MenuContext | null>("pa-menu-context", null);

/**
 * 同级菜单组上下文
 * @description 从父级注入，用于点击模式下同级之间协调子菜单的打开/关闭
 */
const groupContext = inject<MenuGroupContext | null>("pa-menu-group", null);

/**
 * 当前菜单项的唯一标识
 * @description 用于在组上下文中标识自己
 */
const itemId = Symbol("pa-menu-item");

/**
 * 菜单项元素引用
 * @type Ref<HTMLElement | null>
 */
const menuItemRef = ref<HTMLElement | null>(null);
/**
 * 子菜单元素引用
 * @type Ref<HTMLElement | null>
 */
const submenuRef = ref<HTMLElement | null>(null);

/**
 * 子菜单可见状态
 * @type Ref<boolean>
 */
const submenuVisible = ref(false);

/**
 * 子菜单位置
 */
const submenuLeft = ref(0);
const submenuTop = ref(0);

/**
 * 是否是点击模式
 * @type ComputedRef<boolean>
 */
const isClickMode = computed(() => props.submenuTrigger === "click");

/**
 * 显示定时器（仅 hover 模式使用）
 * @description 延迟 200ms 后显示，防止鼠标快速划过时闪烁
 */
let showTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 是否有子菜单（通过检测插槽内容）
 * @type ComputedRef<boolean>
 * @description 检查父组件是否传递了 slot 内容，以此判断是否有子菜单。
 *              Vue 3 中 slots.default 仅在父组件提供了 slot 内容时才存在，
 *              比调用 slots.default() 再过滤 vnode 更可靠。
 */
const hasSubmenu = computed(() => typeof slots.default === "function");

/**
 * 解析后的标签文本
 * @type ComputedRef<string>
 * @description 根据当前语言环境解析多语言标签
 */
const resolvedLabel = computed(() => {
  if (typeof props.label === "object") {
    return props.label[language.value] || props.label[DEFAULT_LANGUAGE] || "";
  }
  return props.label;
});

/**
 * 菜单项样式类
 * @type ComputedRef<Array<string>>
 */
const itemClasses = computed(() => [props.danger ? "pa-menu-item--danger" : "", props.disabled ? "pa-menu-item--disabled" : "", props.class]);

/**
 * 子菜单样式
 * @type ComputedRef<Record<string, string>>
 */
const submenuStyle = computed(() => ({
  position: "fixed" as const,
  left: submenuLeft.value + "px",
  top: submenuTop.value + "px",
  display: submenuVisible.value ? undefined : "none"
}));

/**
 * 为子级菜单项提供同级别调上下文
 * @description 当前菜单项如果包含子菜单（插槽内有 pa-menu-item），
 *              则子级菜单项之间也需要同级协调
 */
const childActiveSubmenuId = ref<symbol | null>(null);
if (hasSubmenu.value && isClickMode.value) {
  const childGroupContext: MenuGroupContext = {
    activeSubmenuId: childActiveSubmenuId,
    notifyClick: (id: symbol) => {
      childActiveSubmenuId.value = id;
    }
  };
  provide("pa-menu-group", childGroupContext);
}

/**
 * 监听同级组上下文的活跃 ID 变化
 * @description 当同级其他菜单项被点击打开子菜单时，关闭自己的子菜单
 */
if (groupContext && isClickMode.value) {
  watch(
    () => groupContext.activeSubmenuId.value,
    newId => {
      if (newId !== null && newId !== itemId && submenuVisible.value) {
        submenuVisible.value = false;
      }
    }
  );
}

/**
 * 打开并定位子菜单
 */
function openSubmenu(): void {
  submenuVisible.value = true;

  // 设置初始位置
  if (menuItemRef.value) {
    const rect = menuItemRef.value.getBoundingClientRect();
    submenuLeft.value = rect.right;
    submenuTop.value = rect.top;
  }

  // 更新位置（考虑溢出）
  nextTick(() => updateSubmenuPosition());
}

/**
 * 更新子菜单位置
 * @description 根据菜单项的位置计算子菜单在右侧显示的位置，处理视口溢出
 */
function updateSubmenuPosition(): void {
  if (!menuItemRef.value) return;

  const rect = menuItemRef.value.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = rect.right;
  let top = rect.top;

  nextTick(() => {
    if (!submenuRef.value) return;
    const sw = submenuRef.value.offsetWidth;
    const sh = submenuRef.value.offsetHeight;

    // 右侧溢出时翻转到左侧显示
    if (left + sw > vw) {
      left = rect.left - sw;
    }

    // 底部溢出时上移
    if (top + sh > vh) {
      top = vh - sh;
    }
    if (top < 0) {
      top = 0;
    }

    submenuLeft.value = left;
    submenuTop.value = top;
  });
}

/**
 * 鼠标进入菜单项（仅 hover 模式）
 * @description 如果有子菜单（插槽内容）且未禁用，延迟 200ms 显示子菜单
 */
function handleMouseEnter(): void {
  if (isClickMode.value) return;
  if (!hasSubmenu.value || props.disabled) return;
  if (showTimer) clearTimeout(showTimer);
  showTimer = setTimeout(() => {
    openSubmenu();
    showTimer = null;
  }, 200);
}

/**
 * 鼠标离开菜单项（仅 hover 模式）
 * @description 子菜单是 DOM 子节点，mouseleave 只在真正离开元素树时触发，
 *              此时立即隐藏（无需延迟）
 */
function handleMouseLeave(): void {
  if (isClickMode.value) return;
  if (!hasSubmenu.value) return;
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  submenuVisible.value = false;
}

/**
 * 处理点击事件
 * @description 根据 submenuTrigger 模式不同行为：
 *              - click 模式：点击有子菜单的项切换子菜单，点击叶子节点触发事件
 *              - hover 模式：有子菜单的项忽略点击，叶子节点触发事件
 *
 *              关键：必须 stopPropagation 阻止事件冒泡到父级菜单项，
 *              否则当点击子菜单项时，事件会冒泡到 DOM 父级（父级 pa-menu-item）
 *              的 handleClick，导致父级也被切换关闭。
 */
function handleClick(event: MouseEvent): void {
  if (props.disabled) return;
  // 阻止事件冒泡到父级菜单项，避免父级 handleClick 误触发
  event.stopPropagation();

  if (hasSubmenu.value) {
    if (isClickMode.value) {
      // 点击模式：切换子菜单
      if (submenuVisible.value) {
        // 已打开 → 关闭
        submenuVisible.value = false;
      } else {
        // 通知同级关闭各自的子菜单
        groupContext?.notifyClick(itemId);
        // 打开自己的子菜单
        openSubmenu();
      }
    }
    // hover 模式下点击有子菜单的项不做任何事
    return;
  }

  // 叶子节点：触发 click 事件并关闭整个菜单
  emit("click");
  menuContext?.closeAll?.();
}

/**
 * 组件卸载时清理定时器
 */
onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer);
});
</script>

<style lang="scss">
@use "./index.scss";
</style>

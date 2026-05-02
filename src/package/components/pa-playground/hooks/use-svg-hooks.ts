/**
 * @description 导入 Vue 相关类型和组件
 * */
import { ref, computed, Ref } from "vue";
/**
 * @description 导入 Playground 类型
 * */
import { PaPlaygroundType } from "../types";
/**
 * @description 导入消息框组件
 * */
import { M_MessageBox } from "../../feedback";

/**
 * @description SVG Hooks 返回类型
 * @type `object`
 * */
interface UseSvgHooksReturn {
  /** @type `ReturnType<typeof ref<number>>` 缩放比例 */
  scale: ReturnType<typeof ref<number>>;
  /** @type `ReturnType<typeof ref<number>>` X 轴平移量 */
  translateX: ReturnType<typeof ref<number>>;
  /** @type `ReturnType<typeof ref<number>>` Y 轴平移量 */
  translateY: ReturnType<typeof ref<number>>;
  /** @type `ReturnType<typeof ref<boolean>>` 是否正在拖拽 */
  isDragging: ReturnType<typeof ref<boolean>>;
  /** @type `Ref<string>` 变换矩阵 */
  transform: Ref<string>;
  /** @type `Ref<Record<string, string>>` 背景样式 */
  backgroundStyle: Ref<Record<string, string>>;
  /** @type `(event: WheelEvent) => void` 处理鼠标滚轮缩放 */
  handleWheel: (event: WheelEvent) => void;
  /** @type `(event: MouseEvent) => void` 处理鼠标按下 */
  handleMouseDown: (event: MouseEvent) => void;
  /** @type `(index: number) => void` 处理删除页面 */
  handleDeletePage: (index: number) => void;
  /** @type `(event: MouseEvent) => void` 处理鼠标移动 */
  handleMouseMove: (event: MouseEvent) => void;
  /** @type `() => void` 处理鼠标释放 */
  handleMouseUp: () => void;
  /** @type `() => { adminX: number; adminY: number; adminScale: number }` 获取 SVG 变换矩阵 */
  getSvgTransform: () => { adminX: number; adminY: number; adminScale: number };
  /** @type `() => void` 更新管理配置 */
  updateAdminConfig: () => void;
}

/**
 * @description SVG Hooks 函数
 * @param lockScroll 是否锁定滚动
 * @param adminConfig 管理配置
 * @returns SVG Hooks 返回对象
 * */
export function useSvgHooks(lockScroll: Ref<boolean>, adminConfig: Ref<PaPlaygroundType>): UseSvgHooksReturn {
  /** @type `ReturnType<typeof ref<number>>` 缩放比例 */
  const scale = ref(adminConfig.value.adminScale || 1);
  /** @type `ReturnType<typeof ref<number>>` X 轴平移量 */
  const translateX = ref(adminConfig.value.adminX || 0);
  /** @type `ReturnType<typeof ref<number>>` Y 轴平移量 */
  const translateY = ref(adminConfig.value.adminY || 0);
  /** @type `ReturnType<typeof ref<boolean>>` 是否正在拖拽 */
  const isDragging = ref(false);
  /** @type `ReturnType<typeof ref<number>>` 上一次鼠标 X 坐标 */
  const lastMouseX = ref(0);
  /** @type `ReturnType<typeof ref<number>>` 上一次鼠标 Y 坐标 */
  const lastMouseY = ref(0);

  /** @type `Ref<string>` 变换矩阵 */
  const transform: Ref<string> = computed(() => {
    return `translate(${translateX.value}, ${translateY.value}) scale(${scale.value})`;
  });

  /** @type `Ref<Record<string, string>>` 背景样式 */
  const backgroundStyle = computed(() => {
    const baseSize = 10.68;
    const baseDotSize = 1;
    const scaleFactor = Math.max(0.5, Math.min(2, scale.value));
    const dotSize = baseDotSize * scaleFactor;
    const spacing = baseSize * scaleFactor;

    return {
      "--svg-background-size": `${spacing}px`,
      "--svg-background-font": `${dotSize}px`
    };
  });

  /**
   * @description 处理鼠标滚轮缩放
   * @param event 鼠标滚轮事件
   * @returns `void`
   * */
  function handleWheel(event: WheelEvent): void {
    event.preventDefault();
    if (lockScroll.value) return;

    const svgContainer = event.currentTarget as HTMLElement;
    const rect = svgContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const scaleFactor = event.deltaY > 0 ? 0.98 : 1.02;
    const newScale = Math.max(0.1, Math.min(5, scale.value * scaleFactor));

    const scaleRatio = newScale / scale.value;
    translateX.value = mouseX - (mouseX - translateX.value) * scaleRatio;
    translateY.value = mouseY - (mouseY - translateY.value) * scaleRatio;

    scale.value = newScale;

    adminConfig.value.adminScale = newScale;
    adminConfig.value.adminX = translateX.value;
    adminConfig.value.adminY = translateY.value;
  }

  /**
   * @description 处理鼠标按下，开始拖拽
   * @param event 鼠标事件
   * @returns `void`
   * */
  function handleMouseDown(event: MouseEvent): void {
    if (lockScroll.value) return;

    if (event.button === 0) {
      isDragging.value = true;
      lastMouseX.value = event.clientX;
      lastMouseY.value = event.clientY;
    }
  }

  /**
   * @description 处理删除页面
   * @param index 页面索引
   * @returns `void`
   * */
  function handleDeletePage(index: number): void {
    M_MessageBox.delete({
      onConfirm: () => {
        adminConfig.value.pagesConfigs.splice(index, 1);
        updateAdminConfig();
      }
    });
  }

  /**
   * @description 处理鼠标移动，实现拖拽
   * @param event 鼠标事件
   * @returns `void`
   * */
  function handleMouseMove(event: MouseEvent): void {
    if (lockScroll.value) return;

    if (isDragging.value) {
      const deltaX = event.clientX - lastMouseX.value;
      const deltaY = event.clientY - lastMouseY.value;

      translateX.value += deltaX;
      translateY.value += deltaY;

      lastMouseX.value = event.clientX;
      lastMouseY.value = event.clientY;

      adminConfig.value.adminX = translateX.value;
      adminConfig.value.adminY = translateY.value;
    }
  }

  /**
   * @description 处理鼠标释放，结束拖拽
   * @returns `void`
   * */
  function handleMouseUp(): void {
    if (lockScroll.value) return;

    isDragging.value = false;
  }

  /**
   * @description 获取当前 SVG 变换矩阵
   * @returns `object` 包含 adminX、adminY、adminScale 的对象
   * */
  function getSvgTransform(): { adminX: number; adminY: number; adminScale: number } {
    return {
      adminX: translateX.value,
      adminY: translateY.value,
      adminScale: scale.value
    };
  }

  /**
   * @description 更新管理配置
   * @returns `void`
   * */
  function updateAdminConfig(): void {
    scale.value = adminConfig.value.adminScale || 1;
    translateX.value = adminConfig.value.adminX || 0;
    translateY.value = adminConfig.value.adminY || 0;
  }

  return {
    scale,
    translateX,
    translateY,
    isDragging,
    transform,
    backgroundStyle,
    updateAdminConfig,
    getSvgTransform,
    handleWheel,
    handleMouseDown,
    handleDeletePage,
    handleMouseMove,
    handleMouseUp
  };
}

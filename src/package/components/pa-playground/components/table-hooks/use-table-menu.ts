/**
 * @description 导入 Vue 相关类型
 */
import { ComputedRef, ref } from "vue";

/**
 * @description 表格菜单 Hooks 函数
 * @param position 位置信息
 * @returns 菜单相关状态和方法
 */
export function useMenuHooks(position: ComputedRef<{ x: number; y: number }>) {
  /**
   * @type ReturnType<typeof ref<boolean>> 右键菜单是否可见
   * @description @type ReturnType<typeof ref<boolean>> 右键菜单是否可见
   */
  const contextMenuVisible = ref(false);
  /**
   * @type ReturnType<typeof ref<number>> 右键菜单 X 坐标
   * @description @type ReturnType<typeof ref<number>> 右键菜单 X 坐标
   */
  const contextMenuX = ref(0);
  /**
   * @type ReturnType<typeof ref<number>> 右键菜单 Y 坐标
   * @description @type ReturnType<typeof ref<number>> 右键菜单 Y 坐标
   */
  const contextMenuY = ref(0);
  /**
   * @type ReturnType<typeof ref<number>> 选中的列索引
   * @description @type ReturnType<typeof ref<number>> 选中的列索引
   */
  const selectedColumnIndex = ref(-1);

  /**
   * @description 显示右键菜单
   * @param event 鼠标事件
   * @param columnIndex 列索引
   * @returns void
   */
  function showContextMenu(event: MouseEvent, columnIndex: number): void {
    event.stopPropagation();
    selectedColumnIndex.value = columnIndex;

    const svgElement = document.getElementById("SvgContent");
    if (svgElement) {
      const svg = svgElement as any;
      const gElement = svg.querySelector("g") as SVGGElement;

      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      if (gElement) {
        const svgPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
        const gTransform = gElement.getCTM()!;
        const gPoint = svgPoint.matrixTransform(gTransform.inverse());

        const tableX = position.value?.x || 0;
        const tableY = position.value?.y || 0;

        contextMenuX.value = gPoint.x - tableX;
        contextMenuY.value = gPoint.y - tableY;
      }
    }

    contextMenuVisible.value = true;

    setTimeout(() => {
      document.addEventListener("click", closeContextMenu);
    }, 0);
  }

  /**
   * @description 关闭右键菜单
   * @returns void
   */
  function closeContextMenu(): void {
    contextMenuVisible.value = false;
    document.removeEventListener("click", closeContextMenu);
  }

  return { contextMenuVisible, contextMenuX, contextMenuY, selectedColumnIndex, showContextMenu, closeContextMenu };
}

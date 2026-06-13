/**
 * 模块导入
 * @description 导入 Vue 相关 API
 */
import { Fragment, defineComponent, h } from "vue";
/**
 * 模块导入
 * @description 导入 VNode 类型
 */
import type { VNode } from "vue";
/**
 * 模块导入
 * @description 导入 PaPopover 组件
 */
import PaPopover from "../pa-popover/pa-popover.vue";
/**
 * 模块导入
 * @description 导入 PaButton 组件
 */
import PaButton from "../pa-button/pa-button.vue";

/**
 * 展开 Fragment 节点扁平化子节点列表
 * @param vnodes - 虚拟节点数组
 * @returns 扁平化后的虚拟节点数组
 */
function unwrap(vnodes: VNode[]): VNode[] {
  const flat: VNode[] = [];
  for (const vnode of vnodes) {
    if ((vnode.type as any) === Fragment) {
      const children = vnode.children as VNode[] | null;
      if (children) flat.push(...unwrap(children));
    } else {
      flat.push(vnode);
    }
  }
  if (flat.length === 1) {
    const only = flat[0];
    if (typeof only.type === "string" && Array.isArray(only.children) && only.children.length > 1) {
      return only.children as VNode[];
    }
  }
  return flat;
}

export default defineComponent({
  name: "PaEasyTableMaxChild",
  props: {
    max: { type: Number, required: true }
  },
  setup(props, { slots }) {
    return () => {
      const children = unwrap(slots.default?.() ?? []);
      if (children.length <= props.max) return children;

      const overCount = children.length - props.max;
      const visible = children.slice(0, props.max);
      const hidden = children.slice(props.max);

      const trigger = h(PaButton, { is: "more" }, () => `+${overCount}`);

      const popover = h(
        PaPopover,
        {
          trigger: "hover",
          placement: "bottom",
          stopPropagation: true
        },
        {
          reference: () => trigger,
          default: () => h("div", { class: "pa-easy-table__cell-more-content" }, hidden)
        }
      );

      return [...visible, popover];
    };
  }
});

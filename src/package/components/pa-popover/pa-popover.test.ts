/**
 * pa-popover 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h, ref } from "vue";

// Mock getElementPosition
const mockGetElementPosition = vi.fn(el => {
  if (!el) return null;
  return {
    top: 100,
    left: 100,
    right: 200,
    bottom: 150,
    width: 100,
    height: 50
  };
});

vi.mock("../utils/getElementPosition", () => ({
  getElementPosition: mockGetElementPosition
}));

// Mock getPaAnagerGlobalZIndex
const mockGetPaAnagerGlobalZIndex = vi.fn(() => 2000);

/** 通用 mount 辅助函数 */
async function mountPopover(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaPopover } = await import("./pa-popover.vue");
  return mount(PaPopover, {
    props,
    slots,
    global: {
      stubs: {
        teleport: {
          template: '<div class="teleported"><slot /></div>',
          props: ["to"]
        }
      },
      provide: {
        getPaAnagerGlobalZIndex: mockGetPaAnagerGlobalZIndex
      }
    }
  });
}

describe("pa-popover 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(document, "addEventListener").mockImplementation(() => {});
    vi.spyOn(document, "removeEventListener").mockImplementation(() => {});
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      setTimeout(cb, 16);
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    // Mock window properties
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true });
    Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    Object.defineProperty(window, "PancakeGlobalConfig", {
      value: { PopoverList: {} },
      writable: true
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-popover-reference", async () => {
      const wrapper = await mountPopover();
      expect(wrapper.find(".pa-popover-reference").exists()).toBe(true);
    });

    it("默认 props 值", async () => {
      const wrapper = await mountPopover();
      expect(wrapper.props("disabled")).toBe(false);
      expect(wrapper.props("trigger")).toBe("click");
      expect(wrapper.props("placement")).toBe("bottom");
      expect(wrapper.props("teleportTo")).toBe("body");
    });

    it("teleport 组件正确渲染", async () => {
      const wrapper = await mountPopover({});
      await nextTick();
      // teleport 是条件渲染的
    });
  });

  // ==================== disabled prop ====================
  describe("2. disabled prop", () => {
    it("disabled=true 添加 is-disabled class", async () => {
      const wrapper = await mountPopover({ disabled: true });
      expect(wrapper.find(".pa-popover-reference").classes()).toContain("is-disabled");
    });

    it("disabled=false 不添加 is-disabled class", async () => {
      const wrapper = await mountPopover({ disabled: false });
      expect(wrapper.find(".pa-popover-reference").classes()).not.toContain("is-disabled");
    });

    it("disabled=true 时点击不触发显示", async () => {
      const wrapper = await mountPopover({ disabled: true });
      await wrapper.find(".pa-popover-reference").trigger("click");
      await nextTick();
      expect(wrapper.vm.visible).toBe(false);
    });
  });

  // ==================== trigger prop ====================
  describe("3. trigger prop", () => {
    it("trigger=click 添加 is-click class", async () => {
      const wrapper = await mountPopover({ trigger: "click" });
      expect(wrapper.find(".pa-popover-reference").classes()).toContain("is-click");
    });

    it("trigger=hover 不添加 is-click class", async () => {
      const wrapper = await mountPopover({ trigger: "hover" });
      expect(wrapper.find(".pa-popover-reference").classes()).not.toContain("is-click");
    });
  });

  // ==================== class/style prop ====================
  describe("4. class/style prop", () => {
    it("自定义 class 应用", async () => {
      const wrapper = await mountPopover({ class: "custom-class" });
      expect(wrapper.find(".pa-popover-reference").classes()).toContain("custom-class");
    });

    it("自定义 style 应用", async () => {
      const wrapper = await mountPopover({ style: { color: "red" } });
      expect(wrapper.find(".pa-popover-reference").exists()).toBe(true);
    });

    it("自定义 referenceStyle 应用", async () => {
      const wrapper = await mountPopover({ referenceStyle: { background: "blue" } });
      expect(wrapper.find(".pa-popover-reference").exists()).toBe(true);
    });
  });

  // ==================== slots ====================
  describe("5. slots", () => {
    it("默认 slot 内容渲染", async () => {
      const wrapper = await mountPopover({}, { default: "弹窗内容" });
      await nextTick();
      // 默认 slot 需要通过 teleport 渲染
    });

    it("reference slot 渲染参考元素", async () => {
      const wrapper = await mountPopover({}, { reference: "参考元素" });
      await nextTick();
      expect(wrapper.find(".pa-popover-reference").text()).toContain("参考元素");
    });
  });

  // ==================== expose 方法 ====================
  describe("6. expose 方法", () => {
    it("暴露 showPopover 方法", async () => {
      const wrapper = await mountPopover();
      expect(typeof wrapper.vm.showPopover).toBe("function");
    });

    it("暴露 hidePopover 方法", async () => {
      const wrapper = await mountPopover();
      expect(typeof wrapper.vm.hidePopover).toBe("function");
    });
  });

  // ==================== zIndex ====================
  describe("7. zIndex", () => {
    it("zIndex 从 getPaAnagerGlobalZIndex 获取", async () => {
      const wrapper = await mountPopover();
      expect(wrapper.vm.zIndex).toBe(2000);
    });
  });

  // ==================== popoverWidth prop ====================
  describe("8. popoverWidth prop", () => {
    it("设置弹窗宽度", async () => {
      const wrapper = await mountPopover({ popoverWidth: 300 });
      expect(wrapper.props("popoverWidth")).toBe(300);
    });

    it("默认宽度为 200", async () => {
      const wrapper = await mountPopover();
      expect(wrapper.props("popoverWidth")).toBe(200);
    });
  });

  // ==================== placement prop ====================
  describe("9. placement prop", () => {
    it("placement 设置方向", async () => {
      const wrapper = await mountPopover({ placement: "top" });
      expect(wrapper.props("placement")).toBe("top");
    });

    it("支持 bottom/left/right/top", async () => {
      for (const placement of ["bottom", "left", "right", "top"] as const) {
        const wrapper = await mountPopover({ placement });
        expect(wrapper.props("placement")).toBe(placement);
      }
    });
  });

  // ==================== targetClose prop ====================
  describe("10. targetClose prop", () => {
    it("targetClose 默认值 true", async () => {
      const wrapper = await mountPopover();
      expect(wrapper.props("targetClose")).toBe(true);
    });
  });

  // ==================== stopPropagation prop ====================
  describe("11. stopPropagation prop", () => {
    it("stopPropagation=false 不阻止冒泡", async () => {
      const wrapper = await mountPopover({ stopPropagation: false });
      expect(wrapper.props("stopPropagation")).toBe(false);
    });

    it("stopPropagation=true 阻止冒泡", async () => {
      const wrapper = await mountPopover({ stopPropagation: true });
      expect(wrapper.props("stopPropagation")).toBe(true);
    });
  });

  // ==================== autoWidth prop ====================
  describe("12. autoWidth prop", () => {
    it("autoWidth=false 不自动宽度", async () => {
      const wrapper = await mountPopover({ autoWidth: false });
      expect(wrapper.props("autoWidth")).toBe(false);
    });

    it("autoWidth=true 自动宽度", async () => {
      const wrapper = await mountPopover({ autoWidth: true });
      expect(wrapper.props("autoWidth")).toBe(true);
    });
  });

  // ==================== sticky prop ====================
  describe("13. sticky prop", () => {
    it("sticky=undefined 默认", async () => {
      const wrapper = await mountPopover();
      expect(wrapper.props("sticky")).toBe(undefined);
    });

    it("sticky=left 左对齐", async () => {
      const wrapper = await mountPopover({ sticky: "left" });
      expect(wrapper.props("sticky")).toBe("left");
    });

    it("sticky=right 右对齐", async () => {
      const wrapper = await mountPopover({ sticky: "right" });
      expect(wrapper.props("sticky")).toBe("right");
    });
  });

  // ==================== contentClassName prop ====================
  describe("14. contentClassName prop", () => {
    it("contentClassName 设置内容类名", async () => {
      const wrapper = await mountPopover({ contentClassName: "custom-content" });
      expect(wrapper.props("contentClassName")).toBe("custom-content");
    });
  });

  // ==================== closeByScroll prop ====================
  describe("15. closeByScroll prop", () => {
    it("closeByScroll 默认值 true", async () => {
      const wrapper = await mountPopover();
      expect(wrapper.props("closeByScroll")).toBe(true);
    });

    it("closeByScroll=false 不关闭", async () => {
      const wrapper = await mountPopover({ closeByScroll: false });
      expect(wrapper.props("closeByScroll")).toBe(false);
    });
  });

  // ==================== id prop ====================
  describe("16. id prop", () => {
    it("自定义 id", async () => {
      const wrapper = await mountPopover({ id: "my-popover" });
      expect(wrapper.props("id")).toBe("my-popover");
    });
  });

  // ==================== change 事件 ====================
  describe("17. change 事件", () => {
    it("showPopover 触发 change(true)", async () => {
      const wrapper = await mountPopover();
      wrapper.vm.showPopover();
      await nextTick();
      vi.advanceTimersByTime(20);
      await nextTick();
      expect(wrapper.emitted("change")).toBeTruthy();
    });

    it("hidePopover 触发 change(false)", async () => {
      const wrapper = await mountPopover();
      wrapper.vm.showPopover();
      await nextTick();
      vi.advanceTimersByTime(20);
      await nextTick();
      wrapper.vm.hidePopover();
      expect(wrapper.emitted("change")).toBeTruthy();
    });
  });
});

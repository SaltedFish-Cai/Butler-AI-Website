/**
 * pa-dialog 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h } from "vue";

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: "PaIcon",
  props: {
    name: { type: String, default: "close_line" },
    customClass: { type: String, default: "" }
  },
  setup(props) {
    return () => h("i", { class: ["pa-icon-mock", props.customClass] });
  }
});

// Mock pa-overlay component
const PaOverlayMock = defineComponent({
  name: "PaOverlay",
  props: {
    modelValue: { type: Boolean, default: false },
    closeOnClickModal: { type: Boolean, default: true },
    class: { type: String, default: "" }
  },
  emits: ["click-overlay", "update:modelValue"],
  setup(props, { slots }) {
    return () =>
      h("div", { class: ["pa-overlay-mock", props.class] }, [
        h("div", { class: "pa-overlay-content", onClick: () => {} }),
        slots.default?.()
      ]);
  }
});

// Mock pa-scrollbar component
const PaScrollbarMock = defineComponent({
  name: "PaScrollbar",
  props: {
    useScrollX: { type: Boolean, default: false }
  },
  emits: ["scroll-child-change"],
  setup(props, { slots }) {
    return () => h("div", { class: "pa-scrollbar-mock" }, slots.default?.());
  }
});

// Mock getPaAnagerGlobalZIndex
const mockGetPaAnagerGlobalZIndex = vi.fn(() => 1000);

// Mock window.PancakeGlobalConfig
beforeAll(() => {
  Object.defineProperty(window, "PancakeGlobalConfig", {
    value: {
      language: "zh-CN",
      escapeMap: []
    },
    writable: true
  });
});

/** 通用 mount 辅助函数 */
async function mountDialog(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaDialog } = await import("./pa-dialog.vue");
  return mount(PaDialog, {
    props: { modelValue: false, ...props },
    slots,
    global: {
      stubs: {
        "pa-icon": PaIconMock,
        "pa-overlay": PaOverlayMock,
        "pa-scrollbar": PaScrollbarMock
      },
      provide: {
        getPaAnagerGlobalZIndex: mockGetPaAnagerGlobalZIndex
      }
    }
  });
}

describe("pa-dialog 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "addEventListener").mockImplementation(() => {});
    vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
    window.PancakeGlobalConfig.escapeMap = [];
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("modelValue=false 时不渲染 dialog", async () => {
      const wrapper = await mountDialog({ modelValue: false });
      expect(wrapper.find(".pa-dialog").exists()).toBe(false);
    });

    it("默认 props 值", async () => {
      const wrapper = await mountDialog();
      expect(wrapper.props("size")).toBe("m");
      expect(wrapper.props("height")).toBe("auto");
      expect(wrapper.props("title")).toBe("标题");
      expect(wrapper.props("useFull")).toBe(true);
      expect(wrapper.props("scroll")).toBe(true);
    });
  });

  // ==================== v-model ====================
  describe("2. v-model 双向绑定", () => {
    it("modelValue=false 时 state.visible 为 false", async () => {
      const wrapper = await mountDialog({ modelValue: false });
      expect(wrapper.vm.state.visible).toBe(false);
    });
  });

  // ==================== title prop ====================
  describe("3. title prop", () => {
    it('默认 title 为 "标题"', async () => {
      const wrapper = await mountDialog({ modelValue: true });
      await nextTick();
      expect(wrapper.text()).toContain("标题");
    });
  });

  // ==================== size prop ====================
  describe("4. size prop", () => {
    it("size=s 设置小尺寸", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "s" });
      expect(wrapper.vm.setSize).toBe("30%");
    });

    it("size=m 设置中等尺寸 (默认)", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "m" });
      expect(wrapper.vm.setSize).toBe("50%");
    });

    it("size=l 设置大尺寸", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "l" });
      expect(wrapper.vm.setSize).toBe("70%");
    });

    it("size=max 设置最大尺寸", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "max" });
      expect(wrapper.vm.setSize).toBe("95%");
    });

    it("自定义 width 优先于 size", async () => {
      const wrapper = await mountDialog({ modelValue: true, width: "600px", size: "m" });
      expect(wrapper.vm.setSize).toBe("600px");
    });
  });

  // ==================== height prop ====================
  describe("5. height prop", () => {
    it("height=auto 设置自动高度", async () => {
      const wrapper = await mountDialog({ modelValue: true, height: "auto" });
      expect(wrapper.vm.setHeight).toBe("max-content");
    });

    it("数字类型 height 转换为 px", async () => {
      const wrapper = await mountDialog({ modelValue: true, height: 300, scroll: false });
      expect(wrapper.vm.setHeight).toBe("300px");
    });

    it("字符串类型 height 直接使用", async () => {
      const wrapper = await mountDialog({ modelValue: true, height: "400px" });
      expect(wrapper.vm.setHeight).toBe("400px");
    });
  });

  // ==================== offsetX/offsetY prop ====================
  describe("6. offsetX/offsetY prop", () => {
    it("offsetX 设置 X 轴偏移", async () => {
      const wrapper = await mountDialog({ modelValue: true, offsetX: 20 });
      expect(wrapper.vm.setOffsetX).toBe("20px");
    });

    it("offsetY 设置 Y 轴偏移", async () => {
      const wrapper = await mountDialog({ modelValue: true, offsetY: 30 });
      expect(wrapper.vm.setOffsetY).toBe("30px");
    });

    it("字符串类型 offsetX 直接使用", async () => {
      const wrapper = await mountDialog({ modelValue: true, offsetX: "50px" });
      expect(wrapper.vm.setOffsetX).toBe("50px");
    });
  });

  // ==================== fullscreen 切换 ====================
  describe("7. fullscreen 切换", () => {
    it("size=full 时自动全屏", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "full" });
      expect(wrapper.vm.state.fullscreen).toBe(true);
    });

    it("非 full size 时 fullscreen 为 false", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "m" });
      expect(wrapper.vm.state.fullscreen).toBe(false);
    });

    it("fullscreen 状态下偏移为 0", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "full", offsetX: 20, offsetY: 30 });
      expect(wrapper.vm.setOffsetX).toBe(0);
      expect(wrapper.vm.setOffsetY).toBe(0);
    });

    it("fullscreen 状态下高度为 100%", async () => {
      const wrapper = await mountDialog({ modelValue: true, size: "full" });
      expect(wrapper.vm.setHeight).toBe("100%");
    });
  });

  // ==================== class/style prop ====================
  describe("8. class/style prop", () => {
    it("class prop 设置到根元素", async () => {
      const wrapper = await mountDialog({ modelValue: true });
      expect(wrapper.classes()).toContain("flex-center");
    });
  });

  // ==================== scroll prop ====================
  describe("9. scroll prop", () => {
    it("scroll=true 显示 pa-scrollbar", async () => {
      const wrapper = await mountDialog({ modelValue: true, scroll: true });
      await nextTick();
      expect(wrapper.find(".pa-scrollbar-mock").exists()).toBe(true);
    });

    it("scroll=false 不显示 pa-scrollbar", async () => {
      const wrapper = await mountDialog({ modelValue: true, scroll: false });
      await nextTick();
      expect(wrapper.find(".pa-scrollbar-mock").exists()).toBe(false);
    });
  });

  // ==================== slots ====================
  describe("10. slots", () => {
    it("默认 slot 内容渲染", async () => {
      const wrapper = await mountDialog({ modelValue: true }, { default: "弹窗内容" });
      await nextTick();
      expect(wrapper.text()).toContain("弹窗内容");
    });

    it("footer slot 渲染底部", async () => {
      const wrapper = await mountDialog({ modelValue: true }, { footer: "自定义底部" });
      await nextTick();
      expect(wrapper.text()).toContain("自定义底部");
    });
  });

  // ==================== padding prop ====================
  describe("11. padding prop", () => {
    it("padding 包含 top 添加 padding-top class", async () => {
      const wrapper = await mountDialog({ modelValue: true, scroll: false, padding: ["top"] });
      await nextTick();
      expect(wrapper.find(".dialog__body").classes()).toContain("padding-top");
    });

    it("padding=['all'] 添加所有 padding class", async () => {
      const wrapper = await mountDialog({ modelValue: true, scroll: false, padding: ["all"] });
      await nextTick();
      const body = wrapper.find(".dialog__body");
      expect(body.classes()).toContain("padding-top");
      expect(body.classes()).toContain("padding-left");
      expect(body.classes()).toContain("padding-bottom");
      expect(body.classes()).toContain("padding-right");
    });
  });
});

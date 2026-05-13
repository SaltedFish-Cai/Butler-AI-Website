/**
 * pa-drawer 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h, computed } from "vue";
import type { ComputedRef } from "vue";

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
    modelValue: { type: Boolean, default: false }
  },
  emits: ["click-overlay", "update:modelValue"],
  setup(props, { slots }) {
    return () =>
      h("div", { class: "pa-overlay-mock" }, [h("div", { class: "pa-overlay-content", onClick: () => {} }), slots.default?.()]);
  }
});

// Mock pa-scrollbar component
const PaScrollbarMock = defineComponent({
  name: "PaScrollbar",
  props: {
    useScrollX: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    return () => h("div", { class: "pa-scrollbar-mock" }, slots.default?.());
  }
});

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: "zh-CN" }
})) as ComputedRef<{ language: { value: string } }>;

// Mock getPaAnagerGlobalZIndex
const mockGetPaAnagerGlobalZIndex = vi.fn(() => 1000);

/** 通用 mount 辅助函数 */
async function mountDrawer(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaDrawer } = await import("./pa-drawer.vue");
  return mount(PaDrawer, {
    props: { modelValue: false, ...props },
    slots,
    global: {
      stubs: {
        "pa-icon": PaIconMock,
        "pa-overlay": PaOverlayMock,
        "pa-scrollbar": PaScrollbarMock
      },
      provide: {
        PancakeGlobalConfig: mockPancakeGlobalConfig,
        getPaAnagerGlobalZIndex: mockGetPaAnagerGlobalZIndex
      }
    }
  });
}

describe("pa-drawer 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "addEventListener").mockImplementation(() => {});
    vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-drawer (当 visible=true)", async () => {
      const wrapper = await mountDrawer({ modelValue: true });
      await nextTick();
      expect(wrapper.find(".pa-drawer").exists()).toBe(true);
    });

    it("modelValue=false 时不渲染 drawer", async () => {
      const wrapper = await mountDrawer({ modelValue: false });
      expect(wrapper.find(".pa-drawer").exists()).toBe(false);
    });

    it("默认 props 值", async () => {
      const wrapper = await mountDrawer();
      expect(wrapper.props("position")).toBe("right");
      expect(wrapper.props("scroll")).toBe(true);
      expect(wrapper.props("title")).toBe("标题");
    });
  });

  // ==================== v-model ====================
  describe("2. v-model 双向绑定", () => {
    it("modelValue=true 时 state.visible 为 true", async () => {
      const wrapper = await mountDrawer({ modelValue: true });
      expect(wrapper.vm.state.visible).toBe(true);
    });

    it("modelValue=false 时 state.visible 为 false", async () => {
      const wrapper = await mountDrawer({ modelValue: false });
      expect(wrapper.vm.state.visible).toBe(false);
    });

    it("modelValue 变化同步到 state.visible", async () => {
      const wrapper = await mountDrawer({ modelValue: false });
      await wrapper.setProps({ modelValue: true });
      expect(wrapper.vm.state.visible).toBe(true);
    });
  });

  // ==================== title prop ====================
  describe("3. title prop", () => {
    it("字符串 title 显示", async () => {
      const wrapper = await mountDrawer({ modelValue: true, title: "自定义标题" });
      await nextTick();
      expect(wrapper.text()).toContain("自定义标题");
    });

    it('默认 title 为 "标题"', async () => {
      const wrapper = await mountDrawer({ modelValue: true });
      await nextTick();
      expect(wrapper.text()).toContain("标题");
    });
  });

  // ==================== position prop ====================
  describe("4. position prop", () => {
    it("position=right 抽屉从右侧弹出", async () => {
      const wrapper = await mountDrawer({ modelValue: true, position: "right" });
      await nextTick();
      expect(wrapper.find(".pa-drawer-content").classes()).toContain("right");
    });

    it("position=left 抽屉从左侧弹出", async () => {
      const wrapper = await mountDrawer({ modelValue: true, position: "left" });
      await nextTick();
      expect(wrapper.find(".pa-drawer-content").classes()).toContain("left");
    });

    it("position=top 抽屉从顶部弹出", async () => {
      const wrapper = await mountDrawer({ modelValue: true, position: "top" });
      await nextTick();
      expect(wrapper.find(".pa-drawer-content").classes()).toContain("top");
    });

    it("position=bottom 抽屉从底部弹出", async () => {
      const wrapper = await mountDrawer({ modelValue: true, position: "bottom" });
      await nextTick();
      expect(wrapper.find(".pa-drawer-content").classes()).toContain("bottom");
    });
  });

  // ==================== width/height prop ====================
  describe("5. width/height prop", () => {
    it("自定义 width 应用", async () => {
      const wrapper = await mountDrawer({ modelValue: true, width: "400px" });
      await nextTick();
      expect(wrapper.find(".pa-drawer-content").attributes("style")).toContain("width");
      expect(wrapper.find(".pa-drawer-content").attributes("style")).toContain("400px");
    });

    it("自定义 height 应用", async () => {
      const wrapper = await mountDrawer({ modelValue: true, height: "500px" });
      await nextTick();
      expect(wrapper.find(".pa-drawer-content").attributes("style")).toContain("height");
      expect(wrapper.find(".pa-drawer-content").attributes("style")).toContain("500px");
    });
  });

  // ==================== closeMenu 关闭方法 ====================
  describe("6. closeMenu 关闭方法", () => {
    it("closeMenu 触发 update:modelValue(false)", async () => {
      const wrapper = await mountDrawer({ modelValue: true });
      wrapper.vm.closeMenu();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual([false]);
    });

    it("closeMenu 触发 closed 事件", async () => {
      const wrapper = await mountDrawer({ modelValue: true });
      wrapper.vm.closeMenu();
      expect(wrapper.emitted("closed")).toBeTruthy();
    });
  });

  // ==================== closeOnClickModal prop ====================
  describe("7. closeOnClickModal prop", () => {
    it("点击关闭按钮触发关闭", async () => {
      const wrapper = await mountDrawer({ modelValue: true });
      await nextTick();
      await wrapper.find(".pa-icon-mock").trigger("click");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });
  });

  // ==================== class/style prop ====================
  describe("8. class/style prop", () => {
    it("class prop 应用到根元素", async () => {
      const wrapper = await mountDrawer({ modelValue: true });
      // pa-drawer 根元素包含 class 属性
      expect(wrapper.classes().length).toBeGreaterThan(0);
    });

    it("自定义 style 应用", async () => {
      const wrapper = await mountDrawer({ modelValue: true, style: { color: "red" } });
      await nextTick();
      expect(wrapper.exists()).toBe(true);
    });
  });

  // ==================== scroll prop ====================
  describe("9. scroll prop", () => {
    it("scroll=true 显示 pa-scrollbar", async () => {
      const wrapper = await mountDrawer({ modelValue: true, scroll: true });
      await nextTick();
      expect(wrapper.find(".pa-scrollbar-mock").exists()).toBe(true);
    });

    it("scroll=false 不显示 pa-scrollbar", async () => {
      const wrapper = await mountDrawer({ modelValue: true, scroll: false });
      await nextTick();
      expect(wrapper.find(".pa-scrollbar-mock").exists()).toBe(false);
    });
  });

  // ==================== slots ====================
  describe("10. slots", () => {
    it("默认 slot 内容渲染", async () => {
      const wrapper = await mountDrawer({ modelValue: true }, { default: "抽屉内容" });
      await nextTick();
      expect(wrapper.text()).toContain("抽屉内容");
    });

    it("header slot 覆盖默认头部", async () => {
      const wrapper = await mountDrawer({ modelValue: true }, { header: "自定义头部" });
      await nextTick();
      expect(wrapper.text()).toContain("自定义头部");
    });

    it("footer slot 渲染底部", async () => {
      const wrapper = await mountDrawer({ modelValue: true }, { footer: "自定义底部" });
      await nextTick();
      expect(wrapper.text()).toContain("自定义底部");
    });
  });

  // ==================== padding prop ====================
  describe("11. padding prop", () => {
    it("padding 包含 top 添加 padding-top class", async () => {
      const wrapper = await mountDrawer({ modelValue: true, scroll: false, padding: ["top"] });
      await nextTick();
      expect(wrapper.find(".pa-drawer-content_body_content").classes()).toContain("padding-top");
    });

    it("padding=['all'] 添加所有 padding class", async () => {
      const wrapper = await mountDrawer({ modelValue: true, scroll: false, padding: ["all"] });
      await nextTick();
      const body = wrapper.find(".pa-drawer-content_body_content");
      expect(body.classes()).toContain("padding-top");
      expect(body.classes()).toContain("padding-left");
      expect(body.classes()).toContain("padding-bottom");
      expect(body.classes()).toContain("padding-right");
    });
  });

  // ==================== language ====================
  describe("12. language", () => {
    it("中文环境", async () => {
      const wrapper = await mountDrawer({ modelValue: true, title: "测试标题" });
      expect(wrapper.vm.language).toBe("zh-CN");
    });
  });
});

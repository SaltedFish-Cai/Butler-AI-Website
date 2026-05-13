/**
 * pa-number 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h, computed } from "vue";
import type { ComputedRef } from "vue";

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: "PaIcon",
  props: {
    name: { type: String, default: "close_circle_line" },
    customClass: { type: String, default: "" }
  },
  setup(props) {
    return () =>
      h("i", {
        class: ["pa-icon-mock", props.customClass],
        onClick: () => {}
      });
  }
});

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: "zh-CN", package: { cell: { inputPlaceholder: "请输入" } } }
})) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>;

/** 通用 mount 辅助函数 */
async function mountNumber(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaNumber } = await import("./pa-number.vue");
  return mount(PaNumber, {
    props,
    global: {
      stubs: { "pa-icon": PaIconMock, "pa-popover": true },
      provide: {
        PancakeGlobalConfig: mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  });
}

describe("pa-number 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-number", async () => {
      const wrapper = await mountNumber();
      expect(wrapper.find("div.pa-number").exists()).toBe(true);
    });

    it("渲染 input", async () => {
      const wrapper = await mountNumber();
      expect(wrapper.find("input.pa-number-input-inner").exists()).toBe(true);
    });
  });

  // ==================== v-model ====================
  describe("2. v-model 双向绑定", () => {
    it("初始值绑定", async () => {
      const wrapper = await mountNumber({ modelValue: 100 });
      expect((wrapper.find("input").element as HTMLInputElement).value).toContain("100");
    });

    it("字符串数值绑定", async () => {
      const wrapper = await mountNumber({ modelValue: "50" });
      expect((wrapper.find("input").element as HTMLInputElement).value).toContain("50");
    });
  });

  // ==================== disabled prop ====================
  describe("3. disabled prop", () => {
    it("disabled=true 时 input 禁用", async () => {
      const wrapper = await mountNumber({ disabled: true });
      expect(wrapper.find("input").attributes("disabled")).toBeDefined();
      expect(wrapper.find(".pa-number").classes()).toContain("is-disabled");
    });

    it("disabled=false 时 input 可用", async () => {
      const wrapper = await mountNumber({ disabled: false });
      expect(wrapper.find("input").attributes("disabled")).toBeUndefined();
    });
  });

  // ==================== controls prop ====================
  describe("4. controls prop", () => {
    it("controls=true 显示控制按钮", async () => {
      const wrapper = await mountNumber({ controls: true });
      expect(wrapper.find(".pa-number-input-controls").exists()).toBe(true);
    });

    it("controls=false 隐藏控制按钮", async () => {
      const wrapper = await mountNumber({ controls: false });
      expect(wrapper.find(".pa-number-input-controls").exists()).toBe(false);
    });
  });

  // ==================== unit prop ====================
  describe("5. unit prop", () => {
    it("unit 显示单位", async () => {
      const wrapper = await mountNumber({ modelValue: 10, unit: "元" });
      expect(wrapper.find(".pa-number-input-unit").text()).toContain("元");
    });
  });

  // ==================== precision prop ====================
  describe("6. precision prop 精度", () => {
    it("precision=2 保留两位小数", async () => {
      const wrapper = await mountNumber({ modelValue: 10.12345, precision: 2 });
      expect(wrapper.props("precision")).toBe(2);
    });
  });

  // ==================== min/max prop ====================
  describe("7. min/max prop", () => {
    it("min 限制最小值", async () => {
      const wrapper = await mountNumber({ min: 0, modelValue: -5 });
      expect(wrapper.props("min")).toBe(0);
    });

    it("max 限制最大值", async () => {
      const wrapper = await mountNumber({ max: 100, modelValue: 150 });
      expect(wrapper.props("max")).toBe(100);
    });
  });

  // ==================== step prop ====================
  describe("8. step prop", () => {
    it("step 默认值为 1", async () => {
      const wrapper = await mountNumber();
      expect(wrapper.props("step")).toBe(1);
    });

    it("step=10 设置步长", async () => {
      const wrapper = await mountNumber({ step: 10 });
      expect(wrapper.props("step")).toBe(10);
    });
  });

  // ==================== placeholder prop ====================
  describe("9. placeholder prop", () => {
    it("字符串 placeholder 显示", async () => {
      const wrapper = await mountNumber({ placeholder: "请输入数字" });
      expect(wrapper.find("input").attributes("placeholder")).toBe("请输入数字");
    });

    it("多语言 placeholder 显示中文", async () => {
      const wrapper = await mountNumber({ placeholder: { "zh-CN": "请输入", "en-US": "Enter" } });
      expect(wrapper.find("input").attributes("placeholder")).toBe("请输入");
    });
  });

  // ==================== title prop ====================
  describe("10. title prop", () => {
    it("字符串 title 显示", async () => {
      const wrapper = await mountNumber({ title: "数量" });
      expect(wrapper.find(".pa-cell-label").text()).toContain("数量");
    });
  });

  // ==================== display prop ====================
  describe("11. display prop 纯展示模式", () => {
    it("display=true 渲染展示模式", async () => {
      const wrapper = await mountNumber({ display: true, modelValue: 100 });
      expect(wrapper.find(".pa-display-style").exists()).toBe(true);
    });

    it("display=true 有值时显示数值", async () => {
      const wrapper = await mountNumber({ display: true, modelValue: 100 });
      expect(wrapper.find(".pa-display-value_content").text()).toContain("100");
    });
  });

  // ==================== contrastData prop ====================
  describe("12. contrastData prop 对比数据", () => {
    it("值不同时显示对比数据", async () => {
      const wrapper = await mountNumber({ modelValue: 200, contrastData: 100 });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });

    it("alwaysContrast=true 始终显示对比数据", async () => {
      const wrapper = await mountNumber({ modelValue: 100, contrastData: 100, alwaysContrast: true });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });
  });

  // ==================== class/style prop ====================
  describe("13. class/style prop", () => {
    it("自定义 class 应用", async () => {
      const wrapper = await mountNumber({ class: "custom-class" });
      expect(wrapper.find(".pa-number").classes()).toContain("custom-class");
    });

    it("自定义 style 应用", async () => {
      const wrapper = await mountNumber({ style: { color: "blue" } });
      const style = wrapper.find(".pa-number").attributes("style");
      expect(style).toContain("color");
    });
  });

  // ==================== events ====================
  describe("14. 事件触发", () => {
    it("blur 事件触发", async () => {
      const wrapper = await mountNumber();
      await wrapper.find("input").trigger("blur");
      expect(wrapper.emitted("blur")).toBeTruthy();
    });
  });

  // ==================== id prop ====================
  describe("15. id prop", () => {
    it("id 绑定到 input", async () => {
      const wrapper = await mountNumber({ id: "number-input" });
      expect(wrapper.find("input").attributes("name")).toBe("number-input");
    });
  });
});

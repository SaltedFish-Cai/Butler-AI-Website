/**
 * pa-input 组件单元测试
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
async function mountInput(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaInput } = await import("./pa-input.vue");
  return mount(PaInput, {
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

describe("pa-input 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-input", async () => {
      const wrapper = await mountInput();
      expect(wrapper.find("div.pa-input").exists()).toBe(true);
    });

    it("默认 type 为 textarea", async () => {
      const wrapper = await mountInput();
      expect(wrapper.find("textarea").exists()).toBe(true);
    });
  });

  // ==================== v-model ====================
  describe("2. v-model 双向绑定", () => {
    it("初始值绑定", async () => {
      const wrapper = await mountInput({ modelValue: "test value" });
      expect(wrapper.find("textarea").exists()).toBe(true);
    });

    it("更新值触发 update:modelValue", async () => {
      const wrapper = await mountInput({ modelValue: "" });
      const textarea = wrapper.find("textarea");
      await textarea.setValue("new value");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });
  });

  // ==================== disabled prop ====================
  describe("3. disabled prop", () => {
    it("disabled=true 时 textarea 禁用", async () => {
      const wrapper = await mountInput({ disabled: true });
      expect(wrapper.find("textarea").attributes("disabled")).toBeDefined();
      expect(wrapper.find(".pa-input_body").classes()).toContain("is-disabled");
    });

    it("disabled=false 时 textarea 可用", async () => {
      const wrapper = await mountInput({ disabled: false });
      expect(wrapper.find("textarea").attributes("disabled")).toBeUndefined();
    });
  });

  // ==================== maxLength prop ====================
  describe("4. maxLength prop", () => {
    it("maxLength 限制输入", async () => {
      const wrapper = await mountInput({ maxLength: 5 });
      expect(wrapper.find("textarea").attributes("maxlength")).toBe("5");
    });
  });

  // ==================== placeholder prop ====================
  describe("5. placeholder prop", () => {
    it("字符串 placeholder 显示", async () => {
      const wrapper = await mountInput({ placeholder: "请输入内容" });
      expect(wrapper.find("textarea").attributes("placeholder")).toBe("请输入内容");
    });

    it("多语言 placeholder 显示中文", async () => {
      const wrapper = await mountInput({ placeholder: { "zh-CN": "请输入", "en-US": "Enter" } });
      expect(wrapper.find("textarea").attributes("placeholder")).toBe("请输入");
    });

    it("多语言 placeholder 英文环境", async () => {
      const enConfig = computed(() => ({
        language: { value: "en-US", package: { cell: { inputPlaceholder: "Enter" } } }
      })) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>;
      const { default: PaInput } = await import("./pa-input.vue");
      const wrapper = mount(PaInput, {
        props: { placeholder: { "zh-CN": "请输入", "en-US": "Enter" } },
        global: {
          stubs: { "pa-icon": PaIconMock, "pa-popover": true },
          provide: { PancakeGlobalConfig: enConfig }
        }
      });
      expect(wrapper.find("textarea").attributes("placeholder")).toBe("Enter");
    });
  });

  // ==================== title prop ====================
  describe("6. title prop", () => {
    it("字符串 title 显示", async () => {
      const wrapper = await mountInput({ title: "标签" });
      expect(wrapper.find(".pa-cell-label").text()).toContain("标签");
    });

    it("多语言 title 显示", async () => {
      const wrapper = await mountInput({ title: { "zh-CN": "标签", "en-US": "Label" } });
      expect(wrapper.find(".pa-cell-label").text()).toContain("标签");
    });
  });

  // ==================== titleWidth prop ====================
  describe("7. titleWidth prop", () => {
    it("titleWidth 应用到 label", async () => {
      const wrapper = await mountInput({ title: "标签", titleWidth: "100px" });
      expect(wrapper.find(".pa-cell-label").attributes("style")).toContain("width");
    });
  });

  // ==================== display prop ====================
  describe("8. display prop 纯展示模式", () => {
    it("display=true 渲染展示模式", async () => {
      const wrapper = await mountInput({ display: true, modelValue: "display value" });
      expect(wrapper.find(".pa-display-style").exists()).toBe(true);
      expect(wrapper.find(".pa-display-value_content").text()).toContain("display value");
    });

    it("display=true 无值显示 --", async () => {
      const wrapper = await mountInput({ display: true, modelValue: "" });
      expect(wrapper.find(".pa-display-value_content").text()).toContain("--");
    });
  });

  // ==================== contrastData prop ====================
  describe("9. contrastData prop 对比数据", () => {
    it("值不同时显示对比数据", async () => {
      const wrapper = await mountInput({ modelValue: "new value", contrastData: "old value" });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });

    it("值相同时不显示对比数据", async () => {
      const wrapper = await mountInput({ modelValue: "same value", contrastData: "same value" });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(false);
    });

    it("alwaysContrast=true 始终显示对比数据", async () => {
      const wrapper = await mountInput({ modelValue: "same value", contrastData: "same value", alwaysContrast: true });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });
  });

  // ==================== class/style prop ====================
  describe("10. class/style prop", () => {
    it("自定义 class 应用", async () => {
      const wrapper = await mountInput({ class: "custom-class" });
      expect(wrapper.find(".pa-input").classes()).toContain("custom-class");
    });

    it("自定义 style 应用", async () => {
      const wrapper = await mountInput({ style: { color: "red" } });
      const style = wrapper.find(".pa-input").attributes("style");
      expect(style).toContain("color");
    });
  });

  // ==================== events ====================
  describe("11. 事件触发", () => {
    it("focus 事件触发", async () => {
      const wrapper = await mountInput();
      await wrapper.find("textarea").trigger("focus");
      expect(wrapper.emitted("focus")).toBeTruthy();
    });

    it("blur 事件触发", async () => {
      const wrapper = await mountInput();
      await wrapper.find("textarea").trigger("blur");
      expect(wrapper.emitted("blur")).toBeTruthy();
    });

    it("change 事件触发", async () => {
      const wrapper = await mountInput({ modelValue: "initial" });
      await wrapper.find("textarea").trigger("change");
      expect(wrapper.emitted("change")).toBeTruthy();
    });

    it("enter 事件触发", async () => {
      const wrapper = await mountInput();
      const textarea = wrapper.find("textarea");
      await textarea.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("enter")).toBeTruthy();
    });
  });

  // ==================== clearable prop ====================
  describe("12. clearable prop", () => {
    it("clearable=true 设置到组件", async () => {
      const wrapper = await mountInput({ modelValue: "test", clearable: true });
      expect(wrapper.props("clearable")).toBe(true);
    });

    it("clearable=false 不显示清除按钮", async () => {
      const wrapper = await mountInput({ modelValue: "test", clearable: false });
      expect(wrapper.props("clearable")).toBe(false);
    });
  });

  // ==================== id prop ====================
  describe("13. id prop", () => {
    it("id 绑定到 textarea", async () => {
      const wrapper = await mountInput({ id: "test-input" });
      expect(wrapper.find("textarea").attributes("name")).toBe("test-input");
    });
  });

  // ==================== slot ====================
  describe("14. slot", () => {
    it("exDisplay slot 渲染", async () => {
      const { default: PaInput } = await import("./pa-input.vue");
      const wrapper = mount(PaInput, {
        props: { display: true, modelValue: "test" },
        slots: { exDisplay: "<span>custom display</span>" },
        global: {
          stubs: { "pa-icon": PaIconMock, "pa-popover": true },
          provide: { PancakeGlobalConfig: mockPancakeGlobalConfig }
        }
      });
      expect(wrapper.find(".pa-display-value_content").text()).toContain("custom display");
    });
  });
});

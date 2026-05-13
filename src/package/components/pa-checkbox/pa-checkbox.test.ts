/**
 * pa-checkbox 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h, computed, ref } from "vue";
import type { ComputedRef } from "vue";

// Mock pa-checkbox-item component
const PaCheckboxItemMock = defineComponent({
  name: "PaCheckboxItem",
  props: {
    label: { type: [String, Object], default: "" },
    value: { type: [String, Number, Boolean], default: "" },
    isChecked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    isOption: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () =>
      h(
        "div",
        {
          class: ["pa-checkbox-item", { "is-checked": props.isChecked, "is-disabled": props.disabled }],
          onClick: () => {
            if (!props.disabled) {
              emit("change", { value: props.value, oldValue: "" });
            }
          }
        },
        typeof props.label === "object" ? "label" : props.label
      );
  }
});

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: "zh-CN", package: { cell: {} } }
})) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>;

/** 通用 mount 辅助函数 */
async function mountCheckbox(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaCheckbox } = await import("./pa-checkbox.vue");
  return mount(PaCheckbox, {
    props,
    global: {
      stubs: { "pa-checkbox-item": PaCheckboxItemMock, "pa-popover": true },
      provide: {
        PancakeGlobalConfig: mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  });
}

describe("pa-checkbox 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-checkbox", async () => {
      const wrapper = await mountCheckbox();
      expect(wrapper.find("div.pa-checkbox").exists()).toBe(true);
    });

    it("渲染选项列表", async () => {
      const wrapper = await mountCheckbox({
        exOptions: [
          { label: "选项1", value: 1 },
          { label: "选项2", value: 2 }
        ]
      });
      expect(wrapper.findAllComponents({ name: "PaCheckboxItem" }).length).toBe(2);
    });
  });

  // ==================== v-model ====================
  describe("2. v-model 双向绑定", () => {
    it("初始值绑定数组", async () => {
      const wrapper = await mountCheckbox({ modelValue: [1, 2] });
      expect(wrapper.vm.inValue).toEqual([1, 2]);
    });

    it("更新值触发 update:modelValue", async () => {
      const wrapper = await mountCheckbox({
        modelValue: [1],
        exOptions: [
          { label: "选项1", value: 1 },
          { label: "选项2", value: 2 }
        ]
      });
      const checkboxItems = wrapper.findAllComponents({ name: "PaCheckboxItem" });
      await checkboxItems[1].trigger("click");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });
  });

  // ==================== disabled prop ====================
  describe("3. disabled prop", () => {
    it("disabled=true 时选项禁用", async () => {
      const wrapper = await mountCheckbox({ disabled: true });
      expect(wrapper.find(".pa-checkbox").attributes("disabled")).toBeDefined();
    });
  });

  // ==================== exOptions prop ====================
  describe("4. exOptions prop", () => {
    it("渲染选项", async () => {
      const options = [
        { label: "苹果", value: "apple" },
        { label: "香蕉", value: "banana" }
      ];
      const wrapper = await mountCheckbox({ exOptions: options });
      expect(wrapper.findAllComponents({ name: "PaCheckboxItem" }).length).toBe(2);
    });

    it("字符串 label", async () => {
      const wrapper = await mountCheckbox({
        exOptions: [{ label: "中文", value: 1 }]
      });
      expect(wrapper.findComponent({ name: "PaCheckboxItem" }).text()).toContain("中文");
    });
  });

  // ==================== display prop ====================
  describe("5. display prop 纯展示模式", () => {
    it("display=true 渲染展示模式", async () => {
      const wrapper = await mountCheckbox({
        display: true,
        modelValue: ["apple"],
        exOptions: [{ label: "苹果", value: "apple" }]
      });
      expect(wrapper.find(".pa-display-style").exists()).toBe(true);
    });

    it("display=true 显示选中值", async () => {
      const wrapper = await mountCheckbox({
        display: true,
        modelValue: ["apple"],
        exOptions: [{ label: "苹果", value: "apple" }]
      });
      expect(wrapper.find(".pa-display-value_content").text()).toContain("苹果");
    });

    it("display=true 无选中值显示 --", async () => {
      const wrapper = await mountCheckbox({
        display: true,
        modelValue: [],
        exOptions: [{ label: "苹果", value: "apple" }]
      });
      expect(wrapper.find(".pa-display-value_content").text()).toContain("--");
    });
  });

  // ==================== displayValue prop ====================
  describe("6. displayValue prop", () => {
    it("直接显示 displayValue", async () => {
      const wrapper = await mountCheckbox({
        display: true,
        displayValue: "自定义显示"
      });
      expect(wrapper.find(".pa-display-value_content").text()).toContain("自定义显示");
    });
  });

  // ==================== contrastData prop ====================
  describe("7. contrastData prop 对比数据", () => {
    it("值不同时显示对比数据", async () => {
      const wrapper = await mountCheckbox({ modelValue: [1], contrastData: [2] });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });
  });

  // ==================== class/style prop ====================
  describe("8. class/style prop", () => {
    it("自定义 class 应用", async () => {
      const wrapper = await mountCheckbox({ class: "custom-class" });
      expect(wrapper.find(".pa-checkbox").classes()).toContain("custom-class");
    });

    it("自定义 style 应用", async () => {
      const wrapper = await mountCheckbox({ style: { color: "red" } });
      const style = wrapper.find(".pa-checkbox").attributes("style");
      expect(style).toContain("color");
    });
  });

  // ==================== title prop ====================
  describe("9. title prop", () => {
    it("title 显示标签", async () => {
      const wrapper = await mountCheckbox({ title: "爱好" });
      expect(wrapper.find(".pa-cell-label").text()).toContain("爱好");
    });
  });

  // ==================== change event ====================
  describe("10. change 事件", () => {
    it("选项变更触发 change", async () => {
      const wrapper = await mountCheckbox({
        modelValue: [1],
        exOptions: [
          { label: "选项1", value: 1 },
          { label: "选项2", value: 2 }
        ]
      });
      const checkboxItems = wrapper.findAllComponents({ name: "PaCheckboxItem" });
      if (checkboxItems.length > 1) {
        await checkboxItems[1].trigger("click");
        expect(wrapper.emitted("change")).toBeTruthy();
      }
    });
  });
});

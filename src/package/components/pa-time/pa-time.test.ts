/**
 * pa-time 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h, computed } from "vue";
import type { ComputedRef } from "vue";

// Mock MDateTimePanel component
const MDateTimePanelMock = defineComponent({
  name: "MDateTimePanel",
  props: {
    modelValue: { type: [String, Array], default: null },
    type: { type: String, default: "date-picker" }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () => h("div", { class: "m-datetime-panel-mock" });
  }
});

// Mock MYearPanel component
const MYearPanelMock = defineComponent({
  name: "MYearPanel",
  props: {
    modelValue: { type: [String, Array], default: null },
    type: { type: String, default: "year-picker" }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () => h("div", { class: "m-year-panel-mock" });
  }
});

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: "zh-CN", package: { cell: { selectPlaceholder: "请选择日期" } } }
})) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>;

/** 通用 mount 辅助函数 */
async function mountTime(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaTime } = await import("./pa-time.vue");
  return mount(PaTime, {
    props,
    global: {
      stubs: {
        MDateTimePanel: MDateTimePanelMock,
        MYearPanel: MYearPanelMock,
        "pa-popover": true
      },
      provide: {
        PancakeGlobalConfig: mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  });
}

describe("pa-time 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-time", async () => {
      const wrapper = await mountTime();
      expect(wrapper.find("div.pa-time").exists()).toBe(true);
    });
  });

  // ==================== v-model ====================
  describe("2. v-model 双向绑定", () => {
    it("日期选择初始值绑定", async () => {
      const wrapper = await mountTime({ modelValue: "2024-01-01" });
      expect(wrapper.vm.inValue).toBe("2024-01-01");
    });

    it("范围选择初始值绑定", async () => {
      const wrapper = await mountTime({ type: "date-picker-group", modelValue: ["2024-01-01", "2024-01-31"] });
      expect(wrapper.vm.inValue).toEqual(["2024-01-01", "2024-01-31"]);
    });
  });

  // ==================== type prop ====================
  describe("3. type prop", () => {
    it("type=date-picker 日期选择", async () => {
      const wrapper = await mountTime({ type: "date-picker" });
      expect(wrapper.props("type")).toBe("date-picker");
      expect(wrapper.vm.isRange).toBe(false);
    });

    it("type=date-picker-group 范围选择", async () => {
      const wrapper = await mountTime({ type: "date-picker-group" });
      expect(wrapper.vm.isRange).toBe(true);
    });

    it("type=time-picker 时间选择", async () => {
      const wrapper = await mountTime({ type: "time-picker" });
      expect(wrapper.props("type")).toBe("time-picker");
    });

    it("type=year-picker 年份选择", async () => {
      const wrapper = await mountTime({ type: "year-picker" });
      expect(wrapper.props("type")).toBe("year-picker");
    });

    it("type=month-picker 月份选择", async () => {
      const wrapper = await mountTime({ type: "month-picker" });
      expect(wrapper.props("type")).toBe("month-picker");
    });
  });

  // ==================== disabled prop ====================
  describe("4. disabled prop", () => {
    it("disabled=true 添加 is-disabled class", async () => {
      const wrapper = await mountTime({ disabled: true });
      expect(wrapper.find(".pa-time").classes()).toContain("is-disabled");
    });
  });

  // ==================== display prop ====================
  describe("5. display prop 纯展示模式", () => {
    it("display=true 渲染展示模式", async () => {
      const wrapper = await mountTime({
        display: true,
        modelValue: "2024-01-01"
      });
      expect(wrapper.find(".pa-display-style").exists()).toBe(true);
    });

    it("displayValue 直接显示", async () => {
      const wrapper = await mountTime({
        display: true,
        displayValue: "自定义日期"
      });
      expect(wrapper.find(".pa-display-value_content").text()).toContain("自定义日期");
    });
  });

  // ==================== contrastData prop ====================
  describe("6. contrastData prop 对比数据", () => {
    it("值不同时显示对比数据", async () => {
      const wrapper = await mountTime({ modelValue: "2024-01-01", contrastData: "2024-01-02" });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });

    it("alwaysContrast=true 始终显示对比数据", async () => {
      const wrapper = await mountTime({
        modelValue: "2024-01-01",
        contrastData: "2024-01-01",
        alwaysContrast: true
      });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });
  });

  // ==================== class/style prop ====================
  describe("7. class/style prop", () => {
    it("自定义 class 应用", async () => {
      const wrapper = await mountTime({ class: "custom-class" });
      expect(wrapper.find(".pa-time").classes()).toContain("custom-class");
    });

    it("自定义 style 应用", async () => {
      const wrapper = await mountTime({ style: { color: "blue" } });
      const style = wrapper.find(".pa-time").attributes("style");
      expect(style).toContain("color");
    });
  });

  // ==================== title prop ====================
  describe("8. title prop", () => {
    it("title prop 设置成功", async () => {
      const wrapper = await mountTime({ title: "日期" });
      expect(wrapper.props("title")).toBe("日期");
    });
  });

  // ==================== placeholder prop ====================
  describe("9. placeholder prop", () => {
    it("placeholder prop 设置成功", async () => {
      const wrapper = await mountTime({ placeholder: "选择日期" });
      expect(wrapper.props("placeholder")).toBe("选择日期");
    });

    it("多语言 placeholder", async () => {
      const wrapper = await mountTime({
        placeholder: { "zh-CN": "选择日期", "en-US": "Select Date" }
      });
      expect(wrapper.vm.inputPlaceholder).toContain("选择日期");
    });
  });

  // ==================== findData computed ====================
  describe("10. findData method", () => {
    it("findData 格式化日期", async () => {
      const wrapper = await mountTime({ modelValue: "2024-01-01" });
      expect(wrapper.vm.findData("2024-01-01")).toBeTruthy();
    });

    it("findData 格式化范围日期", async () => {
      const wrapper = await mountTime({ type: "date-picker-group" });
      expect(wrapper.vm.findData(["2024-01-01", "2024-01-31"])).toBeTruthy();
    });

    it("findData 处理空值", async () => {
      const wrapper = await mountTime();
      expect(wrapper.vm.findData(undefined)).toBe("--");
    });
  });

  // ==================== isRange computed ====================
  describe("11. isRange computed", () => {
    it("非 group 类型 isRange 为 false", async () => {
      const wrapper = await mountTime({ type: "date-picker" });
      expect(wrapper.vm.isRange).toBe(false);
    });

    it("group 类型 isRange 为 true", async () => {
      const wrapper = await mountTime({ type: "date-picker-group" });
      expect(wrapper.vm.isRange).toBe(true);
    });
  });
});

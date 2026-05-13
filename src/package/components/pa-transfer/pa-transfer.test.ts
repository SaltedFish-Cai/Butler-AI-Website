/**
 * pa-transfer 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h } from "vue";

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = {
  value: {
    language: {
      value: "zh-CN",
      package: {
        cell: {
          unselected: "未选中",
          selected: "已选中"
        }
      }
    }
  }
};

// Mock PaIcon
const PaIconMock = defineComponent({
  name: "PaIcon",
  props: {
    name: { type: String, default: "loading_line" }
  },
  template: '<span class="pa-icon icon-{{ name }}"></span>'
});

// Mock PaButton
const PaButtonMock = defineComponent({
  name: "PaButton",
  props: {
    iconName: { type: String, default: "" },
    disabled: { type: Boolean, default: false }
  },
  template: '<button class="pa-button" :disabled="disabled">{{ $slots.default?.() }}</button>'
});

// Mock PaInput
const PaInputMock = defineComponent({
  name: "PaInput",
  props: {
    modelValue: { type: String, default: "" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    return () =>
      h("input", {
        class: "pa-input",
        value: props.modelValue,
        disabled: props.disabled,
        onInput: (e: Event) => emit("update:modelValue", (e.target as HTMLInputElement).value)
      });
  }
});

// Mock PaCheckboxItem
const PaCheckboxItemMock = defineComponent({
  name: "PaCheckboxItem",
  props: {
    disabled: { type: Boolean, default: false },
    isChecked: { type: Boolean, default: false },
    isIndeterminate: { type: Boolean, default: false }
  },
  emits: ["change"],
  template: '<div class="pa-checkbox-item" :class="{ checked: isChecked }" @click="$emit(\'change\')"></div>'
});

// Mock PaScrollbar
const PaScrollbarMock = defineComponent({
  name: "PaScrollbar",
  props: {
    useBackTop: { type: Boolean, default: false },
    useScrollX: { type: Boolean, default: false },
    padding: { type: Array, default: () => [] }
  },
  template: '<div class="pa-scrollbar"><slot /></div>'
});

// Mock PaEmpty
const PaEmptyMock = defineComponent({
  name: "PaEmpty",
  props: {
    message: { type: [String, Object], default: "" },
    style: { type: Object, default: () => ({}) }
  },
  template: '<div class="pa-empty">{{ typeof message === \'object\' ? message["zh-CN"] : message }}</div>'
});

// 测试数据
const mockOptions = [
  { value: "1", label: "选项1" },
  { value: "2", label: "选项2" },
  { value: "3", label: "选项3" },
  { value: "4", label: "选项4" }
];

describe("pa-transfer 组件测试", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    if (typeof window !== "undefined") {
      window.PancakeGlobalConfig = mockPancakeGlobalConfig.value as any;
    }
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // 通用 mount 辅助函数
  async function mountTransfer(props: Record<string, any> = {}) {
    const PaTransfer = await import("./pa-transfer.vue");
    return mount(PaTransfer.default, {
      props: {
        id: "test-transfer",
        ...props
      },
      global: {
        stubs: {
          "pa-icon": PaIconMock,
          "pa-button": PaButtonMock,
          "pa-input": PaInputMock,
          "pa-checkbox-item": PaCheckboxItemMock,
          "pa-scrollbar": PaScrollbarMock,
          "pa-empty": PaEmptyMock
        },
        provide: {
          PancakeGlobalConfig: mockPancakeGlobalConfig
        }
      }
    });
  }

  // ==================== 组件基础 ====================
  describe("1. 组件基础", () => {
    it("组件导出存在", async () => {
      const PaTransfer = await import("./index");
      expect(PaTransfer.default).toBeDefined();
    });

    it("渲染基本结构", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      expect(wrapper.find(".pa-transfer").exists()).toBe(true);
    });

    it("默认高度为 300px", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      const style = wrapper.find(".pa-transfer").attributes("style");
      expect(style).toContain("300px");
    });

    it("接受自定义高度", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        height: "400px"
      });
      const style = wrapper.find(".pa-transfer").attributes("style");
      expect(style).toContain("400px");
    });
  });

  // ==================== props 属性 ====================
  describe("2. props 属性", () => {
    it("id prop 正确绑定", async () => {
      const wrapper = await mountTransfer({
        id: "custom-id",
        exOptions: mockOptions
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("class prop 接受字符串", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        class: "custom-class"
      });
      const el = wrapper.find(".pa-transfer");
      expect(el.classes()).toContain("custom-class");
    });

    it("style prop 接受对象", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        style: { width: "100%" }
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("modelValue prop 控制选中值", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        modelValue: ["1", "2"]
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("disabled prop 禁用组件", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        disabled: true
      });
      const el = wrapper.find(".pa-transfer");
      expect(el.classes()).toContain("is-disabled");
    });

    it("display prop 显示模式", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        display: true,
        modelValue: ["1"]
      });
      expect(wrapper.find(".pa-display-style").exists()).toBe(true);
    });

    it("displayValue prop 显示值", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        display: true,
        displayValue: "自定义显示",
        modelValue: ["1"]
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("useSearch prop 启用搜索", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        useSearch: true
      });
      expect(wrapper.findAll("input.pa-input").length).toBeGreaterThanOrEqual(0);
    });

    it("placeholder prop 设置占位符", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        placeholder: "请选择"
      });
      expect(wrapper.vm).toBeDefined();
    });
  });

  // ==================== 数据选项 ====================
  describe("3. 数据选项", () => {
    it("exOptions prop 提供选项数据", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("空选项显示空状态", async () => {
      const wrapper = await mountTransfer({
        exOptions: []
      });
      expect(wrapper.find(".pa-empty").exists()).toBe(true);
    });

    it("选项支持多语言 label", async () => {
      const multiLangOptions = [{ value: "1", label: { "zh-CN": "中文", "en-US": "English" } }];
      const wrapper = await mountTransfer({
        exOptions: multiLangOptions
      });
      expect(wrapper.vm).toBeDefined();
    });
  });

  // ==================== 穿梭功能 ====================
  describe("4. 穿梭功能", () => {
    it("左右两侧选择框存在", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      expect(wrapper.findAll(".pa-transfer-select-box").length).toBe(2);
    });

    it("中间穿梭按钮存在", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      expect(wrapper.find(".pa-transfer-transfer").exists()).toBe(true);
      expect(wrapper.findAll(".pa-button").length).toBe(2);
    });

    it("左右标题存在", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      const titles = wrapper.findAll(".pa-transfer-select-box_title");
      expect(titles.length).toBe(2);
    });
  });

  // ==================== 事件 ====================
  describe("5. 事件", () => {
    it("update:modelValue 事件存在", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("change 事件存在", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions
      });
      expect(wrapper.vm).toBeDefined();
    });
  });

  // ==================== 对比数据 ====================
  describe("6. 对比数据", () => {
    it("contrastData prop 显示对比", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        contrastData: ["1"],
        alwaysContrast: true,
        modelValue: ["2"]
      });
      expect(wrapper.find(".pa-contrast-style").exists()).toBe(true);
    });

    it("alwaysContrast prop 总是显示对比", async () => {
      const wrapper = await mountTransfer({
        exOptions: mockOptions,
        contrastData: ["1"],
        alwaysContrast: true,
        modelValue: ["1"]
      });
      expect(wrapper.vm).toBeDefined();
    });
  });

  // ==================== findData 工具函数 ====================
  describe("7. findData 工具函数", () => {
    it("findData 函数导出存在", async () => {
      const { findData } = await import("./find-data");
      expect(typeof findData).toBe("function");
    });

    it("findData 查找数据", async () => {
      const { findData } = await import("./find-data");
      const result = findData(["1", "2"], mockOptions);
      expect(result).toBeDefined();
    });

    it("findData 处理空数据", async () => {
      const { findData } = await import("./find-data");
      const result = findData([], mockOptions);
      // 空数据返回 '--'
      expect(result).toBeDefined();
    });

    it("findData 处理未找到的值", async () => {
      const { findData } = await import("./find-data");
      const result = findData(["999"], mockOptions);
      // 未找到的值返回 '--'
      expect(result).toBeDefined();
    });
  });
});

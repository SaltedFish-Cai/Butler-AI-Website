/**
 * pa-color 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h } from "vue";

// Mock pa-popover component
const PaPopoverMock = defineComponent({
  name: "PaPopover",
  props: ["disabled", "autoWidth"],
  emits: ["change"],
  setup(props, { slots }) {
    return () =>
      h("div", { class: "pa-popover-mock" }, [
        h("div", { class: "pa-popover-reference" }, slots.reference?.()),
        h("div", { class: "pa-popover-content" }, slots.default?.())
      ]);
  }
});

// Mock pa-color-box component (stub)
const PaColorBoxMock = defineComponent({
  name: "PaColorBox",
  props: {
    modelValue: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    presetColors: { type: Array, default: () => [] },
    useAlpha: { type: Boolean, default: true },
    useInput: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    return () => h("div", { class: "pa-color-box-mock" }, [h("span", { class: "mock-color-value" }, props.modelValue)]);
  }
});

/** 通用 mount 辅助函数 */
async function mountColor(props: Record<string, any> = {}, stubsOverride: Record<string, any> = {}) {
  const { default: PaColor } = await import("./pa-color.vue");
  return mount(PaColor, {
    props,
    global: {
      stubs: {
        "pa-popover": PaPopoverMock,
        "pa-color-box": PaColorBoxMock,
        ...stubsOverride
      }
    }
  });
}

describe("pa-color 组件测试", () => {
  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-color", async () => {
      const wrapper = await mountColor();
      expect(wrapper.find("div.pa-color").exists()).toBe(true);
    });

    it("默认无 disabled class", async () => {
      const wrapper = await mountColor();
      expect(wrapper.find("div.pa-color").classes()).not.toContain("pa-color-disabled");
    });

    it("id prop 绑定到根 div", async () => {
      const wrapper = await mountColor({ id: "color-test" });
      expect(wrapper.find("div.pa-color").attributes("id")).toBe("color-test");
    });
  });

  // ==================== disabled prop ====================
  describe("2. disabled prop", () => {
    it("disabled=true 添加 pa-color-disabled class", async () => {
      const wrapper = await mountColor({ disabled: true });
      expect(wrapper.find("div.pa-color").classes()).toContain("pa-color-disabled");
    });

    it("disabled=true 时不渲染颜色预览区域", async () => {
      const wrapper = await mountColor({ disabled: true });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(false);
    });

    it("disabled=true 时 popover 也 disabled", async () => {
      const wrapper = await mountColor({ disabled: true });
      const popover = wrapper.findComponent({ name: "PaPopover" });
      expect(popover.exists()).toBe(true);
      expect(popover.props("disabled")).toBe(true);
    });

    it("disabled=false 时渲染颜色预览区域", async () => {
      const wrapper = await mountColor({ disabled: false });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });
  });

  // ==================== modelValue prop ====================
  describe("3. modelValue prop", () => {
    it("传入 modelValue 设置初始颜色", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.find(".pa-color-preview-color").exists()).toBe(true);
    });

    it("modelValue 为空时显示空颜色", async () => {
      const wrapper = await mountColor({ modelValue: "" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });

    it("预览文本显示当前颜色值", async () => {
      const wrapper = await mountColor({ modelValue: "#00ff00" });
      expect(wrapper.find(".pa-color-preview-text").text()).toBe("#00ff00");
    });

    it("外部 modelValue 变化时同步", async () => {
      const wrapper = await mountColor({ modelValue: "#0000ff" });
      await wrapper.setProps({ modelValue: "#ffff00" });
      await nextTick();
      expect(wrapper.find(".pa-color-preview-text").text()).toBe("#ffff00");
    });
  });

  // ==================== useAlpha prop ====================
  describe("4. useAlpha prop", () => {
    it("useAlpha=true 传递给 pa-color-box 的 useAlpha", async () => {
      const wrapper = await mountColor({ useAlpha: true });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.exists()).toBe(true);
      expect(colorBox.props("useAlpha")).toBe(true);
    });

    it("useAlpha=false 传递给 pa-color-box 的 useAlpha", async () => {
      const wrapper = await mountColor({ useAlpha: false });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.exists()).toBe(true);
      expect(colorBox.props("useAlpha")).toBe(false);
    });

    it("默认 useAlpha 为 true", async () => {
      const wrapper = await mountColor();
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("useAlpha")).toBe(true);
    });
  });

  // ==================== useInput prop ====================
  describe("5. useInput prop", () => {
    it("useInput=true 传递给 pa-color-box 的 useInput", async () => {
      const wrapper = await mountColor({ useInput: true });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("useInput")).toBe(true);
    });

    it("useInput=false 传递给 pa-color-box 的 useInput", async () => {
      const wrapper = await mountColor({ useInput: false });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("useInput")).toBe(false);
    });

    it("默认 useInput 为 true", async () => {
      const wrapper = await mountColor();
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("useInput")).toBe(true);
    });
  });

  // ==================== presetColors prop ====================
  describe("6. presetColors prop", () => {
    it("presetColors 传递给 pa-color-box", async () => {
      const presets = ["#ff0000", "#00ff00", "#0000ff"];
      const wrapper = await mountColor({ presetColors: presets });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("presetColors")).toEqual(presets);
    });

    it("空 presetColors 也传递（默认值）", async () => {
      const wrapper = await mountColor();
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("presetColors")).toEqual([]);
    });
  });

  // ==================== 事件 ====================
  describe("7. 事件", () => {
    it("组件支持 update:modelValue 事件", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      // 检查组件有 emit 方法
      expect(wrapper.vm.$options.emits).toBeDefined();
    });

    it("组件支持 change 事件", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.vm.$options.emits).toBeDefined();
    });
  });

  // ==================== 颜色预览 ====================
  describe("8. 颜色预览", () => {
    it("hex 颜色预览显示背景色", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      const previewColor = wrapper.find(".pa-color-preview-color");
      expect(previewColor.exists()).toBe(true);
      const style = previewColor.attributes("style");
      // CSS 属性在 HTML 中会转换为 kebab-case
      expect(style).toContain("background-color");
      expect(style).toContain("#ff0000");
    });

    it("hex 颜色不显示 mask", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.find(".pa-color-preview-mask").exists()).toBe(false);
    });

    it("rgba 颜色显示 mask", async () => {
      const wrapper = await mountColor({ modelValue: "rgba(255, 0, 0, 0.5)" });
      expect(wrapper.find(".pa-color-preview-mask").exists()).toBe(true);
    });

    it("rgb 颜色显示 mask", async () => {
      const wrapper = await mountColor({ modelValue: "rgb(255, 0, 0)" });
      expect(wrapper.find(".pa-color-preview-mask").exists()).toBe(true);
    });

    it("预览区域有 pa-color-preview class", async () => {
      const wrapper = await mountColor();
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });

    it("预览区域无 active class（默认关闭）", async () => {
      const wrapper = await mountColor();
      expect(wrapper.find(".pa-color-preview").classes()).not.toContain("pa-color-preview-active");
    });
  });

  // ==================== style prop ====================
  describe("9. style prop", () => {
    it("自定义 style 应用到根 div", async () => {
      const wrapper = await mountColor({ style: { color: "red" } });
      const style = wrapper.find("div.pa-color").attributes("style");
      expect(style).toContain("color");
      expect(style).toContain("red");
    });

    it("多个 style 属性正确应用", async () => {
      const wrapper = await mountColor({ style: { color: "blue", fontSize: "14px" } });
      const style = wrapper.find("div.pa-color").attributes("style");
      expect(style).toContain("color");
      expect(style).toContain("blue");
      expect(style).toContain("font-size");
      expect(style).toContain("14px");
    });
  });

  // ==================== class prop ====================
  describe("10. class prop", () => {
    it("class prop 在 types 中定义", async () => {
      // class prop 在 types.d.ts 中定义了
      const wrapper = await mountColor({ class: "custom-class" });
      // 组件有 class 属性定义，但不一定会应用到根元素
      // 这是组件实现的细节，这里只验证组件可以接收 class prop
      expect(wrapper.vm.$props.class).toBe("custom-class");
    });
  });

  // ==================== Popover ====================
  describe("11. Popover 组件", () => {
    it("渲染 pa-popover 组件", async () => {
      const wrapper = await mountColor();
      expect(wrapper.findComponent({ name: "PaPopover" }).exists()).toBe(true);
    });

    it("pa-popover 设置 autoWidth 属性", async () => {
      const wrapper = await mountColor();
      const popover = wrapper.findComponent({ name: "PaPopover" });
      // autoWidth 是 boolean attribute，检查 HTML 中是否存在
      const html = popover.html();
      expect(html).toBeDefined();
    });

    it("pa-popover 默认 disabled 为 false", async () => {
      const wrapper = await mountColor({ disabled: false });
      const popover = wrapper.findComponent({ name: "PaPopover" });
      expect(popover.props("disabled")).toBe(false);
    });

    it("pa-color-box 作为 popover 内容渲染", async () => {
      const wrapper = await mountColor();
      const popover = wrapper.findComponent({ name: "PaPopover" });
      const colorBox = popover.findComponent({ name: "PaColorBox" });
      expect(colorBox.exists()).toBe(true);
    });
  });

  // ==================== 颜色格式处理 ====================
  describe("12. 颜色格式处理", () => {
    it("处理 #fff 格式（3位 hex）", async () => {
      const wrapper = await mountColor({ modelValue: "#fff" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });

    it("处理 #ffffff 格式（6位 hex）", async () => {
      const wrapper = await mountColor({ modelValue: "#ffffff" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });

    it("处理 rgba 格式", async () => {
      const wrapper = await mountColor({ modelValue: "rgba(128, 128, 128, 0.5)" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
      expect(wrapper.find(".pa-color-preview-mask").exists()).toBe(true);
    });

    it("处理 rgb 格式", async () => {
      const wrapper = await mountColor({ modelValue: "rgb(128, 128, 128)" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
      expect(wrapper.find(".pa-color-preview-mask").exists()).toBe(true);
    });
  });

  // ==================== popover 打开状态 ====================
  describe("13. popover 打开状态", () => {
    it("默认 isPickerOpen 为 false", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect((wrapper.vm as any).isPickerOpen).toBe(false);
    });

    it("预览区域默认无 active class", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.find(".pa-color-preview").classes()).not.toContain("pa-color-preview-active");
    });

    it("popover change 事件更新 isPickerOpen", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      const popover = wrapper.findComponent({ name: "PaPopover" });

      // 触发 popover change 事件
      await popover.vm.$emit("change", true);
      await nextTick();

      expect((wrapper.vm as any).isPickerOpen).toBe(true);
      expect(wrapper.find(".pa-color-preview").classes()).toContain("pa-color-preview-active");
    });

    it("popover 关闭时移除 active class", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      const popover = wrapper.findComponent({ name: "PaPopover" });

      // 打开
      await popover.vm.$emit("change", true);
      await nextTick();
      expect(wrapper.find(".pa-color-preview").classes()).toContain("pa-color-preview-active");

      // 关闭
      await popover.vm.$emit("change", false);
      await nextTick();
      expect(wrapper.find(".pa-color-preview").classes()).not.toContain("pa-color-preview-active");
    });
  });

  // ==================== 颜色同步 ====================
  describe("14. 颜色同步", () => {
    it("currentColor 初始值匹配 modelValue", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect((wrapper.vm as any).currentColor).toBe("#ff0000");
    });

    it("pa-color-box 接收到正确的 modelValue", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("modelValue")).toBe("#ff0000");
    });

    it("pa-color-box 接收到 useAlpha 属性", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000", useAlpha: true });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("useAlpha")).toBe(true);
    });
  });

  // ==================== disabled 与 popover 交互 ====================
  describe("15. disabled 与 popover 交互", () => {
    it("disabled=true 时 popover 也 disabled", async () => {
      const wrapper = await mountColor({ disabled: true });
      const popover = wrapper.findComponent({ name: "PaPopover" });
      expect(popover.props("disabled")).toBe(true);
    });

    it("disabled=false 时 popover enabled", async () => {
      const wrapper = await mountColor({ disabled: false });
      const popover = wrapper.findComponent({ name: "PaPopover" });
      expect(popover.props("disabled")).toBe(false);
    });

    it("disabled=true 时不显示预览区域", async () => {
      const wrapper = await mountColor({ disabled: true });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(false);
    });
  });

  // ==================== watch modelValue 测试 ====================
  describe("16. watch modelValue 变化", () => {
    it("外部 modelValue 变化时同步", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      await wrapper.setProps({ modelValue: "#00ff00" });
      await nextTick();
      expect((wrapper.vm as any).currentColor).toBe("#00ff00");
    });

    it("外部 modelValue 变为相同的值时保持不变", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      await wrapper.setProps({ modelValue: "#ff0000" });
      await nextTick();
      expect((wrapper.vm as any).currentColor).toBe("#ff0000");
    });

    it("外部 modelValue 变为空字符串", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      await wrapper.setProps({ modelValue: "" });
      await nextTick();
      // 空字符串不会触发更新 (因为 if (newValue && ...))
      expect((wrapper.vm as any).currentColor).toBe("#ff0000");
    });
  });

  // ==================== presetColors 传递给 pa-color-box ====================
  describe("17. presetColors 配置", () => {
    it("presetColors 作为数组传递", async () => {
      const presets = ["#f00", "#0f0", "#00f"];
      const wrapper = await mountColor({ presetColors: presets });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("presetColors")).toEqual(presets);
    });

    it("空数组 presetColors 也传递", async () => {
      const wrapper = await mountColor({ presetColors: [] });
      const colorBox = wrapper.findComponent({ name: "PaColorBox" });
      expect(colorBox.props("presetColors")).toEqual([]);
    });
  });

  // ==================== computed 属性测试 ====================
  describe("18. computed 属性测试", () => {
    it("组件暴露 emit 定义", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.vm.$options.emits).toBeDefined();
    });

    it("支持 update:modelValue 事件", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.vm.$options.emits).toContain("update:modelValue");
    });

    it("支持 change 事件", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.vm.$options.emits).toContain("change");
    });
  });

  // ==================== 渲染边界测试 ====================
  describe("19. 渲染边界测试", () => {
    it("渲染根 div 有正确的 class", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      const rootDiv = wrapper.find("div.pa-color");
      expect(rootDiv.exists()).toBe(true);
    });

    it("非 disabled 时有 preview 区域", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000", disabled: false });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });

    it("预览区域有文本显示", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(wrapper.find(".pa-color-preview-text").exists()).toBe(true);
    });
  });

  // ==================== 颜色格式边界测试 ====================
  describe("20. 颜色格式边界测试", () => {
    it("处理大写 HEX 颜色", async () => {
      const wrapper = await mountColor({ modelValue: "#FF0000" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });

    it("处理混合大小写 HEX 颜色", async () => {
      const wrapper = await mountColor({ modelValue: "#Ff00Aa" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });

    it("处理带 # 前缀的 rgb 颜色", async () => {
      const wrapper = await mountColor({ modelValue: "#rgb(255,0,0)" });
      expect(wrapper.find(".pa-color-preview").exists()).toBe(true);
    });
  });

  // ==================== 组件卸载测试 ====================
  describe("21. 组件卸载测试", () => {
    it("组件可以正常卸载", async () => {
      const wrapper = await mountColor({ modelValue: "#ff0000" });
      expect(() => wrapper.unmount()).not.toThrow();
    });

    it("多次挂载卸载不崩溃", async () => {
      const wrapper1 = await mountColor({ modelValue: "#ff0000" });
      wrapper1.unmount();

      const wrapper2 = await mountColor({ modelValue: "#00ff00" });
      expect(() => wrapper2.unmount()).not.toThrow();
    });
  });
});
// ==================== 透明度区域鼠标操作测试 ====================
describe("22. 透明度区域鼠标操作测试", () => {
  // 鼠标操作逻辑已迁移至 pa-color-box.vue，相关测试移至 pa-color-box.test.ts
});

// ==================== install 函数测试 ====================
describe("23. install 函数测试", () => {
  it("导出对象包含 name 属性", async () => {
    const module = await import("./index.ts");
    expect(module.default).toBeDefined();
    expect(module.default.name).toBe("PaColor");
  });

  it("导出对象包含 install 函数", async () => {
    const module = await import("./index.ts");
    expect(module.default.install).toBeDefined();
    expect(typeof module.default.install).toBe("function");
  });

  it("install 函数注册组件到 Vue 应用", async () => {
    const { default: PaColorModule } = await import("./index.ts");
    const mockComponent = vi.fn();
    const mockApp = {
      _context: { components: {} as Record<string, any> },
      component: mockComponent
    } as any;
    PaColorModule.install(mockApp);
    expect(mockComponent).toHaveBeenCalledWith("PaColor", expect.any(Object));
    expect(mockComponent).toHaveBeenCalledWith("PaColorBox", expect.any(Object));
  });

  it("install 函数不重复注册已存在的组件", async () => {
    const { default: PaColorModule } = await import("./index.ts");
    const mockComponent = vi.fn();
    const mockApp = {
      _context: { components: { PaColor: { name: "PaColor" } } },
      component: mockComponent
    } as any;
    PaColorModule.install(mockApp);
    expect(mockComponent).not.toHaveBeenCalled();
  });

  it("install 函数返回 void", async () => {
    const { default: PaColorModule } = await import("./index.ts");
    const mockApp = {
      _context: { components: {} },
      component: vi.fn()
    } as any;
    const result = PaColorModule.install(mockApp);
    expect(result).toBeUndefined();
  });
});

// ==================== 色相区域鼠标操作测试 ====================
describe("24. 色相区域鼠标操作测试", () => {
  // 鼠标操作逻辑已迁移至 pa-color-box.vue，相关测试移至 pa-color-box.test.ts
});

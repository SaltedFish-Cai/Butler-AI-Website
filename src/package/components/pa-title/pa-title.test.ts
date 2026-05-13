/**
 * pa-title 组件单元测试
 */
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import type { ComputedRef } from "vue";

const mockPancakeGlobalConfig = {
  value: { language: { value: "zh-CN" } }
} as ComputedRef<{ language: { value: string } }>;

// Mock pa-line
const PaLineMock = {
  name: "PaLine",
  props: ["padding", "height", "width", "borderColor", "borderStyle"],
  template: '<div class="pa-line-mock"></div>'
};

async function mountTitle(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaTitle } = await import("./pa-title.vue");
  return mount(PaTitle, {
    props,
    slots: { default: "标题文本" },
    global: {
      stubs: { "pa-line": PaLineMock },
      provide: { PancakeGlobalConfig: mockPancakeGlobalConfig, ...provideOverride }
    }
  });
}

describe("pa-title 组件测试", () => {
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-title", async () => {
      const wrapper = await mountTitle();
      expect(wrapper.find("div.pa-title").exists()).toBe(true);
    });

    it("渲染 slot 标题文本", async () => {
      const wrapper = await mountTitle();
      expect(wrapper.find(".pa-title_text").text()).toContain("标题文本");
    });

    it("默认模式有分割线", async () => {
      const wrapper = await mountTitle();
      expect(wrapper.findComponent({ name: "PaLine" }).exists()).toBe(true);
    });

    it("默认 styleMode 为 default", async () => {
      const wrapper = await mountTitle();
      expect(wrapper.find("div.pa-title").classes()).toContain("default");
    });
  });

  describe("2. styleMode prop", () => {
    it("styleMode=vertical", async () => {
      const wrapper = await mountTitle({ styleMode: "vertical" });
      expect(wrapper.find("div.pa-title").classes()).toContain("vertical");
    });

    it("styleMode=horizontal", async () => {
      const wrapper = await mountTitle({ styleMode: "horizontal" });
      expect(wrapper.find("div.pa-title").classes()).toContain("horizontal");
    });

    it("非 default 模式无 lineConfig 时不显示分割线", async () => {
      const wrapper = await mountTitle({ styleMode: "vertical" });
      expect(wrapper.findComponent({ name: "PaLine" }).exists()).toBe(false);
    });
  });

  describe("3. tips prop", () => {
    it("tips 字符串 + tipsPosition=bottom（默认）", async () => {
      const wrapper = await mountTitle({ tips: "提示信息" });
      // 底部提示
      const tips = wrapper.findAll(".pa-title_tip");
      const bottomTip = tips.find(t => t.text().includes("提示信息"));
      expect(bottomTip).toBeTruthy();
    });

    it("tipsPosition=right 时提示在右侧", async () => {
      const wrapper = await mountTitle({ tips: "右侧提示", tipsPosition: "right" });
      const rightTip = wrapper.find(".pa-title_text .pa-title_tip");
      expect(rightTip.exists()).toBe(true);
      expect(rightTip.text()).toContain("右侧提示");
    });

    it("tips slot 自定义内容", async () => {
      const { default: PaTitle } = await import("./pa-title.vue");
      const wrapper = mount(PaTitle, {
        props: { tipsPosition: "bottom" },
        slots: { default: "标题", tips: "自定义提示" },
        global: {
          stubs: { "pa-line": PaLineMock },
          provide: { PancakeGlobalConfig: mockPancakeGlobalConfig }
        }
      });
      expect(wrapper.text()).toContain("自定义提示");
    });
  });

  describe("4. padding prop", () => {
    it("padding 包含 top 时添加 padding-top class", async () => {
      const wrapper = await mountTitle({ padding: ["top"] });
      expect(wrapper.find("div.pa-title").classes()).toContain("padding-top");
    });

    it("padding 包含 left 时添加 padding-left class", async () => {
      const wrapper = await mountTitle({ padding: ["left"] });
      expect(wrapper.find("div.pa-title").classes()).toContain("padding-left");
    });

    it("padding 包含 bottom 时添加 padding-bottom class", async () => {
      const wrapper = await mountTitle({ padding: ["bottom"] });
      expect(wrapper.find("div.pa-title").classes()).toContain("padding-bottom");
    });

    it("padding 包含 right 时添加 padding-right class", async () => {
      const wrapper = await mountTitle({ padding: ["right"] });
      expect(wrapper.find("div.pa-title").classes()).toContain("padding-right");
    });

    it("多个 padding 方向", async () => {
      const wrapper = await mountTitle({ padding: ["top", "left"] });
      const classes = wrapper.find("div.pa-title").classes();
      expect(classes).toContain("padding-top");
      expect(classes).toContain("padding-left");
    });
  });

  describe("5. lineConfig prop", () => {
    it("lineConfig=true 使用默认分割线配置", async () => {
      const wrapper = await mountTitle({ lineConfig: true });
      const line = wrapper.findComponent({ name: "PaLine" });
      expect(line.exists()).toBe(true);
    });

    it("lineConfig 为对象时传递给 pa-line", async () => {
      const wrapper = await mountTitle({ lineConfig: { padding: [0, 0, 0, 10], height: "4px" } });
      const line = wrapper.findComponent({ name: "PaLine" });
      expect(line.exists()).toBe(true);
    });

    it("lineConfig=false 且非 default 模式时不显示分割线", async () => {
      const wrapper = await mountTitle({ styleMode: "vertical", lineConfig: false });
      expect(wrapper.findComponent({ name: "PaLine" }).exists()).toBe(false);
    });
  });

  describe("6. class/style prop", () => {
    it("自定义 class", async () => {
      const wrapper = await mountTitle({ class: "custom-title" });
      expect(wrapper.find("div.pa-title").classes()).toContain("custom-title");
    });

    it("自定义 style", async () => {
      const wrapper = await mountTitle({ style: { color: "red" } });
      const style = wrapper.find("div.pa-title").attributes("style");
      expect(style).toContain("color");
    });
  });

  describe("7. 全局配置 titleStyle", () => {
    it("PancakeGlobalConfig.titleStyle 作为默认 styleMode", async () => {
      const config = { value: { language: { value: "zh-CN" }, titleStyle: "vertical" } } as ComputedRef<any>;
      const { default: PaTitle } = await import("./pa-title.vue");
      const wrapper = mount(PaTitle, {
        slots: { default: "标题" },
        global: {
          stubs: { "pa-line": PaLineMock },
          provide: { PancakeGlobalConfig: config }
        }
      });
      expect(wrapper.find("div.pa-title").classes()).toContain("vertical");
    });
  });
});

// ==================== install 函数测试 ====================
describe("install 函数测试", () => {
  it("导出对象包含 name 属性", async () => {
    const module = await import("./index.ts");
    expect(module.default).toBeDefined();
    expect(module.default.name).toBe("PaTitle");
  });

  it("导出对象包含 install 函数", async () => {
    const module = await import("./index.ts");
    expect(module.default.install).toBeDefined();
    expect(typeof module.default.install).toBe("function");
  });

  it("install 函数注册组件到 Vue 应用", async () => {
    const { default: PaTitleModule } = await import("./index.ts");
    const mockComponent = vi.fn();
    const mockApp = {
      _context: { components: {} as Record<string, any> },
      component: mockComponent
    } as any;
    PaTitleModule.install(mockApp);
    expect(mockComponent).toHaveBeenCalledWith("PaTitle", expect.any(Object));
  });

  it("install 函数不重复注册已存在的组件", async () => {
    const { default: PaTitleModule } = await import("./index.ts");
    const mockComponent = vi.fn();
    const mockApp = {
      _context: { components: { PaTitle: { name: "PaTitle" } } },
      component: mockComponent
    } as any;
    PaTitleModule.install(mockApp);
    expect(mockComponent).not.toHaveBeenCalled();
  });

  it("install 函数返回 void", async () => {
    const { default: PaTitleModule } = await import("./index.ts");
    const mockApp = {
      _context: { components: {} },
      component: vi.fn()
    } as any;
    const result = PaTitleModule.install(mockApp);
    expect(result).toBeUndefined();
  });
});

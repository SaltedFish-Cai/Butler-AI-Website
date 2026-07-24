import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import type { ComputedRef } from "vue";

const mockPancakeGlobalConfig = {
  value: { language: "zh-CN" }
} as ComputedRef<{ language: string }>;

async function mountLanguage(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaLanguage } = await import("./pa-language.vue");
  return mount(PaLanguage, {
    props,
    global: {
      provide: { PancakeGlobalConfig: { ...mockPancakeGlobalConfig, ...provideOverride } }
    }
  });
}

describe("pa-language 组件测试", () => {
  describe("1. 默认渲染", () => {
    it("渲染 span.pa-language", async () => {
      const wrapper = await mountLanguage({ text: { "zh-CN": "你好", "en-US": "Hello" } });
      expect(wrapper.find("span.pa-language").exists()).toBe(true);
    });

    it("默认显示 zh-CN 文本", async () => {
      const wrapper = await mountLanguage({ text: { "zh-CN": "你好", "en-US": "Hello" } });
      expect(wrapper.text()).toBe("你好");
    });
  });

  describe("2. 多语言切换", () => {
    it("en-US 环境显示英文", async () => {
      const enConfig = { value: { language: "en-US" } } as ComputedRef<{ language: string }>;
      const { default: PaLanguage } = await import("./pa-language.vue");
      const wrapper = mount(PaLanguage, {
        props: { text: { "zh-CN": "你好", "en-US": "Hello" } },
        global: {
          provide: { PancakeGlobalConfig: enConfig }
        }
      });
      expect(wrapper.text()).toBe("Hello");
    });
  });

  describe("3. 无全局配置时 fallback", () => {
    it("无全局配置时 fallback 到 zh-CN", async () => {
      const wrapper = await mountLanguage(
        { text: { "zh-CN": "默认中文", "en-US": "English" } },
        { PancakeGlobalConfig: {} }
      );
      expect(wrapper.text()).toBe("默认中文");
    });

    it("未提供 text 时显示空字符串", async () => {
      const wrapper = await mountLanguage({});
      expect(wrapper.text()).toBe("");
    });

    it("text 缺少当前语言键时显示空字符串", async () => {
      const enConfig = { value: { language: "en-US" } } as ComputedRef<{ language: string }>;
      const { default: PaLanguage } = await import("./pa-language.vue");
      const wrapper = mount(PaLanguage, {
        props: { text: { "zh-CN": "只有中文" } },
        global: {
          provide: { PancakeGlobalConfig: enConfig }
        }
      });
      expect(wrapper.text()).toBe("");
    });
  });

  describe("4. class/style prop", () => {
    it("自定义 class", async () => {
      const wrapper = await mountLanguage({
        text: { "zh-CN": "你好", "en-US": "Hello" },
        class: "custom-lang"
      });
      expect(wrapper.find("span.pa-language").classes()).toContain("custom-lang");
    });

    it("自定义 style", async () => {
      const wrapper = await mountLanguage({
        text: { "zh-CN": "你好", "en-US": "Hello" },
        style: { color: "red" }
      });
      expect(wrapper.find("span.pa-language").attributes("style")).toContain("color");
    });
  });
});

describe("5. install 函数", () => {
  it("注册 PaLanguage 组件", async () => {
    const { default: module } = await import("./index");
    const app = { _context: { components: {} }, component: vi.fn() } as any;
    module.install(app);
    expect(app.component).toHaveBeenCalledWith("PaLanguage", expect.anything());
  });

  it("不重复注册 PaLanguage 组件", async () => {
    const { default: module } = await import("./index");
    const app = { _context: { components: { PaLanguage: true } }, component: vi.fn() } as any;
    module.install(app);
    expect(app.component).not.toHaveBeenCalled();
  });

  it("install 返回 void", async () => {
    const { default: module } = await import("./index");
    const app = { _context: { components: {} }, component: vi.fn() } as any;
    const result = module.install(app);
    expect(result).toBeUndefined();
  });
});

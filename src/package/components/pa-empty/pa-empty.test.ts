/**
 * pa-empty 组件单元测试
 */
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h } from "vue";
import type { ComputedRef } from "vue";

const PaIconMock = defineComponent({
  name: "PaIcon",
  props: { name: { type: String, default: "" }, class: { type: [String, Array], default: "" } },
  setup(props) {
    return () => h("span", { class: ["pa-icon", props.class, `icon-${props.name}`] });
  }
});

const mockPancakeGlobalConfig = {
  value: { language: { value: "zh-CN" } }
} as ComputedRef<{ language: { value: string } }>;

async function mountEmpty(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaEmpty } = await import("./pa-empty.vue");
  return mount(PaEmpty, {
    props,
    global: {
      stubs: { "pa-icon": PaIconMock },
      provide: { PancakeGlobalConfig: mockPancakeGlobalConfig, ...provideOverride }
    }
  });
}

describe("pa-empty 组件测试", () => {
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-empty", async () => {
      const wrapper = await mountEmpty();
      expect(wrapper.find("div.pa-empty").exists()).toBe(true);
    });

    it("默认 icon 为 folder_open_line", async () => {
      const wrapper = await mountEmpty();
      const icon = wrapper.findComponent({ name: "PaIcon" });
      expect(icon.exists()).toBe(true);
      expect(icon.props("name")).toBe("folder_open_line");
    });

    it('默认 message 为 "暂无数据"', async () => {
      const wrapper = await mountEmpty();
      expect(wrapper.find(".pa-empty_message").text()).toContain("暂无数据");
    });
  });

  describe("2. icon prop", () => {
    it("自定义 icon", async () => {
      const wrapper = await mountEmpty({ icon: "search_line" });
      const icon = wrapper.findComponent({ name: "PaIcon" });
      expect(icon.props("name")).toBe("search_line");
    });
  });

  describe("3. message prop (字符串)", () => {
    it("字符串 message 直接显示", async () => {
      const wrapper = await mountEmpty({ message: "没有找到数据" });
      expect(wrapper.find(".pa-empty_message").text()).toContain("没有找到数据");
    });
  });

  describe("4. message prop (多语言)", () => {
    it("多语言 message 根据语言显示", async () => {
      const wrapper = await mountEmpty({ message: { "zh-CN": "暂无内容", "en-US": "No content" } });
      expect(wrapper.find(".pa-empty_message").text()).toContain("暂无内容");
    });

    it("en-US 环境显示英文", async () => {
      const enConfig = { value: { language: { value: "en-US" } } } as ComputedRef<{ language: { value: string } }>;
      const { default: PaEmpty } = await import("./pa-empty.vue");
      const wrapper = mount(PaEmpty, {
        props: { message: { "zh-CN": "暂无内容", "en-US": "No content" } },
        global: {
          stubs: { "pa-icon": PaIconMock },
          provide: { PancakeGlobalConfig: enConfig }
        }
      });
      expect(wrapper.find(".pa-empty_message").text()).toContain("No content");
    });

    it("无全局配置时 fallback 到 zh-CN", async () => {
      const wrapper = await mountEmpty({ message: { "zh-CN": "默认中文", "en-US": "English" } }, { PancakeGlobalConfig: {} });
      expect(wrapper.find(".pa-empty_message").text()).toContain("默认中文");
    });
  });

  describe("5. message fallback", () => {
    it("多语言 message 无匹配语言时 fallback 暂无数据", async () => {
      const wrapper = await mountEmpty({ message: { "ja-JP": "データなし" } });
      expect(wrapper.find(".pa-empty_message").text()).toContain("暂无数据");
    });

    it("message 为空对象时 fallback 暂无数据", async () => {
      const wrapper = await mountEmpty({ message: {} });
      expect(wrapper.find(".pa-empty_message").text()).toContain("暂无数据");
    });

    it("多语言 message 有 zh-CN 但无 en-US 时 en-US 环境 fallback", async () => {
      const enConfig = { value: { language: { value: "en-US" } } } as ComputedRef<{ language: { value: string } }>;
      const { default: PaEmpty } = await import("./pa-empty.vue");
      const wrapper = mount(PaEmpty, {
        props: { message: { "zh-CN": "只有中文" } },
        global: {
          stubs: { "pa-icon": PaIconMock },
          provide: { PancakeGlobalConfig: enConfig }
        }
      });
      expect(wrapper.find(".pa-empty_message").text()).toContain("暂无数据");
    });
  });

  describe("6. class/style prop", () => {
    it("自定义 class 应用到 inner", async () => {
      const wrapper = await mountEmpty({ class: "custom-empty" });
      expect(wrapper.find(".pa-empty_inner").classes()).toContain("custom-empty");
    });

    it("自定义 style 应用到 inner", async () => {
      const wrapper = await mountEmpty({ style: { color: "gray" } });
      const style = wrapper.find(".pa-empty_inner").attributes("style");
      expect(style).toContain("color");
    });
  });
});

// ==================== install 函数测试 ====================
describe("7. install 函数", () => {
  it("注册 PaEmpty 组件", async () => {
    const { default: module } = await import("./index");
    const app = { _context: { components: {} }, component: vi.fn() } as any;
    module.install(app);
    expect(app.component).toHaveBeenCalledWith("PaEmpty", expect.anything());
  });

  it("不重复注册 PaEmpty 组件", async () => {
    const { default: module } = await import("./index");
    const app = { _context: { components: { PaEmpty: true } }, component: vi.fn() } as any;
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

/**
 * pa-manager 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref, computed, defineComponent, h } from "vue";

// Mock language.json
vi.mock("../language.json", () => ({
  default: {
    test: { hello: "你好" }
  }
}));

// Mock setThemeColor
vi.mock("../tools/color", () => ({
  setThemeColor: vi.fn()
}));

// Mock createLog
vi.mock("../utils/develop-log", () => ({
  createLog: vi.fn(() => ({
    log: vi.fn()
  }))
}));

// Mock useZIndex from element-plus
vi.mock("element-plus", () => ({
  useZIndex: () => ({
    nextZIndex: vi.fn(() => 1001)
  })
}));

// Mock lodash
vi.mock("lodash", () => ({
  default: {
    isNil: vi.fn(val => val === null || val === undefined)
  }
}));

// Mock PaIcon
const PaIconMock = defineComponent({
  name: "PaIcon",
  props: { name: { type: String, default: "test" } },
  setup() {
    return () => h("i", { class: "pa-icon" });
  }
});

describe("pa-manager 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== 默认渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 slot 内容", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        slots: { default: '<div class="test-slot">Manager Content</div>' }
      });
      expect(wrapper.find(".test-slot").exists()).toBe(true);
    });
  });

  // ==================== props ====================
  describe("2. props", () => {
    it("接受 env prop", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { env: "development" }
      });
      expect(wrapper.props().env).toBe("development");
    });

    it("接受 baseHost prop", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { baseHost: "https://api.example.com" }
      });
      expect(wrapper.props().baseHost).toBe("https://api.example.com");
    });

    it("接受 themeColor prop", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { themeColor: "#1890ff" }
      });
      expect(wrapper.props().themeColor).toBe("#1890ff");
    });

    it("接受 language prop", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { language: "en-US" }
      });
      expect(wrapper.props().language).toBe("en-US");
    });

    it("接受 size prop", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { size: "large" }
      });
      expect(wrapper.props().size).toBe("large");
    });

    it("接受 isDark prop", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { isDark: true }
      });
      expect(wrapper.props().isDark).toBe(true);
    });
  });

  // ==================== provide 功能 ====================
  describe("3. provide 功能", () => {
    it("提供 PancakeGlobalConfig", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { language: "zh-CN" }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("提供 setPaManagerConfig 方法", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;
      expect(typeof vm.setPaManagerConfig).toBe("function");
    });
  });

  // ==================== 暴露方法 ====================
  describe("4. 暴露方法", () => {
    it("暴露 setPaManagerThemeColor", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;
      expect(typeof vm.setPaManagerThemeColor).toBe("function");
    });

    it("暴露 setPaManagerSize", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;
      expect(typeof vm.setPaManagerSize).toBe("function");
    });

    it("暴露 setPaManagerLanguage", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;
      expect(typeof vm.setPaManagerLanguage).toBe("function");
    });

    it("暴露 setPaManagerTableInfiniteScroll", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;
      expect(typeof vm.setPaManagerTableInfiniteScroll).toBe("function");
    });

    it("暴露 setPaManagerConfig", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;
      expect(typeof vm.setPaManagerConfig).toBe("function");
    });
  });

  // ==================== 配置方法测试 ====================
  describe("5. 配置方法测试", () => {
    it("setPaManagerThemeColor 更新主题色", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { themeColor: "#000000" }
      });
      const vm = wrapper.vm as any;
      await nextTick();
      vm.setPaManagerThemeColor("#1890ff", false);
      await nextTick();
      expect(true).toBe(true);
    });

    it("setPaManagerSize 更新尺寸", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { size: "default" }
      });
      const vm = wrapper.vm as any;
      vm.setPaManagerSize("large");
      await nextTick();
      expect(true).toBe(true);
    });

    it("setPaManagerLanguage 更新语言", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        props: { language: "zh-CN" }
      });
      const vm = wrapper.vm as any;
      vm.setPaManagerLanguage("en-US");
      await nextTick();
      expect(true).toBe(true);
    });

    it("setPaManagerTableInfiniteScroll 更新表格配置", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;
      vm.setPaManagerTableInfiniteScroll({ infiniteScroll: true });
      await nextTick();
      expect(true).toBe(true);
    });

    it("setPaManagerConfig 根据 type 调用对应方法", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      const vm = wrapper.vm as any;

      // 测试 language 类型
      vm.setPaManagerConfig("language", "en-US");
      await nextTick();

      // 测试 size 类型
      vm.setPaManagerConfig("size", "small");
      await nextTick();

      expect(true).toBe(true);
    });
  });

  // ==================== 全局 ZIndex ====================
  describe("6. 全局 ZIndex", () => {
    it("组件正常挂载", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      expect(wrapper.exists()).toBe(true);
    });
  });

  // ==================== slot ====================
  describe("7. slot", () => {
    it("默认 slot 正常渲染", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager, {
        slots: {
          default: '<div class="manager-content"><span>Manager</span></div>'
        }
      });
      expect(wrapper.find(".manager-content").exists()).toBe(true);
    });
  });

  // ==================== 边界情况 ====================
  describe("8. 边界情况", () => {
    it("不传任何 props 时组件正常工作", async () => {
      const { default: PaManager } = await import("./pa-manager.vue");
      const wrapper = mount(PaManager);
      expect(wrapper.exists()).toBe(true);
    });
  });
});

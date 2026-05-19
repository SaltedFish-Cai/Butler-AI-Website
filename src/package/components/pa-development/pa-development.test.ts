/**
 * pa-development 组件单元测试
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h } from "vue";
import type { ComputedRef } from "vue";

// Mock M_Message
vi.mock("../feedback", () => ({
  M_Message: {
    success: vi.fn()
  }
}));

// Mock PaIcon
const PaIconMock = defineComponent({
  name: "PaIcon",
  props: {
    name: { type: String, default: "link_line" }
  },
  setup(props) {
    return () => h("i", { class: `pa-icon icon-${props.name}` });
  }
});

// Mock PancakeGlobalConfig
function createMockPancakeGlobalConfig(env: string = "development") {
  return {
    value: {
      env,
      language: { value: "zh-CN" }
    }
  } as ComputedRef<{ env: string; language: { value: string } }>;
}

async function mountDevelopment(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaDevelopment } = await import("./pa-development.vue");
  return mount(PaDevelopment, {
    props,
    global: {
      stubs: { "pa-icon": PaIconMock },
      provide: {
        PancakeGlobalConfig: createMockPancakeGlobalConfig(),
        ...provideOverride
      }
    }
  });
}

describe("pa-development 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("组件正常挂载", async () => {
      const wrapper = await mountDevelopment({}, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      expect(wrapper.exists()).toBe(true);
    });

    it("默认不显示菜单", async () => {
      const wrapper = await mountDevelopment({}, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(vm.menu.visible).toBe(false);
    });
  });

  // ==================== menu 状态 ====================
  describe("2. menu 状态", () => {
    it("初始 menu.visible 为 false", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(vm.menu.visible).toBe(false);
    });

    it("初始 menu top 为 -100%", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(vm.menu.top).toBe("-100%");
    });

    it("初始 menu left 为 -100%", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(vm.menu.left).toBe("-100%");
    });
  });

  // ==================== props ====================
  describe("3. props", () => {
    it("接受 id prop", async () => {
      const wrapper = await mountDevelopment({ id: "my-component-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      expect((wrapper.props() as any).id).toBe("my-component-id");
    });
  });

  // ==================== 环境检查 ====================
  describe("4. 环境检查", () => {
    it("开发环境下 PancakeGlobalConfig 被注入", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(vm.PancakeGlobalConfig).toBeDefined();
    });
  });

  // ==================== teleport 行为 ====================
  describe("5. teleport 行为", () => {
    it("menu 不可见时组件正常渲染", async () => {
      const wrapper = await mountDevelopment({}, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      await nextTick();
      expect(wrapper.html()).toBeDefined();
    });
  });

  // ==================== 暴露方法 ====================
  describe("6. 组件实例属性", () => {
    it("menu 对象可访问", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(vm.menu).toBeDefined();
      expect(vm.menu.visible).toBe(false);
    });

    it("copyInfo 方法可访问", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(typeof vm.copyInfo).toBe("function");
    });

    it("copyUrl 方法可访问", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(typeof vm.copyUrl).toBe("function");
    });

    it("onContextMenu 方法可访问", async () => {
      const wrapper = await mountDevelopment({ id: "test-id" }, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect(typeof vm.onContextMenu).toBe("function");
    });
  });

  // ==================== slot ====================
  describe("7. slot", () => {
    it("默认 slot 正常渲染", async () => {
      const { default: PaDevelopment } = await import("./pa-development.vue");
      const wrapper = mount(PaDevelopment, {
        props: { id: "test-id" },
        slots: { default: '<div class="test-slot">Test Content</div>' },
        global: {
          stubs: { "pa-icon": PaIconMock },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") }
        }
      });
      expect(wrapper.find(".test-slot").exists()).toBe(true);
    });
  });

  // ==================== 边界情况 ====================
  describe("8. 边界情况", () => {
    it("不传 id 时使用默认空字符串", async () => {
      const wrapper = await mountDevelopment({}, { PancakeGlobalConfig: createMockPancakeGlobalConfig("development") });
      const vm = wrapper.vm as any;
      expect((vm as any).id).toBe("");
    });
  });
});

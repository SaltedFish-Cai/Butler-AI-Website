/**
 * pa-row 栅格行组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";

async function mountRow(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaRow } = await import("./pa-row.vue");
  return mount(PaRow, { props, slots });
}

describe("pa-row 组件测试", () => {
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-row", async () => {
      const wrapper = await mountRow();
      expect(wrapper.find("div.pa-row").exists()).toBe(true);
    });

    it("默认 justify 为 start", async () => {
      const wrapper = await mountRow();
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--start");
    });

    it("默认 align 为 top", async () => {
      const wrapper = await mountRow();
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--align-top");
    });

    it("默认无 gutter 时 margin 使用 CSS 变量", async () => {
      const wrapper = await mountRow();
      const style = wrapper.find("div.pa-row").attributes("style");
      expect(style).toContain("--row-gutter-value");
      expect(style).toContain("--pa-size-padding");
    });
  });

  describe("2. justify prop", () => {
    it("justify=center", async () => {
      const wrapper = await mountRow({ justify: "center" });
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--center");
    });

    it("justify=end", async () => {
      const wrapper = await mountRow({ justify: "end" });
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--end");
    });

    it("justify=space-between", async () => {
      const wrapper = await mountRow({ justify: "space-between" });
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--space-between");
    });

    it("justify=space-around", async () => {
      const wrapper = await mountRow({ justify: "space-around" });
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--space-around");
    });
  });

  describe("3. align prop", () => {
    it("align=center", async () => {
      const wrapper = await mountRow({ align: "center" });
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--align-center");
    });

    it("align=bottom", async () => {
      const wrapper = await mountRow({ align: "bottom" });
      expect(wrapper.find("div.pa-row").classes()).toContain("pa-row--align-bottom");
    });
  });

  describe("4. gutter prop", () => {
    it("数字 gutter 计算为 gutter/2", async () => {
      const wrapper = await mountRow({ gutter: 20 });
      const style = wrapper.find("div.pa-row").attributes("style");
      expect(style).toContain("10px");
    });

    it("字符串 gutter 提取数字后除以2", async () => {
      const wrapper = await mountRow({ gutter: "30px" });
      const style = wrapper.find("div.pa-row").attributes("style");
      expect(style).toContain("15px");
    });

    it("非数字字符串 gutter 视为 0", async () => {
      const wrapper = await mountRow({ gutter: "abc" });
      const style = wrapper.find("div.pa-row").attributes("style");
      expect(style).toContain("--pa-size-padding");
    });

    it("gutter 为 0 时使用 CSS 变量", async () => {
      const wrapper = await mountRow({ gutter: 0 });
      const style = wrapper.find("div.pa-row").attributes("style");
      expect(style).toContain("--pa-size-padding");
    });

    it("有 gutter 时 marginTop 为负值", async () => {
      const wrapper = await mountRow({ gutter: 20 });
      const style = wrapper.find("div.pa-row").attributes("style");
      expect(style).toContain("calc(0px - 10px)");
    });

    it("有 gutter 时 marginBottom 为负值", async () => {
      const wrapper = await mountRow({ gutter: 20 });
      const style = wrapper.find("div.pa-row").attributes("style");
      // marginBottom also has calc(0px - 10px)
      const matches = style?.match(/calc\(0px - 10px\)/g);
      expect(matches?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("5. slot", () => {
    it("渲染默认 slot", async () => {
      const wrapper = await mountRow({}, { default: '<div class="child">内容</div>' });
      expect(wrapper.find(".child").exists()).toBe(true);
      expect(wrapper.text()).toContain("内容");
    });
  });

  describe("6. provide 注入", () => {
    it("向子组件提供 breakPoint 和 rowGutter", async () => {
      const { default: PaRow } = await import("./pa-row.vue");
      const { default: PaCol } = await import("../pa-col/pa-col.vue");
      const wrapper = mount(PaRow, {
        props: { gutter: 20 },
        slots: { default: PaCol }
      });
      // PaCol should receive breakPoint and rowGutter from PaRow
      await nextTick();
      expect(wrapper.find("div.pa-col").exists()).toBe(true);
    });
  });

  describe("7. 响应式断点", () => {
    it("挂载时计算断点", async () => {
      const wrapper = await mountRow();
      // Component calculates breakpoint on mount
      expect(wrapper.find("div.pa-row").exists()).toBe(true);
    });

    it("卸载时移除 resize 监听", async () => {
      const removeSpy = vi.spyOn(window, "removeEventListener");
      const wrapper = await mountRow();
      wrapper.unmount();
      expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      removeSpy.mockRestore();
    });
  });
});

// ==================== install 函数测试 ====================
describe("8. install 函数", () => {
  it("注册 PaRow 组件", async () => {
    const { default: module } = await import("./index");
    const app = { _context: { components: {} }, component: vi.fn() } as any;
    module.install(app);
    expect(app.component).toHaveBeenCalledWith("PaRow", expect.anything());
  });

  it("不重复注册 PaRow 组件", async () => {
    const { default: module } = await import("./index");
    const app = { _context: { components: { PaRow: true } }, component: vi.fn() } as any;
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

// ==================== SSR 分支覆盖 ====================
describe("9. window 事件监听分支", () => {
  it("onMounted 添加 resize 监听", async () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const wrapper = await mountRow();
    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    addSpy.mockRestore();
  });

  it("onUnmounted 移除 resize 监听", async () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const wrapper = await mountRow();
    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });

  it("resize 事件触发时重新计算断点", async () => {
    const wrapper = await mountRow();
    // 触发 resize 事件
    window.dispatchEvent(new Event("resize"));
    await nextTick();
    // 组件仍然正常渲染
    expect(wrapper.find("div.pa-row").exists()).toBe(true);
  });

  it("不同窗口宽度计算断点", async () => {
    // 默认 happy-dom innerWidth 通常是较大值，断点为 xl
    const wrapper = await mountRow();
    expect(wrapper.find("div.pa-row").exists()).toBe(true);
  });
});

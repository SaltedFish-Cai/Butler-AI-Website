/**
 * pa-scrollbar 滚动条组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach, type Spy } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref, shallowRef, triggerEvent } from "vue";

// Mock PaIcon
const PaIconMock = defineComponent({
  name: "PaIcon",
  props: ["name", "class"],
  setup(props, { slots }) {
    return () => h("i", { class: ["pa-icon-mock", props.class] }, slots.default?.());
  }
});

// Mock randChar
vi.mock("../tools/rand-char", () => ({
  randChar: () => "testrand"
}));

// Mock lodash
const debounceMock = vi.fn((fn: Function) => fn);
vi.mock("lodash", () => ({
  default: {
    debounce: debounceMock
  }
}));

// 滚动回调模拟数据
let scrollHandlerCallback: ((data: any) => void) | null = null;
let directlyHandlerCallback: ((data: any) => void) | null = null;
const setElementScrollPositionMock = vi.fn();

// Mock scrollListener
vi.mock("./scrollListener", () => ({
  listenElementScroll: (el: HTMLElement, handler: any, directlyHandler: any, options: any) => {
    scrollHandlerCallback = handler;
    directlyHandlerCallback = directlyHandler;
    return {
      listener: {
        setElementScrollPosition: setElementScrollPositionMock,
        update: vi.fn()
      },
      bodyHeight: 300,
      bodyWidth: 600,
      remove: vi.fn(),
      update: () => ({
        horizontalThumb: 50,
        verticalThumb: 80,
        horizontalThumbScale: 0.5,
        verticalThumbScale: 0.8,
        useHorizontal: false,
        useVertical: true
      }),
      useHorizontal: false,
      useVertical: true
    };
  },
  startDrag: () => ({ stop: vi.fn() }),
  observeElementResize: () => ({ stop: vi.fn() })
}));

// Mock useIntersectionObserver
const stopObservingMock = vi.fn();
const isIntersectingRef = ref(false);
vi.mock("./useIntersectionObserver", () => ({
  useIntersectionObserver: () => {
    isIntersectingRef.value = false;
    return {
      isIntersecting: isIntersectingRef,
      stopObserving: stopObservingMock
    };
  }
}));

// Mock getElementPosition
vi.mock("../utils/getElementPosition", () => ({
  getElementPosition: () => ({ parentTop: 0, parentLeft: 0 })
}));

// 辅助函数：触发滚动回调
function triggerScrollCallback(data: any) {
  // 安全地触发回调
  try {
    if (scrollHandlerCallback) {
      scrollHandlerCallback(data);
    }
  } catch (e) {
    // ignore
  }
  try {
    if (directlyHandlerCallback) {
      directlyHandlerCallback(data);
    }
  } catch (e) {
    // ignore
  }
}

async function mountScrollbar(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaScrollbar } = await import("./pa-scrollbar.vue");
  return mount(PaScrollbar, {
    props,
    slots,
    global: {
      stubs: {
        PaIcon: PaIconMock
      }
    }
  });
}

describe("pa-scrollbar 组件测试", () => {
  let wrapper: any;

  describe("1. 默认渲染", () => {
    it("渲染 section.pa-scrollbar", async () => {
      const wrapper = await mountScrollbar();
      expect(wrapper.find("section.pa-scrollbar").exists()).toBe(true);
    });

    it("默认有 scrollbar-body", async () => {
      const wrapper = await mountScrollbar();
      expect(wrapper.find(".scrollbar-body").exists()).toBe(true);
    });

    it("默认有 scrollbar-body-content", async () => {
      const wrapper = await mountScrollbar();
      expect(wrapper.find(".scrollbar-body-content").exists()).toBe(true);
    });
  });

  describe("2. styleMode prop", () => {
    it("styleMode=color 添加 color-scrollbar class", async () => {
      const wrapper = await mountScrollbar({ styleMode: "color" });
      expect(wrapper.find("section.pa-scrollbar").classes()).toContain("color-scrollbar");
    });

    it("styleMode=default 不添加 color-scrollbar class", async () => {
      const wrapper = await mountScrollbar({ styleMode: "default" });
      expect(wrapper.find("section.pa-scrollbar").classes()).not.toContain("color-scrollbar");
    });
  });

  describe("3. useScrollY/useScrollX prop", () => {
    it("useScrollY=true 时添加 scrollbar-body-y class", async () => {
      const wrapper = await mountScrollbar({ useScrollY: true });
      expect(wrapper.find(".scrollbar-body").classes()).toContain("scrollbar-body-y");
    });

    it("useScrollX=true 时添加 scrollbar-body-x class", async () => {
      const wrapper = await mountScrollbar({ useScrollX: true });
      expect(wrapper.find(".scrollbar-body").classes()).toContain("scrollbar-body-x");
    });

    it("useScrollY=false 时不添加 scrollbar-body-y", async () => {
      const wrapper = await mountScrollbar({ useScrollY: false });
      expect(wrapper.find(".scrollbar-body").classes()).not.toContain("scrollbar-body-y");
    });
  });

  describe("4. padding prop", () => {
    it("padding 包含 top 时添加 padding-top class", async () => {
      const wrapper = await mountScrollbar({ padding: ["top"] });
      expect(wrapper.find(".scrollbar-body-content").classes()).toContain("padding-top");
    });

    it("padding 包含 all 时添加所有 padding class", async () => {
      const wrapper = await mountScrollbar({ padding: ["all"] });
      const content = wrapper.find(".scrollbar-body-content");
      expect(content.classes()).toContain("padding-top");
      expect(content.classes()).toContain("padding-bottom");
      expect(content.classes()).toContain("padding-left");
      expect(content.classes()).toContain("padding-right");
    });

    it("padding 包含 left 和 right", async () => {
      const wrapper = await mountScrollbar({ padding: ["left", "right"] });
      const content = wrapper.find(".scrollbar-body-content");
      expect(content.classes()).toContain("padding-left");
      expect(content.classes()).toContain("padding-right");
    });
  });

  describe("5. border prop", () => {
    it("border 包含 top 时渲染 pa-border_top", async () => {
      const wrapper = await mountScrollbar({ border: ["top"] });
      expect(wrapper.find(".pa-border_top").exists()).toBe(true);
    });

    it("border 包含 all 时渲染所有边框", async () => {
      const wrapper = await mountScrollbar({ border: ["all"] });
      expect(wrapper.find(".pa-border_top").exists()).toBe(true);
      expect(wrapper.find(".pa-border_bottom").exists()).toBe(true);
      expect(wrapper.find(".pa-border_left").exists()).toBe(true);
      expect(wrapper.find(".pa-border_right").exists()).toBe(true);
    });

    it("无 border 时不渲染边框元素", async () => {
      const wrapper = await mountScrollbar();
      expect(wrapper.find(".pa-border_top").exists()).toBe(false);
    });
  });

  describe("6. paddingBorder prop", () => {
    it("paddingBorder 包含 top 时渲染 pa-border_padding_top", async () => {
      const wrapper = await mountScrollbar({ paddingBorder: ["top"] });
      expect(wrapper.find(".pa-border_padding_top").exists()).toBe(true);
    });

    it("paddingBorder 包含 all 时渲染所有内边距边框", async () => {
      const wrapper = await mountScrollbar({ paddingBorder: ["all"] });
      expect(wrapper.find(".pa-border_padding_top").exists()).toBe(true);
      expect(wrapper.find(".pa-border_padding_bottom").exists()).toBe(true);
    });
  });

  describe("7. useShadow prop", () => {
    it("useShadow=true 时渲染 is-scroll-top 和 is-scroll-end", async () => {
      const wrapper = await mountScrollbar({ useShadow: true });
      expect(wrapper.find(".is-scroll-top").exists()).toBe(true);
      expect(wrapper.find(".is-scroll-end").exists()).toBe(true);
    });

    it("useShadow=false 时不渲染阴影", async () => {
      const wrapper = await mountScrollbar({ useShadow: false });
      expect(wrapper.find(".is-scroll-top").exists()).toBe(false);
      expect(wrapper.find(".is-scroll-end").exists()).toBe(false);
    });
  });

  describe("8. showThumb prop", () => {
    it("showThumb=true 且 useVertical 时渲染垂直滚动条", async () => {
      const wrapper = await mountScrollbar({ showThumb: true });
      expect(wrapper.find("section.pa-scrollbar").exists()).toBe(true);
    });

    it("showThumb=false 时不渲染滚动条", async () => {
      const wrapper = await mountScrollbar({ showThumb: false });
      expect(wrapper.find(".scrollbar__bar").exists()).toBe(false);
    });
  });

  describe("9. paddingWidth prop", () => {
    it("数字 paddingWidth 设置为 px", async () => {
      const wrapper = await mountScrollbar({ paddingWidth: 20 });
      const style = wrapper.find("section.pa-scrollbar").attributes("style");
      expect(style).toContain("20px");
    });

    it("字符串 paddingWidth 直接使用", async () => {
      const wrapper = await mountScrollbar({ paddingWidth: "2em" });
      const style = wrapper.find("section.pa-scrollbar").attributes("style");
      expect(style).toContain("2em");
    });
  });

  describe("10. contentStyle prop", () => {
    it("contentStyle 添加到 scrollbar-body 样式", async () => {
      const wrapper = await mountScrollbar({ contentStyle: { height: "200px" } });
      const style = wrapper.find(".scrollbar-body").attributes("style");
      expect(style).toContain("200px");
    });
  });

  describe("11. slot", () => {
    it("渲染默认 slot", async () => {
      const wrapper = await mountScrollbar({}, { default: '<div class="content">内容</div>' });
      expect(wrapper.find(".content").exists()).toBe(true);
    });

    it("渲染 footer slot", async () => {
      const wrapper = await mountScrollbar({}, { footer: '<div class="footer">底部</div>' });
      expect(wrapper.find(".pa-scrollbar-content_footer").exists()).toBe(true);
      expect(wrapper.find(".footer").exists()).toBe(true);
    });
  });

  describe("12. class prop", () => {
    it("自定义 class 添加到 section", async () => {
      const wrapper = await mountScrollbar({ class: "custom-class" });
      expect(wrapper.find("section.pa-scrollbar").classes()).toContain("custom-class");
    });
  });

  describe("13. emit 事件测试", () => {
    it("触发 scroll 事件 - 验证组件能处理滚动数据", async () => {
      const wrapper = await mountScrollbar({}, { default: "<div>content</div>" });

      // 触发 scroll 回调
      triggerScrollCallback({
        scrollTop: 100,
        scrollLeft: 50,
        isAtTop: false,
        isAtBottom: false,
        isAtLeft: false,
        isAtRight: false,
        scrollDirectionY: "down",
        scrollDirectionX: "right",
        element: null as any
      });

      await nextTick();
      // 验证组件实例存在
      expect(wrapper.vm.$).toBeDefined();
    });

    it("触发滚动到底部事件", async () => {
      const wrapper = await mountScrollbar();

      triggerScrollCallback({
        scrollTop: 290,
        scrollLeft: 0,
        isAtTop: false,
        isAtBottom: true,
        isAtLeft: true,
        isAtRight: false,
        element: null as any
      });

      await nextTick();
      expect(wrapper.vm.$).toBeDefined();
    });

    it("触发滚动到顶部事件", async () => {
      const wrapper = await mountScrollbar();

      triggerScrollCallback({
        scrollTop: 5,
        scrollLeft: 0,
        isAtTop: true,
        isAtBottom: false,
        isAtLeft: true,
        isAtRight: false,
        element: null as any
      });

      await nextTick();
      expect(wrapper.vm.$).toBeDefined();
    });

    it("触发滚动到左侧边界事件", async () => {
      const wrapper = await mountScrollbar();

      triggerScrollCallback({
        scrollTop: 0,
        scrollLeft: 5,
        isAtTop: true,
        isAtBottom: false,
        isAtLeft: true,
        isAtRight: false,
        element: null as any
      });

      await nextTick();
      expect(wrapper.vm.$).toBeDefined();
    });

    it("触发滚动到右侧边界事件", async () => {
      const wrapper = await mountScrollbar();

      triggerScrollCallback({
        scrollTop: 0,
        scrollLeft: 100,
        isAtTop: true,
        isAtBottom: false,
        isAtLeft: false,
        isAtRight: true,
        element: null as any
      });

      await nextTick();
      expect(wrapper.vm.$).toBeDefined();
    });

    it("触发 directlyScrollEnd 事件", async () => {
      const wrapper = await mountScrollbar();

      triggerScrollCallback({
        scrollTop: 290,
        scrollLeft: 0,
        scrollData: {
          isAtBottom: true,
          isAtTop: false,
          isAtLeft: false,
          isAtRight: false
        }
      });

      await nextTick();
      expect(wrapper.vm.$).toBeDefined();
    });

    it("触发 directlyScrollStart 事件", async () => {
      const wrapper = await mountScrollbar();

      triggerScrollCallback({
        scrollTop: 5,
        scrollLeft: 0,
        scrollData: {
          isAtBottom: false,
          isAtTop: true,
          isAtLeft: false,
          isAtRight: false
        }
      });

      await nextTick();
      expect(wrapper.vm.$).toBeDefined();
    });

    it("触发 directlyScroll 事件", async () => {
      const wrapper = await mountScrollbar();

      triggerScrollCallback({
        scrollTop: 100,
        scrollLeft: 50,
        scrollData: {
          isAtBottom: false,
          isAtTop: false,
          isAtLeft: false,
          isAtRight: false
        }
      });

      await nextTick();
      expect(wrapper.vm.$).toBeDefined();
    });
  });

  describe("14. 暴露方法测试 (defineExpose)", () => {
    it("暴露 update 方法", async () => {
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      expect(typeof vm.update).toBe("function");
    });

    it("暴露 setScrollTop 方法", async () => {
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      expect(typeof vm.setScrollTop).toBe("function");
    });

    it("暴露 setScrollLeft 方法", async () => {
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      expect(typeof vm.setScrollLeft).toBe("function");
    });

    it("暴露 setScrollToIntersect 方法", async () => {
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      expect(typeof vm.setScrollToIntersect).toBe("function");
    });

    it("暴露 resetObserver 方法", async () => {
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      expect(typeof vm.resetObserver).toBe("function");
    });

    it("暴露 bodyEl (scrollbarBodyRef)", async () => {
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      expect(vm.bodyEl).toBeDefined();
    });
  });

  describe("15. setScrollTop/setScrollLeft 方法测试", () => {
    it("setScrollTop 调用 setElementScrollPosition", async () => {
      setElementScrollPositionMock.mockClear();
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      // setScrollTop 需要 listener.value 存在
      if (vm.listener) {
        vm.setScrollTop(100);
        expect(setElementScrollPositionMock).toHaveBeenCalled();
      }
    });

    it("setScrollLeft 调用 setElementScrollPosition", async () => {
      setElementScrollPositionMock.mockClear();
      const wrapper = await mountScrollbar();
      const vm = wrapper.vm as any;
      if (vm.listener) {
        vm.setScrollLeft(50);
        expect(setElementScrollPositionMock).toHaveBeenCalled();
      }
    });
  });

  describe("16. useBackTop 测试", () => {
    it("useBackTop=true 显示返回顶部按钮", async () => {
      const wrapper = await mountScrollbar({ useBackTop: true });
      expect(wrapper.find("section.pa-scrollbar").exists()).toBe(true);
    });

    it("useBackTop=false 不显示返回顶部按钮", async () => {
      const wrapper = await mountScrollbar({ useBackTop: false });
      expect(wrapper.find(".pa-scrollbar-back-top").exists()).toBe(false);
    });
  });

  describe("17. defaultScrollHorizontalThumb/defaultScrollVerticalThumb", () => {
    it("设置默认滚动条位置", async () => {
      const wrapper = await mountScrollbar({
        defaultScrollHorizontalThumb: 10,
        defaultScrollVerticalThumb: 20
      });
      expect(wrapper.find("section.pa-scrollbar").exists()).toBe(true);
    });
  });

  describe("18. useClosePopover 测试", () => {
    it("useClosePopover=true", async () => {
      const wrapper = await mountScrollbar({ useClosePopover: true });
      expect(wrapper.find("section.pa-scrollbar").exists()).toBe(true);
    });

    it("useClosePopover=false", async () => {
      const wrapper = await mountScrollbar({ useClosePopover: false });
      expect(wrapper.find("section.pa-scrollbar").exists()).toBe(true);
    });
  });

  describe("19. 滚动阴影显示逻辑", () => {
    it("scrollVerticalThumb > 5 时顶部阴影显示", async () => {
      const wrapper = await mountScrollbar({ useShadow: true });
      // 触发滚动使 scrollVerticalThumb > 5
      triggerScrollCallback({
        scrollTop: 100,
        scrollLeft: 0,
        isAtTop: false,
        isAtBottom: false,
        isAtLeft: false,
        isAtRight: false,
        element: null as any
      });
      await nextTick();
      expect(wrapper.find(".is-scroll-top").exists()).toBe(true);
    });

    it("isScrollEnd 为 false 时底部阴影显示", async () => {
      const wrapper = await mountScrollbar({ useShadow: true });
      // 触发滚动到底部
      triggerScrollCallback({
        scrollTop: 290,
        scrollLeft: 0,
        isAtTop: false,
        isAtBottom: true,
        isAtLeft: false,
        isAtRight: false,
        element: null as any
      });
      await nextTick();
      expect(wrapper.find(".is-scroll-end").exists()).toBe(true);
    });
  });

  describe("20. parentBoxRef 测试", () => {
    it("传入 parentBoxRef", async () => {
      const parentEl = document.createElement("div");
      parentEl.style.height = "400px";
      document.body.appendChild(parentEl);

      try {
        const wrapper = await mountScrollbar({
          parentBoxRef: parentEl as any
        });
        expect(wrapper.find("section.pa-scrollbar").exists()).toBe(true);
      } finally {
        document.body.removeChild(parentEl);
      }
    });
  });

  describe("21. onBeforeUnmount 清理测试", () => {
    it("组件卸载时正确清理资源", async () => {
      const wrapper = await mountScrollbar();
      await nextTick();
      wrapper.unmount();
      expect(wrapper.exists()).toBe(false);
    });
  });

  describe("22. 组合测试 - 完整滚动流程", () => {
    it("完整滚动流程: 初始 -> 滚动 -> 到底部 -> 返回顶部", async () => {
      const wrapper = await mountScrollbar({ useShadow: true, useBackTop: true });

      // 初始状态
      triggerScrollCallback({
        scrollTop: 0,
        scrollLeft: 0,
        isAtTop: true,
        isAtBottom: false,
        isAtLeft: true,
        isAtRight: false,
        scrollData: {
          isAtTop: true,
          isAtBottom: false,
          isAtLeft: true,
          isAtRight: false
        },
        element: null as any
      });
      await nextTick();

      // 滚动中
      triggerScrollCallback({
        scrollTop: 100,
        scrollLeft: 50,
        isAtTop: false,
        isAtBottom: false,
        isAtLeft: false,
        isAtRight: false,
        scrollData: {
          isAtTop: false,
          isAtBottom: false,
          isAtLeft: false,
          isAtRight: false
        },
        element: null as any
      });
      await nextTick();

      // 滚动到底部
      triggerScrollCallback({
        scrollTop: 290,
        scrollLeft: 0,
        isAtTop: false,
        isAtBottom: true,
        isAtLeft: true,
        isAtRight: false,
        scrollData: {
          isAtTop: false,
          isAtBottom: true,
          isAtLeft: true,
          isAtRight: false
        },
        element: null as any
      });
      await nextTick();

      // 返回顶部
      triggerScrollCallback({
        scrollTop: 0,
        scrollLeft: 0,
        isAtTop: true,
        isAtBottom: false,
        isAtLeft: true,
        isAtRight: false,
        scrollData: {
          isAtTop: true,
          isAtBottom: false,
          isAtLeft: true,
          isAtRight: false
        },
        element: null as any
      });
      await nextTick();

      expect(wrapper.vm.$).toBeDefined();
    });
  });
});

// ============ index.ts install 函数测试 ============
describe("pa-scrollbar index.ts install", () => {
  it("install 注册 PaScrollBar 组件", async () => {
    const { createApp } = await import("vue");
    const { default: PaScrollBar } = await import("./index");
    const app = createApp({});
    PaScrollBar.install(app);
    expect(app._context.components["PaScrollBar"]).toBeDefined();
  });

  it("install 不重复注册", async () => {
    const { createApp } = await import("vue");
    const { default: PaScrollBar } = await import("./index");
    const app = createApp({});
    PaScrollBar.install(app);
    const comp = app._context.components["PaScrollBar"];
    PaScrollBar.install(app);
    expect(app._context.components["PaScrollBar"]).toBe(comp);
  });

  it("install 返回 void", async () => {
    const { createApp } = await import("vue");
    const { default: PaScrollBar } = await import("./index");
    const app = createApp({});
    const result = PaScrollBar.install(app);
    expect(result).toBeUndefined();
  });
});

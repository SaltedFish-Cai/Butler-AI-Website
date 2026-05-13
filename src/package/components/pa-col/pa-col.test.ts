/**
 * pa-col 栅格列组件单元测试
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, provide } from "vue";

async function mountCol(props: Record<string, any> = {}, provides: Record<string, any> = {}) {
  const { default: PaCol } = await import("./pa-col.vue");
  return mount(PaCol, {
    props,
    global: {
      provide: {
        breakPoint: ref("xl"),
        // rowGutter from pa-row is already gutterValue (gutter/2)
        rowGutter: ref(0),
        ...provides
      }
    }
  });
}

describe("pa-col 组件测试", () => {
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-col", async () => {
      const wrapper = await mountCol();
      expect(wrapper.find("div.pa-col").exists()).toBe(true);
    });

    it("无 span 时不添加 pa-col-${span} class", async () => {
      const wrapper = await mountCol();
      expect(wrapper.find("div.pa-col").classes()).not.toContain("pa-col-24");
    });
  });

  describe("2. span prop", () => {
    it("span=12 添加 pa-col-12 class", async () => {
      const wrapper = await mountCol({ span: 12 });
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-12");
    });

    it("span=24 不添加 pa-col-24 class", async () => {
      const wrapper = await mountCol({ span: 24 });
      expect(wrapper.find("div.pa-col").classes()).not.toContain("pa-col-24");
    });

    it("span 影响样式 flex 计算", async () => {
      const wrapper = await mountCol({ span: 12 });
      const style = wrapper.find("div.pa-col").attributes("style");
      expect(style).toContain("--col-span-value");
      expect(style).toContain("flex");
    });
  });

  describe("3. offset prop", () => {
    it("offset > 0 添加 pa-col-offset class", async () => {
      const wrapper = await mountCol({ span: 12, offset: 4 });
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-offset-4");
    });

    it("offset=0 不添加 offset class", async () => {
      const wrapper = await mountCol({ span: 12, offset: 0 });
      expect(wrapper.find("div.pa-col").classes()).not.toContain("pa-col-offset-0");
    });
  });

  describe("4. 响应式 props", () => {
    it("xs 为数字时添加 pa-col-xs-${n} class", async () => {
      const wrapper = await mountCol({ span: 12, xs: 8 });
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-xs-8");
    });

    it("sm 为对象时添加 span 和 offset class", async () => {
      const wrapper = await mountCol({ span: 12, sm: { span: 6, offset: 2 } });
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-sm-6");
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-sm-offset-2");
    });

    it("lg 为数字时添加对应 class", async () => {
      const wrapper = await mountCol({ span: 12, lg: 8 });
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-lg-8");
    });

    it("md 为对象时 offset=0 不添加 offset class", async () => {
      const wrapper = await mountCol({ span: 12, md: { span: 6, offset: 0 } });
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-md-6");
      expect(wrapper.find("div.pa-col").classes()).not.toContain("pa-col-md-offset-0");
    });

    it("xl 为对象时 offset > 0 添加 offset class", async () => {
      const wrapper = await mountCol({ span: 12, xl: { span: 8, offset: 3 } });
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-xl-8");
      expect(wrapper.find("div.pa-col").classes()).toContain("pa-col-xl-offset-3");
    });
  });

  describe("5. rowGutter 注入", () => {
    it("注入 rowGutter 时 margin 使用像素值", async () => {
      // rowGutter from pa-row is gutterValue = gutter/2
      // So rowGutter=10 means original gutter was 20
      const wrapper = await mountCol({ span: 12 }, { rowGutter: ref(10) });
      const style = wrapper.find("div.pa-col").attributes("style");
      expect(style).toContain("10px");
    });

    it("无 rowGutter 时 margin 使用 CSS 变量", async () => {
      const wrapper = await mountCol({ span: 12 });
      const style = wrapper.find("div.pa-col").attributes("style");
      expect(style).toContain("--pa-size-padding");
    });
  });

  describe("6. breakPoint 注入", () => {
    it("breakPoint 为 xs 时 currentSpan 可用", async () => {
      const wrapper = await mountCol({ xs: { span: 8 }, span: 12 }, { breakPoint: ref("xs") });
      const style = wrapper.find("div.pa-col").attributes("style");
      expect(style).toContain("--col-span-value");
    });
  });

  describe("7. slot", () => {
    it("渲染默认 slot", async () => {
      const { default: PaCol } = await import("./pa-col.vue");
      const wrapper = mount(PaCol, {
        props: { span: 12 },
        slots: { default: '<span class="col-content">列内容</span>' },
        global: {
          provide: {
            breakPoint: ref("xl"),
            rowGutter: ref(0)
          }
        }
      });
      expect(wrapper.find(".col-content").exists()).toBe(true);
    });
  });
});

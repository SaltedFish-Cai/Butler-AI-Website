/**
 * pa-playground 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h, ref, computed } from "vue";

// Mock indexedDB for happy-dom
const mockIndexedDB = {
  open: vi.fn().mockReturnValue({
    onsuccess: null,
    onerror: null,
    result: {}
  })
};
Object.defineProperty(global, "indexedDB", {
  value: mockIndexedDB
});

// Mock openDB
vi.mock("../store", () => ({
  openDB: vi.fn().mockResolvedValue({}),
  getSavedValue: vi.fn().mockReturnValue(null)
}));

// Mock m-editor-tools
vi.mock("./m-editor-tools.vue", () => ({
  default: {
    name: "MEditorTools",
    template: '<div class="m-editor-tools-mock"></div>'
  }
}));

// Mock pa-table
vi.mock("../pa-table/pa-table.vue", () => ({
  default: {
    name: "PaTable",
    template: '<div class="pa-table-mock"></div>',
    props: ["id", "structure", "requestApi", "usePagination", "useSelect"]
  }
}));

// Mock pa-form
vi.mock("../pa-form/pa-form.vue", () => ({
  default: {
    name: "PaForm",
    template: '<div class="pa-form-mock"></div>',
    props: ["id", "structure", "requestApi"]
  }
}));

// Mock pa-tabs
vi.mock("../pa-tabs/pa-tabs.vue", () => ({
  default: {
    name: "PaTabs",
    template: '<div class="pa-tabs-mock"></div>',
    props: ["id", "structure", "requestApi"]
  }
}));

// Mock m-svg-draggable
vi.mock("./components/m-svg-draggable.vue", () => ({
  default: {
    name: "MSvgDraggable",
    template: '<div class="m-svg-draggable-mock"><slot></slot></div>',
    props: ["x", "y", "scale", "index"]
  }
}));

// Mock m-item-svg
vi.mock("./components/m-item-svg.vue", () => ({
  default: {
    name: "MItemSvg",
    template: '<div class="m-item-svg-mock"></div>',
    props: ["itemId", "itemIndex", "pageId"]
  }
}));

// Mock useSvgHooks
vi.mock("./hooks/use-svg-hooks", () => ({
  useSvgHooks: vi.fn().mockReturnValue({
    scale: ref(1),
    translateX: ref(0),
    translateY: ref(0),
    transform: computed(() => "translate(0, 0) scale(1)"),
    backgroundStyle: computed(() => ({})),
    handleWheel: vi.fn(),
    handleMouseDown: vi.fn(),
    handleMouseMove: vi.fn(),
    handleMouseUp: vi.fn(),
    getSvgTransform: vi.fn().mockReturnValue({ adminX: 0, adminY: 0, adminScale: 1 }),
    updateAdminConfig: vi.fn(),
    handleDeletePage: vi.fn()
  })
}));

// Mock use-admin-config
vi.mock("./hooks/use-admin-config", () => ({
  useAdminConfig: vi.fn().mockReturnValue({
    start: vi.fn(),
    stop: vi.fn(),
    inValue: ref({
      id: "test-playground",
      name: "Test Playground",
      pagesConfigs: [],
      dataStructures: [],
      exOptions: []
    })
  })
}));

// Mock config
vi.mock("./config", () => ({
  default: {}
}));

// Mock PaDialog components
vi.mock("../pa-dialog/pa-dialog.vue", () => ({
  default: {
    name: "PaDialog",
    template: '<div class="pa-dialog-mock"><slot></slot></div>',
    props: ["modelValue", "title"],
    emits: ["update:modelValue"],
    methods: {
      open: vi.fn()
    }
  }
}));

// Mock PaButton components
vi.mock("../pa-button/pa-button.vue", () => ({
  default: {
    name: "PaButton",
    template: '<button class="pa-button-mock"><slot></slot></button>',
    props: ["text", "iconName", "type", "is", "disabled"]
  }
}));

// Mock PaButtonGroup
vi.mock("../pa-button-group/pa-button-group.vue", () => ({
  default: {
    name: "PaButtonGroup",
    template: '<div class="pa-button-group-mock"><slot></slot></div>',
    props: ["type"]
  }
}));

// Mock PaScrollbar
vi.mock("../pa-scrollbar/pa-scrollbar.vue", () => ({
  default: {
    name: "PaScrollbar",
    template: '<div class="pa-scrollbar-mock"><slot></slot></div>',
    props: ["useScrollY"]
  }
}));

// Mock PaIcon
vi.mock("../pa-icon/pa-icon.vue", () => ({
  default: {
    name: "PaIcon",
    template: '<i class="pa-icon-mock"></i>',
    props: ["name"]
  }
}));

// Default mock for all other components
const defaultStub = {
  template: '<div class="stub-mock"></div>'
};

async function mountPlayground(props: Record<string, any> = {}) {
  const { default: PaPlayground } = await import("./pa-playground.vue");

  const defaultData = {
    id: "test-playground",
    name: "Test Playground",
    pagesConfigs: [],
    dataStructures: [],
    exOptions: [],
    interfaceConfigs: []
  };

  return mount(PaPlayground, {
    props: {
      data: defaultData,
      ...props
    },
    global: {
      stubs: {
        "pa-button": defaultStub,
        "pa-button-group": defaultStub,
        "pa-dialog": defaultStub,
        "pa-scrollbar": defaultStub,
        "pa-icon": defaultStub,
        "pa-table": defaultStub,
        "pa-form": defaultStub,
        "pa-tabs": defaultStub,
        "m-svg-draggable": defaultStub,
        "m-item-svg": defaultStub,
        "m-editor-tools": defaultStub
      },
      provide: {
        PancakeGlobalConfig: computed(() => ({
          language: ref("zh-CN")
        }))
      }
    }
  });
}

describe("pa-playground 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIndexedDB.open.mockClear();
  });

  // ==================== 渲染 ====================
  describe("1. 默认渲染", () => {
    it("渲染 div.pa-playground", async () => {
      const wrapper = await mountPlayground();
      expect(wrapper.find(".pa-playground").exists()).toBe(true);
    });

    it("包含 fixed-button 工具栏区域", async () => {
      const wrapper = await mountPlayground();
      expect(wrapper.find(".fixed-button").exists()).toBe(true);
    });

    it("包含 svg-container 画布区域", async () => {
      const wrapper = await mountPlayground();
      expect(wrapper.find(".svg-container").exists()).toBe(true);
    });
  });

  // ==================== props ====================
  describe("2. props", () => {
    it("接受 id prop", async () => {
      const wrapper = await mountPlayground({ id: "my-playground" });
      expect(wrapper.find(".pa-playground").exists()).toBe(true);
    });

    it("接受 class prop", async () => {
      const wrapper = await mountPlayground({ class: "custom-class" });
      expect(wrapper.find(".pa-playground.custom-class").exists()).toBe(true);
    });

    it("接受 style prop", async () => {
      const wrapper = await mountPlayground({ style: { width: "500px" } });
      const style = wrapper.find(".pa-playground").attributes("style");
      expect(style).toContain("width");
    });
  });

  // ==================== 子组件渲染 ====================
  describe("3. 子组件渲染", () => {
    it("渲染 SVG 内容区域", async () => {
      const wrapper = await mountPlayground();
      expect(wrapper.find("svg").exists()).toBe(true);
    });

    it("渲染按钮工具栏", async () => {
      const wrapper = await mountPlayground();
      expect(wrapper.findAll(".stub-mock").length).toBeGreaterThan(0);
    });
  });

  // ==================== 数据初始化 ====================
  describe("4. 数据初始化", () => {
    it("使用默认数据结构", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(vm.inValue).toBeDefined();
    });

    it("接受自定义 data", async () => {
      const customData = {
        id: "custom-id",
        name: "Custom Name",
        pagesConfigs: [],
        dataStructures: [],
        exOptions: [],
        interfaceConfigs: []
      };
      const wrapper = await mountPlayground({ data: customData });
      const vm = wrapper.vm as any;
      expect(vm.inValue.id).toBe("custom-id");
    });
  });

  // ==================== 页面配置 ====================
  describe("5. 页面配置", () => {
    it("初始页面配置为空", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(vm.inValue.pagesConfigs).toEqual([]);
    });

    it("接受带页面的配置", async () => {
      const dataWithPages = {
        id: "test",
        name: "Test",
        pagesConfigs: [
          {
            pageId: "page-1",
            name: "Page 1",
            x: 100,
            y: 100,
            itemConfigs: []
          }
        ],
        dataStructures: [],
        exOptions: [],
        interfaceConfigs: []
      };
      const wrapper = await mountPlayground({ data: dataWithPages });
      const vm = wrapper.vm as any;
      expect(vm.inValue.pagesConfigs.length).toBe(1);
    });
  });

  // ==================== 方法测试 ====================
  describe("6. 方法测试", () => {
    it("handleCreatePage 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleCreatePage).toBe("function");
    });

    it("handleCreateTable 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleCreateTable).toBe("function");
    });

    it("handleCreateForm 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleCreateForm).toBe("function");
    });

    it("handleCreateTabs 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleCreateTabs).toBe("function");
    });

    it("handleDeleteItem 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleDeleteItem).toBe("function");
    });

    it("saveBaseConfig 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.saveBaseConfig).toBe("function");
    });
  });

  // ==================== 拖拽相关方法 ====================
  describe("7. 拖拽相关方法", () => {
    it("handleDragStart 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleDragStart).toBe("function");
    });

    it("handleDragEnd 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleDragEnd).toBe("function");
    });

    it("handleDrop 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleDrop).toBe("function");
    });
  });

  // ==================== 模拟场方法 ====================
  describe("8. 模拟场方法", () => {
    it("handleEnablePlayground 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleEnablePlayground).toBe("function");
    });

    it("handleEnableTraining 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleEnableTraining).toBe("function");
    });

    it("useMock ref 存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(vm.useMock).toBeDefined();
    });
  });

  // ==================== ref 方法 ====================
  describe("9. ref 方法", () => {
    it("setTableRef 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.setTableRef).toBe("function");
    });

    it("setFormRef 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.setFormRef).toBe("function");
    });

    it("setDraggableRef 方法存在", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.setDraggableRef).toBe("function");
    });
  });

  // ==================== 暴露方法 ====================
  describe("10. 暴露方法", () => {
    it("暴露 handleCreatePage", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleCreatePage).toBe("function");
    });

    it("暴露 handleDeleteItem", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(typeof vm.handleDeleteItem).toBe("function");
    });
  });

  // ==================== 边界情况 ====================
  describe("11. 边界情况", () => {
    it("空数据时正常工作", async () => {
      const emptyData = {
        id: "",
        name: "",
        pagesConfigs: [],
        dataStructures: [],
        exOptions: [],
        interfaceConfigs: []
      };
      const wrapper = await mountPlayground({ data: emptyData });
      expect(wrapper.find(".pa-playground").exists()).toBe(true);
    });

    it("lockScroll ref 初始值为 false", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(vm.lockScroll).toBe(false);
    });

    it("draggedIndex ref 初始值为 -1", async () => {
      const wrapper = await mountPlayground();
      const vm = wrapper.vm as any;
      expect(vm.draggedIndex).toBe(-1);
    });
  });

  // ==================== SVG 背景 ====================
  describe("12. SVG 背景样式", () => {
    it("svg-background 元素存在", async () => {
      const wrapper = await mountPlayground();
      expect(wrapper.find(".svg-background").exists()).toBe(true);
    });
  });

  // ==================== 组件交互 ====================
  describe("13. 组件交互", () => {
    it("handleClickItem 方法存在且可调用", async () => {
      const wrapper = await mountPlayground({
        data: {
          id: "test",
          name: "Test",
          pagesConfigs: [
            {
              pageId: "page-1",
              name: "Page 1",
              x: 0,
              y: 0,
              itemConfigs: []
            }
          ],
          dataStructures: [],
          exOptions: [],
          interfaceConfigs: []
        }
      });
      const vm = wrapper.vm as any;

      // 调用 handleClickItem 不应该抛出错误
      expect(() => vm.handleClickItem(0)).not.toThrow();
    });
  });
});

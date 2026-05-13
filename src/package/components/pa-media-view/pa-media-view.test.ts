/**
 * pa-media-view 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, defineComponent, h } from "vue";
import type { ComputedRef } from "vue";

// Mock useDownload and useGetBlob
vi.mock("./use-download", () => ({
  useDownload: vi.fn(),
  useGetBlob: vi.fn().mockResolvedValue(null)
}));

// Mock PancakeGlobalConfig
function createMockPancakeGlobalConfig() {
  return {
    value: {
      language: {
        value: "zh-CN",
        package: {
          media: {
            filePreview: "预览",
            expand: "展开",
            collapse: "收起",
            downloadCurrentFile: "下载当前文件",
            downloadAllFiles: "下载所有文件",
            rotateTip: "旋转",
            zoomTip: "缩放"
          }
        }
      },
      requestHeader: {},
      file_config: {
        downloadHose: ""
      }
    }
  } as ComputedRef<{
    language: { value: string; package: Record<string, Record<string, string>> };
    requestHeader: any;
    file_config: { downloadHose: string };
  }>;
}

// Mock PaButton
const PaButtonMock = defineComponent({
  name: "PaButton",
  props: {
    is: { type: String, default: "button" },
    type: { type: String, default: "default" },
    text: { type: [String, Object], default: "" }
  },
  emits: ["click"],
  setup(props, { emit }) {
    return () =>
      h(
        "button",
        {
          class: ["pa-button", props.type],
          onClick: () => emit("click")
        },
        typeof props.text === "string" ? props.text : "按钮"
      );
  }
});

// Mock PaDialog
const PaDialogMock = defineComponent({
  name: "PaDialog",
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: "" },
    size: { type: String, default: "default" },
    scroll: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "closed"],
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        {
          class: "pa-dialog-mock",
          onClick: () => {}
        },
        [h("div", { class: "pa-dialog-content" }, slots.default?.()), slots.footer?.(), slots.footerRight?.()]
      );
  }
});

// Mock PaIcon
const PaIconMock = defineComponent({
  name: "PaIcon",
  props: {
    name: { type: String, default: "test" }
  },
  setup(props) {
    return () => h("i", { class: `pa-icon icon-${props.name}` });
  }
});

// Mock PaScrollbar
const PaScrollbarMock = defineComponent({
  name: "PaScrollbar",
  props: {
    class: { type: String, default: "" },
    always: { type: Boolean, default: false },
    useScrollX: { type: Boolean, default: true }
  },
  setup(props, { slots }) {
    return () => h("div", { class: "pa-scrollbar-mock" }, slots.default?.());
  }
});

// Mock 子视图组件
const ImageViewMock = defineComponent({
  name: "ImageView",
  props: {
    filePath: { type: String, default: "" }
  },
  setup() {
    return () => h("div", { class: "image-view-mock" });
  }
});

const PdfViewMock = defineComponent({
  name: "PdfView",
  props: {
    filePath: { type: String, default: "" },
    zoom: { type: Number, default: 1 }
  },
  setup() {
    return () => h("div", { class: "pdf-view-mock" });
  }
});

const ExcelViewMock = defineComponent({
  name: "ExcelView",
  props: {
    filePath: { type: String, default: "" },
    zoom: { type: Number, default: 1 }
  },
  setup() {
    return () => h("div", { class: "excel-view-mock" });
  }
});

const WordViewMock = defineComponent({
  name: "WordView",
  props: {
    filePath: { type: String, default: "" },
    zoom: { type: Number, default: 1 }
  },
  setup() {
    return () => h("div", { class: "word-view-mock" });
  }
});

const TextViewMock = defineComponent({
  name: "TextView",
  props: {
    filePath: { type: String, default: "" },
    zoom: { type: Number, default: 1 }
  },
  setup() {
    return () => h("div", { class: "text-view-mock" });
  }
});

describe("pa-media-view 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== 默认渲染 ====================
  describe("1. 默认渲染", () => {
    it("组件正常挂载", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: {
            PancakeGlobalConfig: createMockPancakeGlobalConfig()
          }
        }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("默认显示按钮区域", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: {
            PancakeGlobalConfig: createMockPancakeGlobalConfig()
          }
        }
      });
      expect(wrapper.find(".flex.pa-hand").exists()).toBe(true);
    });
  });

  // ==================== props ====================
  describe("2. props", () => {
    it("接受 fileList prop", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const fileList = [
        { filePath: "/test1.jpg", fileName: "test1.jpg" },
        { filePath: "/test2.pdf", fileName: "test2.pdf" }
      ];
      const wrapper = mount(PaMediaView, {
        props: { fileList },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      expect((wrapper.props() as any).fileList).toEqual(fileList);
    });

    it("接受 hideBtn prop", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }],
          hideBtn: true
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      expect((wrapper.props() as any).hideBtn).toBe(true);
    });
  });

  // ==================== 初始状态 ====================
  describe("3. 初始状态", () => {
    it("visible 默认为 false", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.visible).toBe(false);
    });

    it("viewIndex 默认为 0", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.viewIndex).toBe(0);
    });

    it("zoomIndex 默认为 1", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.zoomIndex).toBe(1);
    });
  });

  // ==================== 方法测试 ====================
  describe("4. 方法测试", () => {
    it("openFile 方法设置 visible 为 true", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      vm.openFile();
      expect(vm.visible).toBe(true);
    });

    it("changeIndex 方法切换文件索引", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [
            { filePath: "/test1.jpg", fileName: "test1.jpg" },
            { filePath: "/test2.jpg", fileName: "test2.jpg" }
          ]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      vm.changeIndex(1);
      await nextTick();
      expect(vm.viewIndex).toBe(1);
    });

    it("handleMouseWheel 调整缩放", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      const initialZoom = vm.zoomIndex;

      // 缩小
      vm.handleMouseWheel({ deltaY: 1 });
      expect(vm.zoomIndex).toBeLessThan(initialZoom);
    });

    it("openVisible 方法打开预览", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      vm.openVisible();
      expect(vm.visible).toBe(true);
      expect(vm.viewIndex).toBe(0);
    });

    it("closeVisible 方法关闭预览", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      vm.openVisible();
      expect(vm.visible).toBe(true);

      vm.closeVisible();
      expect(vm.visible).toBe(false);
    });
  });

  // ==================== 文件类型判断 ====================
  describe("5. 文件类型判断", () => {
    it("识别图片文件", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.fileType).toBe("image");
    });

    it("识别 PDF 文件", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.pdf", fileName: "test.pdf" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.fileType).toBe("pdf");
    });

    it("识别文本文件", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.txt", fileName: "test.txt" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.fileType).toBe("text");
    });
  });

  // ==================== 暴露方法 ====================
  describe("6. 暴露方法", () => {
    it("暴露 openVisible 方法", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(typeof vm.openVisible).toBe("function");
    });

    it("暴露 closeVisible 方法", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }]
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      const vm = wrapper.vm as any;
      expect(typeof vm.closeVisible).toBe("function");
    });
  });

  // ==================== hideBtn ====================
  describe("7. hideBtn 功能", () => {
    it("hideBtn 为 true 时不显示按钮区域", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: {
          fileList: [{ filePath: "/test.jpg", fileName: "test.jpg" }],
          hideBtn: true
        },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      expect(wrapper.find(".flex.pa-hand").exists()).toBe(false);
    });
  });

  // ==================== 边界情况 ====================
  describe("8. 边界情况", () => {
    it("空 fileList 时组件仍能挂载", async () => {
      const { default: PaMediaView } = await import("./pa-media-view.vue");
      const wrapper = mount(PaMediaView, {
        props: { fileList: [] },
        global: {
          stubs: {
            "pa-button": PaButtonMock,
            "pa-dialog": PaDialogMock,
            "pa-icon": PaIconMock,
            "pa-scrollbar": PaScrollbarMock,
            imageView: ImageViewMock,
            pdfView: PdfViewMock,
            "excel-view": ExcelViewMock,
            "word-view": WordViewMock,
            textView: TextViewMock
          },
          provide: { PancakeGlobalConfig: createMockPancakeGlobalConfig() }
        }
      });
      expect(wrapper.exists()).toBe(true);
    });
  });
});

/**
 * pa-table 组件单元测试
 *
 * 注意: pa-table 是一个非常复杂的组件，依赖于多个 hooks。
 * 此测试文件专注于基础的导入和基本渲染测试。
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, computed } from "vue";

// Mock window.developLog for happy-dom
Object.defineProperty(window, "developLog", {
  value: { log: vi.fn(), error: vi.fn(), warn: vi.fn() }
});

// Mock all sub-components
const mockComponents = [
  "pa-development",
  "pa-scrollbar",
  "pa-checkbox-item",
  "pa-icon",
  "m-icon",
  "pa-overlay",
  "pa-button",
  "pa-dialog",
  "pa-empty",
  "pa-table-cell",
  "pa-table-filter",
  "senior-filter",
  "operation",
  "cell-tag",
  "loading-1",
  "pagination",
  "pa-pagination",
  "config-setting",
  "header-item",
  "header-item-filter",
  "mTableV2Filter",
  "mLightTableCell"
];

mockComponents.forEach(name => {
  vi.mock(`../${name}/${name}.vue`, () => ({
    default: { name, template: '<div class="stub"></div>' }
  }));
});

vi.mock("./pa-table-cell.vue", () => ({
  default: { name: "PaTableCell", template: '<div class="stub"></div>' }
}));

// Mock all hooks with complete return values
vi.mock("./hooks/use-observer-hooks", () => ({
  useObserverHooks: vi.fn().mockReturnValue({
    isIntersectingList: ref([]),
    observer: null,
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    listenCellInView: vi.fn(),
    listenCellChildChange: vi.fn(),
    clearListen: vi.fn()
  })
}));

vi.mock("./hooks/use-state-hooks", () => ({
  useStateHooks: vi.fn().mockReturnValue({
    state: {
      tableLoadingSize: 100,
      tableData: [],
      flatTableData: [],
      selectTableData: [],
      summaryData: [],
      PageNum: 1,
      maxPage: 0,
      pageable: { PageNum: 1, PageSize: 10, pageSizes: [10, 20, 50], total: 0 },
      tableQuery: {},
      setCellWidthIng: false,
      tableLoadStatus: false,
      tableLoadEndStatus: false,
      useOrderPropName: "",
      isRowOpenStatus: false,
      showSelectList: false,
      hoveredRowIndex: -1,
      hoveredColumnIndex: -1,
      listenCellInViewIng: false,
      oldPageIndex: 0,
      useAverageWidth: 0,
      inRules: {},
      awaitSelectData: []
    },
    tableStructure: ref([]),
    isRowIndex: vi.fn().mockReturnValue(false),
    getTableList: vi.fn().mockResolvedValue({ Data: { List: [], TotalCount: 0 } }),
    handleSearch: vi.fn(),
    handleReset: vi.fn(),
    handleRefresh: vi.fn(),
    handleSortChange: vi.fn(),
    handleColSetting: vi.fn(),
    handleSelectAllStatus: vi.fn(),
    changeRowStatus: vi.fn(),
    changeRowAllStatus: vi.fn()
  })
}));

vi.mock("./hooks/use-select-hooks", () => ({
  useSelectHooks: vi.fn().mockReturnValue({
    handleSelectionChange: vi.fn(),
    handleRadioChange: vi.fn(),
    isTableSelectAll: false,
    selectedRowsLength: 0
  })
}));

vi.mock("./hooks/use-sort-hooks", () => ({
  useSortHooks: vi.fn().mockReturnValue({
    handleSortChange: vi.fn(),
    handleColSetting: vi.fn()
  })
}));

vi.mock("./hooks/use-table-hooks", () => ({
  useTableHooks: vi.fn().mockReturnValue({
    tableData: ref([]),
    flatTableData: ref([]),
    loading: ref(false)
  })
}));

vi.mock("./hooks/use-column-hooks", () => ({
  useColumnHooks: vi.fn().mockReturnValue({
    tableStructure: ref([]),
    addColumn: vi.fn(),
    removeColumn: vi.fn()
  })
}));

vi.mock("./hooks/use-pagination-hooks", () => ({
  usePaginationHooks: vi.fn().mockReturnValue({
    pageable: ref({ PageNum: 1, PageSize: 10, pageSizes: [10, 20, 50], total: 0 })
  })
}));

vi.mock("./config-setting.vue", () => ({
  default: { name: "ConfigSetting", template: '<div class="stub"></div>' }
}));

vi.mock("./header-item.vue", () => ({
  default: { name: "HeaderItem", template: '<div class="stub"></div>' }
}));

vi.mock("./header-item-filter.vue", () => ({
  default: { name: "HeaderItemFilter", template: '<div class="stub"></div>' }
}));

vi.mock("./hooks/m-table-v2-filter", () => ({
  mTableV2Filter: { name: "MTableV2Filter", template: '<div class="stub"></div>' }
}));

vi.mock("./hooks/m-light-table-cell", () => ({
  mLightTableCell: { name: "MLightTableCell", template: '<div class="stub"></div>' }
}));

vi.mock("./pa-table-filter.vue", () => ({
  default: { name: "PaTableFilter", template: '<div class="stub"></div>' }
}));

vi.mock("./senior-filter.vue", () => ({
  default: { name: "SeniorFilter", template: '<div class="stub"></div>' }
}));

vi.mock("./operation.vue", () => ({
  default: { name: "Operation", template: '<div class="stub"></div>' }
}));

vi.mock("./cell-tag.vue", () => ({
  default: { name: "CellTag", template: '<div class="stub"></div>' }
}));

vi.mock("./loading-1.vue", () => ({
  default: { name: "Loading1", template: '<div class="stub"></div>' }
}));

vi.mock("./pagination.vue", () => ({
  default: { name: "Pagination", template: '<div class="stub"></div>' }
}));

const defaultStub = { template: '<div class="stub"></div>' };

describe("pa-table 组件测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. 渲染 div.pa-table", async () => {
    const { default: PaTable } = await import("./pa-table.vue");
    const wrapper = mount(PaTable, {
      props: { id: "test-table", structure: [], requestApi: vi.fn() },
      global: {
        stubs: { defaultStub },
        provide: { PancakeGlobalConfig: computed(() => ({ language: ref("zh-CN") })), parentScrollbarRef: ref(null) }
      }
    });
    expect(wrapper.find(".pa-table").exists()).toBe(true);
  });

  it("2. 接受 id prop", async () => {
    const { default: PaTable } = await import("./pa-table.vue");
    const wrapper = mount(PaTable, {
      props: { id: "my-table", structure: [], requestApi: vi.fn() },
      global: {
        stubs: { defaultStub },
        provide: { PancakeGlobalConfig: computed(() => ({ language: ref("zh-CN") })), parentScrollbarRef: ref(null) }
      }
    });
    expect(wrapper.find(".pa-table").exists()).toBe(true);
  });

  it("3. 接受空 structure", async () => {
    const { default: PaTable } = await import("./pa-table.vue");
    const wrapper = mount(PaTable, {
      props: { id: "test", structure: [], requestApi: vi.fn() },
      global: {
        stubs: { defaultStub },
        provide: { PancakeGlobalConfig: computed(() => ({ language: ref("zh-CN") })), parentScrollbarRef: ref(null) }
      }
    });
    expect(wrapper.find(".pa-table").exists()).toBe(true);
  });

  it("4. state 存在且可访问", async () => {
    const { default: PaTable } = await import("./pa-table.vue");
    const wrapper = mount(PaTable, {
      props: { id: "test", structure: [], requestApi: vi.fn() },
      global: {
        stubs: { defaultStub },
        provide: { PancakeGlobalConfig: computed(() => ({ language: ref("zh-CN") })), parentScrollbarRef: ref(null) }
      }
    });
    const vm = wrapper.vm as any;
    expect(vm.state).toBeDefined();
  });

  it("5. pageable 状态存在", async () => {
    const { default: PaTable } = await import("./pa-table.vue");
    const wrapper = mount(PaTable, {
      props: { id: "test", structure: [], requestApi: vi.fn() },
      global: {
        stubs: { defaultStub },
        provide: { PancakeGlobalConfig: computed(() => ({ language: ref("zh-CN") })), parentScrollbarRef: ref(null) }
      }
    });
    const vm = wrapper.vm as any;
    expect(vm.state.pageable).toBeDefined();
  });

  it("6. 接受 rowKey prop", async () => {
    const { default: PaTable } = await import("./pa-table.vue");
    const wrapper = mount(PaTable, {
      props: { id: "test", structure: [], requestApi: vi.fn(), rowKey: "id" },
      global: {
        stubs: { defaultStub },
        provide: { PancakeGlobalConfig: computed(() => ({ language: ref("zh-CN") })), parentScrollbarRef: ref(null) }
      }
    });
    expect(wrapper.find(".pa-table").exists()).toBe(true);
  });

  it("7. 接受 useSelect prop", async () => {
    const { default: PaTable } = await import("./pa-table.vue");
    const wrapper = mount(PaTable, {
      props: { id: "test", structure: [], requestApi: vi.fn(), useSelect: true },
      global: {
        stubs: { defaultStub },
        provide: { PancakeGlobalConfig: computed(() => ({ language: ref("zh-CN") })), parentScrollbarRef: ref(null) }
      }
    });
    expect(wrapper.find(".pa-table").exists()).toBe(true);
  });
});

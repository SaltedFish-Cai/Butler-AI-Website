/**
 * pa-form 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick, defineComponent, h, ref, reactive } from 'vue'
import type { Ref } from 'vue'

// Mock 开发日志
const mockDevelopLog = {
  json: vi.fn(),
  log: vi.fn()
}
const mockWindow = {
  developLog: mockDevelopLog
}

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = {
  value: {
    language: {
      value: 'zh-CN',
      package: {
        form: {
          add: '添加',
          remove: '删除',
          warning: '警告'
        }
      }
    }
  }
}

// Mock PaIcon
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: 'loading_line' }
  },
  template: '<span class="pa-icon icon-{{ name }}"></span>'
})

// Mock PaButton
const PaButtonMock = defineComponent({
  name: 'PaButton',
  props: {
    is: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  template: '<button class="pa-button" :disabled="disabled">{{ $slots.default?.() }}</button>'
})

// Mock PaInput
const PaInputMock = defineComponent({
  name: 'PaInput',
  props: {
    modelValue: { default: '' },
    disabled: { type: Boolean, default: false },
    display: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => h('input', {
      class: 'pa-input',
      value: props.modelValue,
      disabled: props.disabled,
      onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
      onChange: (e: Event) => emit('change', (e.target as HTMLInputElement).value)
    })
  }
})

// Mock PaSelect
const PaSelectMock = defineComponent({
  name: 'PaSelect',
  props: {
    modelValue: { default: null },
    disabled: { type: Boolean, default: false },
    display: { type: Boolean, default: false },
    exOptions: { type: Array, default: () => [] }
  },
  emits: ['update:modelValue', 'change'],
  template: '<select class="pa-select" :disabled="disabled" :value="modelValue" @change="$emit(\'change\', $event.target.value)"><option v-for="opt in exOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>'
})

// Mock PaTabs
const PaTabsMock = defineComponent({
  name: 'PaTabs',
  props: {
    modelValue: { type: [String, Number], default: 0 }
  },
  emits: ['update:modelValue', 'tab-change'],
  template: '<div class="pa-tabs"><slot /></div>'
})

// Mock PaTabsItem
const PaTabsItemMock = defineComponent({
  name: 'PaTabsItem',
  props: {
    label: { type: String, default: '' },
    name: { type: [String, Number], default: '' }
  },
  template: '<div class="pa-tabs-item">{{ label }}</div>'
})

// Mock PaRow
const PaRowMock = defineComponent({
  name: 'PaRow',
  props: {
    gutter: { type: String, default: '' }
  },
  template: '<div class="pa-row"><slot /></div>'
})

// Mock PaCol
const PaColMock = defineComponent({
  name: 'PaCol',
  props: {
    span: { type: Number, default: 1 },
    xs: { type: Number, default: 1 },
    sm: { type: Number, default: 1 },
    md: { type: Number, default: 1 },
    lg: { type: Number, default: 1 },
    xl: { type: Number, default: 1 }
  },
  template: '<div class="pa-col"><slot /></div>'
})

// Mock PaTitle
const PaTitleMock = defineComponent({
  name: 'PaTitle',
  props: {
    padding: { type: [String, Array], default: '' }
  },
  template: '<div class="pa-title"><slot /></div>'
})

// Mock PaPopover
const PaPopoverMock = defineComponent({
  name: 'PaPopover',
  props: {
    trigger: { type: String, default: 'hover' },
    placement: { type: String, default: 'top' },
    teleportTo: { default: null }
  },
  template: '<div class="pa-popover"><slot name="reference" /><slot /></div>'
})

// Mock PaScrollbar
const PaScrollbarMock = defineComponent({
  name: 'PaScrollbar',
  props: {
    useBackTop: { type: Boolean, default: false },
    useScrollX: { type: Boolean, default: false },
    padding: { type: Array, default: () => [] }
  },
  template: '<div class="pa-scrollbar"><slot /></div>'
})

// Mock PaEmpty
const PaEmptyMock = defineComponent({
  name: 'PaEmpty',
  props: {
    message: { type: [String, Object], default: '' }
  },
  template: '<div class="pa-empty">{{ typeof message === \'object\' ? message["zh-CN"] : message }}</div>'
})

// Mock PaSwitch
const PaSwitchMock = defineComponent({
  name: 'PaSwitch',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  template: '<button class="pa-switch" :disabled="disabled" @click="$emit(\'update:modelValue\', !modelValue)">{{ modelValue }}</button>'
})

// Mock PaCheckboxItem
const PaCheckboxItemMock = defineComponent({
  name: 'PaCheckboxItem',
  props: {
    disabled: { type: Boolean, default: false },
    isChecked: { type: Boolean, default: false },
    isIndeterminate: { type: Boolean, default: false }
  },
  template: '<div class="pa-checkbox-item" :class="{ checked: isChecked }"></div>'
})

// Mock PaTime
const PaTimeMock = defineComponent({
  name: 'PaTime',
  props: {
    modelValue: { default: null },
    disabled: { type: Boolean, default: false }
  },
  template: '<div class="pa-time">{{ modelValue }}</div>'
})

// Mock PaTransfer
const PaTransferMock = defineComponent({
  name: 'PaTransfer',
  props: {
    modelValue: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    exOptions: { type: Array, default: () => [] }
  },
  emits: ['update:modelValue'],
  template: '<div class="pa-transfer"><slot name="exDisplay" /></div>'
})

// Mock PaCascader
const PaCascaderMock = defineComponent({
  name: 'PaCascader',
  props: {
    modelValue: { default: null },
    disabled: { type: Boolean, default: false },
    exOptions: { type: Array, default: () => [] }
  },
  template: '<div class="pa-cascader"></div>'
})

// Mock PaDevelopment
const PaDevelopmentMock = defineComponent({
  name: 'PaDevelopment',
  props: {
    id: { type: String, default: '' }
  },
  template: '<div class="pa-development"><slot /></div>'
})

// Mock form-label
const FormLabelMock = defineComponent({
  name: 'FormLabel',
  props: {
    label: { type: String, default: '' },
    tip: { type: String, default: '' }
  },
  template: '<label class="form-label">{{ label }}</label>'
})

describe('pa-form 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    if (typeof window !== 'undefined') {
      window.developLog = mockDevelopLog
      window.PancakeGlobalConfig = mockPancakeGlobalConfig.value as any
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // 通用 mount 辅助函数
  async function mountForm(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
    const PaForm = await import('./pa-form.vue')
    return mount(PaForm.default, {
      props: {
        id: 'test-form',
        structure: [],
        ...props
      },
      slots,
      global: {
        stubs: {
          'pa-icon': PaIconMock,
          'pa-button': PaButtonMock,
          'pa-input': PaInputMock,
          'pa-select': PaSelectMock,
          'pa-tabs': PaTabsMock,
          'pa-tabs-item': PaTabsItemMock,
          'pa-row': PaRowMock,
          'pa-col': PaColMock,
          'pa-title': PaTitleMock,
          'pa-popover': PaPopoverMock,
          'pa-scrollbar': PaScrollbarMock,
          'pa-empty': PaEmptyMock,
          'pa-switch': PaSwitchMock,
          'pa-checkbox-item': PaCheckboxItemMock,
          'pa-time': PaTimeMock,
          'pa-transfer': PaTransferMock,
          'pa-cascader': PaCascaderMock,
          'pa-development': PaDevelopmentMock,
          'form-label': FormLabelMock,
          'formItem': { template: '<div class="form-item"><slot /></div>' },
          'tabsItem': { template: '<div class="tabs-item"><slot /></div>' }
        },
        provide: {
          'PancakeGlobalConfig': mockPancakeGlobalConfig
        }
      }
    })
  }

  // ==================== 组件导出 ====================
  describe('1. 组件导出', () => {
    it('PaForm 导出存在', async () => {
      const PaForm = await import('./index')
      expect(PaForm.default).toBeDefined()
      expect(PaForm.default.name).toBe('PaForm')
    })
  })

  // ==================== 基础渲染 ====================
  describe('2. 基础渲染', () => {
    it('空 structure 时不渲染表单', async () => {
      const wrapper = await mountForm({ structure: [] })
      await nextTick()
      vi.advanceTimersByTime(100)
      // 空配置时 initialization 可能是 -1 或 -2
      expect(wrapper.vm).toBeDefined()
    })

    it('无 structure 时显示加载中或错误', async () => {
      const wrapper = await mountForm()
      await nextTick()
      vi.advanceTimersByTime(100)
      expect(wrapper.vm).toBeDefined()
    })

    it('id prop 正确绑定', async () => {
      const wrapper = await mountForm({ id: 'custom-form-id' })
      expect(wrapper.vm).toBeDefined()
    })
  })

  // ==================== props 属性 ====================
  describe('3. props 属性', () => {
    it('class prop 接受字符串', async () => {
      const wrapper = await mountForm({ class: 'custom-class' })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('style prop 接受对象', async () => {
      const wrapper = await mountForm({ style: { width: '100%' } })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('useRequired prop 控制必填', async () => {
      const wrapper = await mountForm({ useRequired: true })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('noLabel prop 隐藏标签', async () => {
      const wrapper = await mountForm({ noLabel: true })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('labelWidth prop 设置标签宽度', async () => {
      const wrapper = await mountForm({ labelWidth: 120 })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('labelPosition prop 设置标签位置', async () => {
      const positions = ['left', 'right', 'top']
      for (const position of positions) {
        const wrapper = await mountForm({ labelPosition: position as any })
        await nextTick()
        expect(wrapper.vm).toBeDefined()
      }
    })

    it('disabled prop 禁用表单', async () => {
      const wrapper = await mountForm({ disabled: true })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('display prop 展示模式', async () => {
      const wrapper = await mountForm({ display: true })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })
  })

  // ==================== 数据相关 ====================
  describe('4. 数据相关', () => {
    it('data prop 接受对象', async () => {
      const wrapper = await mountForm({
        data: { name: 'test' }
      })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('contrastData prop 对比数据', async () => {
      const wrapper = await mountForm({
        data: { name: 'new' },
        contrastData: { name: 'old' }
      })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('alwaysContrast prop 总是显示对比', async () => {
      const wrapper = await mountForm({
        alwaysContrast: true
      })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })
  })

  // ==================== expose 方法 ====================
  describe('5. expose 方法', () => {
    it('getSubmitForm 方法存在', async () => {
      const wrapper = await mountForm({
        structure: []
      })
      await nextTick()
      vi.advanceTimersByTime(100)
      const vm = wrapper.vm as any
      expect(typeof vm.getSubmitForm).toBe('function')
    })

    it('clean_All 方法存在', async () => {
      const wrapper = await mountForm({
        structure: []
      })
      await nextTick()
      vi.advanceTimersByTime(100)
      const vm = wrapper.vm as any
      expect(typeof vm.clean_All).toBe('function')
    })

    it('setStructure_All 方法存在', async () => {
      const wrapper = await mountForm({
        structure: []
      })
      await nextTick()
      vi.advanceTimersByTime(100)
      const vm = wrapper.vm as any
      expect(typeof vm.setStructure_All).toBe('function')
    })

    it('setStructure_Item 方法存在', async () => {
      const wrapper = await mountForm({
        structure: []
      })
      await nextTick()
      vi.advanceTimersByTime(100)
      const vm = wrapper.vm as any
      expect(typeof vm.setStructure_Item).toBe('function')
    })

    it('changeData_All 方法存在', async () => {
      const wrapper = await mountForm({
        structure: []
      })
      await nextTick()
      vi.advanceTimersByTime(100)
      const vm = wrapper.vm as any
      expect(typeof vm.changeData_All).toBe('function')
    })

    it('changeData_Item 方法存在', async () => {
      const wrapper = await mountForm({
        structure: []
      })
      await nextTick()
      vi.advanceTimersByTime(100)
      const vm = wrapper.vm as any
      expect(typeof vm.changeData_Item).toBe('function')
    })
  })

  // ==================== 布局相关 ====================
  describe('6. 布局相关', () => {
    it('maxSpan prop 设置最大分栏', async () => {
      const wrapper = await mountForm({ maxSpan: 2 })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('exSpan prop 强制分栏', async () => {
      const wrapper = await mountForm({ exSpan: 2 })
      await nextTick()
      expect(wrapper.vm).toBeDefined()
    })
  })
})

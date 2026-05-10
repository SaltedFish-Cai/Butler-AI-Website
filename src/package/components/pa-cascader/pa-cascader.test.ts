/**
 * pa-cascader 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, computed } from 'vue'
import type { ComputedRef } from 'vue'

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: 'down_line' },
    customClass: { type: String, default: '' }
  },
  setup(props) {
    return () => h('i', {
      class: ['pa-icon-mock', props.customClass],
      onClick: () => {}
    })
  }
})

// Mock pa-tag component
const PaTagMock = defineComponent({
  name: 'PaTag',
  props: {
    tagList: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  emits: ['removeTag'],
  setup(props, { emit }) {
    return () => h('div', {
      class: 'pa-tag-mock'
    }, props.tagList.map((tag: any) => tag.label))
  }
})

// Mock pa-cascader-option component
const PaCascaderOptionMock = defineComponent({
  name: 'PaCascaderOption',
  props: {
    exOptions: { type: Array, default: () => [] },
    inValue: { type: [String, Number, Array], default: '' },
    isMultiple: { type: Boolean, default: false },
    isCheck: { type: Boolean, default: false },
    optionsHeight: { type: String, default: 'auto' }
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'pa-cascader-option-mock' }, slots.default?.())
  }
})

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: 'zh-CN', package: { cell: { selectPlaceholder: '请选择', empyt: '无数据', empytFind: '未找到' } } }
})) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>

/** 通用 mount 辅助函数 */
async function mountCascader(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaCascader } = await import('./pa-cascader.vue')
  return mount(PaCascader, {
    props,
    global: {
      stubs: {
        'pa-icon': PaIconMock,
        'pa-tag': PaTagMock,
        'pa-cascader-option': PaCascaderOptionMock,
        'pa-popover': true
      },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        'handleOptionClick': vi.fn(),
        ...provideOverride
      }
    }
  })
}

describe('pa-cascader 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-cascader', async () => {
      const wrapper = await mountCascader()
      expect(wrapper.find('div.pa-cascader').exists()).toBe(true)
    })
  })

  // ==================== v-model ====================
  describe('2. v-model 双向绑定', () => {
    it('单选初始值绑定', async () => {
      const wrapper = await mountCascader({ modelValue: '1' })
      expect(wrapper.vm.inValue).toBe('1')
    })

    it('多选初始值绑定', async () => {
      const wrapper = await mountCascader({ type: 'multiple-cascader', modelValue: ['1', '2'] })
      expect(wrapper.vm.inValue).toEqual(['1', '2'])
    })
  })

  // ==================== type prop ====================
  describe('3. type prop', () => {
    it('type=cascader 单选模式', async () => {
      const wrapper = await mountCascader()
      expect(wrapper.vm.isMultiple).toBe(false)
    })

    it('type=multiple-cascader 多选模式', async () => {
      const wrapper = await mountCascader({ type: 'multiple-cascader' })
      expect(wrapper.vm.isMultiple).toBe(true)
    })

    it('type=cascader-check 复选框模式', async () => {
      const wrapper = await mountCascader({ type: 'cascader-check' })
      expect(wrapper.vm.isCheck).toBe(true)
    })
  })

  // ==================== exOptions prop ====================
  describe('4. exOptions prop', () => {
    it('渲染选项列表', async () => {
      const options = [
        { label: '广东', value: '1', children: [{ label: '广州', value: '1-1' }] }
      ]
      const wrapper = await mountCascader({ exOptions: options })
      expect(wrapper.vm.exOptionsList.length).toBe(1)
    })

    it('flatExOptions 扁平化选项', async () => {
      const options = [
        { label: '广东', value: '1', children: [{ label: '广州', value: '1-1' }] }
      ]
      const wrapper = await mountCascader({ exOptions: options })
      expect(wrapper.vm.flatExOptions.length).toBeGreaterThan(1)
    })
  })

  // ==================== disabled prop ====================
  describe('5. disabled prop', () => {
    it('disabled=true 添加 is-disabled class', async () => {
      const wrapper = await mountCascader({ disabled: true })
      expect(wrapper.find('.pa-cascader').classes()).toContain('is-disabled')
    })
  })

  // ==================== display prop ====================
  describe('6. display prop 纯展示模式', () => {
    it('display=true 渲染展示模式', async () => {
      const wrapper = await mountCascader({
        display: true,
        modelValue: '1',
        exOptions: [{ label: '广东', value: '1' }]
      })
      expect(wrapper.find('.pa-display-style').exists()).toBe(true)
    })

    it('display=true 无选中值显示 --', async () => {
      const wrapper = await mountCascader({
        display: true,
        modelValue: '',
        exOptions: [{ label: '广东', value: '1' }]
      })
      expect(wrapper.find('.pa-display-value_content').text()).toContain('--')
    })
  })

  // ==================== displayValue prop ====================
  describe('7. displayValue prop', () => {
    it('直接显示 displayValue', async () => {
      const wrapper = await mountCascader({
        display: true,
        displayValue: '自定义显示'
      })
      expect(wrapper.find('.pa-display-value_content').text()).toContain('自定义显示')
    })
  })

  // ==================== contrastData prop ====================
  describe('8. contrastData prop 对比数据', () => {
    it('值不同时显示对比数据', async () => {
      const wrapper = await mountCascader({ modelValue: '1', contrastData: '2' })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })

    it('alwaysContrast=true 始终显示对比数据', async () => {
      const wrapper = await mountCascader({ modelValue: '1', contrastData: '1', alwaysContrast: true })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })
  })

  // ==================== class/style prop ====================
  describe('9. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountCascader({ class: 'custom-class' })
      expect(wrapper.find('.pa-cascader').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountCascader({ style: { color: 'red' } })
      const style = wrapper.find('.pa-cascader').attributes('style')
      expect(style).toContain('color')
    })
  })

  // ==================== title prop ====================
  describe('10. title prop', () => {
    it('title prop 设置成功', async () => {
      const wrapper = await mountCascader({ title: '地区' })
      expect(wrapper.props('title')).toBe('地区')
    })
  })

  // ==================== filterValue ====================
  describe('11. filterValue computed', () => {
    it('filterValue 默认空字符串', async () => {
      const wrapper = await mountCascader()
      expect(wrapper.vm.filterValue).toBe('')
    })
  })

  // ==================== inputValue computed ====================
  describe('12. inputValue computed', () => {
    it('非聚焦时显示选中标签', async () => {
      const wrapper = await mountCascader({
        modelValue: '1',
        exOptions: [{ label: '广东', value: '1' }]
      })
      expect(wrapper.vm.inputValue).toContain('广东')
    })
  })
})

/**
 * pa-select 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, computed, ref } from 'vue'
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

// Mock pa-scrollbar component
const PaScrollbarMock = defineComponent({
  name: 'PaScrollbar',
  props: {
    useBackTop: { type: Boolean, default: true },
    useShadow: { type: Boolean, default: true }
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'pa-scrollbar-mock' }, slots.default?.())
  }
})

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: 'zh-CN', package: { cell: { selectPlaceholder: '请选择', empyt: '无数据', empytFind: '未找到' } } }
})) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>

/** 通用 mount 辅助函数 */
async function mountSelect(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaSelect } = await import('./pa-select.vue')
  return mount(PaSelect, {
    props,
    global: {
      stubs: {
        'pa-icon': PaIconMock,
        'pa-popover': true,
        'pa-tag': PaTagMock,
        'pa-scrollbar': PaScrollbarMock
      },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  })
}

describe('pa-select 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-select', async () => {
      const wrapper = await mountSelect()
      expect(wrapper.find('div.pa-select').exists()).toBe(true)
    })
  })

  // ==================== v-model ====================
  describe('2. v-model 双向绑定', () => {
    it('单选初始值绑定', async () => {
      const wrapper = await mountSelect({ modelValue: 'apple' })
      expect(wrapper.vm.inValue).toBe('apple')
    })

    it('多选初始值绑定', async () => {
      const wrapper = await mountSelect({ type: 'multiple-select', modelValue: ['apple', 'banana'] })
      expect(wrapper.vm.inValue).toEqual(['apple', 'banana'])
    })
  })

  // ==================== type prop ====================
  describe('3. type prop', () => {
    it('type=select 单选模式', async () => {
      const wrapper = await mountSelect()
      expect(wrapper.vm.isMultiple).toBe(false)
    })

    it('type=multiple-select 多选模式', async () => {
      const wrapper = await mountSelect({ type: 'multiple-select' })
      expect(wrapper.vm.isMultiple).toBe(true)
    })

    it('type=online-select 在线选择模式', async () => {
      const wrapper = await mountSelect({ type: 'online-select' })
      expect(wrapper.vm.isOnlineSelect).toBe(true)
    })
  })

  // ==================== exOptions prop ====================
  describe('4. exOptions prop', () => {
    it('渲染选项列表', async () => {
      const wrapper = await mountSelect({
        exOptions: [
          { label: '苹果', value: 'apple' },
          { label: '香蕉', value: 'banana' }
        ]
      })
      expect(wrapper.vm.exOptionsList.length).toBe(2)
    })

    it('多语言 label', async () => {
      const wrapper = await mountSelect({
        exOptions: [{ label: { 'zh-CN': '苹果', 'en-US': 'Apple' }, value: 'apple' }]
      })
      expect(wrapper.vm.exOptionsList[0].label).toEqual({ 'zh-CN': '苹果', 'en-US': 'Apple' })
    })
  })

  // ==================== disabled prop ====================
  describe('5. disabled prop', () => {
    it('disabled=true 添加 is-disabled class', async () => {
      const wrapper = await mountSelect({ disabled: true })
      expect(wrapper.find('.pa-select').classes()).toContain('is-disabled')
    })
  })

  // ==================== display prop ====================
  describe('6. display prop 纯展示模式', () => {
    it('display=true 渲染展示模式', async () => {
      const wrapper = await mountSelect({
        display: true,
        modelValue: 'apple',
        exOptions: [{ label: '苹果', value: 'apple' }]
      })
      expect(wrapper.find('.pa-display-style').exists()).toBe(true)
    })

    it('display=true 无选中值显示 --', async () => {
      const wrapper = await mountSelect({
        display: true,
        modelValue: '',
        exOptions: [{ label: '苹果', value: 'apple' }]
      })
      expect(wrapper.find('.pa-display-value_content').text()).toContain('--')
    })
  })

  // ==================== displayValue prop ====================
  describe('7. displayValue prop', () => {
    it('直接显示 displayValue', async () => {
      const wrapper = await mountSelect({
        display: true,
        displayValue: '自定义显示'
      })
      expect(wrapper.find('.pa-display-value_content').text()).toContain('自定义显示')
    })
  })

  // ==================== contrastData prop ====================
  describe('8. contrastData prop 对比数据', () => {
    it('值不同时显示对比数据', async () => {
      const wrapper = await mountSelect({ modelValue: 'apple', contrastData: 'banana' })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })
  })

  // ==================== class/style prop ====================
  describe('9. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountSelect({ class: 'custom-class' })
      expect(wrapper.find('.pa-select').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountSelect({ style: { color: 'blue' } })
      const style = wrapper.find('.pa-select').attributes('style')
      expect(style).toContain('color')
    })
  })

  // ==================== title prop ====================
  describe('10. title prop', () => {
    it('title prop 设置成功', async () => {
      const wrapper = await mountSelect({ title: '水果' })
      expect(wrapper.props('title')).toBe('水果')
    })
  })

  // ==================== clearable prop ====================
  describe('11. clearable prop', () => {
    it('clearable 默认值 true', async () => {
      const wrapper = await mountSelect()
      expect(wrapper.props('clearable')).toBe(true)
    })

    it('clearable=false 禁用清除', async () => {
      const wrapper = await mountSelect({ clearable: false })
      expect(wrapper.props('clearable')).toBe(false)
    })
  })

  // ==================== inputValue computed ====================
  describe('12. inputValue computed', () => {
    it('非聚焦时显示选中标签', async () => {
      const wrapper = await mountSelect({
        modelValue: 'apple',
        exOptions: [{ label: '苹果', value: 'apple' }]
      })
      expect(wrapper.vm.inputValue).toContain('苹果')
    })
  })

  // ==================== tagValue computed ====================
  describe('13. tagValue computed', () => {
    it('多选模式显示选中标签', async () => {
      const wrapper = await mountSelect({
        type: 'multiple-select',
        modelValue: ['apple'],
        exOptions: [{ label: '苹果', value: 'apple' }]
      })
      expect(wrapper.vm.tagValue.length).toBe(1)
    })
  })
})

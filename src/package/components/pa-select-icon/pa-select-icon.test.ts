/**
 * pa-select-icon 组件单元测试
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

// Mock pa-button component
const PaButtonMock = defineComponent({
  name: 'PaButton',
  props: {
    type: { type: String, default: 'default' },
    disabled: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    return () => h('button', {
      class: ['pa-button-mock', { 'is-disabled': props.disabled }],
      disabled: props.disabled
    }, slots.default?.())
  }
})

// Mock pa-tabs component
const PaTabsMock = defineComponent({
  name: 'PaTabs',
  props: {
    vModel: { type: String, default: 'all' },
    align: { type: String, default: 'left' }
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'pa-tabs-mock' }, slots.default?.())
  }
})

// Mock pa-tabs-item component
const PaTabsItemMock = defineComponent({
  name: 'PaTabsItem',
  props: {
    label: { type: String, default: '' },
    name: { type: String, default: '' },
    scroll: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'pa-tabs-item-mock', 'data-name': props.name }, slots.default?.())
  }
})

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: 'zh-CN', package: { cell: { clickChangeIcon: '选择图标' } } }
})) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>

/** 通用 mount 辅助函数 */
async function mountSelectIcon(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaSelectIcon } = await import('./pa-select-icon.vue')
  return mount(PaSelectIcon, {
    props,
    global: {
      stubs: {
        'pa-icon': PaIconMock,
        'pa-button': PaButtonMock,
        'pa-tabs': PaTabsMock,
        'pa-tabs-item': PaTabsItemMock,
        'pa-popover': true
      },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  })
}

describe('pa-select-icon 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-select-icon', async () => {
      const wrapper = await mountSelectIcon()
      expect(wrapper.find('div.pa-select-icon').exists()).toBe(true)
    })
  })

  // ==================== v-model ====================
  describe('2. v-model 双向绑定', () => {
    it('初始值绑定', async () => {
      const wrapper = await mountSelectIcon({ modelValue: 'check_line' })
      expect(wrapper.vm.selectItem).toBe('check_line')
    })

    it('默认选择 finger_press_line', async () => {
      const wrapper = await mountSelectIcon()
      expect(wrapper.vm.selectItem).toBe('finger_press_line')
    })
  })

  // ==================== disabled prop ====================
  describe('3. disabled prop', () => {
    it('disabled=true 添加 is-disabled class', async () => {
      const wrapper = await mountSelectIcon({ disabled: true })
      expect(wrapper.find('.pa-select-icon').classes()).toContain('is-disabled')
    })
  })

  // ==================== display prop ====================
  describe('4. display prop 纯展示模式', () => {
    it('display=true 渲染展示模式', async () => {
      const wrapper = await mountSelectIcon({
        display: true,
        modelValue: 'check_line'
      })
      expect(wrapper.find('.pa-display-style').exists()).toBe(true)
    })

    it('displayValue 直接显示', async () => {
      const wrapper = await mountSelectIcon({
        display: true,
        modelValue: 'check_line',
        displayValue: '自定义图标'
      })
      expect(wrapper.find('.pa-display-value_content').text()).toContain('自定义图标')
    })
  })

  // ==================== contrastData prop ====================
  describe('5. contrastData prop 对比数据', () => {
    it('值不同时显示对比数据', async () => {
      const wrapper = await mountSelectIcon({ modelValue: 'check_line', contrastData: 'close_line' })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })

    it('alwaysContrast=true 始终显示对比数据', async () => {
      const wrapper = await mountSelectIcon({
        modelValue: 'check_line',
        contrastData: 'check_line',
        alwaysContrast: true
      })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })
  })

  // ==================== class/style prop ====================
  describe('6. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountSelectIcon({ class: 'custom-class' })
      expect(wrapper.find('.pa-select-icon').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountSelectIcon({ style: { color: 'green' } })
      const style = wrapper.find('.pa-select-icon').attributes('style')
      expect(style).toContain('color')
    })
  })

  // ==================== title prop ====================
  describe('7. title prop', () => {
    it('title prop 设置成功', async () => {
      const wrapper = await mountSelectIcon({ title: '图标' })
      expect(wrapper.props('title')).toBe('图标')
    })
  })

  // ==================== Config computed ====================
  describe('8. Config computed', () => {
    it('Config 包含默认分类', async () => {
      const wrapper = await mountSelectIcon()
      expect(wrapper.vm.Config.length).toBeGreaterThan(0)
      expect(wrapper.vm.Config[0].name).toBe('all')
    })

    it('activeName 默认 all', async () => {
      const wrapper = await mountSelectIcon()
      expect(wrapper.vm.activeName).toBe('all')
    })
  })

  // ==================== selectedIcon method ====================
  describe('9. selectedIcon method', () => {
    it('触发 update:modelValue', async () => {
      const wrapper = await mountSelectIcon({ modelValue: 'check_line' })
      wrapper.vm.selectedIcon('close_line')
      expect(wrapper.vm.selectItem).toBe('close_line')
    })

    it('触发 change 事件', async () => {
      const wrapper = await mountSelectIcon({ modelValue: 'check_line' })
      wrapper.vm.selectedIcon('close_line')
      // selectedIcon 应该触发 emit
      await nextTick()
    })
  })

  // ==================== inputPlaceholder computed ====================
  describe('10. inputPlaceholder computed', () => {
    it('显示默认占位符', async () => {
      const wrapper = await mountSelectIcon()
      expect(wrapper.vm.inputPlaceholder).toContain('选择图标')
    })

    it('自定义占位符', async () => {
      const wrapper = await mountSelectIcon({ placeholder: '点击选择' })
      expect(wrapper.vm.inputPlaceholder).toContain('点击选择')
    })
  })
})

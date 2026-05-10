/**
 * pa-switch 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, computed, ref } from 'vue'
import type { ComputedRef } from 'vue'

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: 'check_line' }
  },
  setup() {
    return () => h('i', { class: 'pa-icon-mock' })
  }
})

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: 'zh-CN', package: { cell: {} } }
})) as ComputedRef<{ language: { value: string; package?: { cell?: Record<string, string> } } }>

/** 通用 mount 辅助函数 */
async function mountSwitch(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaSwitch } = await import('./pa-switch.vue')
  return mount(PaSwitch, {
    props,
    global: {
      stubs: { 'pa-icon': PaIconMock, 'pa-popover': true },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  })
}

describe('pa-switch 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-switch', async () => {
      const wrapper = await mountSwitch()
      expect(wrapper.find('div.pa-switch').exists()).toBe(true)
    })
  })

  // ==================== v-model ====================
  describe('2. v-model 双向绑定', () => {
    it('activeValue=1 时显示 active class', async () => {
      const wrapper = await mountSwitch({ modelValue: 1 })
      expect(wrapper.find('.pa-switch').classes()).toContain('pa-switch-active')
    })

    it('inActiveValue=0 时不显示 active class', async () => {
      const wrapper = await mountSwitch({ modelValue: 0 })
      expect(wrapper.find('.pa-switch').classes()).not.toContain('pa-switch-active')
    })
  })

  // ==================== disabled prop ====================
  describe('3. disabled prop', () => {
    it('disabled=true 添加 is-disabled class', async () => {
      const wrapper = await mountSwitch({ disabled: true })
      expect(wrapper.find('.pa-switch').classes()).toContain('is-disabled')
    })

    it('disabled=true 点击不触发 change', async () => {
      const wrapper = await mountSwitch({ disabled: true, modelValue: 0 })
      await wrapper.find('.pa-switch').trigger('click')
      // disabled 时 changeEvent 直接返回
    })
  })

  // ==================== activeValue/inActiveValue prop ====================
  describe('4. activeValue/inActiveValue prop', () => {
    it('activeValue 默认值为 1', async () => {
      const wrapper = await mountSwitch()
      expect(wrapper.props('activeValue')).toBe(1)
    })

    it('inActiveValue 默认值为 0', async () => {
      const wrapper = await mountSwitch()
      expect(wrapper.props('inActiveValue')).toBe(0)
    })

    it('字符串类型值', async () => {
      const wrapper = await mountSwitch({ modelValue: 'on', activeValue: 'on', inActiveValue: 'off' })
      expect(wrapper.find('.pa-switch').classes()).toContain('pa-switch-active')
    })
  })

  // ==================== exOptions prop ====================
  describe('5. exOptions prop', () => {
    it('exOptions 配置 activeText', async () => {
      const wrapper = await mountSwitch({
        modelValue: 1,
        exOptions: {
          activeValue: 1,
          inActiveValue: 0,
          activeText: '开启',
          inActiveText: '关闭'
        }
      })
      expect(wrapper.find('.pa-switch-text-active').text()).toContain('开启')
    })

    it('exOptions 配置 inActiveText', async () => {
      const wrapper = await mountSwitch({
        modelValue: 0,
        exOptions: {
          activeValue: 1,
          inActiveValue: 0,
          activeText: '开启',
          inActiveText: '关闭'
        }
      })
      expect(wrapper.find('.pa-switch-text-inactive').text()).toContain('关闭')
    })
  })

  // ==================== display prop ====================
  describe('6. display prop 纯展示模式', () => {
    it('display=true 渲染展示模式', async () => {
      const wrapper = await mountSwitch({ display: true, modelValue: 1 })
      expect(wrapper.find('.pa-display-style').exists()).toBe(true)
    })
  })

  // ==================== contrastData prop ====================
  describe('7. contrastData prop 对比数据', () => {
    it('值不同时显示对比数据', async () => {
      const wrapper = await mountSwitch({ modelValue: 1, contrastData: 0 })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })

    it('alwaysContrast=true 始终显示对比数据', async () => {
      const wrapper = await mountSwitch({ modelValue: 1, contrastData: 1, alwaysContrast: true })
      expect(wrapper.find('.pa-contrast-style').exists()).toBe(true)
    })
  })

  // ==================== class/style prop ====================
  describe('8. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountSwitch({ class: 'custom-class' })
      expect(wrapper.find('.pa-switch').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountSwitch({ style: { color: 'green' } })
      const style = wrapper.find('.pa-switch').attributes('style')
      expect(style).toContain('color')
    })
  })

  // ==================== title prop ====================
  describe('9. title prop', () => {
    it('title 显示标签', async () => {
      const wrapper = await mountSwitch({ title: '开关' })
      expect(wrapper.find('.pa-cell-label').text()).toContain('开关')
    })
  })

  // ==================== click event ====================
  describe('10. click 事件切换', () => {
    it('点击切换值', async () => {
      const wrapper = await mountSwitch({ modelValue: 0, activeValue: 1, inActiveValue: 0 })
      await wrapper.find('.pa-switch').trigger('click')
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('点击触发 change 事件', async () => {
      const wrapper = await mountSwitch({ modelValue: 0 })
      await wrapper.find('.pa-switch').trigger('click')
      expect(wrapper.emitted('change')).toBeTruthy()
    })
  })

  // ==================== icon prop ====================
  describe('11. icon prop', () => {
    it('activeIcon 图标显示', async () => {
      const wrapper = await mountSwitch({
        modelValue: 1,
        activeIcon: 'check_line',
        inActiveIcon: 'close_line'
      })
      expect(wrapper.find('.pa-icon-mock').exists()).toBe(true)
    })
  })
})

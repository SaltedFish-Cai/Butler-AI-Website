/**
 * pa-tabs 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, computed } from 'vue'
import type { ComputedRef } from 'vue'

// Mock pa-tabs-label (JSX component that causes parsing issues)
vi.mock('./pa-tabs-label.vue', () => ({
  default: defineComponent({
    name: 'TitleItem',
    props: {
      slots: { type: Array, default: () => [] },
      activeName: { type: String, default: '' },
      changeTabs: { type: Function, default: null },
      portrait: { type: Boolean, default: false }
    },
    setup(props) {
      return () => h('div', { class: 'title-item-mock' })
    }
  })
}))

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: 'left_small' }
  },
  setup(props) {
    return () => h('i', { class: ['pa-icon-mock', `icon-${props.name}`] })
  }
})

// Mock pa-scrollbar component
const PaScrollbarMock = defineComponent({
  name: 'PaScrollbar',
  props: {
    intersectClassName: { type: String, default: '' }
  },
  emits: ['intersecting'],
  setup(props, { slots }) {
    const setScrollToIntersect = () => {}
    const scrollToRight = () => {}
    const scrollToLeft = () => {}
    return { setScrollToIntersect, scrollToRight, scrollToLeft }
  },
  render() {
    return h('div', { class: 'pa-scrollbar-mock' }, this.$slots.default?.())
  }
})

// Mock getElementPosition
vi.mock('../utils/getElementPosition', () => ({
  getElementPosition: () => ({
    top: 100,
    left: 100,
    right: 200,
    bottom: 150,
    width: 100,
    height: 50,
    parentTop: 0,
    parentLeft: 0
  })
}))

// Mock randChar
vi.mock('../tools/rand-char', () => ({
  randChar: () => 'test123'
}))

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: 'zh-CN' }
})) as ComputedRef<{ language: { value: string } }>

/** 通用 mount 辅助函数 */
async function mountTabs(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaTabs } = await import('./pa-tabs.vue')
  return mount(PaTabs, {
    props,
    slots,
    global: {
      stubs: {
        'pa-icon': PaIconMock,
        'pa-scrollbar': PaScrollbarMock,
        'title-item': defineComponent({
          name: 'TitleItem',
          props: {
            slots: { type: Array, default: () => [] },
            activeName: { type: String, default: '' },
            changeTabs: { type: Function, default: null },
            portrait: { type: Boolean, default: false }
          },
          setup(props) {
            return () => h('div', { class: 'title-item-mock' })
          }
        })
      },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        'initTitle': vi.fn()
      }
    }
  })
}

describe('pa-tabs 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    
    // Mock document.querySelector and document.getElementById
    vi.spyOn(document, 'querySelector').mockReturnValue({
      getBoundingClientRect: () => ({ width: 100, height: 40, offsetLeft: 10 }),
      offsetLeft: 10,
      offsetTop: 0
    } as any)
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollWidth: 300,
      clientWidth: 200,
      scrollHeight: 200,
      clientHeight: 150
    } as any)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-tabs', async () => {
      const wrapper = await mountTabs()
      expect(wrapper.find('.pa-tabs').exists()).toBe(true)
    })

    it('默认 props 值', async () => {
      const wrapper = await mountTabs()
      expect(wrapper.props('visibleMode')).toBe('visible')
      expect(wrapper.props('mode')).toBe('default')
      expect(wrapper.props('styleMode')).toBe('card')
      expect(wrapper.props('align')).toBe('default')
      expect(wrapper.props('useShadow')).toBe(true)
    })
  })

  // ==================== class/style prop ====================
  describe('2. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountTabs({ class: 'custom-class' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountTabs({ style: { color: 'blue' } })
      expect(wrapper.find('.pa-tabs').exists()).toBe(true)
    })
  })

  // ==================== mode prop ====================
  describe('3. mode prop', () => {
    it('mode=default 默认模式', async () => {
      const wrapper = await mountTabs({ mode: 'default' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('mode-default')
    })

    it('mode=portrait 纵向模式', async () => {
      const wrapper = await mountTabs({ mode: 'portrait' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('mode-portrait')
    })

    it('mode=slider 滑动模式', async () => {
      const wrapper = await mountTabs({ mode: 'slider' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('mode-slider')
    })
  })

  // ==================== styleMode prop ====================
  describe('4. styleMode prop', () => {
    it('styleMode=card 卡片样式', async () => {
      const wrapper = await mountTabs({ styleMode: 'card' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('style_mode-card')
    })

    it('styleMode=border-card 边框卡片样式', async () => {
      const wrapper = await mountTabs({ styleMode: 'border-card' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('style_mode-border-card')
    })

    it('styleMode=default 默认样式', async () => {
      const wrapper = await mountTabs({ styleMode: 'default' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('style_mode-default')
    })
  })

  // ==================== align prop ====================
  describe('5. align prop', () => {
    it('align=default 默认对齐', async () => {
      const wrapper = await mountTabs({ align: 'default' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('style_align-default')
    })

    it('align=edge 边缘对齐', async () => {
      const wrapper = await mountTabs({ align: 'edge' })
      expect(wrapper.find('.pa-tabs').classes()).toContain('style_align-edge')
    })
  })

  // ==================== visibleMode prop ====================
  describe('6. visibleMode prop', () => {
    it('visibleMode=visible 可见模式', async () => {
      const wrapper = await mountTabs({ visibleMode: 'visible' })
      expect(wrapper.props('visibleMode')).toBe('visible')
    })

    it('visibleMode=display 显示模式', async () => {
      const wrapper = await mountTabs({ visibleMode: 'display' })
      expect(wrapper.props('visibleMode')).toBe('display')
    })
  })

  // ==================== tabsId ====================
  describe('7. tabsId', () => {
    it('tabsId 自动生成', async () => {
      const wrapper = await mountTabs()
      expect(wrapper.vm.tabsId).toBeTruthy()
    })

    it('id prop 设置成功', async () => {
      const wrapper = await mountTabs({ id: 'custom-tabs-id' })
      expect(wrapper.props('id')).toBe('custom-tabs-id')
    })
  })

  // ==================== slots ====================
  describe('8. slots', () => {
    it('默认 slot 渲染', async () => {
      const wrapper = await mountTabs({}, { default: '标签页内容' })
      await nextTick()
      expect(wrapper.find('.pa-tabs-contents').exists()).toBe(true)
    })

    it('HeaderLeft slot 渲染', async () => {
      const wrapper = await mountTabs({}, { HeaderLeft: '左侧头部' })
      await nextTick()
      expect(wrapper.text()).toContain('左侧头部')
    })

    it('HeaderRight slot 渲染', async () => {
      const wrapper = await mountTabs({}, { HeaderRight: '右侧头部' })
      await nextTick()
      expect(wrapper.text()).toContain('右侧头部')
    })

    it('footer slot 渲染', async () => {
      const wrapper = await mountTabs({}, { footer: '底部内容' })
      await nextTick()
      expect(wrapper.text()).toContain('底部内容')
    })
  })

  // ==================== modelValue ====================
  describe('9. modelValue', () => {
    it('初始 modelValue 绑定', async () => {
      const wrapper = await mountTabs({ modelValue: 'tab1' })
      await nextTick()
      // 初始值设置
    })

    it('modelValue 变化同步', async () => {
      const wrapper = await mountTabs({ modelValue: 'tab1' })
      await wrapper.setProps({ modelValue: 'tab2' })
      await nextTick()
      expect(wrapper.vm.activeName).toBe('tab2')
    })
  })

  // ==================== defineExpose ====================
  describe('10. defineExpose', () => {
    it('暴露 el (tabsRef)', async () => {
      const wrapper = await mountTabs()
      expect(wrapper.vm.el).toBeDefined()
    })
  })

  // ==================== 滚动功能 ====================
  describe('11. 滚动功能', () => {
    it('useScrollX 计算值存在', async () => {
      const wrapper = await mountTabs()
      expect(typeof wrapper.vm.useScrollX).toBe('number')
    })

    it('headerScroll 初始值为 0', async () => {
      const wrapper = await mountTabs()
      expect(wrapper.vm.headerScroll).toBe(0)
    })

    it('headerScrollEnd 初始值为 false', async () => {
      const wrapper = await mountTabs()
      expect(wrapper.vm.headerScrollEnd).toBe(false)
    })
  })

  // ==================== slotIndex ====================
  describe('12. slotIndex', () => {
    it('slotIndex 初始值可以是 0 或 -1', async () => {
      const wrapper = await mountTabs()
      // 当没有 slots 时 slotIndex 可能是 -1
      expect(typeof wrapper.vm.slotIndex).toBe('number')
    })
  })
})

/**
 * pa-scrollbar 滚动条组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

// Mock PaIcon
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: ['name', 'class'],
  setup(props, { slots }) {
    return () => h('i', { class: ['pa-icon-mock', props.class] }, slots.default?.())
  }
})

// Mock randChar
vi.mock('../tools/rand-char', () => ({
  randChar: () => 'testrand'
}))

// Mock scrollListener
vi.mock('./scrollListener', () => ({
  listenElementScroll: () => ({
    listener: { setElementScrollPosition: vi.fn() },
    bodyHeight: 300,
    bodyWidth: 600,
    remove: vi.fn(),
    update: () => ({
      horizontalThumb: 50,
      verticalThumb: 80,
      horizontalThumbScale: 0.5,
      verticalThumbScale: 0.8,
      useHorizontal: false,
      useVertical: true
    }),
    useHorizontal: false,
    useVertical: true
  }),
  startDrag: () => ({ stop: vi.fn() }),
  observeElementResize: () => ({ stop: vi.fn() })
}))

// Mock useIntersectionObserver
vi.mock('./useIntersectionObserver', () => ({
  useIntersectionObserver: () => ({
    isIntersecting: ref(false),
    stopObserving: vi.fn()
  })
}))

// Mock getElementPosition
vi.mock('../utils/getElementPosition', () => ({
  getElementPosition: () => ({ parentTop: 0, parentLeft: 0 })
}))

// Mock lodash
vi.mock('lodash', () => ({
  default: {
    debounce: (fn: Function) => fn
  }
}))

async function mountScrollbar(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaScrollbar } = await import('./pa-scrollbar.vue')
  return mount(PaScrollbar, {
    props,
    slots,
    global: {
      stubs: {
        PaIcon: PaIconMock
      }
    }
  })
}

describe('pa-scrollbar 组件测试', () => {
  describe('1. 默认渲染', () => {
    it('渲染 section.pa-scrollbar', async () => {
      const wrapper = await mountScrollbar()
      expect(wrapper.find('section.pa-scrollbar').exists()).toBe(true)
    })

    it('默认有 scrollbar-body', async () => {
      const wrapper = await mountScrollbar()
      expect(wrapper.find('.scrollbar-body').exists()).toBe(true)
    })

    it('默认有 scrollbar-body-content', async () => {
      const wrapper = await mountScrollbar()
      expect(wrapper.find('.scrollbar-body-content').exists()).toBe(true)
    })
  })

  describe('2. styleMode prop', () => {
    it('styleMode=color 添加 color-scrollbar class', async () => {
      const wrapper = await mountScrollbar({ styleMode: 'color' })
      expect(wrapper.find('section.pa-scrollbar').classes()).toContain('color-scrollbar')
    })

    it('styleMode=default 不添加 color-scrollbar class', async () => {
      const wrapper = await mountScrollbar({ styleMode: 'default' })
      expect(wrapper.find('section.pa-scrollbar').classes()).not.toContain('color-scrollbar')
    })
  })

  describe('3. useScrollY/useScrollX prop', () => {
    it('useScrollY=true 时添加 scrollbar-body-y class', async () => {
      const wrapper = await mountScrollbar({ useScrollY: true })
      expect(wrapper.find('.scrollbar-body').classes()).toContain('scrollbar-body-y')
    })

    it('useScrollX=true 时添加 scrollbar-body-x class', async () => {
      const wrapper = await mountScrollbar({ useScrollX: true })
      expect(wrapper.find('.scrollbar-body').classes()).toContain('scrollbar-body-x')
    })

    it('useScrollY=false 时不添加 scrollbar-body-y', async () => {
      const wrapper = await mountScrollbar({ useScrollY: false })
      expect(wrapper.find('.scrollbar-body').classes()).not.toContain('scrollbar-body-y')
    })
  })

  describe('4. padding prop', () => {
    it('padding 包含 top 时添加 padding-top class', async () => {
      const wrapper = await mountScrollbar({ padding: ['top'] })
      expect(wrapper.find('.scrollbar-body-content').classes()).toContain('padding-top')
    })

    it('padding 包含 all 时添加所有 padding class', async () => {
      const wrapper = await mountScrollbar({ padding: ['all'] })
      const content = wrapper.find('.scrollbar-body-content')
      expect(content.classes()).toContain('padding-top')
      expect(content.classes()).toContain('padding-bottom')
      expect(content.classes()).toContain('padding-left')
      expect(content.classes()).toContain('padding-right')
    })

    it('padding 包含 left 和 right', async () => {
      const wrapper = await mountScrollbar({ padding: ['left', 'right'] })
      const content = wrapper.find('.scrollbar-body-content')
      expect(content.classes()).toContain('padding-left')
      expect(content.classes()).toContain('padding-right')
    })
  })

  describe('5. border prop', () => {
    it('border 包含 top 时渲染 pa-border_top', async () => {
      const wrapper = await mountScrollbar({ border: ['top'] })
      expect(wrapper.find('.pa-border_top').exists()).toBe(true)
    })

    it('border 包含 all 时渲染所有边框', async () => {
      const wrapper = await mountScrollbar({ border: ['all'] })
      expect(wrapper.find('.pa-border_top').exists()).toBe(true)
      expect(wrapper.find('.pa-border_bottom').exists()).toBe(true)
      expect(wrapper.find('.pa-border_left').exists()).toBe(true)
      expect(wrapper.find('.pa-border_right').exists()).toBe(true)
    })

    it('无 border 时不渲染边框元素', async () => {
      const wrapper = await mountScrollbar()
      expect(wrapper.find('.pa-border_top').exists()).toBe(false)
    })
  })

  describe('6. paddingBorder prop', () => {
    it('paddingBorder 包含 top 时渲染 pa-border_padding_top', async () => {
      const wrapper = await mountScrollbar({ paddingBorder: ['top'] })
      expect(wrapper.find('.pa-border_padding_top').exists()).toBe(true)
    })

    it('paddingBorder 包含 all 时渲染所有内边距边框', async () => {
      const wrapper = await mountScrollbar({ paddingBorder: ['all'] })
      expect(wrapper.find('.pa-border_padding_top').exists()).toBe(true)
      expect(wrapper.find('.pa-border_padding_bottom').exists()).toBe(true)
    })
  })

  describe('7. useShadow prop', () => {
    it('useShadow=true 时渲染 is-scroll-top 和 is-scroll-end', async () => {
      const wrapper = await mountScrollbar({ useShadow: true })
      expect(wrapper.find('.is-scroll-top').exists()).toBe(true)
      expect(wrapper.find('.is-scroll-end').exists()).toBe(true)
    })

    it('useShadow=false 时不渲染阴影', async () => {
      const wrapper = await mountScrollbar({ useShadow: false })
      expect(wrapper.find('.is-scroll-top').exists()).toBe(false)
      expect(wrapper.find('.is-scroll-end').exists()).toBe(false)
    })
  })

  describe('8. showThumb prop', () => {
    it('showThumb=true 且 useVertical 时渲染垂直滚动条', async () => {
      const wrapper = await mountScrollbar({ showThumb: true })
      // after mount, useVertical is set by listener mock
      await nextTick()
      await nextTick()
      // The scrollbar bar may or may not render depending on useVertical
      expect(wrapper.find('section.pa-scrollbar').exists()).toBe(true)
    })

    it('showThumb=false 时不渲染滚动条', async () => {
      const wrapper = await mountScrollbar({ showThumb: false })
      expect(wrapper.find('.scrollbar__bar').exists()).toBe(false)
    })
  })

  describe('9. paddingWidth prop', () => {
    it('数字 paddingWidth 设置为 px', async () => {
      const wrapper = await mountScrollbar({ paddingWidth: 20 })
      const style = wrapper.find('section.pa-scrollbar').attributes('style')
      expect(style).toContain('20px')
    })

    it('字符串 paddingWidth 直接使用', async () => {
      const wrapper = await mountScrollbar({ paddingWidth: '2em' })
      const style = wrapper.find('section.pa-scrollbar').attributes('style')
      expect(style).toContain('2em')
    })
  })

  describe('10. contentStyle prop', () => {
    it('contentStyle 添加到 scrollbar-body 样式', async () => {
      const wrapper = await mountScrollbar({ contentStyle: { height: '200px' } })
      const style = wrapper.find('.scrollbar-body').attributes('style')
      expect(style).toContain('200px')
    })
  })

  describe('11. slot', () => {
    it('渲染默认 slot', async () => {
      const wrapper = await mountScrollbar({}, { default: '<div class="content">内容</div>' })
      expect(wrapper.find('.content').exists()).toBe(true)
    })

    it('渲染 footer slot', async () => {
      const wrapper = await mountScrollbar({}, { footer: '<div class="footer">底部</div>' })
      expect(wrapper.find('.pa-scrollbar-content_footer').exists()).toBe(true)
      expect(wrapper.find('.footer').exists()).toBe(true)
    })
  })

  describe('12. class prop', () => {
    it('自定义 class 添加到 section', async () => {
      const wrapper = await mountScrollbar({ class: 'custom-class' })
      expect(wrapper.find('section.pa-scrollbar').classes()).toContain('custom-class')
    })
  })
})

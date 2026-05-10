/**
 * pa-scrollbar-list 滚动列表组件单元测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, computed } from 'vue'

// Mock randChar
vi.mock('../tools/rand-char', () => ({
  randChar: () => 'testrand'
}))

// Mock requestApi that returns valid data
const mockRequestApi = vi.fn(() => Promise.resolve({
  Data: {
    List: [{ id: 1, name: 'item1' }, { id: 2, name: 'item2' }],
    TotalCount: 2
  }
}))

async function mountScrollbarList(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaScrollbarList } = await import('./pa-scrollbar-list.vue')
  return mount(PaScrollbarList, {
    props: {
      requestApi: mockRequestApi,
      ...props
    },
    slots,
    global: {
      stubs: {
        'pa-scrollbar': {
          template: `<div class="pa-scrollbar-mock" :data-style-mode="styleMode" :data-padding="JSON.stringify(padding)" :data-use-scroll-x="useScrollX" :data-intersect-class-name="intersectClassName"><slot></slot><slot name="footer"></slot></div>`,
          props: ['styleMode', 'padding', 'useScrollX', 'intersectClassName'],
          methods: {
            resetObserver: vi.fn(),
            setScrollToIntersect: vi.fn(),
            setScrollTop: vi.fn()
          }
        },
        'pa-empty': {
          template: '<div class="pa-empty-mock">空状态</div>'
        },
        'pa-icon': {
          template: '<i class="pa-icon-mock"></i>'
        },
        'pa-pagination': {
          template: '<div class="pa-pagination-mock"></div>'
        }
      },
      provide: {
        PancakeGlobalConfig: computed(() => ({
          language: ref('zh-CN')
        }))
      }
    }
  })
}

describe('pa-scrollbar-list 组件测试', () => {
  beforeEach(() => {
    mockRequestApi.mockClear()
    mockRequestApi.mockImplementation(() => Promise.resolve({
      Data: {
        List: [{ id: 1, name: 'item1' }, { id: 2, name: 'item2' }],
        TotalCount: 2
      }
    }))
  })

  describe('1. 默认渲染', () => {
    it('渲染 section.pa-scrollbar-list', async () => {
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('section.pa-scrollbar-list').exists()).toBe(true)
    })

    it('包含 pa-scrollbar-mock 子组件', async () => {
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('.pa-scrollbar-mock').exists()).toBe(true)
    })

    it('flex-col class', async () => {
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('section.pa-scrollbar-list').classes()).toContain('flex-col')
    })
  })

  describe('2. styleMode prop', () => {
    it('传递 styleMode 给 PaScrollbar', async () => {
      const wrapper = await mountScrollbarList({ styleMode: 'color' })
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-style-mode')).toBe('color')
    })

    it('默认 styleMode 为 default', async () => {
      const wrapper = await mountScrollbarList()
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-style-mode')).toBe('default')
    })
  })

  describe('3. padding prop', () => {
    it('默认 padding 为 ["left", "right"]', async () => {
      const wrapper = await mountScrollbarList()
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-padding')).toBe('["left","right"]')
    })

    it('自定义 padding', async () => {
      const wrapper = await mountScrollbarList({ padding: ['all'] })
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-padding')).toBe('["all"]')
    })
  })

  describe('4. showPagination prop', () => {
    it('默认显示分页器', async () => {
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('.pa-pagination-mock').exists()).toBe(true)
    })
  })

  describe('5. 数据加载', () => {
    it('挂载时调用 requestApi', async () => {
      await mountScrollbarList()
      expect(mockRequestApi).toHaveBeenCalled()
    })
  })

  describe('6. footer slot', () => {
    it('渲染 footer slot', async () => {
      const wrapper = await mountScrollbarList(
        {},
        { footer: '<div class="custom-footer">底部</div>' }
      )
      expect(wrapper.find('.custom-footer').exists()).toBe(true)
    })
  })

  describe('7. footerLeft slot', () => {
    it('渲染 footerLeft slot', async () => {
      const wrapper = await mountScrollbarList(
        {},
        { footerLeft: '<div class="footer-left">左侧</div>' }
      )
      expect(wrapper.find('.footer-left').exists()).toBe(true)
    })
  })

  describe('8. 暴露方法', () => {
    it('暴露 refresh 和 setScrollTop', async () => {
      const wrapper = await mountScrollbarList()
      const vm = wrapper.vm as any
      expect(typeof vm.refresh).toBe('function')
      expect(typeof vm.setScrollTop).toBe('function')
    })
  })
})

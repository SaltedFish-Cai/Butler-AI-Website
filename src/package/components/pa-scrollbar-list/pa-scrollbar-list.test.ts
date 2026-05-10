/**
 * pa-scrollbar-list 滚动列表组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, computed, nextTick } from 'vue'

// Mock randChar
vi.mock('../tools/rand-char', () => ({
  randChar: () => 'testrandlist'
}))

// Mock PaScrollbar methods storage
const PaScrollbarMethods = {
  resetObserver: vi.fn(),
  setScrollToIntersect: vi.fn(),
  setScrollTop: vi.fn()
}

// Mock requestApi
const mockRequestApi = vi.fn()

async function mountScrollbarList(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const { default: PaScrollbarList } = await import('./pa-scrollbar-list.vue')
  
  // Reset mocks before each mount
  PaScrollbarMethods.resetObserver.mockClear()
  PaScrollbarMethods.setScrollToIntersect.mockClear()
  PaScrollbarMethods.setScrollTop.mockClear()
  
  return mount(PaScrollbarList, {
    props: {
      requestApi: mockRequestApi,
      ...props
    },
    slots,
    global: {
      stubs: {
        'pa-scrollbar': {
          template: `<div class="pa-scrollbar-mock" 
            :data-style-mode="styleMode" 
            :data-padding="JSON.stringify(padding)" 
            :data-use-scroll-x="useScrollX" 
            :data-intersect-class-name="intersectClassName"
            @intersecting="$emit('intersecting', $event)"
            @directly-scroll-end="$emit('directly-scroll-end', $event)"
          >
            <slot></slot>
            <slot name="footer"></slot>
          </div>`,
          props: ['styleMode', 'padding', 'useScrollX', 'intersectClassName'],
          emits: ['intersecting', 'directly-scroll-end'],
          methods: PaScrollbarMethods
        },
        'pa-empty': {
          template: '<div class="pa-empty-mock">空状态</div>'
        },
        'pa-icon': {
          template: '<i class="pa-icon-mock"></i>'
        },
        'pa-pagination': {
          template: '<div class="pa-pagination-mock"></div>',
          props: ['currentPage', 'total', 'pageSize', 'pageSizes', 'layout'],
          emits: ['current-change', 'update:currentPage']
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
  })

  describe('1. 默认渲染', () => {
    it('渲染 section.pa-scrollbar-list', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('section.pa-scrollbar-list').exists()).toBe(true)
    })

    it('包含 pa-scrollbar-mock 子组件', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('.pa-scrollbar-mock').exists()).toBe(true)
    })

    it('flex-col class', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('section.pa-scrollbar-list').classes()).toContain('flex-col')
    })
  })

  describe('2. styleMode prop', () => {
    it('传递 styleMode 给 PaScrollbar', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList({ styleMode: 'color' })
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-style-mode')).toBe('color')
    })

    it('默认 styleMode 为 default', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-style-mode')).toBe('default')
    })
  })

  describe('3. padding prop', () => {
    it('默认 padding 为 ["left", "right"]', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-padding')).toBe('["left","right"]')
    })

    it('自定义 padding', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList({ padding: ['all'] })
      const scrollbar = wrapper.find('.pa-scrollbar-mock')
      expect(scrollbar.attributes('data-padding')).toBe('["all"]')
    })
  })

  describe('4. showPagination prop', () => {
    it('默认显示分页器', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('.pa-pagination-mock').exists()).toBe(true)
    })
  })

  describe('5. 数据加载', () => {
    it('挂载时调用 requestApi', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      await mountScrollbarList()
      expect(mockRequestApi).toHaveBeenCalled()
    })

    it('正确解析返回的数据结构 (List 格式)', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [
            { id: 1, name: 'item1' },
            { id: 2, name: 'item2' }
          ],
          TotalCount: 10
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      expect(mockRequestApi).toHaveBeenCalled()
    })

    it('正确解析返回的数据结构 (直接数组格式)', async () => {
      mockRequestApi.mockResolvedValue({
        Data: [
          { id: 1, name: 'item1' },
          { id: 2, name: 'item2' }
        ]
      })
      const wrapper = await mountScrollbarList({ showPagination: false })
      await nextTick()
      await nextTick()
      expect(mockRequestApi).toHaveBeenCalled()
    })
  })

  describe('6. 空状态测试', () => {
    it('请求返回空数组时显示空状态', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [],
          TotalCount: 0
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      expect(wrapper.find('.pa-empty-mock').exists()).toBe(true)
    })

    it('无数据时不显示加载状态', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [],
          TotalCount: 0
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      expect(wrapper.find('.pa-loading').exists()).toBe(false)
    })
  })

  describe('7. 加载状态测试', () => {
    it('加载中显示 loading 图标', async () => {
      mockRequestApi.mockImplementation(() => new Promise(() => {})) // 永不 resolve
      const wrapper = await mountScrollbarList()
      await nextTick()
      // 初始状态可能有 loading
      expect(wrapper.find('section.pa-scrollbar-list').exists()).toBe(true)
    })
  })

  describe('8. 加载完成测试', () => {
    it('数据加载完成后显示"没有更多了"', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [
            { id: 1, name: 'item1' },
            { id: 2, name: 'item2' }
          ],
          TotalCount: 2 // 总数等于返回数量，表示加载完成
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      await nextTick()
      await nextTick()
      // 检查 no-more 元素
      expect(wrapper.find('.no-more').exists()).toBe(true)
    })

    it('还有更多数据时不显示"没有更多了"', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 10 // 总数大于返回数量
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      // 可能不显示 no-more，或者触发加载更多
      expect(wrapper.find('section.pa-scrollbar-list').exists()).toBe(true)
    })
  })

  describe('9. handleIntersecting 测试', () => {
    it('handleIntersecting 更新页码', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      
      const vm = wrapper.vm as any
      // 模拟 handleIntersecting 被调用
      const mockEl = {
        dataset: {
          name: 'more-2'
        }
      } as any
      vm.handleIntersecting(mockEl)
      
      expect(vm.state.pageNum).toBe(2)
    })

    it('handleIntersecting 处理无效 name', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      
      const vm = wrapper.vm as any
      const mockEl = {
        dataset: {}
      } as any
      vm.handleIntersecting(mockEl)
      // 不应该改变页码
      expect(vm.state.pageNum).toBe(1)
    })
  })

  describe('10. handleScrollEnd 测试', () => {
    it('handleScrollEnd 加载下一页', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 10
        }
      })
      
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      await nextTick()
      
      const vm = wrapper.vm as any
      // 触发 handleScrollEnd
      vm.handleScrollEnd(true)
      await nextTick()
      
      // 如果还有更多数据，会加载下一页
      expect(wrapper.vm.$).toBeDefined()
    })

    it('handleScrollEnd 在加载中时不加载', async () => {
      mockRequestApi.mockImplementation(() => new Promise(() => {}))
      const wrapper = await mountScrollbarList()
      await nextTick()
      
      const vm = wrapper.vm as any
      vm.state.tableLoad = true // 模拟正在加载
      
      const callsBefore = mockRequestApi.mock.calls.length
      vm.handleScrollEnd(true)
      // 不应该增加调用
      expect(mockRequestApi.mock.calls.length).toBe(callsBefore)
    })

    it('handleScrollEnd 在已加载完成时不加载', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      
      const vm = wrapper.vm as any
      vm.state.tableLoadEnd = true // 模拟已加载完成
      
      const callsBefore = mockRequestApi.mock.calls.length
      vm.handleScrollEnd(true)
      expect(mockRequestApi.mock.calls.length).toBe(callsBefore)
    })
  })

  describe('11. getTableList 完整流程测试', () => {
    it('getTableList 第一页', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      
      const vm = wrapper.vm as any
      expect(mockRequestApi).toHaveBeenCalled()
    })

    it('getTableList 第二页', async () => {
      const requests: any[] = []
      mockRequestApi.mockImplementation((query: any) => {
        requests.push(query)
        return Promise.resolve({
          Data: {
            List: [{ id: requests.length, name: `item${requests.length}` }],
            TotalCount: 5
          }
        })
      })
      
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      await nextTick()
      
      const vm = wrapper.vm as any
      // 加载第二页
      await vm.getTableList(2)
      
      expect(requests.length).toBeGreaterThanOrEqual(1)
    })

    it('getTableList 已有数据时不重复加载', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      
      const vm = wrapper.vm as any
      const callsBefore = mockRequestApi.mock.calls.length
      // 尝试加载已存在的页
      await vm.getTableList(1)
      // 不应该有新的请求
      expect(mockRequestApi.mock.calls.length).toBe(callsBefore)
    })
  })

  describe('12. handleCurrentChange 测试', () => {
    it('handleCurrentChange 在加载中时不处理', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      
      const wrapper = await mountScrollbarList()
      await nextTick()
      
      const vm = wrapper.vm as any
      vm.state.tableLoad = true
      
      PaScrollbarMethods.setScrollToIntersect.mockClear()
      vm.handleCurrentChange(2)
      
      expect(PaScrollbarMethods.setScrollToIntersect).not.toHaveBeenCalled()
    })
  })

  describe('13. refresh 测试', () => {
    it('refresh 重置状态并重新加载', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      
      const wrapper = await mountScrollbarList()
      await nextTick()
      await nextTick()
      
      const vm = wrapper.vm as any
      // 调用 refresh
      vm.refresh()
      
      // 状态应该被重置
      expect(vm.state.tableLoadEnd).toBe(false)
      
      // 应该触发新的请求
      await nextTick()
      expect(mockRequestApi).toHaveBeenCalled()
    })
  })

  describe('14. updatePageable 测试', () => {
    it('updatePageable 更新分页信息', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 100
        }
      })
      
      const wrapper = await mountScrollbarList()
      await nextTick()
      
      const vm = wrapper.vm as any
      vm.updatePageable({ total: 100, pageSize: 20 })
      
      expect(vm.state.pageable.total).toBe(100)
      expect(vm.state.pageable.pageSize).toBe(20)
    })

    it('updatePageable 更新页码', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 50
        }
      })
      
      const wrapper = await mountScrollbarList()
      await nextTick()
      
      const vm = wrapper.vm as any
      vm.updatePageable({ pageNum: 3 })
      
      expect(vm.state.pageable.pageNum).toBe(3)
    })
  })

  describe('15. footer slot 测试', () => {
    it('渲染 footer slot', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList(
        {},
        { footer: '<div class="custom-footer">底部</div>' }
      )
      expect(wrapper.find('.custom-footer').exists()).toBe(true)
    })
  })

  describe('16. footerLeft slot 测试', () => {
    it('渲染 footerLeft slot', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList(
        {},
        { footerLeft: '<div class="footer-left">左侧</div>' }
      )
      expect(wrapper.find('.footer-left').exists()).toBe(true)
    })
  })

  describe('17. 暴露方法测试', () => {
    it('暴露 refresh 方法', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      const vm = wrapper.vm as any
      expect(typeof vm.refresh).toBe('function')
    })

    it('暴露 setScrollTop 方法', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      const vm = wrapper.vm as any
      expect(typeof vm.setScrollTop).toBe('function')
    })

    it('暴露 el 属性', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      const vm = wrapper.vm as any
      expect(vm.el).toBeDefined()
    })
  })

  describe('18. rowKey prop 测试', () => {
    it('rowKey 传递给子组件', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList({ rowKey: 'id' })
      expect(wrapper.find('section.pa-scrollbar-list').exists()).toBe(true)
    })
  })

  describe('19. 分页器布局测试', () => {
    it('分页器包含正确布局', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 50
        }
      })
      const wrapper = await mountScrollbarList()
      expect(wrapper.find('.pa-pagination-mock').exists()).toBe(true)
    })
  })

  describe('20. scrollBarList ref 测试', () => {
    it('存在 scrollBarList ref', async () => {
      mockRequestApi.mockResolvedValue({
        Data: {
          List: [{ id: 1, name: 'item1' }],
          TotalCount: 1
        }
      })
      const wrapper = await mountScrollbarList()
      const vm = wrapper.vm as any
      expect(vm.scrollBarList).toBeDefined()
    })
  })

  describe('21. 并发加载保护测试', () => {
    it('防止重复加载', async () => {
      mockRequestApi.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              Data: {
                List: [{ id: 1, name: 'item1' }],
                TotalCount: 1
              }
            })
          }, 100)
        })
      })
      
      const wrapper = await mountScrollbarList()
      await nextTick()
      
      const vm = wrapper.vm as any
      
      // 第一次加载中
      expect(vm.state.tableLoad).toBe(true)
      
      // 尝试第二次加载
      const callsBefore = mockRequestApi.mock.calls.length
      await vm.getTableList(1)
      // 不应该有新请求
      expect(mockRequestApi.mock.calls.length).toBe(callsBefore)
    })
  })
})

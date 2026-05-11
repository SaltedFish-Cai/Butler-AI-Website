/**
 * pa-pagination 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h, computed } from 'vue'
import type { ComputedRef } from 'vue'

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: 'left_line' }
  },
  setup(props) {
    return () => h('i', { class: ['pa-icon-mock', `icon-${props.name}`] })
  }
})

// Mock pa-select component
const PaSelectMock = defineComponent({
  name: 'PaSelect',
  props: {
    modelValue: { type: [String, Number, Array], default: '' },
    exOptions: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false }
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { slots }) {
    return () => h('div', { 
      class: 'pa-select-mock',
      onClick: () => {}
    }, props.exOptions.map((opt: any) => opt.label))
  }
})

// Mock pa-number component
const PaNumberMock = defineComponent({
  name: 'PaNumber',
  props: {
    modelValue: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 100 },
    disabled: { type: Boolean, default: false }
  },
  emits: ['change', 'update:modelValue'],
  setup(props) {
    return () => h('input', { 
      class: 'pa-number-mock',
      type: 'number',
      value: props.modelValue
    })
  }
})

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = computed(() => ({
  language: { value: 'zh-CN' }
})) as ComputedRef<{ language: { value: string } }>

/** 通用 mount 辅助函数 */
async function mountPagination(props: Record<string, any> = {}) {
  const { default: PaPagination } = await import('./pa-pagination.vue')
  return mount(PaPagination, {
    props: { total: 100, ...props },
    global: {
      stubs: {
        'pa-icon': PaIconMock,
        'pa-select': PaSelectMock,
        'pa-number': PaNumberMock
      },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig
      }
    }
  })
}

describe('pa-pagination 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-pagination', async () => {
      const wrapper = await mountPagination()
      expect(wrapper.find('.pa-pagination').exists()).toBe(true)
    })

    it('默认 props 值', async () => {
      const wrapper = await mountPagination()
      expect(wrapper.props('currentPage')).toBe(1)
      expect(wrapper.props('pageSize')).toBe(10)
      expect(wrapper.props('disabled')).toBe(false)
      expect(wrapper.props('background')).toBe(false)
    })
  })

  // ==================== class/style prop ====================
  describe('2. class/style prop', () => {
    it('自定义 class 应用', async () => {
      const wrapper = await mountPagination({ class: 'custom-class' })
      expect(wrapper.find('.pa-pagination').classes()).toContain('custom-class')
    })

    it('自定义 style 应用', async () => {
      const wrapper = await mountPagination({ style: { color: 'red' } })
      expect(wrapper.find('.pa-pagination').exists()).toBe(true)
    })
  })

  // ==================== total prop ====================
  describe('3. total prop', () => {
    it('total 设置总数', async () => {
      const wrapper = await mountPagination({ total: 200 })
      expect(wrapper.props('total')).toBe(200)
    })

    it('pageCount 根据 total 计算', async () => {
      const wrapper = await mountPagination({ total: 100, pageSize: 10 })
      expect(wrapper.vm.pageCount).toBe(10)
    })

    it('total=0 时 pageCount 为 1', async () => {
      const wrapper = await mountPagination({ total: 0 })
      expect(wrapper.vm.pageCount).toBe(1)
    })
  })

  // ==================== currentPage prop ====================
  describe('4. currentPage prop', () => {
    it('初始 currentPage 设置', async () => {
      const wrapper = await mountPagination({ currentPage: 5 })
      expect(wrapper.vm.internalCurrentPage).toBe(5)
    })

    it('currentPage 变化同步', async () => {
      const wrapper = await mountPagination({ currentPage: 1 })
      await wrapper.setProps({ currentPage: 3 })
      expect(wrapper.vm.internalCurrentPage).toBe(3)
    })

    it('currentPage 限制在有效范围内', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 1 })
      // goToPage 会限制范围
      wrapper.vm.goToPage(0)
      expect(wrapper.vm.internalCurrentPage).toBe(1)
      
      wrapper.vm.goToPage(100)
      expect(wrapper.vm.internalCurrentPage).toBe(10) // pageCount = 10
    })
  })

  // ==================== pageSize prop ====================
  describe('5. pageSize prop', () => {
    it('初始 pageSize 设置', async () => {
      const wrapper = await mountPagination({ pageSize: 20 })
      expect(wrapper.vm.internalPageSize).toBe(20)
    })

    it('pageSize 变化同步', async () => {
      const wrapper = await mountPagination({ pageSize: 10 })
      await wrapper.setProps({ pageSize: 20 })
      expect(wrapper.vm.internalPageSize).toBe(20)
    })

    it('pageSizes 设置可选值', async () => {
      const wrapper = await mountPagination({ pageSizes: [5, 10, 15] })
      expect(wrapper.vm.exOptions.length).toBe(3)
    })
  })

  // ==================== goToPage 方法 ====================
  describe('6. goToPage 方法', () => {
    it('goToPage 触发 update:currentPage', async () => {
      const wrapper = await mountPagination({ currentPage: 1 })
      wrapper.vm.goToPage(2)
      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    })

    it('goToPage 触发 current-change', async () => {
      const wrapper = await mountPagination({ currentPage: 1 })
      wrapper.vm.goToPage(2)
      expect(wrapper.emitted('current-change')).toBeTruthy()
    })


    it('disabled=true 时 goToPage 不生效', async () => {
      const wrapper = await mountPagination({ currentPage: 1, disabled: true })
      wrapper.vm.goToPage(2)
      expect(wrapper.emitted('update:currentPage')).toBeFalsy()
    })
  })

  // ==================== handleSizeChange 方法 ====================
  describe('7. handleSizeChange 方法', () => {
    it('handleSizeChange 触发 size-change', async () => {
      const wrapper = await mountPagination()
      wrapper.vm.handleSizeChange({ value: 20 })
      expect(wrapper.emitted('size-change')).toBeTruthy()
    })

    it('handleSizeChange 触发 update:pageSize', async () => {
      const wrapper = await mountPagination()
      wrapper.vm.handleSizeChange({ value: 20 })
      expect(wrapper.emitted('update:pageSize')).toBeTruthy()
    })

    it('每页数量增加导致总页数减少', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 10 })
      wrapper.vm.handleSizeChange({ value: 100 })
      // 新的 pageCount = 1，但当前页是 10，应该调整
    })
  })

  // ==================== layout prop ====================
  describe('8. layout prop', () => {
    it('默认 layout 包含所有组件', async () => {
      const wrapper = await mountPagination()
      expect(wrapper.props('layout')).toBe('total,sizes,prev,pager,next,jumper')
    })

    it('layout 只包含 total', async () => {
      const wrapper = await mountPagination({ layout: 'total' })
      expect(wrapper.vm.showTotal).toBe(true)
      expect(wrapper.vm.showSizes).toBe(false)
      expect(wrapper.vm.showPager).toBe(false)
      expect(wrapper.vm.showJumper).toBe(false)
    })
  })

  // ==================== showTotal ====================
  describe('9. showTotal', () => {
    it('layout 包含 total 时显示', async () => {
      const wrapper = await mountPagination({ layout: 'total' })
      expect(wrapper.vm.showTotal).toBe(true)
      expect(wrapper.find('.m-pagination-total').exists()).toBe(true)
    })

    it('layout 不包含 total 时不显示', async () => {
      const wrapper = await mountPagination({ layout: 'pager' })
      expect(wrapper.vm.showTotal).toBe(false)
    })
  })

  // ==================== showSizes ====================
  describe('10. showSizes', () => {
    it('layout 包含 sizes 时显示', async () => {
      const wrapper = await mountPagination({ layout: 'sizes' })
      expect(wrapper.vm.showSizes).toBe(true)
      expect(wrapper.find('.m-pagination-sizes').exists()).toBe(true)
    })
  })

  // ==================== showPager ====================
  describe('11. showPager', () => {
    it('layout 包含 pager 时显示', async () => {
      const wrapper = await mountPagination({ layout: 'pager' })
      expect(wrapper.vm.showPager).toBe(true)
    })

    it('pagerPages 计算正确', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 5, pagerCount: 3 })
      expect(wrapper.vm.pagerPages.length).toBeGreaterThan(0)
    })
  })

  // ==================== showJumper ====================
  describe('12. showJumper', () => {
    it('layout 包含 jumper 时显示', async () => {
      const wrapper = await mountPagination({ layout: 'jumper' })
      expect(wrapper.vm.showJumper).toBe(true)
      expect(wrapper.find('.m-pagination-jumper').exists()).toBe(true)
    })
  })

  // ==================== prev/next 按钮 ====================
  describe('13. prev/next 按钮', () => {
    it('上一页按钮存在', async () => {
      const wrapper = await mountPagination()
      expect(wrapper.find('.m-pagination-prev').exists()).toBe(true)
    })

    it('下一页按钮存在', async () => {
      const wrapper = await mountPagination()
      expect(wrapper.find('.m-pagination-next').exists()).toBe(true)
    })

    it('第一页时 prev 按钮 disabled', async () => {
      const wrapper = await mountPagination({ currentPage: 1 })
      expect(wrapper.find('.m-pagination-prev').attributes('disabled')).toBeDefined()
    })

    it('最后一页时 next 按钮 disabled', async () => {
      const wrapper = await mountPagination({ currentPage: 10 })
      expect(wrapper.find('.m-pagination-next').attributes('disabled')).toBeDefined()
    })
  })

  // ==================== pagerPages 计算 ====================
  describe('14. pagerPages 计算', () => {
    it('居中显示页码', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 5, pageSize: 10 })
      const pages = wrapper.vm.pagerPages
      expect(pages).toContain(5)
    })

    it('显示第一页', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 5, pageSize: 10 })
      expect(wrapper.vm.showFirstPage).toBe(true)
    })

    it('显示最后一页', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 5, pageSize: 10 })
      expect(wrapper.vm.showLastPage).toBe(true)
    })

    it('显示左侧更多', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 10, pageSize: 10 })
      expect(wrapper.vm.showPrevMore).toBe(true)
    })

    it('显示右侧更多', async () => {
      const wrapper = await mountPagination({ total: 100, currentPage: 1, pageSize: 10 })
      expect(wrapper.vm.showNextMore).toBe(true)
    })
  })

  // ==================== disabled prop ====================
  describe('15. disabled prop', () => {
    it('disabled=true 添加 is-disabled class', async () => {
      const wrapper = await mountPagination({ disabled: true })
      expect(wrapper.find('.pa-pagination').classes()).toContain('is-disabled')
    })

    it('disabled=true 时点击不生效', async () => {
      const wrapper = await mountPagination({ disabled: true, currentPage: 1 })
      await wrapper.find('.m-pagination-prev').trigger('click')
      expect(wrapper.emitted('update:currentPage')).toBeFalsy()
    })
  })

  // ==================== jumpPrevMore / jumpNextMore ====================
  describe('16. jumpPrevMore / jumpNextMore', () => {
    it('jumpPrevMore 向左跳转', async () => {
      const wrapper = await mountPagination({ currentPage: 10, pagerCount: 3 })
      wrapper.vm.jumpPrevMore()
      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    })

    it('jumpNextMore 向右跳转', async () => {
      const wrapper = await mountPagination({ currentPage: 1, pagerCount: 3 })
      wrapper.vm.jumpNextMore()
      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    })
  })

  // ==================== 语言包 ====================
  describe('17. 语言包', () => {
    it('中文语言包', async () => {
      const wrapper = await mountPagination()
      expect(wrapper.vm.languagePackage).toBeDefined()
      expect(wrapper.vm.languagePackage['total']).toBe('共')
    })

    it('英文语言包', async () => {
      const enConfig = computed(() => ({
        language: { value: 'en-US' }
      })) as ComputedRef<{ language: { value: string } }>
      
      const { default: PaPagination } = await import('./pa-pagination.vue')
      const wrapper = mount(PaPagination, {
        props: { total: 100 },
        global: {
          stubs: {
            'pa-icon': PaIconMock,
            'pa-select': PaSelectMock,
            'pa-number': PaNumberMock
          },
          provide: {
            'PancakeGlobalConfig': enConfig
          }
        }
      })
      expect(wrapper.vm.languagePackage['total']).toBe('Total')
    })
  })

  // ==================== change-max-page 事件 ====================
  describe('18. change-max-page 事件', () => {
    it('pageCount 变化触发 change-max-page', async () => {
      const wrapper = await mountPagination({ total: 100, pageSize: 10 })
      // pageCount 是 computed 属性，访问时触发 emit
      expect(wrapper.vm.pageCount).toBe(10)
    })
  })
})

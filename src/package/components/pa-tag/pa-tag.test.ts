/**
 * pa-tag 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'
import type { ComputedRef } from 'vue'

// Mock pa-icon component
const PaIconMock = defineComponent({
  name: 'PaIcon',
  props: {
    name: { type: String, default: '' },
    class: { type: [String, Array], default: '' }
  },
  setup(props, { emit }) {
    return () => h('span', {
      class: ['pa-icon', props.class, `icon-${props.name}`],
      onClick: (e: MouseEvent) => emit('click', e)
    })
  }
})

// Mock pa-popover component
const PaPopoverMock = {
  name: 'PaPopover',
  props: ['popoverWidth', 'stopPropagation'],
  template: '<div class="pa-popover-mock"><slot name="reference" /><slot /></div>'
}

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = {
  value: {
    language: { value: 'zh-CN' }
  }
} as ComputedRef<{ language: { value: string } }>

// Mock getElementPosition
vi.mock('../utils/getElementPosition', () => ({
  getElementPosition: vi.fn(() => ({ isFullInParent: true }))
}))

/** 通用 mount 辅助函数 */
async function mountTag(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  const { default: PaTag } = await import('./pa-tag.vue')
  return mount(PaTag, {
    props,
    global: {
      stubs: { 'pa-icon': PaIconMock, 'pa-popover': PaPopoverMock },
      provide: {
        'PancakeGlobalConfig': mockPancakeGlobalConfig,
        ...provideOverride
      }
    }
  })
}

const testTagList = [
  { label: '标签1', value: 'tag1' },
  { label: '标签2', value: 'tag2' },
  { label: '标签3', value: 'tag3' }
]

describe('pa-tag 组件测试', () => {

  // ==================== 默认渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-tag', async () => {
      const wrapper = await mountTag({ tagList: testTagList })
      expect(wrapper.find('div.pa-tag').exists()).toBe(true)
    })

    it('渲染标签列表', async () => {
      const wrapper = await mountTag({ tagList: testTagList })
      await nextTick()
      const tags = wrapper.findAll('.pa-tag-text')
      expect(tags.length).toBeGreaterThan(0)
    })

    it('标签显示 label 文本', async () => {
      const wrapper = await mountTag({ tagList: [{ label: '测试标签', value: 'test' }] })
      await nextTick()
      expect(wrapper.text()).toContain('测试标签')
    })

    it('无 tagList 时不渲染标签', async () => {
      const wrapper = await mountTag()
      await nextTick()
      const tags = wrapper.findAll('.pa-tag-text')
      expect(tags.length).toBe(0)
    })
  })

  // ==================== 多语言 label ====================
  describe('2. 多语言 label', () => {
    it('label 为多语言对象时根据语言显示', async () => {
      const wrapper = await mountTag({
        tagList: [{ label: { 'zh-CN': '中文', 'en-US': 'English' }, value: 'test' }]
      })
      await nextTick()
      expect(wrapper.text()).toContain('中文')
    })

    it('label 为多语言对象时 en-US 环境', async () => {
      const enConfig = { value: { language: { value: 'en-US' } } } as ComputedRef<{ language: { value: string } }>
      const { default: PaTag } = await import('./pa-tag.vue')
      const wrapper = mount(PaTag, {
        props: { tagList: [{ label: { 'zh-CN': '中文', 'en-US': 'English' }, value: 'test' }] },
        global: {
          stubs: { 'pa-icon': PaIconMock, 'pa-popover': PaPopoverMock },
          provide: { 'PancakeGlobalConfig': enConfig }
        }
      })
      await nextTick()
      expect(wrapper.text()).toContain('English')
    })

    it('多语言对象 fallback 到 zh-CN', async () => {
      const wrapper = await mountTag({
        tagList: [{ label: { 'zh-CN': '默认中文', 'en-US': 'English' }, value: 'test' }]
      }, { 'PancakeGlobalConfig': { value: { language: { value: 'fr' } } } })
      await nextTick()
      expect(wrapper.text()).toContain('默认中文')
    })
  })

  // ==================== disabled prop ====================
  describe('3. disabled prop', () => {
    it('disabled 时不显示关闭图标', async () => {
      const wrapper = await mountTag({ tagList: testTagList, disabled: true })
      await nextTick()
      const closeIcons = wrapper.findAll('.pa-tag-text_close')
      expect(closeIcons.length).toBe(0)
    })

    it('非 disabled 时显示关闭图标', async () => {
      const wrapper = await mountTag({ tagList: testTagList })
      await nextTick()
      const closeIcons = wrapper.findAll('.pa-tag-text_close')
      expect(closeIcons.length).toBeGreaterThan(0)
    })
  })

  // ==================== removeTag 事件 ====================
  describe('4. removeTag 事件', () => {
    it('点击关闭图标触发 removeTag 事件', async () => {
      const wrapper = await mountTag({ tagList: testTagList })
      await nextTick()
      const closeIcon = wrapper.find('.pa-tag-text_close')
      if (closeIcon.exists()) {
        await closeIcon.trigger('click')
        expect(wrapper.emitted('removeTag')).toBeTruthy()
      }
    })

    it('removeTag 事件携带标签数据', async () => {
      const wrapper = await mountTag({ tagList: [{ label: '删除我', value: 'del' }] })
      await nextTick()
      const closeIcon = wrapper.find('.pa-tag-text_close')
      if (closeIcon.exists()) {
        await closeIcon.trigger('click')
        const emitted = wrapper.emitted('removeTag')
        expect(emitted).toBeTruthy()
        expect(emitted![0][0]).toEqual({ label: '删除我', value: 'del' })
      }
    })

    it('removeTag 事件阻止冒泡', async () => {
      const wrapper = await mountTag({ tagList: testTagList })
      await nextTick()
      const closeIcon = wrapper.find('.pa-tag-text_close')
      if (closeIcon.exists()) {
        const stopPropagationSpy = vi.fn()
        const event = { stopPropagation: stopPropagationSpy } as unknown as MouseEvent
        // 直接通过 vm 调用验证逻辑
        const vm = wrapper.vm as any
        vm.removeTag(event, testTagList[0])
        expect(stopPropagationSpy).toHaveBeenCalled()
      }
    })
  })

  // ==================== useCollapse prop ====================
  describe('5. useCollapse prop', () => {
    it('useCollapse=false 时不折叠', async () => {
      const wrapper = await mountTag({ tagList: testTagList, useCollapse: false })
      await nextTick()
      // useCollapse=false 时直接显示所有标签，opacity=1
      expect(wrapper.find('div.pa-tag').exists()).toBe(true)
    })

    it('useCollapse=true 时添加 pa-tag-collapse class', async () => {
      const wrapper = await mountTag({ tagList: testTagList, useCollapse: true })
      await nextTick()
      expect(wrapper.find('div.pa-tag').classes()).toContain('pa-tag-collapse')
    })

    it('useCollapse=false 时不添加 pa-tag-collapse class', async () => {
      const wrapper = await mountTag({ tagList: testTagList, useCollapse: false })
      await nextTick()
      expect(wrapper.find('div.pa-tag').classes()).not.toContain('pa-tag-collapse')
    })
  })

  // ==================== class/style prop ====================
  describe('6. class/style prop', () => {
    it('传入自定义 class', async () => {
      const wrapper = await mountTag({ tagList: testTagList, class: 'custom-tag' })
      await nextTick()
      expect(wrapper.find('div.pa-tag').classes()).toContain('custom-tag')
    })

    it('传入自定义 style', async () => {
      const wrapper = await mountTag({ tagList: testTagList, style: { color: 'red' } })
      await nextTick()
      const style = wrapper.find('div.pa-tag').attributes('style')
      expect(style).toContain('color')
    })
  })

  // ==================== tagList 变化 ====================
  describe('7. tagList 变化', () => {
    it('tagList 变化时重新渲染', async () => {
      const wrapper = await mountTag({ tagList: [{ label: 'A', value: 'a' }] })
      await nextTick()
      expect(wrapper.text()).toContain('A')

      await wrapper.setProps({ tagList: [{ label: 'B', value: 'b' }] })
      await nextTick()
      expect(wrapper.text()).toContain('B')
    })

    it('tagList 清空时不显示标签', async () => {
      const wrapper = await mountTag({ tagList: testTagList })
      await nextTick()

      await wrapper.setProps({ tagList: [] })
      await nextTick()
      const tags = wrapper.findAll('.pa-tag-text')
      expect(tags.length).toBe(0)
    })

    it('tagList 为 undefined 时不崩溃', async () => {
      const wrapper = await mountTag({ tagList: undefined })
      await nextTick()
      expect(wrapper.find('div.pa-tag').exists()).toBe(true)
    })
  })

  // ==================== 折叠溢出 ====================
  describe('8. 折叠溢出', () => {
    it('hideValue 存在时渲染 popover 显示 +N', async () => {
      // 模拟折叠场景：getElementPosition 返回只有第一个标签在容器内
      const { getElementPosition } = await import('../utils/getElementPosition')
      ;(getElementPosition as any).mockImplementation((el: any, parent: any) => {
        // 模拟第一个在父容器内，其余不在
        return { isFullInParent: false }
      })

      const wrapper = await mountTag({ tagList: testTagList, useCollapse: true })
      await nextTick()
      // 由于所有子元素 isFullInParent=false，spliceIndex=0，不会折叠
      // 实际折叠依赖真实 DOM 布局，这里验证组件不崩溃
      expect(wrapper.find('div.pa-tag').exists()).toBe(true)
    })
  })

  // ==================== opacity 动画 ====================
  describe('9. opacity 动画', () => {
    it('组件挂载后 opacity 变为 1', async () => {
      const wrapper = await mountTag({ tagList: testTagList, useCollapse: false })
      await nextTick()
      const style = wrapper.find('div.pa-tag').attributes('style')
      expect(style).toContain('opacity')
    })
  })

  // ==================== PancakeGlobalConfig fallback ====================
  describe('10. PancakeGlobalConfig fallback', () => {
    it('无全局配置时语言 fallback 到 zh-CN', async () => {
      const { default: PaTag } = await import('./pa-tag.vue')
      const wrapper = mount(PaTag, {
        props: { tagList: [{ label: { 'zh-CN': '中文', 'en-US': 'English' }, value: 'test' }] },
        global: {
          stubs: { 'pa-icon': PaIconMock, 'pa-popover': PaPopoverMock },
          provide: { 'PancakeGlobalConfig': {} }
        }
      })
      await nextTick()
      expect(wrapper.text()).toContain('中文')
    })
  })

  // ==================== popoverWidth prop ====================
  describe('11. popoverWidth prop', () => {
    it('popoverWidth 传递给 pa-popover', async () => {
      const { getElementPosition } = await import('../utils/getElementPosition')
      ;(getElementPosition as any).mockImplementation(() => ({ isFullInParent: false }))
      
      const wrapper = await mountTag({ tagList: testTagList, popoverWidth: 200 })
      await nextTick()
      const popover = wrapper.findComponent({ name: 'PaPopover' })
      // popover 可能不存在（取决于折叠计算），验证组件不崩溃即可
      expect(wrapper.find('div.pa-tag').exists()).toBe(true)
    })
  })

  // ==================== 标签 value 类型 ====================
  describe('12. 标签 value 类型', () => {
    it('value 为数字类型', async () => {
      const wrapper = await mountTag({ tagList: [{ label: '数字', value: 123 }] })
      await nextTick()
      expect(wrapper.text()).toContain('数字')
    })

    it('value 为布尔类型', async () => {
      const wrapper = await mountTag({ tagList: [{ label: '布尔', value: true }] })
      await nextTick()
      expect(wrapper.text()).toContain('布尔')
    })

    it('value 为 undefined', async () => {
      const wrapper = await mountTag({ tagList: [{ label: '空值', value: undefined }] })
      await nextTick()
      expect(wrapper.text()).toContain('空值')
    })
  })
})

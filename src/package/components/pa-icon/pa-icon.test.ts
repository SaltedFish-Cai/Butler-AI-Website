/**
 * pa-icon 组件单元测试
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ComputedRef } from 'vue'

// Mock pa-popover component
const PaPopoverMock = {
  name: 'PaPopover',
  props: ['trigger'],
  template: '<div class="pa-popover-mock"><slot name="reference" /><slot /></div>'
}

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = {
  value: {
    language: { value: 'zh-CN' }
  }
} as ComputedRef<{ language: { value: string } }>

/** 通用 mount 辅助函数 */
function mountIcon(props: Record<string, any> = {}, provideOverride: Record<string, any> = {}) {
  // 动态 import 保证每次拿到最新模块
  return import('./pa-icon.vue').then(({ default: PaIcon }) =>
    mount(PaIcon, {
      props,
      global: {
        stubs: { 'pa-popover': PaPopoverMock },
        provide: {
          'PancakeGlobalConfig': mockPancakeGlobalConfig,
          ...provideOverride
        }
      }
    })
  )
}

describe('pa-icon 组件测试', () => {

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染 i.pa-icon 和默认 span.icon-magic_line', async () => {
      const wrapper = await mountIcon()
      const icon = wrapper.find('i.pa-icon')
      expect(icon.exists()).toBe(true)
      expect(wrapper.find('span.icon-magic_line').exists()).toBe(true)
      expect(wrapper.find('span.pa-icon_font').exists()).toBe(true)
    })

    it('无 tip 时不渲染 pa-popover', async () => {
      const wrapper = await mountIcon()
      expect(wrapper.findComponent({ name: 'PaPopover' }).exists()).toBe(false)
    })
  })

  // ==================== name prop ====================
  describe('2. name prop', () => {
    it('传入 name 渲染对应 icon class', async () => {
      const wrapper = await mountIcon({ name: 'search_line' })
      expect(wrapper.find('span.icon-search_line').exists()).toBe(true)
    })

    it('fontFamily 为 butler-iconfont 时 class 前缀变为 butler-', async () => {
      const wrapper = await mountIcon({ name: 'star_line', fontFamily: 'butler-iconfont' })
      expect(wrapper.find('span.butler-star_line').exists()).toBe(true)
      // 不应有 icon- 前缀
      expect(wrapper.find('span.icon-star_line').exists()).toBe(false)
    })
  })

  // ==================== click 事件 ====================
  describe('3. click 事件', () => {
    it('点击 i 触发 click 事件', async () => {
      const wrapper = await mountIcon()
      await wrapper.find('i.pa-icon').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')!.length).toBe(1)
    })
  })

  // ==================== fontFamily prop ====================
  describe('4. fontFamily prop', () => {
    it('默认 fontFamily 为 pa-iconfont', async () => {
      const wrapper = await mountIcon()
      const style = wrapper.find('i.pa-icon').attributes('style')
      expect(style).toContain('pa-iconfont')
    })

    it('传入 fontFamily 应用到 i 的 style', async () => {
      const wrapper = await mountIcon({ fontFamily: 'butler-iconfont' })
      const style = wrapper.find('i.pa-icon').attributes('style')
      expect(style).toContain('butler-iconfont')
    })
  })

  // ==================== fontColor prop ====================
  describe('5. fontColor prop', () => {
    it('fontColor 为空数组时不添加 background-color class', async () => {
      const wrapper = await mountIcon({ fontColor: [] })
      const span = wrapper.find('span.pa-icon_font')
      expect(span.classes()).not.toContain('background-color')
    })

    it('fontColor 有值时添加 background-color class', async () => {
      const wrapper = await mountIcon({ fontColor: ['#ff0000', '#00ff00'] })
      const span = wrapper.find('span.pa-icon_font')
      expect(span.classes()).toContain('background-color')
    })

    it('fontColor 有值时设置 CSS 变量 --set-icon-background-color', async () => {
      const wrapper = await mountIcon({ fontColor: ['#ff0000', '#00ff00'] })
      const span = wrapper.find('span.pa-icon_font')
      const style = span.attributes('style')
      expect(style).toContain('--set-icon-background-color')
      expect(style).toContain('linear-gradient')
      expect(style).toContain('#ff0000')
      expect(style).toContain('#00ff00')
    })

    it('fontColor 无值时 span 无 inline style', async () => {
      const wrapper = await mountIcon()
      const span = wrapper.find('span.pa-icon_font')
      const style = span.attributes('style')
      // 空对象时 Vue 不渲染 style 属性
      expect(style).toBeUndefined()
    })
  })

  // ==================== tip prop ====================
  describe('6. tip prop', () => {
    it('tip 为字符串时渲染 pa-popover 并显示文字', async () => {
      const wrapper = await mountIcon({ tip: '提示文字' })
      const popover = wrapper.findComponent({ name: 'PaPopover' })
      expect(popover.exists()).toBe(true)
      // popover 内容应包含提示文字
      expect(popover.text()).toContain('提示文字')
    })

    it('tip 为多语言对象时根据 languageValue 取值', async () => {
      const wrapper = await mountIcon({
        tip: { 'zh-CN': '中文提示', 'en-US': 'English tip' }
      })
      const popover = wrapper.findComponent({ name: 'PaPopover' })
      expect(popover.exists()).toBe(true)
      expect(popover.text()).toContain('中文提示')
    })

    it('tip 为多语言对象且语言为 en-US 时返回英文', async () => {
      const enConfig = { value: { language: { value: 'en-US' } } } as ComputedRef<{ language: { value: string } }>
      const { default: PaIcon } = await import('./pa-icon.vue')
      const wrapper = mount(PaIcon, {
        props: { tip: { 'zh-CN': '中文提示', 'en-US': 'English tip' } },
        global: {
          stubs: { 'pa-popover': PaPopoverMock },
          provide: { 'PancakeGlobalConfig': enConfig }
        }
      })
      const popover = wrapper.findComponent({ name: 'PaPopover' })
      expect(popover.text()).toContain('English tip')
    })

    it('PancakeGlobalConfig 无值时 tipText fallback 到 zh-CN', async () => {
      const { default: PaIcon } = await import('./pa-icon.vue')
      const wrapper = mount(PaIcon, {
        props: { tip: { 'zh-CN': '默认中文', 'en-US': 'English' } },
        global: {
          stubs: { 'pa-popover': PaPopoverMock },
          provide: { 'PancakeGlobalConfig': {} }
        }
      })
      const popover = wrapper.findComponent({ name: 'PaPopover' })
      expect(popover.text()).toContain('默认中文')
    })

    it('有 tip 时不渲染普通 span（无 pa-popover 包裹的那个）', async () => {
      const wrapper = await mountIcon({ tip: '提示' })
      // 无 tip 时是 v-if="!tip" 的 span，有 tip 时不应有
      expect(wrapper.find('i.pa-icon > span.pa-icon_font').exists()).toBe(false)
    })
  })

  // ==================== class/style prop ====================
  describe('7. class/style prop', () => {
    it('传入自定义 class 正确应用', async () => {
      const wrapper = await mountIcon({ class: 'custom-class' })
      expect(wrapper.find('i.pa-icon').classes()).toContain('custom-class')
    })

    it('传入数组 class 正确应用', async () => {
      const wrapper = await mountIcon({ class: ['class-a', 'class-b'] })
      const classes = wrapper.find('i.pa-icon').classes()
      expect(classes).toContain('class-a')
      expect(classes).toContain('class-b')
    })

    it('传入自定义 style 正确应用', async () => {
      const wrapper = await mountIcon({ style: { color: 'red' } })
      const style = wrapper.find('i.pa-icon').attributes('style')
      expect(style).toContain('color')
      expect(style).toContain('red')
    })

    it('自定义 style 与 fontFamily 合并', async () => {
      const wrapper = await mountIcon({ style: { color: 'red' }, fontFamily: 'butler-iconfont' })
      const style = wrapper.find('i.pa-icon').attributes('style')
      expect(style).toContain('color')
      expect(style).toContain('red')
      expect(style).toContain('butler-iconfont')
    })
  })

  // ==================== iconStyle computed ====================
  describe('8. iconStyle computed', () => {
    it('iconStyle 合并 props.style 和 fontFamily', async () => {
      const wrapper = await mountIcon({ style: { fontSize: '16px' } })
      const style = wrapper.find('i.pa-icon').attributes('style')
      expect(style).toContain('font-size')
      expect(style).toContain('16px')
      expect(style).toContain('pa-iconfont')
    })
  })
})

// ==================== install 函数测试 ====================
describe('install 函数测试', () => {
  it('导出对象包含 name 属性', async () => {
    const module = await import('./index.ts')
    expect(module.default).toBeDefined()
    expect(module.default.name).toBe('PaIcon')
  })

  it('导出对象包含 install 函数', async () => {
    const module = await import('./index.ts')
    expect(module.default.install).toBeDefined()
    expect(typeof module.default.install).toBe('function')
  })

  it('install 函数注册组件到 Vue 应用', async () => {
    const { default: PaIconModule } = await import('./index.ts')
    const mockComponent = vi.fn()
    const mockApp = {
      _context: { components: {} as Record<string, any> },
      component: mockComponent
    } as any
    PaIconModule.install(mockApp)
    expect(mockComponent).toHaveBeenCalledWith('PaIcon', expect.any(Object))
  })

  it('install 函数不重复注册已存在的组件', async () => {
    const { default: PaIconModule } = await import('./index.ts')
    const mockComponent = vi.fn()
    const mockApp = {
      _context: { components: { 'PaIcon': { name: 'PaIcon' } } },
      component: mockComponent
    } as any
    PaIconModule.install(mockApp)
    expect(mockComponent).not.toHaveBeenCalled()
  })

  it('install 函数返回 void', async () => {
    const { default: PaIconModule } = await import('./index.ts')
    const mockApp = {
      _context: { components: {} },
      component: vi.fn()
    } as any
    const result = PaIconModule.install(mockApp)
    expect(result).toBeUndefined()
  })
})

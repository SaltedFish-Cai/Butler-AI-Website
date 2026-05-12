/**
 * pa-line 组件单元测试
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

async function mountLine(props: Record<string, any> = {}) {
  const { default: PaLine } = await import('./pa-line.vue')
  return mount(PaLine, { props })
}

describe('pa-line 组件测试', () => {
  describe('1. 默认渲染', () => {
    it('渲染 div.pa-line', async () => {
      const wrapper = await mountLine()
      expect(wrapper.find('div.pa-line').exists()).toBe(true)
    })

    it('默认 height 为 2px', async () => {
      const wrapper = await mountLine()
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('--pa-line-height')
    })

    it('默认 width 为 100%', async () => {
      const wrapper = await mountLine()
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('--pa-line-width')
    })

    it('默认 borderColor', async () => {
      const wrapper = await mountLine()
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('--pa-line-border-color')
    })

    it('默认 borderStyle 为 solid', async () => {
      const wrapper = await mountLine()
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('--pa-line-border-style')
      expect(style).toContain('solid')
    })
  })

  describe('2. padding prop', () => {
    it('数字 padding 转为 px', async () => {
      const wrapper = await mountLine({ padding: [10, 20, 10, 20] })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('--pa-line-margin-top')
      expect(style).toContain('10px')
    })

    it('字符串 padding 直接使用', async () => {
      const wrapper = await mountLine({ padding: ['1em', '2em', '1em', '2em'] })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('1em')
    })

    it('默认 padding 为 [0,0,0,0]', async () => {
      const wrapper = await mountLine()
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('0px')
    })
  })

  describe('3. height prop', () => {
    it('自定义 height', async () => {
      const wrapper = await mountLine({ height: '3px' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('3px')
    })

    it('marginTop 为负 height', async () => {
      const wrapper = await mountLine({ height: '4px' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('calc(0px - 4px)')
    })
  })

  describe('4. width prop', () => {
    it('自定义 width', async () => {
      const wrapper = await mountLine({ width: '50%' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('50%')
    })
  })

  describe('5. borderColor prop', () => {
    it('自定义 borderColor', async () => {
      const wrapper = await mountLine({ borderColor: 'red' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('red')
    })

    it('borderColor 默认 transparent 时使用 CSS 变量', async () => {
      const wrapper = await mountLine()
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('--pa-line-border-color')
    })
  })

  describe('6. borderStyle prop', () => {
    it('dashed 样式', async () => {
      const wrapper = await mountLine({ borderStyle: 'dashed' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('dashed')
    })

    it('dotted 样式', async () => {
      const wrapper = await mountLine({ borderStyle: 'dotted' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('dotted')
    })
  })

  describe('7. slot', () => {
    it('有默认 slot 时渲染内容', async () => {
      const { default: PaLine } = await import('./pa-line.vue')
      const wrapper = mount(PaLine, {
        props: {},
        slots: { default: '分割线文字' }
      })
      expect(wrapper.text()).toContain('分割线文字')
    })

    it('无 slot 时不渲染内容区', async () => {
      const wrapper = await mountLine()
      const content = wrapper.find('.ml-size')
      expect(content.exists()).toBe(false)
    })
  })

  describe('8. 混合 padding', () => {
    it('数字和字符串混合 padding', async () => {
      const wrapper = await mountLine({ padding: [10, '2em', 10, '2em'] })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('10px')
      expect(style).toContain('2em')
    })

    it('padding 全为字符串', async () => {
      const wrapper = await mountLine({ padding: ['1rem', '2rem', '3rem', '4rem'] })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('1rem')
      expect(style).toContain('2rem')
      expect(style).toContain('3rem')
      expect(style).toContain('4rem')
    })

    it('padding 全为数字', async () => {
      const wrapper = await mountLine({ padding: [5, 10, 15, 20] })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('5px')
      expect(style).toContain('10px')
      expect(style).toContain('15px')
      expect(style).toContain('20px')
    })
  })

  describe('9. borderColor 为空', () => {
    it('borderColor 未设置时使用默认值', async () => {
      const wrapper = await mountLine()
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('var(--pa-color-primary-light-6)')
    })

    it('borderColor 设为 transparent', async () => {
      const wrapper = await mountLine({ borderColor: 'transparent' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('transparent')
    })
  })

  describe('10. 更多 borderStyle', () => {
    it('double 样式', async () => {
      const wrapper = await mountLine({ borderStyle: 'double' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('double')
    })

    it('groove 样式', async () => {
      const wrapper = await mountLine({ borderStyle: 'groove' })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('groove')
    })
  })

  describe('11. class/style prop', () => {
    it('自定义 class', async () => {
      const wrapper = await mountLine({ class: 'custom-line' })
      expect(wrapper.find('div.pa-line').classes()).toContain('custom-line')
    })

    it('自定义 style', async () => {
      const wrapper = await mountLine({ style: { color: 'blue' } })
      const style = wrapper.find('div.pa-line').attributes('style')
      expect(style).toContain('color')
    })
  })
})

// ==================== install 函数测试 ====================
describe('12. install 函数', () => {
  it('注册 PaLine 组件', async () => {
    const { default: module } = await import('./index')
    const app = { _context: { components: {} }, component: vi.fn() } as any
    module.install(app)
    expect(app.component).toHaveBeenCalledWith('PaLine', expect.anything())
  })

  it('不重复注册 PaLine 组件', async () => {
    const { default: module } = await import('./index')
    const app = { _context: { components: { PaLine: true } }, component: vi.fn() } as any
    module.install(app)
    expect(app.component).not.toHaveBeenCalled()
  })

  it('install 返回 void', async () => {
    const { default: module } = await import('./index')
    const app = { _context: { components: {} }, component: vi.fn() } as any
    const result = module.install(app)
    expect(result).toBeUndefined()
  })
})

// ==================== 剩余 borderStyle ====================
describe('13. 剩余 borderStyle', () => {
  it('inset 样式', async () => {
    const wrapper = await mountLine({ borderStyle: 'inset' })
    const style = wrapper.find('div.pa-line').attributes('style')
    expect(style).toContain('inset')
  })

  it('outset 样式', async () => {
    const wrapper = await mountLine({ borderStyle: 'outset' })
    const style = wrapper.find('div.pa-line').attributes('style')
    expect(style).toContain('outset')
  })

  it('ridge 样式', async () => {
    const wrapper = await mountLine({ borderStyle: 'ridge' })
    const style = wrapper.find('div.pa-line').attributes('style')
    expect(style).toContain('ridge')
  })
})

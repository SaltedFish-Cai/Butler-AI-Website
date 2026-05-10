/**
 * pa-line 组件单元测试
 */
import { describe, it, expect } from 'vitest'
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

  describe('8. class/style prop', () => {
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

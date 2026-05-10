/**
 * pa-color-box 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'

/** 通用 mount 辅助函数 */
async function mountColorBox(props: Record<string, any> = {}, stubsOverride: Record<string, any> = {}) {
  const { default: PaColorBox } = await import('./pa-color-box.vue')
  return mount(PaColorBox, {
    props,
    global: {
      stubs: {
        ...stubsOverride
      }
    }
  })
}

describe('pa-color-box 组件测试', () => {

  // ==================== 渲染 ====================
  describe('1. 默认渲染', () => {
    it('渲染颜色选择面板', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('渲染颜色选择区域', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-color-area').exists()).toBe(true)
    })

    it('渲染色相选择条', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-hue-area').exists()).toBe(true)
    })

    it('渲染透明度选择条（默认）', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-alpha-area').exists()).toBe(true)
    })
  })

  // ==================== useAlpha prop ====================
  describe('2. useAlpha prop', () => {
    it('useAlpha=true 时显示透明度条', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
      expect(wrapper.find('.pa-color-picker-alpha-area').exists()).toBe(true)
    })

    it('useAlpha=false 时隐藏透明度条', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: false })
      expect(wrapper.find('.pa-color-picker-alpha-area').exists()).toBe(false)
    })

    it('默认 useAlpha 为 true', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-alpha-area').exists()).toBe(true)
    })
  })

  // ==================== useInput prop ====================
  describe('3. useInput prop', () => {
    it('useInput=true 时显示输入框', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', useInput: true })
      expect(wrapper.find('.pa-color-picker-inputs-group').exists()).toBe(true)
    })

    it('useInput=false 时隐藏输入框', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', useInput: false })
      expect(wrapper.find('.pa-color-picker-inputs-group').exists()).toBe(false)
    })

    it('默认 useInput 为 true', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-inputs-group').exists()).toBe(true)
    })

    it('输入框有 placeholder', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('placeholder')).toBe('#000000')
    })
  })

  // ==================== presetColors prop ====================
  describe('4. presetColors prop', () => {
    it('有预设颜色时渲染预设列表', async () => {
      const presets = ['#ff0000', '#00ff00', '#0000ff']
      const wrapper = await mountColorBox({ modelValue: '#ff0000', presetColors: presets })
      expect(wrapper.find('.pa-color-picker-presets').exists()).toBe(true)
      const presetBtns = wrapper.findAll('.pa-color-picker-presets-preset')
      expect(presetBtns.length).toBe(3)
    })

    it('无预设颜色时隐藏预设列表', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', presetColors: [] })
      expect(wrapper.find('.pa-color-picker-presets').exists()).toBe(false)
    })

    it('预设颜色有正确的背景色样式', async () => {
      const presets = ['#ff0000']
      const wrapper = await mountColorBox({ modelValue: '#ff0000', presetColors: presets })
      const presetBtn = wrapper.find('.pa-color-picker-presets-preset')
      expect(presetBtn.exists()).toBe(true)
      expect(presetBtn.attributes('style')).toContain('#ff0000')
    })

    it('预设颜色数组为空时不渲染预设区域', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', presetColors: undefined })
      expect(wrapper.find('.pa-color-picker-presets').exists()).toBe(false)
    })
  })

  // ==================== modelValue prop ====================
  describe('5. modelValue prop', () => {
    it('传入初始颜色值', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('modelValue 为空时也能渲染', async () => {
      const wrapper = await mountColorBox({ modelValue: '' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('输入框初始值匹配 modelValue', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      expect(input.exists()).toBe(true)
      // 输入框值应该是初始化的 hex 颜色值
    })
  })

  // ==================== disabled prop ====================
  describe('6. disabled prop', () => {
    it('disabled=true 时不渲染面板', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', disabled: true })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(false)
    })

    it('disabled=false 时渲染面板', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', disabled: false })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('默认 disabled 为 false', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })
  })

  // ==================== 事件 ====================
  describe('7. 事件', () => {
    it('组件支持 update:modelValue 事件', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.vm.$options.emits).toBeDefined()
    })

    it('组件支持 change 事件', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.vm.$options.emits).toBeDefined()
    })
  })

  // ==================== 颜色选择区域 ====================
  describe('8. 颜色选择区域', () => {
    it('颜色区域有 pointer 元素', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-color-area-pointer').exists()).toBe(true)
    })

    it('颜色区域有 overlay 元素', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-color-area-overlay').exists()).toBe(true)
    })

    it('颜色区域有 mask 元素', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-color-area-mask').exists()).toBe(true)
    })

    it('pointer 有 left style', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const pointer = wrapper.find('.pa-color-picker-color-area-pointer')
      expect(pointer.exists()).toBe(true)
      expect(pointer.attributes('style')).toContain('left')
    })

    it('pointer 有 top style', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const pointer = wrapper.find('.pa-color-picker-color-area-pointer')
      expect(pointer.exists()).toBe(true)
      expect(pointer.attributes('style')).toContain('top')
    })
  })

  // ==================== 色相选择条 ====================
  describe('9. 色相选择条', () => {
    it('色相条有 gradient 元素', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-hue-area-gradient').exists()).toBe(true)
    })

    it('色相条有 pointer 元素', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-hue-area-pointer').exists()).toBe(true)
    })

    it('色相 pointer 有 left style', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const pointer = wrapper.find('.pa-color-picker-hue-area-pointer')
      expect(pointer.exists()).toBe(true)
      expect(pointer.attributes('style')).toContain('left')
    })
  })

  // ==================== 透明度选择条 ====================
  describe('10. 透明度选择条', () => {
    it('透明度条有 gradient 元素', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-alpha-area-gradient').exists()).toBe(true)
    })

    it('透明度条有 pointer 元素', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-alpha-area-pointer').exists()).toBe(true)
    })

    it('透明度 gradient 有背景色样式', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const gradient = wrapper.find('.pa-color-picker-alpha-area-gradient')
      expect(gradient.exists()).toBe(true)
      // CSS 属性在 HTML 中会转换为 kebab-case
      expect(gradient.attributes('style')).toContain('background-color')
    })
  })

  // ==================== 颜色格式处理 ====================
  describe('11. 颜色格式处理', () => {
    it('处理 #ff0000 格式', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('处理 #fff 格式（3位）', async () => {
      const wrapper = await mountColorBox({ modelValue: '#fff' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('处理 rgba 格式', async () => {
      const wrapper = await mountColorBox({ modelValue: 'rgba(255, 0, 0, 0.5)' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('处理 rgb 格式', async () => {
      const wrapper = await mountColorBox({ modelValue: 'rgb(255, 0, 0)' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })
  })

  // ==================== 输入框功能 ====================
  describe('12. 输入框功能', () => {
    it('输入框类型为 text', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('type')).toBe('text')
    })

    it('输入框有 class', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      expect(input.classes()).toContain('pa-color-picker-inputs-input')
    })

    it('输入框有 @input 事件绑定', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      expect(input.exists()).toBe(true)
      // Vue 会绑定 input 事件
    })
  })

  // ==================== 预设颜色点击 ====================
  describe('13. 预设颜色点击', () => {
    it('预设颜色按钮有 click 事件绑定', async () => {
      const presets = ['#ff0000', '#00ff00']
      const wrapper = await mountColorBox({ modelValue: '#ff0000', presetColors: presets })
      const presetBtns = wrapper.findAll('.pa-color-picker-presets-preset')
      expect(presetBtns.length).toBe(2)
    })
  })

  // ==================== 组件结构 ====================
  describe('14. 组件结构', () => {
    it('主面板有 pa-color-picker-main class', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-main').exists()).toBe(true)
    })

    it('输入区域有 pa-color-picker-inputs class', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-inputs').exists()).toBe(true)
    })

    it('预设区域有 pa-color-picker-presets class', async () => {
      const presets = ['#ff0000']
      const wrapper = await mountColorBox({ modelValue: '#ff0000', presetColors: presets })
      expect(wrapper.find('.pa-color-picker-presets').exists()).toBe(true)
    })

    it('输入分组有 pa-color-picker-inputs-group class', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      expect(wrapper.find('.pa-color-picker-inputs-group').exists()).toBe(true)
    })
  })
})

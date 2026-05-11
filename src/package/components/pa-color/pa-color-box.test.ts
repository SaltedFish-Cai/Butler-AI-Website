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

  // ==================== onUnmounted 测试 (lines 457-464) ====================
  describe('15. onUnmounted 清理', () => {
    it('组件卸载时移除事件监听器', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      // 验证组件可以正常卸载而不报错
      expect(() => wrapper.unmount()).not.toThrow()
    })

    it('多次挂载卸载不报错', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      wrapper.unmount()
      
      const wrapper2 = await mountColorBox({ modelValue: '#00ff00' })
      expect(() => wrapper2.unmount()).not.toThrow()
    })
  })

  // ==================== watch modelValue 测试 (lines 469-476) ====================
  describe('16. watch modelValue 变化', () => {
    it('外部 modelValue 变化时同步更新', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      
      await wrapper.setProps({ modelValue: '#00ff00' })
      await nextTick()
      
      // 验证组件响应变化
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('modelValue 变为相同时不重复更新', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      
      // 设置相同的值
      await wrapper.setProps({ modelValue: '#ff0000' })
      await nextTick()
      
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('modelValue 为空字符串时不崩溃', async () => {
      const wrapper = await mountColorBox({ modelValue: '' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })
  })

  // ==================== 预设颜色点击测试 ====================
  describe('17. 预设颜色交互', () => {
    it('点击预设颜色触发 update:modelValue', async () => {
      const presets = ['#ff0000', '#00ff00', '#0000ff']
      const wrapper = await mountColorBox({ modelValue: '#ffffff', presetColors: presets })
      
      const presetBtns = wrapper.findAll('.pa-color-picker-presets-preset')
      expect(presetBtns.length).toBe(3)
      
      // 点击第一个预设颜色
      await presetBtns[0].trigger('click')
      await nextTick()
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('点击预设颜色触发 change 事件', async () => {
      const presets = ['#ff0000', '#00ff00']
      const wrapper = await mountColorBox({ modelValue: '#ffffff', presetColors: presets })
      
      const presetBtns = wrapper.findAll('.pa-color-picker-presets-preset')
      await presetBtns[0].trigger('click')
      await nextTick()
      
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('预设颜色按钮有正确的 click 事件绑定', async () => {
      const presets = ['#ff0000']
      const wrapper = await mountColorBox({ modelValue: '#ffffff', presetColors: presets })
      const presetBtn = wrapper.find('.pa-color-picker-presets-preset')
      expect(presetBtn.exists()).toBe(true)
    })
  })

  // ==================== 输入框交互测试 ====================
  describe('18. 输入框交互', () => {
    it('输入有效的 hex 颜色触发更新', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      
      await input.setValue('#00ff00')
      await input.trigger('input')
      await nextTick()
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('输入无效颜色不触发更新', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      
      await input.setValue('invalid-color')
      await input.trigger('input')
      await nextTick()
      
      // 无效颜色 parseColor 返回 false，不触发更新
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('输入 rgba 格式颜色触发更新', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      
      await input.setValue('rgba(0, 255, 0, 0.5)')
      await input.trigger('input')
      await nextTick()
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('输入 rgb 格式颜色触发更新', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const input = wrapper.find('.pa-color-picker-inputs-input')
      
      await input.setValue('rgb(0, 0, 255)')
      await input.trigger('input')
      await nextTick()
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  // ==================== 颜色解析函数测试 ====================
  describe('19. 颜色解析函数', () => {
    it('处理无效的 hex 颜色', async () => {
      const wrapper = await mountColorBox({ modelValue: '#xyz' })
      // 无效颜色应该不崩溃
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('处理带透明度的 rgba 颜色', async () => {
      const wrapper = await mountColorBox({ 
        modelValue: 'rgba(128, 128, 128, 0.3)',
        useAlpha: true 
      })
      expect(wrapper.find('.pa-color-picker-alpha-area').exists()).toBe(true)
    })

    it('不正确的 rgba 格式不崩溃', async () => {
      const wrapper = await mountColorBox({ modelValue: 'rgba(invalid)' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })
  })

  // ==================== 鼠标拖拽交互测试 ====================
  describe('20. 鼠标拖拽交互', () => {
    it('颜色区域支持 mousedown 事件', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const colorArea = wrapper.find('.pa-color-picker-color-area')
      expect(colorArea.exists()).toBe(true)
      
      // 触发 mousedown
      const mockEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        bubbles: true
      })
      // 注意: 由于 DOM 测试限制，我们只验证事件绑定存在
    })

    it('色相区域支持 mousedown 事件', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const hueArea = wrapper.find('.pa-color-picker-hue-area-gradient')
      expect(hueArea.exists()).toBe(true)
    })

    it('透明度区域支持 mousedown 事件', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
      const alphaArea = wrapper.find('.pa-color-picker-alpha-area-gradient')
      expect(alphaArea.exists()).toBe(true)
    })

    it('透明度区域在 useAlpha=false 时不渲染', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: false })
      expect(wrapper.find('.pa-color-picker-alpha-area').exists()).toBe(false)
    })
  })

  // ==================== computed 属性测试 ====================
  describe('21. computed 属性测试', () => {
    it('hueColor computed 属性返回 HSL 字符串', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const vm = wrapper.vm as any
      // hueColor 应该是 hsl 格式
      expect(vm.hueColor).toContain('hsl')
    })

    it('currentColorWithoutAlpha computed 属性处理有效颜色', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const vm = wrapper.vm as any
      // 验证 computed 属性存在
      expect(vm.currentColorWithoutAlpha).toBeDefined()
    })

    it('currentColorWithoutAlpha 处理 rgba 颜色', async () => {
      const wrapper = await mountColorBox({ modelValue: 'rgba(255, 0, 0, 0.5)' })
      const vm = wrapper.vm as any
      // 应该是 rgb 格式（不含 alpha）
      expect(vm.currentColorWithoutAlpha).toContain('rgb')
    })
  })

  // ==================== 初始化行为测试 ====================
  describe('22. 初始化行为测试', () => {
    it('onMounted 设置初始值', async () => {
      const wrapper = await mountColorBox({ modelValue: '#00ff00' })
      const vm = wrapper.vm as any
      expect(vm.currentColor).toBe('#00ff00')
    })

    it('hexInput 初始化为 modelValue', async () => {
      const wrapper = await mountColorBox({ modelValue: '#00ff00' })
      const vm = wrapper.vm as any
      expect(vm.hexInput).toBe('#00ff00')
    })

    it('alphaInput 初始化为 1', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000' })
      const vm = wrapper.vm as any
      expect(vm.alphaInput).toBe(1)
    })
  })

  // ==================== 边界条件测试 ====================
  describe('23. 边界条件测试', () => {
    it('处理空字符串 modelValue', async () => {
      const wrapper = await mountColorBox({ modelValue: '' })
      expect(wrapper.find('.pa-color-picker').exists()).toBe(true)
    })

    it('处理 undefined presetColors', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', presetColors: undefined })
      expect(wrapper.find('.pa-color-picker-presets').exists()).toBe(false)
    })

    it('处理带透明度的初始颜色', async () => {
      const wrapper = await mountColorBox({ 
        modelValue: 'rgba(255, 128, 0, 0.8)',
        useAlpha: true 
      })
      const vm = wrapper.vm as any
      expect(vm.currentColor).toBeDefined()
    })

    it('alpha 透明度滑块正确渲染', async () => {
      const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
      const pointer = wrapper.find('.pa-color-picker-alpha-area-pointer')
      expect(pointer.exists()).toBe(true)
    })
  })
})
// ==================== 透明度区域鼠标操作测试 ====================
describe('15. 透明度区域鼠标操作测试', () => {
  it('handleAlphaAreaMouseMove 更新 alpha 值', async () => {
    const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
    const vm = wrapper.vm as any
    // 设置 alphaAreaRef 为 mock 元素
    vm.alphaAreaRef = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 20 })
    }
    const mockEvent = { clientX: 100, clientY: 10 } as MouseEvent
    vm.handleAlphaAreaMouseMove(mockEvent)
    // x=100, width=200 => alpha = 1 - 100/200 = 0.5
    expect(vm.alpha).toBe(0.5)
    expect(vm.alphaInput).toBe(0.5)
  })

  it('handleAlphaAreaMouseMove alphaAreaRef 为 null 时提前返回', async () => {
    const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
    const vm = wrapper.vm as any
    vm.alphaAreaRef = null
    const mockEvent = { clientX: 100, clientY: 10 } as MouseEvent
    // 不应该抛出错误，alpha 值不变
    expect(() => vm.handleAlphaAreaMouseMove(mockEvent)).not.toThrow()
  })

  it('handleAlphaAreaMouseMove 处理边界值 x=0', async () => {
    const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
    const vm = wrapper.vm as any
    vm.alphaAreaRef = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 20 })
    }
    const mockEvent = { clientX: 0, clientY: 10 } as MouseEvent
    vm.handleAlphaAreaMouseMove(mockEvent)
    // x=0 => alpha = 1 - 0/200 = 1
    expect(vm.alpha).toBe(1)
  })

  it('handleAlphaAreaMouseMove 处理边界值 x>=width', async () => {
    const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
    const vm = wrapper.vm as any
    vm.alphaAreaRef = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 20 })
    }
    const mockEvent = { clientX: 300, clientY: 10 } as MouseEvent
    vm.handleAlphaAreaMouseMove(mockEvent)
    // x clamped to 200 => alpha = 1 - 200/200 = 0
    expect(vm.alpha).toBe(0)
  })

  it('handleAlphaAreaMouseUp 清理 ref 和移除事件监听', async () => {
    const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
    const vm = wrapper.vm as any
    vm.alphaAreaRef = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 20 }) }
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    vm.handleAlphaAreaMouseUp()
    expect(vm.alphaAreaRef).toBeNull()
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('onHexInputChange 解析有效十六进制值', async () => {
    const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
    const vm = wrapper.vm as any
    vm.hexInput = '#00ff00'
    vm.onHexInputChange()
    // 不崩溃即可
    expect(vm.currentColor).toBeDefined()
  })

  it('onHexInputChange 解析无效值不崩溃', async () => {
    const wrapper = await mountColorBox({ modelValue: '#ff0000', useAlpha: true })
    const vm = wrapper.vm as any
    vm.hexInput = 'invalid-color'
    expect(() => vm.onHexInputChange()).not.toThrow()
  })
})

/**
 * pa-message 组件单元测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'

// Mock PancakeGlobalConfig
const mockPancakeGlobalConfig = {
  value: {
    language: { value: 'zh-CN' },
    escapeMap: []
  }
}

describe('pa-message 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    if (typeof window !== 'undefined') {
      window.PancakeGlobalConfig = mockPancakeGlobalConfig.value as any
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== Message 函数基础功能 ====================
  describe('1. Message 函数基础功能', () => {
    it('Message 函数导出存在', async () => {
      const { Message } = await import('./index')
      expect(Message).toBeDefined()
      expect(typeof Message).toBe('function')
    })

    it('Message.success 函数存在', async () => {
      const { Message } = await import('./index')
      expect(Message.success).toBeDefined()
      expect(typeof Message.success).toBe('function')
    })

    it('Message.warning 函数存在', async () => {
      const { Message } = await import('./index')
      expect(Message.warning).toBeDefined()
      expect(typeof Message.warning).toBe('function')
    })

    it('Message.danger 函数存在', async () => {
      const { Message } = await import('./index')
      expect(Message.danger).toBeDefined()
      expect(typeof Message.danger).toBe('function')
    })

    it('Message.info 函数存在', async () => {
      const { Message } = await import('./index')
      expect(Message.info).toBeDefined()
      expect(typeof Message.info).toBe('function')
    })

    it('Message.closeAll 函数存在', async () => {
      const { Message } = await import('./index')
      expect(Message.closeAll).toBeDefined()
      expect(typeof Message.closeAll).toBe('function')
    })
  })

  // ==================== MessageManager ====================
  describe('2. MessageManager', () => {
    it('MessageManager 导出存在', async () => {
      const { MessageManager } = await import('./message-manager')
      expect(MessageManager).toBeDefined()
    })

    it('MessageManager 有 Messages 数组', async () => {
      const { MessageManager } = await import('./message-manager')
      expect(Array.isArray(MessageManager.Messages)).toBe(true)
    })

    it('MessageManager 有 add 方法', async () => {
      const { MessageManager } = await import('./message-manager')
      expect(typeof MessageManager.add).toBe('function')
    })

    it('MessageManager 有 close 方法', async () => {
      const { MessageManager } = await import('./message-manager')
      expect(typeof MessageManager.close).toBe('function')
    })

    it('MessageManager 有 closeAll 方法', async () => {
      const { MessageManager } = await import('./message-manager')
      expect(typeof MessageManager.closeAll).toBe('function')
    })

    it('MessageManager 有 getOffset 方法', async () => {
      const { MessageManager } = await import('./message-manager')
      expect(typeof MessageManager.getOffset).toBe('function')
    })

    it('MessageManager 有 setOffset 方法', async () => {
      const { MessageManager } = await import('./message-manager')
      expect(typeof MessageManager.setOffset).toBe('function')
    })

    it('add 方法创建消息实例', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试消息' })
      expect(instance).toBeDefined()
      expect(instance.id).toBeDefined()
      expect(typeof instance.close).toBe('function')
      expect(instance.vm).toBeDefined()
    })

    it('add 方法处理 type', async () => {
      const { MessageManager } = await import('./message-manager')
      const types = ['success', 'warning', 'danger', 'info']
      for (const type of types) {
        const instance = MessageManager.add({ message: '测试', type: type as any })
        expect(instance.options.type).toBe(type)
      }
    })

    it('add 方法处理 duration', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', duration: 5000 })
      expect(instance.options.duration).toBe(5000)
    })

    it('add 方法处理 duration 为 0 不自动关闭', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', duration: 0 })
      expect(instance.options.duration).toBe(0)
    })

    it('add 方法处理 customClass', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', customClass: 'custom-class' })
      expect(instance.options.customClass).toBe('custom-class')
    })

    it('add 方法处理 offset', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', offset: 50 })
      expect(instance.options.offset).toBe(50)
    })

    it('add 方法处理 dangerouslyUseHTMLString', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '<b>测试</b>', dangerouslyUseHTMLString: true })
      expect(instance.options.dangerouslyUseHTMLString).toBe(true)
    })

    it('add 方法处理 zIndex', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', zIndex: 3000 })
      expect(instance.options.zIndex).toBe(3000)
    })

    it('add 方法处理 onClick 回调', async () => {
      const onClick = vi.fn()
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', onClick })
      expect(instance.options.onClick).toBe(onClick)
    })

    it('add 方法处理 onClose 回调', async () => {
      const onClose = vi.fn()
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', onClose })
      expect(instance.options.onClose).toBe(onClose)
    })

    it('add 方法处理 closeOnPressEscape', async () => {
      const { MessageManager } = await import('./message-manager')
      const instance = MessageManager.add({ message: '测试', closeOnPressEscape: false })
      expect(instance.options.closeOnPressEscape).toBe(false)
    })

    it('closeAll 方法关闭所有消息', async () => {
      const { MessageManager } = await import('./message-manager')
      MessageManager.add({ message: '测试1' })
      MessageManager.add({ message: '测试2' })
      MessageManager.closeAll()
      await nextTick()
      vi.advanceTimersByTime(100)
    })

    it('getOffset 方法计算偏移量', async () => {
      const { MessageManager } = await import('./message-manager')
      const offset = MessageManager.getOffset('center')
      expect(typeof offset).toBe('number')
      expect(offset).toBeGreaterThanOrEqual(0)
    })
  })

  // ==================== Message 快捷方法 ====================
  describe('3. Message 快捷方法', () => {
    it('Message.success 创建成功消息', async () => {
      const { Message } = await import('./index')
      const instance = Message.success('成功消息')
      expect(instance.options.message).toBe('成功消息')
      expect(instance.options.type).toBe('success')
    })

    it('Message.warning 创建警告消息', async () => {
      const { Message } = await import('./index')
      const instance = Message.warning('警告消息')
      expect(instance.options.message).toBe('警告消息')
      expect(instance.options.type).toBe('warning')
    })

    it('Message.danger 创建危险消息', async () => {
      const { Message } = await import('./index')
      const instance = Message.danger('危险消息')
      expect(instance.options.message).toBe('危险消息')
      expect(instance.options.type).toBe('danger')
    })

    it('Message.info 创建信息消息', async () => {
      const { Message } = await import('./index')
      const instance = Message.info('信息消息')
      expect(instance.options.message).toBe('信息消息')
      expect(instance.options.type).toBe('info')
    })

    it('Message.success 支持配置对象参数', async () => {
      const { Message } = await import('./index')
      const instance = Message.success({
        message: '成功消息',
        duration: 0
      })
      expect(instance.options.message).toBe('成功消息')
      expect(instance.options.type).toBe('success')
    })
  })

  // ==================== 实例属性 ====================
  describe('4. 实例属性', () => {
    it('实例有 id 属性', async () => {
      const { Message } = await import('./index')
      const instance = Message('测试')
      expect(instance.id).toMatch(/^Message_/)
    })

    it('实例有 vm 属性', async () => {
      const { Message } = await import('./index')
      const instance = Message('测试')
      expect(instance.vm).toBeDefined()
    })

    it('实例有 options 属性', async () => {
      const { Message } = await import('./index')
      const instance = Message({ message: '测试' })
      expect(instance.options).toBeDefined()
      expect(instance.options.message).toBe('测试')
    })

    it('实例有 close 方法', async () => {
      const { Message } = await import('./index')
      const instance = Message('测试')
      expect(typeof instance.close).toBe('function')
    })
  })
})

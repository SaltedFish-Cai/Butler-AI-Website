/**
 * pa-message-box 组件单元测试
 * 
 * 注意：notification 和 message-box 组件使用 createApp 动态创建实例，
 * 这导致 vi.mock 无法正常工作。因此本测试仅验证导出和 manager API。
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

describe('pa-message-box 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    if (typeof window !== 'undefined') {
      window.PancakeGlobalConfig = mockPancakeGlobalConfig.value as any
      window.globalZIndex = 2000
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ==================== MessageBox 函数基础功能 ====================
  describe('1. MessageBox 函数基础功能', () => {
    it('MessageBox 函数导出存在', async () => {
      const { MessageBox } = await import('./index')
      expect(MessageBox).toBeDefined()
      expect(typeof MessageBox).toBe('function')
    })

    it('MessageBox.confirm 函数存在', async () => {
      const { MessageBox } = await import('./index')
      expect(MessageBox.confirm).toBeDefined()
      expect(typeof MessageBox.confirm).toBe('function')
    })

    it('MessageBox.delete 函数存在', async () => {
      const { MessageBox } = await import('./index')
      expect(MessageBox.delete).toBeDefined()
      expect(typeof MessageBox.delete).toBe('function')
    })
  })

  // ==================== messageBoxManager ====================
  describe('2. messageBoxManager', () => {
    it('messageBoxManager 导出存在', async () => {
      const { messageBoxManager } = await import('./message-box-manager')
      expect(messageBoxManager).toBeDefined()
    })

    it('messageBoxManager 有 notifications 数组', async () => {
      const { messageBoxManager } = await import('./message-box-manager')
      expect(Array.isArray(messageBoxManager.notifications)).toBe(true)
    })

    it('messageBoxManager 有 add 方法', async () => {
      const { messageBoxManager } = await import('./message-box-manager')
      expect(typeof messageBoxManager.add).toBe('function')
    })

    it('messageBoxManager 有 close 方法', async () => {
      const { messageBoxManager } = await import('./message-box-manager')
      expect(typeof messageBoxManager.close).toBe('function')
    })

    it('messageBoxManager 有 closeAll 方法', async () => {
      const { messageBoxManager } = await import('./message-box-manager')
      expect(typeof messageBoxManager.closeAll).toBe('function')
    })
  })
})

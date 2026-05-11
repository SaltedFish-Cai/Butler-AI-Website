/**
 * pa-notification 组件单元测试
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

describe('pa-notification 组件测试', () => {
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

  // ==================== Notification 函数基础功能 ====================
  describe('1. Notification 函数基础功能', () => {
    it('Notification 函数导出存在', async () => {
      const { Notification } = await import('./index')
      expect(Notification).toBeDefined()
      expect(typeof Notification).toBe('function')
    })

    it('Notification.success 函数存在', async () => {
      const { Notification } = await import('./index')
      expect(Notification.success).toBeDefined()
      expect(typeof Notification.success).toBe('function')
    })

    it('Notification.warning 函数存在', async () => {
      const { Notification } = await import('./index')
      expect(Notification.warning).toBeDefined()
      expect(typeof Notification.warning).toBe('function')
    })

    it('Notification.danger 函数存在', async () => {
      const { Notification } = await import('./index')
      expect(Notification.danger).toBeDefined()
      expect(typeof Notification.danger).toBe('function')
    })

    it('Notification.info 函数存在', async () => {
      const { Notification } = await import('./index')
      expect(Notification.info).toBeDefined()
      expect(typeof Notification.info).toBe('function')
    })

    it('Notification.closeAll 函数存在', async () => {
      const { Notification } = await import('./index')
      expect(Notification.closeAll).toBeDefined()
      expect(typeof Notification.closeAll).toBe('function')
    })
  })

  // ==================== notificationManager ====================
  describe('2. notificationManager', () => {
    it('notificationManager 导出存在', async () => {
      const { notificationManager } = await import('./notification-manager')
      expect(notificationManager).toBeDefined()
    })

    it('notificationManager 有 notifications 数组', async () => {
      const { notificationManager } = await import('./notification-manager')
      expect(Array.isArray(notificationManager.notifications)).toBe(true)
    })

    it('notificationManager 有 add 方法', async () => {
      const { notificationManager } = await import('./notification-manager')
      expect(typeof notificationManager.add).toBe('function')
    })

    it('notificationManager 有 close 方法', async () => {
      const { notificationManager } = await import('./notification-manager')
      expect(typeof notificationManager.close).toBe('function')
    })

    it('notificationManager 有 closeAll 方法', async () => {
      const { notificationManager } = await import('./notification-manager')
      expect(typeof notificationManager.closeAll).toBe('function')
    })

    it('notificationManager 有 getOffset 方法', async () => {
      const { notificationManager } = await import('./notification-manager')
      expect(typeof notificationManager.getOffset).toBe('function')
    })

    it('notificationManager 有 setOffset 方法', async () => {
      const { notificationManager } = await import('./notification-manager')
      expect(typeof notificationManager.setOffset).toBe('function')
    })

    it('getOffset 方法返回数字类型', async () => {
      const { notificationManager } = await import('./notification-manager')
      const offset = notificationManager.getOffset('top-right')
      expect(typeof offset).toBe('number')
    })

    it('getOffset 方法处理 top-left', async () => {
      const { notificationManager } = await import('./notification-manager')
      const offset = notificationManager.getOffset('top-left')
      expect(typeof offset).toBe('number')
    })

    it('getOffset 方法处理 bottom-right', async () => {
      const { notificationManager } = await import('./notification-manager')
      const offset = notificationManager.getOffset('bottom-right')
      expect(typeof offset).toBe('number')
    })

    it('getOffset 方法处理 bottom-left', async () => {
      const { notificationManager } = await import('./notification-manager')
      const offset = notificationManager.getOffset('bottom-left')
      expect(typeof offset).toBe('number')
    })
  })
})

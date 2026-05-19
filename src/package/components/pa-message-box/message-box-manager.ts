/**
 * 模块级变量
 * @description 检查 window 对象是否可用
 */
const isBrowser = typeof window !== "undefined";
/**
 * 模块级变量
 * @description PancakeGlobalConfig 引用
 */
const PancakeGlobalConfig = isBrowser ? window.PancakeGlobalConfig : undefined;
/**
 * 模块级函数
 * @description 获取语言键值
 * @returns 语言键值，默认为 zh-CN
 */
function getLanguageKey(): string {
  return PancakeGlobalConfig?.language || "zh-CN";
}
/**
 * 模块级函数
 * @description 生成唯一 ID
 * @returns 唯一标识字符串
 */
function generateId(): string {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * 模块导入
 * @description 导入 Vue 创建应用和渲染函数
 */
import { createApp, h } from "vue";
/**
 * 模块导入
 * @description 导入消息框组件
 */
import MessageBoxVue from "./pa-message-box.vue";
/**
 * 模块导入
 * @description 导入消息框相关类型
 */
import type { MessageBoxOptions, MessageBoxInstance, MessageBoxManager } from "./types.d.ts";
/**
 * 消息框管理器实现类
 * @description 消息框管理器的具体实现
 */
class MessageBoxManagerImpl implements MessageBoxManager {
  /**
   * 消息框列表
   * @description 当前显示的所有消息框实例
   */
  notifications: Array<MessageBoxInstance> = [];
  /**
   * 基础层级
   * @description 消息框的基础 z-index 值
   */
  zIndex = 2050;

  add(options: MessageBoxOptions): MessageBoxInstance {
    const id = generateId();
    const languageKey = getLanguageKey();
    const mergedOptions = {
      ...options,
      title: typeof options.title === "string" ? options.title : options.title?.[languageKey] || "",
      message: typeof options.message === "string" ? options.message : options.message?.[languageKey] || "",
      confirmButtonText: typeof options.confirmButtonText === "string" ? options.confirmButtonText : options.confirmButtonText?.[languageKey] || "",
      cancelButtonText: typeof options.cancelButtonText === "string" ? options.cancelButtonText : options.cancelButtonText?.[languageKey] || "",
      zIndex: options.zIndex || this.zIndex++,
      position: "center"
    };
    const container = document.createElement("div");
    container.id = `m-message-box-container-${id}`;
    document.body.appendChild(container);
    const app = createApp({
      render: () =>
        h(MessageBoxVue, {
          id,
          options: mergedOptions
        })
    });
    const vm = app.mount(container);
    const instance: MessageBoxInstance = {
      id,
      vm,
      options: mergedOptions,
      close: () => {
        this.close(id);
      }
    };
    this.notifications.unshift(instance);
    const handleClose = (event: CustomEvent) => {
      if (event.detail.id === id) {
        this.close(id);
        window.removeEventListener("notification-closed", handleClose as EventListener);
      }
    };
    window.addEventListener("notification-closed", handleClose as EventListener);
    return instance;
  }

  close(id: string, forceClose: boolean = false): void {
    const index = this.notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
      const instance = this.notifications[index];
      if (instance.vm.$el && instance.vm.$el.parentNode) {
        instance.vm.$el.parentNode.removeChild(instance.vm.$el);
      }
      instance.vm.$.appContext.app.unmount();
      if (!forceClose) {
        this.notifications.splice(index, 1);
      }
      document.getElementById(`m-message-box-container-${id}`)?.remove();
    }
  }

  closeAll(): void {
    this.notifications.forEach(instance => {
      const closeFn = (instance.vm as any)?.close;
      if (closeFn) {
        closeFn();
      }
    });
  }
}
/**
 * 消息框管理器实例
 * @type MessageBoxManager
 * @description 导出的消息框管理器单例
 */
export const messageBoxManager = new MessageBoxManagerImpl();

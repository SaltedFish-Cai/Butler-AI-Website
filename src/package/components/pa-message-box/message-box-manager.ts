/**
 * **模块导入**
 * @description 导入 Vue 创建应用和渲染函数
 * */
import { createApp, h } from "vue";
/**
 * **模块导入**
 * @description 导入消息框组件
 * */
import MessageBox from "./pa-message-box.vue";
/**
 * **模块导入**
 * @description 导入消息框相关类型
 * */
import type { MessageBoxOptions, MessageBoxInstance, MessageBoxManager } from "./types.d.ts";
/**
 * **消息框管理器实现类**
 * @description 消息框管理器的具体实现
 * */
class MessageBoxManagerImpl implements MessageBoxManager {
  /**
   * **消息框列表**
   * @description 当前显示的所有消息框实例
   * */
  notifications: Array<MessageBoxInstance> = [];
  /**
   * **添加消息框**
   * @param `options` `MessageBoxOptions` 消息框配置
   * @returns `MessageBoxInstance` 消息框实例
   * @description 创建并显示一条新消息框
   * */
  add(options: MessageBoxOptions): MessageBoxInstance {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const languageKey = typeof window !== "undefined" && window.PancakeGlobalConfig?.language || "zh-CN";
    const mergedOptions = {
      ...options,
      title: typeof options.title === "string" ? options.title : options.title?.[languageKey] || "",
      message: typeof options.message === "string" ? options.message : options.message?.[languageKey] || "",
      confirmButtonText: typeof options.confirmButtonText === "string" ? options.confirmButtonText : options.confirmButtonText?.[languageKey] || "",
      cancelButtonText: typeof options.cancelButtonText === "string" ? options.cancelButtonText : options.cancelButtonText?.[languageKey] || "",
      zIndex: options.zIndex,
      position: "center"
    };
    const container = document.createElement("div");
    container.id = `m-message-box-container-${id}`;
    document.body.appendChild(container);
    const app = createApp({
      render: () =>
        h(MessageBox, {
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
        if (typeof window !== "undefined") window.removeEventListener("notification-closed", handleClose as EventListener);
      }
    };
    if (typeof window !== "undefined") window.addEventListener("notification-closed", handleClose as EventListener);
    return instance;
  }
  /**
   * **关闭消息框**
   * @param `id` `string` 消息框ID
   * @param `forceClose` `boolean` 是否强制关闭
   * @description 关闭指定ID的消息框
   * */
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
  /**
   * **关闭所有消息框**
   * @description 关闭所有当前显示的消息框
   * */
  closeAll(): void {
    this.notifications.forEach(instance => {
      instance.vm.$el.__vnode.ctx.exposed.close();
    });
  }
}
/**
 * **消息框管理器实例**
 * @description 导出的消息框管理器单例
 * */
export const messageBoxManager = new MessageBoxManagerImpl();

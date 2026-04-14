import { createApp, h } from "vue";
import MessageBox from "./m-message-box.vue";
import type { MessageBoxOptions, MessageBoxInstance, MessageBoxManager } from "./type";

// 通知管理器实现
class MessageBoxManagerImpl implements MessageBoxManager {
  notifications: MessageBoxInstance[] = [];
  // 添加通知
  add(options: MessageBoxOptions): MessageBoxInstance {
    // 生成唯一ID
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const languageKey = window.ManagerGlobalConfig.language || "zh-CN";
    // 合并默认选项
    const mergedOptions = {
      ...options,
      title: typeof options.title === "string" ? options.title : options.title?.[languageKey] || "",
      message: typeof options.message === "string" ? options.message : options.message?.[languageKey] || "",
      confirmButtonText:
        typeof options.confirmButtonText === "string"
          ? options.confirmButtonText
          : options.confirmButtonText?.[languageKey] || "",
      cancelButtonText:
        typeof options.cancelButtonText === "string" ? options.cancelButtonText : options.cancelButtonText?.[languageKey] || "",
      zIndex: options.zIndex,
      position: "center"
    };

    // 创建DOM容器
    const container = document.createElement("div");
    container.id = `m-message-box-container-${id}`;
    document.body.appendChild(container);

    // 创建Vue应用实例
    const app = createApp({
      render: () =>
        h(MessageBox, {
          id,
          options: mergedOptions
        })
    });

    // 挂载应用
    const vm = app.mount(container);

    // 创建通知实例
    const instance: MessageBoxInstance = {
      id,
      vm,
      options: mergedOptions,
      close: () => {
        this.close(id);
      }
    };

    // 添加到通知列表
    this.notifications.unshift(instance);

    // 监听关闭事件
    const handleClose = (event: CustomEvent) => {
      if (event.detail.id === id) {
        this.close(id);
        window.removeEventListener("notification-closed", handleClose as EventListener);
      }
    };
    window.addEventListener("notification-closed", handleClose as EventListener);

    return instance;
  }

  // 关闭单个通知
  close(id: string, forceClose: boolean = false): void {
    const index = this.notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
      const instance = this.notifications[index];
      // 移除DOM
      if (instance.vm.$el && instance.vm.$el.parentNode) {
        instance.vm.$el.parentNode.removeChild(instance.vm.$el);
      }
      // 卸载Vue应用
      instance.vm.$.appContext.app.unmount();
      if (!forceClose) {
        // 从列表中移除
        this.notifications.splice(index, 1);
      }
      // 移除DOM容器
      document.getElementById(`m-message-box-container-${id}`)?.remove();
    }
  }

  // 关闭所有通知
  closeAll(): void {
    this.notifications.forEach(instance => {
      instance.vm.$el.__vnode.ctx.exposed.close();
    });
    // this.notifications = [];
  }
}

// 导出通知管理器实例
export const messageBoxManager = new MessageBoxManagerImpl();

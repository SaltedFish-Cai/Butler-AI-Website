/**
 * **模块导入**
 * @description 导入 Vue 创建应用和渲染函数
 * */
import { createApp, h } from "vue";
/**
 * **模块导入**
 * @description 导入通知组件
 * */
import MNotification from "./pa-notification.vue";
/**
 * **模块导入**
 * @description 导入通知相关类型
 * */
import type { NotificationOptions, NotificationInstance, NotificationManager } from "./types.d.ts";
/**
 * **通知管理器实现类**
 * @description 通知管理器的具体实现
 * */
class NotificationManagerImpl implements NotificationManager {
  /**
   * **通知列表**
   * @description 当前显示的所有通知实例
   * */
  notifications: Array<NotificationInstance> = [];
  /**
   * **基础层级**
   * @description 通知的基础 z-index 值
   * */
  zIndex = 2050;
  /**
   * **添加通知**
   * @param `options` `NotificationOptions` 通知配置
   * @returns `NotificationInstance` 通知实例
   * @description 创建并显示一条新通知
   * */
  add(options: NotificationOptions): NotificationInstance {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mergedOptions = {
      ...options,
      zIndex: options.zIndex || this.zIndex++,
      position: options.position || "top-right"
    };
    const container = document.createElement("div");
    container.id = `m-notification-container-${id}`;
    document.body.appendChild(container);
    const app = createApp({
      render: () =>
        h(MNotification, {
          id,
          options: mergedOptions
        })
    });
    const vm = app.mount(container);
    const instance: NotificationInstance = {
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
    setTimeout(() => {
      this.repositionNotifications();
    }, 100);
    return instance;
  }
  /**
   * **关闭通知**
   * @param `id` `string` 通知ID
   * @param `forceClose` `boolean` 是否强制关闭
   * @description 关闭指定ID的通知
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
        this.repositionNotifications();
      }
      document.getElementById(`m-notification-container-${id}`)?.remove();
    }
  }
  /**
   * **关闭所有通知**
   * @description 关闭所有当前显示的通知
   * */
  closeAll(): void {
    this.notifications.forEach(instance => {
      instance.vm.$el.__vnode.ctx.exposed.close();
    });
  }
  /**
   * **获取偏移量**
   * @param `position` `string` 位置参数
   * @returns `number` 计算得出的偏移量
   * @description 计算新通知的偏移量
   * */
  getOffset(position: string): number {
    const baseOffset = 20;
    const gap = 16;
    const samePositionNotifications = this.notifications.filter(notification => notification.options.position === position);
    if (this.notifications.length === 1 || samePositionNotifications.length === 0) {
      return baseOffset;
    }
    const lastNotification = samePositionNotifications[samePositionNotifications.length - 1];
    const lastEl = lastNotification.vm.$el;
    if (!lastEl) {
      return baseOffset;
    }
    const lastHeight = lastEl.offsetHeight;
    const lastOffset = lastNotification.options.offset || baseOffset;
    return lastOffset + lastHeight + gap;
  }
  /**
   * **设置偏移量**
   * @param `id` `string` 通知ID
   * @param `offset` `number` 偏移量
   * @description 设置指定通知的偏移量
   * */
  setOffset(id: string, offset: number): void {
    const instance = this.notifications.find(notification => notification.id === id);
    if (instance && instance.vm.$el) {
      instance.vm.$el.style.top = `${offset}px`;
    }
  }
  /**
   * **重新定位通知**
   * @description 重新计算所有通知的位置
   * */
  private repositionNotifications(): void {
    const notificationsByPosition: Record<string, Array<NotificationInstance>> = {};
    this.notifications.forEach(notification => {
      const position = notification.options.position || "top-right";
      if (!notificationsByPosition[position]) {
        notificationsByPosition[position] = [];
      }
      notificationsByPosition[position].push(notification);
    });
    Object.keys(notificationsByPosition).forEach(position => {
      const notifications = notificationsByPosition[position];
      let offset = 20;
      notifications.forEach(notification => {
        notification.vm.$el.style.top = `${offset}px`;
        const el = notification.vm.$el;
        if (el) {
          offset += el.offsetHeight + 16;
        }
      });
    });
  }
}
/**
 * **通知管理器实例**
 * @description 导出的通知管理器单例
 * */
export const notificationManager = new NotificationManagerImpl();

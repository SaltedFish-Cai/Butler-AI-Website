import { createApp, h } from "vue";
import MNotification from "./m-notification.vue";
import type { NotificationOptions, NotificationInstance, NotificationManager } from "./type";

// 通知管理器实现
class NotificationManagerImpl implements NotificationManager {
  notifications: NotificationInstance[] = [];
  zIndex = 2050;

  // 添加通知
  add(options: NotificationOptions): NotificationInstance {
    // 生成唯一ID
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 合并默认选项
    const mergedOptions = {
      ...options,
      zIndex: options.zIndex || this.zIndex++,
      position: options.position || "top-right"
    };

    // 创建DOM容器
    const container = document.createElement("div");
    container.id = `m-notification-container-${id}`;
    document.body.appendChild(container);

    // 创建Vue应用实例
    const app = createApp({
      render: () =>
        h(MNotification, {
          id,
          options: mergedOptions
        })
    });

    // 挂载应用
    const vm = app.mount(container);

    // 创建通知实例
    const instance: NotificationInstance = {
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

    setTimeout(() => {
      this.repositionNotifications();
    }, 100);

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
        // 重新计算其他通知的偏移量
        this.repositionNotifications();
      }
      // 移除DOM容器
      document.getElementById(`m-notification-container-${id}`)?.remove();
    }
  }

  // 关闭所有通知
  closeAll(): void {
    this.notifications.forEach(instance => {
      instance.vm.$el.__vnode.ctx.exposed.close();
    });
    // this.notifications = [];
  }

  // 获取指定位置的偏移量
  getOffset(position: string): number {
    const baseOffset = 20;
    const gap = 16;

    // 筛选相同位置的通知
    const samePositionNotifications = this.notifications.filter(notification => notification.options.position === position);
    if (this.notifications.length === 1 || samePositionNotifications.length === 0) {
      return baseOffset;
    }

    // 计算最大偏移量
    const lastNotification = samePositionNotifications[samePositionNotifications.length - 1];
    const lastEl = lastNotification.vm.$el;

    if (!lastEl) {
      return baseOffset;
    }

    const lastHeight = lastEl.offsetHeight;
    const lastOffset = lastNotification.options.offset || baseOffset;

    return lastOffset + lastHeight + gap;
  }

  // 设置指定通知的偏移量
  setOffset(id: string, offset: number): void {
    const instance = this.notifications.find(notification => notification.id === id);
    if (instance && instance.vm.$el) {
      instance.vm.$el.style.top = `${offset}px`;
    }
  }

  // 重新定位所有通知
  private repositionNotifications(): void {
    // 按位置分组通知
    const notificationsByPosition: Record<string, NotificationInstance[]> = {};
    this.notifications.forEach(notification => {
      const position = notification.options.position || "top-right";
      if (!notificationsByPosition[position]) {
        notificationsByPosition[position] = [];
      }
      notificationsByPosition[position].push(notification);
    });

    // 对每个位置的通知重新计算偏移量
    Object.keys(notificationsByPosition).forEach(position => {
      const notifications = notificationsByPosition[position];
      let offset = 20;

      notifications.forEach(notification => {
        notification.vm.$el.style.top = `${offset}px`;
        // 更新下一个通知的偏移量
        const el = notification.vm.$el;
        if (el) {
          offset += el.offsetHeight + 16;
        }
      });
    });
  }
}

// 导出通知管理器实例
export const notificationManager = new NotificationManagerImpl();

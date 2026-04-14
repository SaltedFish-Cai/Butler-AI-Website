import type { NotificationOptions, NotificationInstance } from "./type";
import { notificationManager } from "./notification-manager";

// 主通知函数
export function Notification(options: NotificationOptions | string): NotificationInstance {
  // 处理字符串参数情况
  if (typeof options === "string") {
    return notificationManager.add({
      message: options
    });
  }

  return notificationManager.add(options);
}

// 快捷方法
Notification.success = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "success" });
  }
  return Notification({ ...options, type: "success" });
};

Notification.warning = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "warning" });
  }
  return Notification({ ...options, type: "warning" });
};

Notification.error = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "error" });
  }
  return Notification({ ...options, type: "error" });
};

Notification.info = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "info" });
  }
  return Notification({ ...options, type: "info" });
};

// 关闭所有通知
Notification.closeAll = (): void => {
  notificationManager.closeAll();
};

export default Notification;

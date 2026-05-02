/**
 * **模块导入**
 * @description 导入通知配置和实例类型
 * */
import type { NotificationOptions, NotificationInstance } from "./types.d.ts";
/**
 * **模块导入**
 * @description 导入通知管理器
 * */
import { notificationManager } from "./notification-manager";
/**
 * **通知函数**
 * @param `options` `NotificationOptions | string` 通知配置或消息内容
 * @returns `NotificationInstance` 通知实例
 * @description 显示通知，支持字符串或配置对象参数
 * */
export function Notification(options: NotificationOptions | string): NotificationInstance {
  if (typeof options === "string") {
    return notificationManager.add({
      message: options
    });
  }
  return notificationManager.add(options);
}
/**
 * **成功通知**
 * @param `options` `NotificationOptions | string` 通知配置或消息内容
 * @returns `NotificationInstance` 通知实例
 * @description 显示成功类型的通知
 * */
Notification.success = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "success" });
  }
  return Notification({ ...options, type: "success" });
};
/**
 * **警告通知**
 * @param `options` `NotificationOptions | string` 通知配置或消息内容
 * @returns `NotificationInstance` 通知实例
 * @description 显示警告类型的通知
 * */
Notification.warning = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "warning" });
  }
  return Notification({ ...options, type: "warning" });
};
/**
 * **危险通知**
 * @param `options` `NotificationOptions | string` 通知配置或消息内容
 * @returns `NotificationInstance` 通知实例
 * @description 显示危险类型的通知
 * */
Notification.danger = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "danger" });
  }
  return Notification({ ...options, type: "danger" });
};
/**
 * **信息通知**
 * @param `options` `NotificationOptions | string` 通知配置或消息内容
 * @returns `NotificationInstance` 通知实例
 * @description 显示信息类型的通知
 * */
Notification.info = (options: NotificationOptions | string): NotificationInstance => {
  if (typeof options === "string") {
    return Notification({ message: options, type: "info" });
  }
  return Notification({ ...options, type: "info" });
};
/**
 * **关闭所有通知**
 * @description 关闭所有当前显示的通知
 * */
Notification.closeAll = (): void => {
  notificationManager.closeAll();
};
export default Notification;

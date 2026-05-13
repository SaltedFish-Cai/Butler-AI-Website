/**
 * 模块导入
 * @description 导入消息框配置类型
 */
import type { MessageBoxOptions, MessageBoxInstance } from "./type";
/**
 * 模块导入
 * @description 导入消息框管理器
 */
import { messageBoxManager } from "./message-box-manager";
/**
 * 模块导入
 * @description 导入 z-index 管理工具
 */
import { useZIndex } from "element-plus";
/**
 * 模块级变量
 * @description 全局 Z 索引获取函数
 */
const { nextZIndex } = useZIndex();
/**
 * 模块级常量
 * @description confirm 方法的基础配置
 */
const CONFIRM_BASE_OPTIONS = {
  title: { "en-US": "Tips", "zh-CN": "温馨提示" },
  message: { "en-US": "Are you sure？", "zh-CN": "是否继续?" },
  type: "warning" as const,
  confirmButtonText: { "en-US": "Confirm", "zh-CN": "确定" },
  cancelButtonText: { "en-US": "Cancel", "zh-CN": "取消" }
};
/**
 * 模块级常量
 * @description delete 方法的基础配置
 */
const DELETE_BASE_OPTIONS = {
  title: { "en-US": "Tips", "zh-CN": "注意" },
  message: { "en-US": "Are you sure to delete this data?", "zh-CN": "是否删除此数据?" },
  type: "danger" as const,
  confirmButtonText: { "en-US": "Delete", "zh-CN": "确认删除" },
  cancelButtonText: { "en-US": "Cancel", "zh-CN": "取消" }
};
/**
 * 模块级函数
 * @description 获取全局 Z 索引
 * @returns z-index 值
 */
function getZIndex(): number {
  return nextZIndex() || window.globalZIndex++;
}
/**
 * 消息框函数
 * @param options - 消息框配置或字符串消息
 * @returns 消息框实例
 * @description 创建并显示消息框
 */
export function MessageBox(options: MessageBoxOptions | string): MessageBoxInstance {
  if (typeof options === "string") {
    return messageBoxManager.add({
      message: options,
      zIndex: getZIndex()
    });
  }
  return messageBoxManager.add({
    ...options,
    zIndex: getZIndex()
  });
}
/**
 * 确认方法
 * @param options - 确认配置或字符串消息
 * @param onConfirm - 确认回调
 * @returns 消息框实例
 * @description 显示确认消息框
 */
MessageBox.confirm = (options: MessageBoxOptions | string, onConfirm?: () => void): MessageBoxInstance => {
  if (typeof options === "string") {
    return MessageBox({ ...CONFIRM_BASE_OPTIONS, message: options, onConfirm, isType: "confirm" });
  }
  return MessageBox({ ...CONFIRM_BASE_OPTIONS, ...options, isType: "confirm" });
};
/**
 * 删除方法
 * @param options - 删除配置或字符串消息
 * @returns 消息框实例
 * @description 显示删除确认消息框
 */
MessageBox.delete = (options: MessageBoxOptions | string): MessageBoxInstance => {
  if (typeof options === "string") {
    return MessageBox({ ...DELETE_BASE_OPTIONS, message: options, isType: "confirm" });
  }
  return MessageBox({ ...DELETE_BASE_OPTIONS, ...options, isType: "confirm" });
};
export default MessageBox;

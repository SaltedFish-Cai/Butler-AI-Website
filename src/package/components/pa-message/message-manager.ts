/**
 * **模块导入**
 * @description 导入 Vue 创建应用和渲染函数
 * */
import { createApp, h } from "vue";
/**
 * **模块导入**
 * @description 导入消息组件
 * */
import MMessage from "./pa-message.vue";
/**
 * **模块导入**
 * @description 导入消息相关类型
 * */
import type { MessageOptions, MessageInstance, MessageManagerType } from "./types.d.ts";
/**
 * **消息管理器实现类**
 * @description 消息管理器的具体实现
 * */
class MessageManagerTypeImpl implements MessageManagerType {
  /**
   * **消息列表**
   * @description 当前显示的所有消息实例
   * */
  Messages: Array<MessageInstance> = [];
  /**
   * **基础层级**
   * @description 消息的基础 z-index 值
   * */
  zIndex = 2050;
  /**
   * **添加消息**
   * @param `options` `MessageOptions` 消息配置
   * @returns `MessageInstance` 消息实例
   * @description 创建并显示一条新消息
   * */
  add(options: MessageOptions): MessageInstance {
    const id = `Message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const languageKey = typeof window !== "undefined" && window.PancakeGlobalConfig?.language || "zh-CN";
    const mergedOptions = {
      ...options,
      title: typeof options.title === "string" ? options.title : options.title?.[languageKey] || "",
      message: typeof options.message === "string" ? options.message : options.message?.[languageKey] || "",
      zIndex: options.zIndex || this.zIndex++,
      position: "center"
    };
    const container = document.createElement("div");
    container.id = `m-message-container-${id}`;
    document.body.appendChild(container);
    const app = createApp({
      render: () =>
        h(MMessage, {
          id,
          options: mergedOptions
        })
    });
    const vm = app.mount(container);
    const instance: MessageInstance = {
      id,
      vm,
      options: mergedOptions,
      close: () => {
        this.close(id);
      }
    };
    this.Messages.unshift(instance);
    const handleClose = (event: CustomEvent) => {
      if (event.detail.id === id) {
        this.close(id);
        if (typeof window !== "undefined") window.removeEventListener("Message-closed", handleClose as EventListener);
      }
    };
    if (typeof window !== "undefined") window.addEventListener("Message-closed", handleClose as EventListener);
    setTimeout(() => {
      this.repositionMessages();
    }, 100);
    return instance;
  }
  /**
   * **关闭消息**
   * @param `id` `string` 消息ID
   * @param `forceClose` `boolean` 是否强制关闭
   * @description 关闭指定ID的消息
   * */
  close(id: string, forceClose: boolean = false): void {
    const index = this.Messages.findIndex(Message => Message.id === id);
    if (index !== -1) {
      const instance = this.Messages[index];
      if (instance.vm.$el && instance.vm.$el.parentNode) {
        instance.vm.$el.parentNode.removeChild(instance.vm.$el);
      }
      instance.vm.$.appContext.app.unmount();
      if (!forceClose) {
        this.Messages.splice(index, 1);
        this.repositionMessages();
      }
      document.getElementById(`m-message-container-${id}`)?.remove();
    }
  }
  /**
   * **关闭所有消息**
   * @description 关闭所有当前显示的消息
   * */
  closeAll(): void {
    this.Messages.forEach(instance => {
      instance.vm.$el.__vnode.ctx.exposed.close();
    });
  }
  /**
   * **获取偏移量**
   * @param `_position` `string` 位置参数（未使用）
   * @returns `number` 计算得出的偏移量
   * @description 计算新消息的偏移量
   * */
  getOffset(_position: string): number {
    const baseOffset = 20;
    const gap = 16;
    const samePositionMessages = this.Messages;
    if (samePositionMessages.length === 0) {
      return baseOffset;
    }
    const lastMessage = samePositionMessages[samePositionMessages.length - 1];
    const lastEl = lastMessage.vm.$el;
    if (!lastEl) {
      return baseOffset;
    }
    const lastHeight = lastEl.offsetHeight;
    const lastOffset = lastMessage.options.offset || baseOffset;
    return lastOffset + lastHeight + gap;
  }
  /**
   * **设置偏移量**
   * @param `id` `string` 消息ID
   * @param `offset` `number` 偏移量
   * @description 设置指定消息的偏移量
   * */
  setOffset(id: string, offset: number): void {
    const instance = this.Messages.find(Message => Message.id === id);
    if (instance && instance.vm.$el) {
      instance.vm.$el.style.top = `${offset}px`;
    }
  }
  /**
   * **重新定位消息**
   * @description 重新计算所有消息的位置
   * */
  private repositionMessages(): void {
    const MessagesByPosition: Record<string, Array<MessageInstance>> = {};
    this.Messages.forEach(Message => {
      const position = "center";
      if (!MessagesByPosition[position]) {
        MessagesByPosition[position] = [];
      }
      MessagesByPosition[position].push(Message);
    });
    Object.keys(MessagesByPosition).forEach(position => {
      const Messages = MessagesByPosition[position];
      let offset = 20;
      Messages.forEach(Message => {
        Message.vm.$el.style.top = `${offset}px`;
        const el = Message.vm.$el;
        if (el) {
          offset += el.offsetHeight + 16;
        }
      });
    });
  }
}
/**
 * **消息管理器实例**
 * @description 导出的消息管理器单例
 * */
export const MessageManager = new MessageManagerTypeImpl();

/**
 * 模块导入
 * @description 导入 Vue 创建应用和渲染函数
 */
import { createApp, h } from "vue";
/**
 * 模块导入
 * @description 导入消息组件
 */
import MMessage from "./pa-message.vue";
/**
 * 模块导入
 * @description 导入消息相关类型
 */
import type { MessageOptions, MessageInstance, MessageManagerType } from "./types.d.ts";

class MessageManagerTypeImpl implements MessageManagerType {
  /**
   * 消息列表
   * @description 当前显示的所有消息实例
   */
  Messages: Array<MessageInstance> = [];
  /**
   * 基础层级
   * @description 消息的基础 z-index 值
   */
  zIndex = 2050;

  add(options: MessageOptions): MessageInstance {
    const id = `Message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const languageKey = (typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN";
    const mergedOptions = {
      ...options,
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
        window.removeEventListener("Message-closed", handleClose as EventListener);
        this.close(id);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("Message-closed", handleClose as EventListener);
    }

    setTimeout(() => {
      this.repositionMessages();
    }, 100);
    return instance;
  }

  close(id: string, forceClose?: boolean): void {
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

  closeAll(): void {
    this.Messages.forEach(instance => {
      instance.vm.$el.__vnode.ctx.exposed.close();
    });
  }

  getOffset(): number {
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

  setOffset(id: string, offset: number): void {
    const instance = this.Messages.find(Message => Message.id === id);
    if (instance && instance.vm.$el) {
      instance.vm.$el.style.top = `${offset}px`;
    }
  }

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
 * 消息管理器实例
 * @description 导出的消息管理器单例
 */
export const MessageManager = new MessageManagerTypeImpl();

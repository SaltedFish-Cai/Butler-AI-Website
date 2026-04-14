import { createApp, h } from "vue";
import MMessage from "./m-message.vue";
import type { MessageOptions, MessageInstance, MessageManagerType } from "./type";

// 消息管理器实现
class MessageManagerTypeImpl implements MessageManagerType {
  Messages: MessageInstance[] = [];
  zIndex = 2050;

  // 添加消息
  add(options: MessageOptions): MessageInstance {
    // 生成唯一ID
    const id = `Message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const languageKey = window.ManagerGlobalConfig.language || "zh-CN";

    // 合并默认选项
    const mergedOptions = {
      ...options,
      title: typeof options.title === "string" ? options.title : options.title?.[languageKey] || "",
      message: typeof options.message === "string" ? options.message : options.message?.[languageKey] || "",
      zIndex: options.zIndex || this.zIndex++,
      position: "center"
    };

    // 创建DOM容器
    const container = document.createElement("div");
    container.id = `m-message-container-${id}`;
    document.body.appendChild(container);

    // 创建Vue应用实例
    const app = createApp({
      render: () =>
        h(MMessage, {
          id,
          options: mergedOptions
        })
    });

    // 挂载应用
    const vm = app.mount(container);

    // 创建消息实例
    const instance: MessageInstance = {
      id,
      vm,
      options: mergedOptions,
      close: () => {
        this.close(id);
      }
    };

    // 添加到消息列表
    this.Messages.unshift(instance);

    // 监听关闭事件
    const handleClose = (event: CustomEvent) => {
      if (event.detail.id === id) {
        this.close(id);
        window.removeEventListener("Message-closed", handleClose as EventListener);
      }
    };
    window.addEventListener("Message-closed", handleClose as EventListener);

    setTimeout(() => {
      this.repositionMessages();
    }, 100);

    return instance;
  }

  // 关闭单个消息
  close(id: string, forceClose: boolean = false): void {
    const index = this.Messages.findIndex(Message => Message.id === id);
    if (index !== -1) {
      const instance = this.Messages[index];
      // 移除DOM
      if (instance.vm.$el && instance.vm.$el.parentNode) {
        instance.vm.$el.parentNode.removeChild(instance.vm.$el);
      }
      // 卸载Vue应用
      instance.vm.$.appContext.app.unmount();
      if (!forceClose) {
        // 从列表中移除
        this.Messages.splice(index, 1);
        // 重新计算其他消息的偏移量
        this.repositionMessages();
      }
      // 移除DOM容器
      document.getElementById(`m-message-container-${id}`)?.remove();
    }
  }

  // 关闭所有消息
  closeAll(): void {
    this.Messages.forEach(instance => {
      instance.vm.$el.__vnode.ctx.exposed.close();
    });
    // this.Messages = [];
  }

  // 获取指定位置的偏移量
  getOffset(): number {
    const baseOffset = 20;
    const gap = 16;

    // // 筛选相同位置的消息
    // const samePositionMessages = this.Messages.filter(Message => Message.options.position === "center");
    // if (this.Messages.length === 1 || samePositionMessages.length === 0) {
    //   return baseOffset;
    // }
    const samePositionMessages = this.Messages;

    // 计算最大偏移量
    const lastMessage = samePositionMessages[samePositionMessages.length - 1];
    const lastEl = lastMessage.vm.$el;

    if (!lastEl) {
      return baseOffset;
    }

    const lastHeight = lastEl.offsetHeight;
    const lastOffset = lastMessage.options.offset || baseOffset;

    return lastOffset + lastHeight + gap;
  }

  // 设置指定消息的偏移量
  setOffset(id: string, offset: number): void {
    const instance = this.Messages.find(Message => Message.id === id);
    if (instance && instance.vm.$el) {
      instance.vm.$el.style.top = `${offset}px`;
    }
  }

  // 重新定位所有消息
  private repositionMessages(): void {
    // 按位置分组消息
    const MessagesByPosition: Record<string, MessageInstance[]> = {};
    this.Messages.forEach(Message => {
      const position = "center";

      if (!MessagesByPosition[position]) {
        MessagesByPosition[position] = [];
      }
      MessagesByPosition[position].push(Message);
    });

    // 对每个位置的消息重新计算偏移量
    Object.keys(MessagesByPosition).forEach(position => {
      const Messages = MessagesByPosition[position];
      let offset = 20;

      Messages.forEach(Message => {
        Message.vm.$el.style.top = `${offset}px`;
        // 更新下一个消息的偏移量
        const el = Message.vm.$el;
        if (el) {
          offset += el.offsetHeight + 16;
        }
      });
    });
  }
}

// 导出消息管理器实例
export const MessageManager = new MessageManagerTypeImpl();

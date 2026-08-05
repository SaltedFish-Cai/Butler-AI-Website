import type { Component } from "vue";

export type PhoneModel = "14-pro" | "14" | "15-pro" | "15" | "plain" | "x";

export interface DeviceSpec {
  w: number;
  h: number;
  radius: number;
  bezel: number;
  topSafe: number;
  bottomSafe: number;
  notch?: { w: number; h: number; r: number };
  island?: { w: number; h: number; r: number };
}

export interface WorkshopComponent {
  id: string;
  type: string;
  [key: string]: unknown;
}

export interface PaPhoneProps {
  model?: PhoneModel;
  color?: string;
  wallpaper?: string;
  bezel?: number;
  radius?: number;
  showIsland?: boolean | null;
  showNotch?: boolean | null;
  showHomeIndicator?: boolean;
  screenBg?: string;
  navTitle?: string | false;
  navBg?: string;
  navTitleColor?: string;
  loading?: boolean;
  /** 工作台组件渲染模式 */
  workshopMode?: boolean;
  workshopComponents?: WorkshopComponent[];
  workshopSelectedId?: string | null;
  workshopRenderer?: (type: string) => Component | undefined;
  workshopLabel?: (type: string) => string;
  /** 动态组件模式：直接传入编译好的 Vue 组件实例，通过 <component :is="dynamicComp" /> 渲染 */
  dynamicComp?: Component | null;
  /** SFC 源码模式：传入 .vue 源码字符串，自动编译并渲染 */
  sfcSource?: string;
  /** SFC 上下文：向动态 SFC 注入自定义方法和数据，动态代码通过 ctx.xxx 访问 */
  sfcContext?: Record<string, unknown>;
}

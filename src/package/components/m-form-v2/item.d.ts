import { MFormV2ItemType } from "./type";

export type GroupItemPropsType = {
  id: string;
  item: MFormV2ItemType;
};

export type TabsItemPropType = {
  id: string;
  item: MFormV2ItemType;
  rules: Record<string, FormItemRule | FormItemRule[]>;
};

export type SlotItemsPropsType = { item: MFormV2ItemType; data?: Record<string, string>; labelWidth?: number };

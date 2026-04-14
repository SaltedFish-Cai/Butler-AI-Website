import { SaFormItemType } from "./type";

export type GroupItemPropsType = {
  id: string;
  item: SaFormItemType;
};

export type TabsItemPropType = {
  id: string;
  item: SaFormItemType;
  rules: Record<string, FormItemRule | FormItemRule[]>;
};

export type SlotItemsPropsType = { item: SaFormItemType; data?: Record<string, string>; labelWidth?: number };

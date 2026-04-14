// # type
export type tableParamsType = {
  fieldName: string;
  fieldValue: string;
  conditionalType: string;
};

export type systemParamsType = {
  keys: string;
};

export type dictType = {
  key: string;
  dictionaryType: "system" | "table";
  tableName?: string;
  columnName?: string;
  dictionaryKey?: string;
  params?: systemParamsType | tableParamsType[];
};

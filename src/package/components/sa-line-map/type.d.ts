export type PropsDataConfigType = objectType & {
  id: string;
  place: { x: number; y: number; width?: number; height?: number };
  condition?: objectType;
  children?: PropsDataConfigType[];
};

export type DefaultPropsDataConfigType = {
  steps: { id: string; place: { x: number; y: number; width?: number; height?: number } }[];
  lines: { to: string; from: string }[];
};

// export type BaseDataConfigType = {
//   id: string;
//   place: { x: number; y: number; width?: number; height?: number };
// };

export type DataConfigType = {
  id: string;
  place: { x: number; y: number; width?: number; height?: number };
  parent: string[];
  children: string[];
  data?: objectType;
  condition?: objectType;
};

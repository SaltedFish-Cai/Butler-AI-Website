declare module "*.vue" {
  const component: import("vue").DefineComponent<{}, {}, any>;
  export default component;
}

declare module "Pancake-UI" {
  const demoblock: (md: any) => void;
  export default demoblock;
}

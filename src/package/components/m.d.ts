import mButton from "./m-button/m-button.vue";

declare module "vue" {
  interface GlobalComponents {
    mButton: typeof mButton;
  }

  interface AppContext {
    app: App;
    config: AppConfig;
    mixins: ComponentOptions[];
    components: Record<string, Component>;
    directives: Record<string, Directive>;
    provides: Record<string | symbol, any>;
    globalMethod: {
      getManagerV2GlobalZIndex: () => number;
    };
  }
}

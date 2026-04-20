import { h, watch } from "vue";
import DefaultTheme from "vitepress/theme"; //引入默认主题
import { useData, EnhanceAppContext } from "vitepress";
import { createMediumZoomProvider } from "../../src/components/box-nav/composable/useMediumZoom";
import { advancedQueryApi, groupAdvancedQueryApi, addressApi } from "../../public/file/mock-api";

// >-------------> 组件 <------------<
import demo from "../../src/demo-block/demo.vue";

import CodeView from "../../src/components/box-code-view/index.vue";

import MNavVisitor from "../../src/components/box-nav/MNavVisitor.vue";
import MDocFooter from "../../src/components/box-nav/MDocFooter.vue";
// import MAsideSponsors from "../../src/components/box-nav/MAsideSponsors.vue";
import NavLinks from "../../src/components/box-nav/NavLinks.vue";

// 首页装饰组件
import HomeDecorations from "./components/HomeDecorations.vue";

import directives from "../../src/directives/index";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@nutui/touch-emulator";
import "@nutui/nutui/dist/style.css";
import "vant/lib/index.css";

// import { mIcon, mButton, mTable, mForm } from "../../src/package/index";
import PancakeUI from "../../src/package/index";

// import ManagerUi from "../../PancakeUI/es/index";
// import "../../PancakeUI/es/style.css";

// scss
import "../../src/styles/custom.scss";
import "../../src/styles/theme.scss";
import "../../src/styles/flex.scss";
import "../../src/styles/mp.scss";

// 导出vitepress配置
export default {
  ...DefaultTheme,
  NotFound: () => "custom 404",
  Layout: () => {
    const props: Record<string, any> = {};
    // 获取 frontmatter
    const { frontmatter } = useData();

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(DefaultTheme.Layout, props, {
      /**
       * 相关插槽
       * https://vitepress.dev/guide/extending-default-theme#layout-slots
       * https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/Layout.vue
       */
      "nav-bar-title-after": () => h(MNavVisitor)
      // "doc-after": () => h(MDocFooter),
      // "aside-bottom": () => h(MAsideSponsors)
    });
  },
  enhanceApp({ app, router }: EnhanceAppContext) {
    createMediumZoomProvider(app, router);
    app.mixin({
      async beforeMount() {
        import("vue-json-viewer").then(module => {
          if (!app._context.components[module.default.name]) app.use(module.default);
        });
      }
    });
    app.use(ElementPlus);
    app.use(directives);
    app.use(PancakeUI, {
      apiBaseUrl: "",
      requestHeader: {
        Authorization: "",
        Version: 2026010101
      },
      tableConfig: {
        groupAdvancedQueryApi: groupAdvancedQueryApi,
        advancedQueryApi: advancedQueryApi,
        useSeniorFilter: true
      },
      formConfig: {
        addressApi: addressApi,
        fileApi: {
          url: "/UploadFile/UploadFiles",
          type: "post",
          fileApi: "/",
          downloadApi: "/UploadFile/getfile?filepath="
        }
      }
    });

    // app.use(mIcon);
    // app.use(mButton);
    // app.use(mTable);
    // app.use(mForm, { token: "token" });

    app.component("CodeView", CodeView);

    app.component("demo", demo);

    app.component("NavLinks", NavLinks);
    
    // 注册首页装饰组件
    app.component("HomeDecorations", HomeDecorations);

    app.provide("DEV", process.env.NODE_ENV === "development");
    const _window: any = typeof window == "undefined" ? global : window;
    _window.app = app;
    if (typeof window !== "undefined") {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === "/"),
        { immediate: true }
      );
    }
  }
};

let homePageStyle: HTMLStyleElement | undefined;
// Speed up the rainbow animation on home page
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return;

    homePageStyle = document.createElement("style");
    homePageStyle.innerHTML = `
      :root {
        animation: rainbow 12s linear infinite;
      }`;
    document.body.appendChild(homePageStyle);
  } else {
    if (!homePageStyle) return;

    homePageStyle.remove();
    homePageStyle = undefined;
  }
}

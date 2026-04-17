<script setup lang="ts">
// import docsearch from "@docsearch/js";
// import "@docsearch/css";

import { useRoute, useRouter } from "vitepress";
import type { DefaultTheme } from "vitepress/theme";
import { nextTick, onMounted, watch } from "vue";
import { useData } from "../composables/data";

const props = defineProps<{
  algolia: DefaultTheme.AlgoliaSearchOptions;
}>();

const router = useRouter();
const route = useRoute();
const { site, localeIndex, lang } = useData();

type DocSearchProps = Parameters<typeof docsearch>[0];

onMounted(update);
watch(localeIndex, update);

async function update() {
  await nextTick();
  const options = {
    ...props.algolia,
    ...props.algolia.locales?.[localeIndex.value]
  };
  const rawFacetFilters = options.searchParameters?.facetFilters ?? [];
  const facetFilters = [
    ...(Array.isArray(rawFacetFilters) ? rawFacetFilters : [rawFacetFilters]).filter(f => !f.startsWith("lang:")),
    `lang:${lang.value}`
  ];
  initialize({
    ...options,
    searchParameters: {
      ...options.searchParameters,
      facetFilters
    }
  });
}

function initialize(userOptions: DefaultTheme.AlgoliaSearchOptions) {
  const options = Object.assign<{}, DefaultTheme.AlgoliaSearchOptions, Partial<DocSearchProps>>({}, userOptions, {
    container: "#docsearch",

    // --- 关键修改：开启 AI 必须项 ---
    insights: true,

    navigator: {
      navigate({ itemUrl }) {
        const { pathname: hitPathname } = new URL(window.location.origin + itemUrl);

        // router doesn't handle same-page navigation so we use the native
        // browser location API for anchor navigation
        if (route.path === hitPathname) {
          window.location.assign(window.location.origin + itemUrl);
        } else {
          router.go(itemUrl);
        }
      }
    },

    transformItems(items) {
      return items.map(item => {
        return Object.assign({}, item, {
          url: getRelativePath(item.url)
        });
      });
    }
  }) as DocSearchProps;

  // docsearch({ options });

  // !(function (e, a, t, n, s, i, c) {
  //   (e.AlgoliaAnalyticsObject = s),
  //     (e[s] =
  //       e[s] ||
  //       function () {
  //         (e[s].queue = e[s].queue || []).push(arguments);
  //       }),
  //     (i = a.createElement(t)),
  //     (c = a.getElementsByTagName(t)[0]),
  //     (i.async = 1),
  //     (i.src = n),
  //     c.parentNode.insertBefore(i, c);
  // })(window, document, "script", "https://cdn.jsdelivr.net/npm/search-insights@2.11.0", "insights");

  // window.insights("init", {
  //   appId: options.appId,
  //   apiKey: options.apiKey,
  //   useCookie: true
  // });

  // docsearch({
  //   container: "#docsearch",
  //   appId: "IAB2LW1YC9",
  //   apiKey: "7137ff10d7023a7fd954b56a313c2076",
  //   indexName: "saltedfish.frontend-m.online",
  //   insights: true, // 必须开启，AI 依赖事件追踪
  //   askAi: "M7l8pndQS3kV"
  // });

  window.docsearch({
    container: "#docsearch",
    ...options
  });
}

function getRelativePath(url: string) {
  const { pathname, hash } = new URL(url, location.origin);
  return pathname.replace(/\.html$/, site.value.cleanUrls ? "" : ".html") + hash;
}
</script>

<template>
  <div id="docsearch" />
</template>

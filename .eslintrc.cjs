// @see: http://eslint.cn

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // 指定如何解析语法
  parser: "vue-eslint-parser",
  // 优先级低于 parse 的语法解析配置
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["spellcheck"],

  // 继承某些已有的规则
  extends: ["plugin:vue/vue3-recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  /**
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    // eslint (http://eslint.cn/docs/rules)
    "no-var": "error", // 要求使用 let 或 const 而不是 var
    "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
    "prefer-const": "warn", // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    "no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
    "no-irregular-whitespace": "off", // 禁止不规则的空白

    // typeScript (https://typescript-eslint.io/rules)
    "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
    "@typescript-eslint/prefer-ts-expect-error": "error", // 禁止使用 @ts-ignore
    "@typescript-eslint/no-inferrable-types": "off", // 可以轻松推断的显式类型可能会增加不必要的冗长
    "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
    "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
    "@typescript-eslint/ban-types": "off", // 禁止使用特定类型
    "@typescript-eslint/explicit-function-return-type": "off", // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    "@typescript-eslint/no-var-requires": "off", // 不允许在 import 语句中使用 require 语句
    "@typescript-eslint/no-empty-function": "off", // 禁止空函数
    "@typescript-eslint/no-use-before-define": "off", // 禁止在变量定义之前使用它们
    "@typescript-eslint/ban-ts-comment": "off", // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    "@typescript-eslint/no-non-null-assertion": "off", // 不允许使用后缀运算符的非空断言(!)
    "@typescript-eslint/explicit-module-boundary-types": "off", // 要求导出函数和类的公共类方法的显式返回和参数类型
    "@typescript-eslint/sort-type-constituents": "error", // 强制类型并集/交集的组成部分按字母顺序排序
    "@typescript-eslint/prefer-ts-expect-off": "off", // 强制使用@ts expect off而不是@ts ignore
    "@typescript-eslint/prefer-optional-chain": "off", // 强制使用简明的可选链表达式，而不是链式的逻辑AND、求反的逻辑or或空对象
    "@typescript-eslint/prefer-literal-enum-member": "off", //要求所有枚举成员都是文字值
    "@typescript-eslint/prefer-includes": "off", // 将includes方法强制于indexOf方法
    "@typescript-eslint/prefer-function-type": "off", // 强制使用函数类型，而不是具有调用签名的接口
    "@typescript-eslint/prefer-for-of": "off", // 在可能的情况下，强制使用for的循环而不是标准的for循环
    "@typescript-eslint/prefer-enum-initializers": "off", // 要求显式初始化每个枚举成员值
    "@typescript-eslint/no-useless-template-literals": "off", // 不允许使用不必要的模板文字
    "@typescript-eslint/no-useless-empty-export": "off", // 不允许不更改模块文件中任何内容的空导出
    "@typescript-eslint/no-unsafe-enum-comparison": "off", // 不允许将枚举值与非枚举值进行比较
    "@typescript-eslint/no-unsafe-assignment": "off", // 不允许将类型为any的值分配给变量和属性
    "@typescript-eslint/no-unsafe-argument": "off", // 不允许调用具有任意类型值的函数
    "@typescript-eslint/no-unnecessary-type-constraint": "off", // 不允许对泛型类型进行不必要的约束
    "@typescript-eslint/no-unnecessary-type-assertion": "off", // 不允许不更改表达式类型的类型断言
    "@typescript-eslint/no-unnecessary-condition": "off", // 不允许条件句的类型总是正确的或总是错误的
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off", // 不允许与布尔文字进行不必要的相等比较
    "@typescript-eslint/no-this-alias": "off", // 不允许对此进行混叠
    "@typescript-eslint/no-restricted-imports": "off", // 通过导入加载时不允许使用指定的模块
    "@typescript-eslint/no-require-imports": "off", // 不允许调用require（）
    "@typescript-eslint/no-redundant-type-constituents": "off", // 不允许不执行任何操作或覆盖类型信息的并集和交集的成员
    "@typescript-eslint/no-non-null-assertion": "off", // 不允许使用非null断言！后缀运算符
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off", // 不允许在可选链表达式之后使用非null断言
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "off", // 不允许在null合并运算符的左操作数中使用非null断言
    "@typescript-eslint/no-namespace": "off", // 不允许使用TypeScript命名空间
    "@typescript-eslint/no-misused-promises": "off", // 不允许在不适合处理承诺的地方做出承诺
    "@typescript-eslint/no-meaningless-void-operator": "off", // 除非用于放弃值，否则不允许使用void运算符
    "@typescript-eslint/no-inferrable-types": "off", // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    "@typescript-eslint/no-import-type-side-effects": "off", // 当导入只有带内联类型限定符的说明符时，强制使用顶级导入类型限定符
    "@typescript-eslint/no-for-in-array": "off", // 不允许在循环中使用for对数组进行迭代
    "@typescript-eslint/no-floating-promises": "off", // 要求对类似Promise的语句进行适当处理
    "@typescript-eslint/no-extra-non-null-assertion": "off", // 不允许额外的非null断言
    "@typescript-eslint/no-explicit-any": "off", // 不允许任何类型
    "@typescript-eslint/no-empty-interface": "off", // 不允许声明空接口
    "@typescript-eslint/no-empty-function": "error", // 不允许使用空函数
    "@typescript-eslint/no-dynamic-delete": "off", // 不允许在计算键表达式上使用delete运算符
    "@typescript-eslint/no-duplicate-type-constituents": "off", // 不允许并集或交集类型的重复组成部分
    "@typescript-eslint/no-duplicate-enum-values": "off", // 不允许重复的枚举成员值
    "@typescript-eslint/no-confusing-void-expression": "off", // 要求void类型的表达式出现在语句位置
    "@typescript-eslint/no-confusing-non-null-assertion": "off", // 不允许在可能混淆的位置使用非null断言
    "@typescript-eslint/no-array-delete": "off", // 不允许对数组值使用delete运算符
    "@typescript-eslint/no-array-constructor": "off", // 不允许使用泛型数组构造函数
    "@typescript-eslint/method-signature-style": "off", // 使用特定的方法签名语法强制执行
    "@typescript-eslint/explicit-module-boundary-types": "off", // 在导出的函数和类的公共类方法上需要显式的返回和参数类型
    "@typescript-eslint/explicit-function-return-type": "off", // 需要函数和类方法的显式返回类型
    "@typescript-eslint/consistent-type-exports": "off", // 强制一致使用类型导出
    "@typescript-eslint/consistent-type-definitions": "off", // 强制类型定义一致地使用接口或类型
    "@typescript-eslint/ban-types": "off", // 不允许某些类型
    "@typescript-eslint/ban-tslint-comment": "off", // 不允许//tslint:<rule-flag>注释
    "@typescript-eslint/ban-ts-comment": "off", // 不允许@ts-<指令>注释，或要求在指令后进行说明
    "@typescript-eslint/await-thenable": "off", // 不允许等待一个不是Thenable的值
    "@typescript-eslint/array-type": "off", // 要求对数组始终使用T[]或Array＜T＞
    "@typescript-eslint/adjacent-overload-signatures": "off", // 要求函数重载签名是连续的

    // vue (https://eslint.vuejs.org/rules)
    "vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
    "vue/v-slot-style": "error", // 强制执行 v-slot 指令样式
    "vue/no-mutating-props": "off", // 不允许组件 prop的改变
    "vue/no-v-html": "off", // 禁止使用 v-html
    "vue/custom-event-name-casing": "off", // 为自定义事件名称强制使用特定大小写
    "vue/attributes-order": "off", // vue api使用顺序，强制执行属性顺序
    "vue/one-component-per-file": "off", // 强制每个组件都应该在自己的文件中
    "vue/html-closing-bracket-newline": "off", // 在标签的右括号之前要求或禁止换行
    "vue/max-attributes-per-line": "off", // 强制每行的最大属性数
    "vue/multiline-html-element-content-newline": "off", // 在多行元素的内容之前和之后需要换行符
    "vue/singleline-html-element-content-newline": "off", // 在单行元素的内容之前和之后需要换行符
    "vue/attribute-hyphenation": "off", // 对模板中的自定义组件强制执行属性命名样式
    "vue/require-default-prop": "off", // 此规则要求为每个 prop 为必填时，必须提供默认值
    "vue/multi-word-component-names": "off", // 要求组件名称始终为 “-” 链接的单词

    "spellcheck/spell-checker": [
      1,
      {
        comments: false,
        strings: false,
        identifiers: true,
        lang: "en_US",
        skipWords: [
          "nanoid",
          "wechatcmsapi",
          "Wechat",
          "WechatTag",
          "visibilitychange",
          "Braun",
          "Berun",
          "dayjs",
          "apng",
          "minmax",
          "resize",
          "Flowable",
          "axios",
          "vnode",
          "Scrollbar",
          "autofocus",
          "Biao",
          "brotli",
          "cascader",
          "commitlint",
          "slugify",
          "copyable",
          "contentleft",
          "contentright",
          "daterange",
          "datetimerange",
          "echarts",
          "fangda",
          "geeker",
          "minify",
          "Gitee",
          "hexs",
          "iconfont",
          "juejin",
          "dropdownMenuVisible",
          "liquidfill",
          "longpress",
          "monthrange",
          "newapi",
          "nprogress",
          "officedocument",
          "openxmlformats",
          "Pageable",
          "persistedstate",
          "pinia",
          "pjpeg",
          "Prefixs",
          "sortablejs",
          "sousuo",
          "spreadsheetml",
          "styl",
          "stylelint",
          "stylelintignore",
          "stylelintrc",
          "suoxiao",
          "truetype",
          "unplugin",
          "VITE",
          "vuedraggable",
          "vueuse",
          "Vuex",
          "wangeditor",
          "xiaoxi",
          "debounce",
          "debounced",
          "zhongyingwen",
          "zhuti",
          "linkify",
          "clearable",
          "getters",
          "textarea",
          "Tooltip",
          "tooltip",
          "nocheck",
          "demoblock",
          "pathname",
          "glyphs",
          "Guids",
          "charset",
          "formatter",
          "Identifer",
          "weChart",
          "renderer",
          "Recordable",
          "Mobilenumber"
        ],
        skipIfMatch: [
          "/newapi/[^s]*",
          "use[^s]*",
          "on[^s]*",
          "drop[^s]*",
          "ex[^s]*",
          "before[^s]*",
          "Uint[^s]*",

          "^[-\\w]+/[-\\w\\.]+$" //For MIME Types
        ],
        skipWordIfMatch: [
          "^foobar.*$" // words that begin with foobar will not be checked
        ],
        minLength: 5
      }
    ]
  }
};

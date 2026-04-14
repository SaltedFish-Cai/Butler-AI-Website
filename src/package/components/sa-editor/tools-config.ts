export const toolsConfig = [
  // {
  //   command: "",
  //   icon: "line-height",
  //   title: "字体",
  //   children: [

  //   ]
  // },
  {
    command: "fontSizeArray",
    icon: "14px",
    title: "字体大小",
    children: [
      { command: "fontSize", icon: "check-square", title: "12px", value: "12px" },
      { command: "fontSize", icon: "check-square", title: "14px", value: "14px" },
      { command: "fontSize", icon: "check-square", title: "16px", value: "16px" },
      { command: "fontSize", icon: "check-square", title: "18px", value: "18px" },
      { command: "fontSize", icon: "check-square", title: "20px", value: "20px" },
      { command: "fontSize", icon: "check-square", title: "24px", value: "24px" },
      { command: "fontSize", icon: "check-square", title: "28px", value: "28px" },
      { command: "fontSize", icon: "check-square", title: "32px", value: "32px" },
      { command: "fontSize", icon: "check-square", title: "36px", value: "36px" }
    ]
  },
  {
    command: "formatBlockArray",
    icon: "h1",
    title: "标题",
    children: [
      { command: "formatBlock", icon: "h1", title: "标题1", value: "<h1>" },
      { command: "formatBlock", icon: "h2", title: "标题2", value: "<h2>" },
      { command: "formatBlock", icon: "h3", title: "标题3", value: "<h3>" },
      { command: "formatBlock", icon: "h4", title: "标题4", value: "<h4>" },
      { command: "formatBlock", icon: "h5", title: "标题5", value: "<h5>" },
      { command: "formatBlock", icon: "h6", title: "标题6", value: "<h6>" }
      // { command: "formatBlock", icon: "line-height", title: "正文", value: "<p>" }
    ]
  },

  { command: "bold", icon: "bold", title: "加粗" },
  { command: "italic", icon: "italic", title: "斜体" },
  { command: "underline", icon: "underline", title: "下划线" },
  { command: "strikeThrough", icon: "strikethrough", title: "删除线" },

  { command: "justifyLeft", icon: "align-left", title: "左对齐" },
  { command: "justifyCenter", icon: "align-center", title: "居中对齐" },
  { command: "justifyRight", icon: "align-right", title: "右对齐" },

  {
    command: "backColor",
    icon: "bg-colors",
    title: "背景色"
  },
  {
    command: "foreColor",
    icon: "font-colors",
    title: "字体颜色"
  },

  {
    command: "unorderedLst",
    icon: "unordered-list",
    title: "列表",
    children: [
      { command: "insertUnorderedList", icon: "unordered-list", title: "无序列表" },
      { command: "insertOrderedList", icon: "ordered-list", title: "有序列表" }
    ]
  },
  {
    command: "",
    icon: "menu-unfold",
    title: "缩进",
    children: [
      { command: "indent", icon: "menu-unfold", title: "增加缩进" },
      { command: "outdent", icon: "menu-fold", title: "减少缩进" }
    ]
  },

  {
    command: "createLink",
    icon: "link",
    title: "链接"
    // children: [
    //   { command: "createLink", icon: "link", title: "插入链接" },
    //   { command: "unlink", icon: "unlink_line", title: "移除链接" }
    // ]
  },

  {
    command: "insertImage",
    icon: "image",
    title: "插入图片"
  },
  {
    command: "insertTable",
    icon: "apps",
    title: "插入表格"
  },

  { command: "sourceCode", icon: "code-square", title: "源码" },

  { command: "visible", icon: "eye", title: "预览" },
  // 撤销和恢复按钮
  { command: "undo", icon: "undo", title: "撤销" },
  { command: "redo", icon: "redo", title: "恢复" },

  { command: "removeFormat", icon: "eraser", title: "清除格式" },
  { command: "fullscreen", icon: "fullscreen", title: "全屏" }
];

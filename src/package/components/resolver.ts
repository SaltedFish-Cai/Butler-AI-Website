//  样式文件路径映射
// const styleMap = {
//   ElButton: "element-plus/es/components/button/style/css"
//   // ...更多样式映射
// };
function kebabCase(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .join("-")
    .toLowerCase();
}
function resolveComponent$1(name, options) {
  if (options.exclude && name.match(options.exclude)) return;
  console.log("+++++1+++++> name:", name);
  if (!name.match(/^Sa[A-Z]/)) return;

  const partialName = kebabCase(name.slice(0));
  let partialNameItem = `${partialName}`;

  if (partialName.includes("-item")) {
    partialNameItem = partialName.replace("-item", "");
  } else if (partialName.includes("-group")) {
    partialNameItem = partialName.replace("-group", "");
  }
  return {
    from: `SaltedU/${partialNameItem}/${partialName}.vue`
    // sideEffects: getSideEffectsLegacy(partialName, options)
  };
}

export function ManagerResolver() {
  return [
    {
      type: "component",
      resolve: async name => {
        // const options$1 = await resolveOptions();
        // if ([...options$1.noStylesComponents, ...noStylesComponents].includes(name))
        //   return resolveComponent$1(name, {
        //     ...options$1,
        //     importStyle: false
        //   });
        // else
        return resolveComponent$1(name, {});
      }
    }
  ];
  // return {
  //   // 解析组件的方法
  //   resolveComponent(componentName) {
  //     console.log("===========> componentName", componentName);
  //     // 只处理Element Plus组件（以El开头）
  //     if (componentName.startsWith("El")) {
  //       // 查找组件映射
  //       const path = componentMap[componentName];

  //       if (path) {
  //         return {
  //           from: path,
  //           name: componentName
  //         };
  //       }
  //     }
  //   },

  //   // 解析样式的方法
  //   resolveStyle(componentName) {
  //     console.log("===========> componentName", componentName);
  //     return;
  //     // // 如果不需要导入样式，直接返回
  //     // if (importStyle === false) return;

  //     // if (componentName.startsWith("El")) {
  //     //   // 根据配置返回对应的样式路径
  //     //   if (importStyle === "scss") {
  //     //     return `${componentMap[componentName]}/style`;
  //     //   } else {
  //     //     return styleMap[componentName];
  //     //   }
  //     // }
  //   }
  // };
}

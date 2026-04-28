1. 获取代码

   - 从 GitHub 仓库中获取最新代码
   - 代码地址：https://github.com/SaltedFish-Cai/Butler-AI-Website.git
   - 分支：butler-dev

2. 阅读 development-guide.md 文件

   - 该文件包含了项目的开发规范，包括代码规范、样式规范、事件组件开发规范等

3. 开发原则

   - Think Before Coding — 先思考再写，不确定就问
   - Simplicity First — 最少代码，不过度设计
   - Surgical Changes — 只改需要的，不碰无关代码
   - Goal-Driven Execution — 定义成功标准，用测试验证

4. 根据需求进行开发

   - 所有开发任务前，都需要先确认 development-guide.md 的名称版本是否发生变化，如果发生变化读取文件内容更新开发规范规则
   - 所有非新建任务，开始前都需要通过 index.ts 中的 install 方法，确认修改组件的范围。

     - 比如安装组件的代码片段如下：

     ```ts
     // #Function install
     const install = function (app) {
       if (!app._context.components["PaColor"]) {
         app.component("PaColor", PaColor);
         app.component("PaColorBox", PaColorBox);
       }
     };
     ```

     - 需要检查和修改的文件路径为：

       - src/package/components/pa-color/pa-color.vue
       - src/package/components/pa-color/pa-color-box.vue

   - 所有样式文件在修改后需要检查 vue 文件中是否有引用该样式，如果有引用，需要同步修改
   - 所有文件修改后都需要进行格式化文档操作保持代码风格一致

     - 使用 Prettier 插件进行代码格式化

   - 如果需求中包含排查任务

     - 先根据需求进行排查，确认问题所在，并询问是否需要修复
     - 确认需要修复后，根据反馈结果进行修复
     - 修复后，使用 Eslint/Tslint 插件 检查代码是否符合规范，确保代码质量
     - 检查文档和类型定义是否同步修复，确保文档和类型定义与代码保持一致

   - 如果需求中包含新增任务

     - 需先确认文件路径，例如 src/components/
     - 根据需求进行新增，确保新增代码符合规范（development-guide.md 中的代码规范）
     - 新增后，使用 Eslint/Tslint 插件 检查新增是否符合规范，确保新增代码质量
     - 检查文档和类型定义是否同步新增，确保文档和类型定义与代码保持一致

   - 如果需求中包含修改任务

     - 需先确认文件路径，例如 src/components/LoginButton.vue
     - 根据需求进行修改，确保修改代码符合规范（development-guide.md 中的代码规范）
     - 修改后，使用 Eslint/Tslint 插件 检查修改是否符合规范，确保修改代码质量
     - 检查文档和类型定义是否同步修改，确保文档和类型定义与代码保持一致

   - 如果需求中包含删除任务

     - 需先确认文件路径，例如 src/components/LoginButton.vue
     - 根据需求进行删除，确保删除代码后符合规范（development-guide.md 中的代码规范）
     - 删除后，使用 Eslint/Tslint 插件 检查删除是否符合规范，确保删除代码后的质量
     - 检查文档和类型定义是否同步删除，确保文档和类型定义与代码保持一致

5. 返回修改文件路径和修改内容，给出代码片段，等待审核确认，

   - 修改文件路径：例如 src/components/LoginButton.vue
   - 修改内容：描述修改内容，例如"修复登录按钮的点击事件，确保用户能够正常登录"
   - 代码片段：例如修复登录按钮的点击事件，确保用户能够正常登录的代码片段
     ```vuets
     // 登录按钮点击事件
     onClick: () => {
       // 登录逻辑
       console.log("登录按钮点击事件触发");
     }
     ```

6. 审核确认后，提交修改到 GitHub 仓库，分支：butler-dev

   - 提交信息：描述修改内容，使用 git 提交信息规范 ，例如"fix: 修复登录页面的登录按钮问题"
   - 提交人： ButlerAi211
   - 提交人邮箱：caiqi211@gmail.com

7. 类型定义修改同步检查（重要）

   - 当从 types.d.ts 中移除属性时，必须同步检查 .vue 文件中是否还有引用
   - 检查命令：`grep -n "props.属性名" src/package/components/pa-xxx/*.vue`
   - 确保所有引用都已移除后，才能提交修改
   - 示例：移除 onChange 属性后，需检查 `props.onChange` 的调用并删除

   - 当修改 types.d.ts 中属性类型时，必须同步检查 .vue 文件中的实际使用
   - 确保 .vue 文件中的代码逻辑与新的类型定义保持一致

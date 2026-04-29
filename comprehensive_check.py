#!/usr/bin/env python3
"""
全面复查脚本 - 检查18个组件的合规性
"""
import os
import re

# 项目路径
PROJECT_ROOT = os.path.expanduser("~/Butler-AI-Website")
DOC_ROOT = os.path.join(PROJECT_ROOT, "document/PancakeUI_Doc")

# 18个组件列表 (目录名, 中文名, 文档目录名)
COMPONENTS = [
    ("pa-icon", "图标", "icon"),
    ("pa-button", "按钮", "button"),
    ("pa-color", "颜色选择器", "color"),
    ("pa-tag", "标签", "tag"),
    ("pa-badge", "徽章", "badge"),
    ("pa-title", "标题", "title"),
    ("pa-empty", "空状态", "empty"),
    ("pa-input", "输入框", "input"),
    ("pa-number", "数字输入框", "number"),
    ("pa-select", "选择器", "select"),
    ("pa-select-icon", "图标选择器", "select-icon"),
    ("pa-cascader", "级联选择器", "cascader"),
    ("pa-checkbox", "多选框", "checkbox"),
    ("pa-radio", "单选框", "radio"),
    ("pa-switch", "开关", "switch"),
    ("pa-time", "时间", "time"),
    ("pa-file", "文件", "file"),
    ("pa-tabs", "选项卡", "tabs"),
]

def check_types_d_ts(component_dir, component_folder):
    """检查 types.d.ts 文件"""
    types_file = os.path.join(component_dir, "types.d.ts")
    errors = []
    
    if not os.path.exists(types_file):
        return [f"types.d.ts 文件不存在"]
    
    with open(types_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查 ComponentProps 定义
    if not re.search(r'export\s+type\s+ComponentProps', content):
        errors.append("缺少 'export type ComponentProps'")
    
    # 检查 id 属性
    if not re.search(r'id\s*\??\s*:\s*string', content):
        errors.append("缺少 id: string 属性")
    
    # 检查 class 属性
    if not re.search(r'class\s*\??\s*:\s*Array<string>\s*\|\s*string', content):
        errors.append("缺少 class: Array<string> | string 属性")
    
    # 检查 style 属性
    if not re.search(r'style\s*\??\s*:\s*Record<string,\s*string>', content):
        errors.append("缺少 style: Record<string, string> 属性")
    
    # 检查 ComponentEmits 格式（如果存在）
    emits_match = re.search(r'export\s+type\s+ComponentEmits(.*?)(?=\n\nexport|\ntype|\Z)', content, re.DOTALL)
    if emits_match:
        emits_content = emits_match.group(1)
        # 检查函数重载格式
        if not re.search(r'\(\s*e\s*:\s*"[^"]+"\s*,\s*[^)]+\)\s*:\s*void', emits_content):
            errors.append("ComponentEmits 格式不正确，应为 (e: \"eventName\", param): void;")
    
    return errors

def check_vue_file(component_dir, component_folder):
    """检查 Vue 文件"""
    vue_file = os.path.join(component_dir, f"{component_folder}.vue")
    errors = []
    warnings = []
    
    if not os.path.exists(vue_file):
        # 尝试其他可能的大小写
        possible_files = [f for f in os.listdir(component_dir) if f.startswith('pa-') and f.endswith('.vue')]
        if not possible_files:
            return [f"{component_folder}.vue 文件不存在 (目录中无 .vue 文件)"], warnings
        vue_file = os.path.join(component_dir, possible_files[0])
        warnings.append(f"Vue 文件名不匹配，使用: {possible_files[0]}")
    
    with open(vue_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查代码顺序
    import_pos = content.find('<script')
    if import_pos == -1:
        errors.append("缺少 <script> 标签")
    else:
        script_end = content.find('</script>', import_pos)
        if script_end == -1:
            errors.append("缺少 </script> 标签")
        else:
            script_content = content[import_pos:script_end]
            
            # 检查 defineEmits 格式
            if re.search(r'defineEmits<ComponentEmits>\(\)', script_content):
                pass  # 正确
            elif re.search(r'defineEmits\s*\(', script_content):
                warnings.append("defineEmits 未使用泛型格式 defineEmits<ComponentEmits>()")
            
            # 检查 JSDoc 注释前是否有空行
            lines = script_content.split('\n')
            for i, line in enumerate(lines):
                stripped = line.strip()
                if stripped.startswith('*') or stripped.startswith('@') or stripped.startswith('/**'):
                    if i > 0:
                        prev_line = lines[i-1].strip()
                        # 跳过 /** 开头的情况
                        if stripped.startswith('/**'):
                            continue
                        # 检查 /** 后面是否紧跟内容
                        if prev_line == '' and i > 1:
                            before_prev = lines[i-2].strip()
                            if before_prev and not before_prev.startswith('/*') and not before_prev.startswith('*'):
                                errors.append(f"JSDoc 注释前有空行")
                                break
    
    return errors, warnings

def check_index_ts(component_dir):
    """检查 index.ts 文件"""
    index_file = os.path.join(component_dir, "index.ts")
    errors = []
    
    if not os.path.exists(index_file):
        return [f"index.ts 文件不存在"]
    
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查 install 函数参数类型 - 支持多种格式
    # function install(app: App) 或 const install = function (app: App)
    if not re.search(r'(function\s+install|const\s+install\s*=\s*function)\s*\([^)]*:\s*App\s*\)', content):
        errors.append("install 函数参数类型应为 App，不是 any")
    
    return errors

def check_index_scss(component_dir, component_folder):
    """检查 index.scss 文件"""
    scss_file = os.path.join(component_dir, "index.scss")
    errors = []
    
    if not os.path.exists(scss_file):
        return [f"index.scss 文件不存在"]
    
    with open(scss_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查根元素类名 - 使用目录名（忽略大小写）
    # 规范是 .pa-{组件名}，目录名如 pa-icon，组件名是 icon，根类名是 .pa-icon
    root_class = rf"\.pa-{re.escape(component_folder.replace('pa-', ''))}"
    if not re.search(root_class, content, re.IGNORECASE):
        errors.append(f"缺少根元素类名 .pa-{component_folder.replace('pa-', '')}")
    
    # 检查单行注释
    if re.search(r'//\s*[^\n]+', content):
        errors.append("index.scss 中存在单行注释 (// xxx)")
    
    return errors

def check_doc(doc_folder, component_folder):
    """检查文档"""
    doc_dir = os.path.join(DOC_ROOT, doc_folder)
    readme_file = os.path.join(doc_dir, "readme.md")
    errors = []
    warnings = []
    
    if not os.path.exists(readme_file):
        return [f"文档不存在: {doc_dir}/readme.md"], warnings
    
    with open(readme_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 从目录名提取组件名（去掉 pa- 前缀，首字母大写）
    component_name = component_folder.replace('pa-', '').title().replace('-', '')
    
    # 检查标题格式
    if not re.search(rf'^#\s+{component_name}\s+', content, re.MULTILINE):
        warnings.append(f"文档标题格式不正确，应为 '# {component_name} {{中文名}}'")
    
    # 检查 ComponentProps 表格
    if not re.search(r'##\s+ComponentProps', content):
        errors.append("缺少 ## ComponentProps 章节")
    
    return errors, warnings

def check_component(component_folder, component_cn, doc_folder):
    """检查单个组件"""
    component_dir = os.path.join(PROJECT_ROOT, "src/package/components", component_folder)
    component_name = component_folder.replace('pa-', '').replace('-', ' ').title().replace(' ', '')
    
    results = {
        "folder": component_folder,
        "name": component_name,
        "cn_name": component_cn,
        "errors": [],
        "warnings": [],
        "files_checked": []
    }
    
    # 检查组件目录
    if not os.path.exists(component_dir):
        results["errors"].append(f"组件目录不存在: {component_dir}")
        return results
    
    # 1. 检查 types.d.ts
    types_errors = check_types_d_ts(component_dir, component_folder)
    if types_errors:
        results["errors"].append(f"[types.d.ts] " + "; ".join(types_errors))
    else:
        results["files_checked"].append("types.d.ts ✓")
    
    # 2. 检查 Vue 文件
    vue_errors, vue_warnings = check_vue_file(component_dir, component_folder)
    if vue_errors:
        results["errors"].append(f"[Vue文件] " + "; ".join(vue_errors))
    else:
        results["files_checked"].append(f"{component_folder}.vue ✓")
    results["warnings"].extend([f"[Vue文件] {w}" for w in vue_warnings])
    
    # 3. 检查 index.ts
    index_errors = check_index_ts(component_dir)
    if index_errors:
        results["errors"].append(f"[index.ts] " + "; ".join(index_errors))
    else:
        results["files_checked"].append("index.ts ✓")
    
    # 4. 检查 index.scss
    scss_errors = check_index_scss(component_dir, component_folder)
    if scss_errors:
        results["errors"].append(f"[index.scss] " + "; ".join(scss_errors))
    else:
        results["files_checked"].append("index.scss ✓")
    
    # 5. 检查文档
    doc_errors, doc_warnings = check_doc(doc_folder, component_folder)
    if doc_errors:
        results["errors"].append(f"[文档] " + "; ".join(doc_errors))
    else:
        results["files_checked"].append("文档 ✓")
    results["warnings"].extend([f"[文档] {w}" for w in doc_warnings])
    
    return results

def main():
    """主函数"""
    print("=" * 80)
    print("开始全面复查 18 个组件的合规性...")
    print("=" * 80)
    
    all_results = []
    total_errors = 0
    total_warnings = 0
    
    for i, (folder, cn_name, doc_folder) in enumerate(COMPONENTS, 1):
        component_name = folder.replace('pa-', '').replace('-', ' ').title().replace(' ', '')
        print(f"\n正在检查 {i}. {component_name} {cn_name}...")
        results = check_component(folder, cn_name, doc_folder)
        all_results.append(results)
        total_errors += len(results["errors"])
        total_warnings += len(results["warnings"])
        
        if results["errors"]:
            print(f"  ❌ 发现 {len(results['errors'])} 个错误")
            for err in results["errors"]:
                print(f"     - {err}")
        else:
            print(f"  ✅ 全部通过")
            for f in results["files_checked"]:
                print(f"     - {f}")
        
        if results["warnings"]:
            print(f"  ⚠️  {len(results['warnings'])} 个警告")
            for warn in results["warnings"]:
                print(f"     - {warn}")
    
    # 输出汇总
    print("\n" + "=" * 80)
    print("复查汇总")
    print("=" * 80)
    print(f"通过组件: {len([r for r in all_results if not r['errors']])} / 18")
    print(f"问题总数: {total_errors} 个错误, {total_warnings} 个警告")
    
    # 输出问题组件列表
    problem_components = [r for r in all_results if r['errors']]
    if problem_components:
        print("\n问题组件:")
        for r in problem_components:
            print(f"  - {r['name']} {r['cn_name']}: {len(r['errors'])} 个错误")
    
    return all_results

if __name__ == "__main__":
    main()

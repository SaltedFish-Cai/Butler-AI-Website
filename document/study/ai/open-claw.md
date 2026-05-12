# Mac Mini M4 24GB 本地部署龙虾（OpenClaw）指南

> 本文档专为 Mac Mini M4 24GB 统一内存设备编写，目标是用 Ollama 运行 Qwen2.5-Coder-7B 本地模型，并对接 OpenClaw（龙虾）框架，实现本地零成本开发辅助。

---

## 一、环境信息

| 项目 | 配置 |
|------|------|
| **设备** | Mac Mini M4 24GB 统一内存 |
| **芯片** | Apple M4 (10核CPU + 10核GPU) |
| **模型** | Qwen2.5-Coder-7B（Q4_K_M 量化） |
| **推理引擎** | Ollama（支持 Metal 加速） |
| **框架** | OpenClaw（龙虾）+ Vue Claw Console |
| **预期** | 本地零成本、数据不上云、开发辅助 |

---

## 二、内存规划

### 24GB 统一内存分配预估

| 组件 | 预计占用 | 说明 |
|------|----------|------|
| **macOS 系统基础** | 4-5 GB | 系统预留，包含内核、Dock、菜单栏等 |
| **Qwen2.5-Coder-7B (Q4)** | 5-6 GB | Q4_K_M 量化版本，Metal 加速加载到统一内存 |
| **VSCode** | 0.5-1.5 GB | 取决于打开的项目规模 |
| **Chrome 浏览器** | 1-3 GB | 每个标签约 100-300MB，建议控制在 10 个标签内 |
| **其他应用余量** | 1-2 GB | 终端、Finder 等基础应用 |
| ****安全余量**** | **6-8 GB** | **必须保留，防止 swap 导致卡顿** |

### 关键原则

```
⚠️ 重要：Apple M 系列芯片使用统一内存，无独立显存概念
     模型直接加载到内存中，内存不足会触发 swap（严重卡顿）

✅ 建议：
   - 保持 6GB+ 空闲内存
   - 开发时关闭不需要的 Chrome 标签页
   - Ollama 加载完模型后，如不使用可等待自动卸载
```

---

## 三、安装 Ollama

### 1. 安装 Ollama

**方式一：官网下载（推荐）**

```bash
# 访问 https://ollama.com/download 下载 macOS 版本
# 或使用 curl 命令直接安装
curl -fsSL https://ollama.com/install.sh | sh
```

**方式二：Homebrew 安装**

```bash
brew install ollama
```

### 2. 验证安装

```bash
# 检查 Ollama 版本
ollama --version

# 预期输出类似：
# ollama version 0.5.x
```

### 3. M4 Metal 加速确认

```bash
# 启动 Ollama 服务（后台运行）
ollama serve

# 在另一个终端窗口测试模型运行（会触发 Metal 加速）
ollama run qwen2.5-coder:7b "你好，介绍一下自己"

# 观察输出，如果使用 Metal 加速，会有类似提示：
# "Using Metal device: Apple M4"
```

---

## 四、拉取模型

### 1. 拉取 Qwen2.5-Coder-7B

```bash
# 拉取 Q4_K_M 量化版本（推荐，大小约 4.7GB）
ollama pull qwen2.5-coder:7b

# 如需更小体积，可选 Q5_K_M（约 5.5GB）或 Q8_0（约 7.2GB）
# ollama pull qwen2.5-coder:7b-q5_k_m
```

> 💡 **为什么选 Q4_K_M？**
> - 大小适中（约 4.7GB）
> - 推理质量接近 FP16
> - M4 24GB 可轻松容纳

### 2. 可选：拉取通用备选模型 Qwen3-8B

```bash
# Qwen3-8B 用于通用对话（需要更大内存，慎用）
ollama pull qwen3:8b

# 或 Qwen3-4B（更轻量，适合简单任务）
ollama pull qwen3:4b
```

### 3. 验证模型列表

```bash
# 查看已下载的模型
ollama list

# 预期输出：
# NAME                      ID           SIZE      MODIFIED
# qwen2.5-coder:7b          a5dcb7c8...  4.7GB     2024-01-15 10:30:00
# qwen3:4b                  b3f9d2e1...  2.6GB     2024-01-15 11:00:00
```

---

## 五、M4 专用优化配置

### 添加环境变量到 ~/.zshrc

```bash
# 打开 .zshrc 文件
nano ~/.zshrc
```

### 复制以下配置（每个参数都有详细注释）

```bash
# =============================================
# Ollama M4 Mac 优化配置
# =============================================

# ---------- 核心加速配置 ----------
# 启用 Apple Metal GPU 加速（M4 必须开启）
export OLLAMA_METAL=1

# 启用 Flash Attention 加速（减少内存占用、提升推理速度）
export OLLAMA_FLASH_ATTENTION=1

# ---------- 内存优化配置 ----------
# KV 缓存量化类型：q8_0（平衡质量和内存）
# 可选值：q4_0, q5_0, q5_1, q8_0
export OLLAMA_KV_CACHE_TYPE=q8_0

# 上下文窗口大小限制（8192 足够代码补全，减少内存占用）
export OLLAMA_CONTEXT_WINDOW=8192

# 同时加载模型数量限制（开发场景建议 1，避免内存溢出）
export OLLAMA_MAX_LOADED_MODELS=1

# 模型空闲保留时间（5分钟后自动卸载，释放内存）
export OLLAMA_KEEP_ALIVE=5m

# ---------- 可选调试配置 ----------
# 调试模式（可选，生产环境建议注释掉）
# export OLLAMA_DEBUG=1

# 日志文件位置（可选）
# export OLLAMA_LOG_LEVEL=debug
```

### 使配置生效

```bash
# 重新加载配置
source ~/.zshrc

# 或者重启 Ollama 服务
pkill -f ollama && ollama serve
```

### 参数说明表

| 参数 | 值 | 作用 |
|------|-----|------|
| `OLLAMA_METAL` | `1` | 启用 M 系列芯片的 GPU 加速，否则 CPU 推理极慢 |
| `OLLAMA_FLASH_ATTENTION` | `1` | 启用 Flash Attention，内存效率提升 30%+ |
| `OLLAMA_KV_CACHE_TYPE` | `q8_0` | KV 缓存量化，平衡质量和内存占用 |
| `OLLAMA_CONTEXT_WINDOW` | `8192` | 最大上下文token数，代码场景 8K 足够 |
| `OLLAMA_MAX_LOADED_MODELS` | `1` | 限制同时加载模型数，避免内存溢出 |
| `OLLAMA_KEEP_ALIVE` | `5m` | 5分钟无请求自动卸载模型 |

---

## 六、安装 OpenClaw（龙虾）

### 1. 一键安装命令

```bash
# 官方安装脚本
curl -sSL https://get.openclaw.tech/install.sh | bash
```

### 2. 国内加速备选

```bash
# 如果官方源慢，可使用镜像
curl -sSL https://ghproxy.com/https://raw.githubusercontent.com/openclaw/openclaw/main/install.sh | bash

# 或使用 jsDelivr CDN
curl -sSL https://cdn.jsdelivr.net/gh/openclaw/openclaw/install.sh | bash
```

### 3. 验证安装

```bash
# 检查 OpenClaw 版本
openclaw --version

# 预期输出：
# OpenClaw version 1.x.x
```

### 4. 如安装失败，手动处理

```bash
# 如果安装脚本有问题，可手动下载二进制
# 访问 https://github.com/openclaw/openclaw/releases 下载对应版本

# 解压并安装
tar -xzf openclaw-darwin-arm64.tar.gz
sudo mv openclaw /usr/local/bin/

# 验证
openclaw --version
```

---

## 七、初始化配置

### 1. 启动引导安装

```bash
openclaw onboard --install-daemon
```

### 2. 配置向导交互

按照提示完成以下配置：

```
? 选择模型供应商：Ollama
? API 地址：http://localhost:11434
? API Key：（留空，本地无需认证）
? 默认模型：qwen2.5-coder:7b
? 其他选项：按回车使用默认值
```

### 3. 手动配置文件（如需要）

```bash
# 配置文件位置
nano ~/.openclaw/config.yaml
```

```yaml
# ~/.openclaw/config.yaml

server:
  host: localhost
  port: 18789

model:
  provider: ollama
  name: qwen2.5-coder:7b
  api_base: http://localhost:11434

# 可选：配置云端 fallback
providers:
  ollama:
    enabled: true
    api_base: http://localhost:11434
  openai:
    enabled: false  # 复杂任务可开启
    api_key: your-api-key-here
```

---

## 八、绑定模型

### 1. 使用命令绑定

```bash
# 设置模型提供商
openclaw config set model.provider ollama

# 设置模型名称
openclaw config set model.name qwen2.5-coder:7b

# 设置 API 地址
openclaw config set model.api_base http://localhost:11434
```

### 2. 重启服务

```bash
# 重启 OpenClaw 服务使配置生效
openclaw restart

# 或手动重启
pkill -f openclaw && openclaw serve
```

---

## 九、启动与验证

### 1. 启动网关

```bash
# 启动 OpenClaw 网关
openclaw gateway

# 预期输出：
# 🚀 OpenClaw Gateway starting on http://localhost:18789
# ✅ Ollama connected: qwen2.5-coder:7b
```

### 2. 启动控制台

```bash
# 在新终端窗口启动控制台
openclaw dashboard

# 或后台运行
openclaw dashboard &
```

### 3. 访问控制台

```
浏览器访问：http://localhost:18789
```

### 4. 测试对话

**方式一：命令行测试**

```bash
openclaw chat "用 Python 写一个快速排序函数"
```

**方式二：控制台测试**

```
1. 打开 http://localhost:18789
2. 在输入框输入问题
3. 观察响应
```

### 5. 验证 Ollama 模型状态

```bash
# 查看当前运行的模型
ollama ps

# 预期输出：
# NAME                 ID       SIZE     MODIFIED
# qwen2.5-coder:7b     a5dcb7c  5.2GB    2 minutes ago
```

---

## 十、开发场景优化

### 同时使用 VSCode + Chrome 调试时的内存管理

#### 内存占用监控

```bash
# 查看内存使用情况
# Activity Monitor 更直观：Command + Space 搜索 "Activity Monitor"

# 或使用命令行
vm_stat 1  # 每秒刷新
```

#### Chrome 内存优化

```bash
# 1. 关闭不需要的标签页（每个标签约 100-300MB）
# 2. 禁用不需要的扩展
# 3. 设置 Chrome 内存限制（可选）
#    添加启动参数：--js-flags="--max-old-space-size=512"
```

#### Ollama 空闲卸载策略

```bash
# 确保设置了自动卸载（已在第五章配置）
# OLLAMA_KEEP_ALIVE=5m

# 手动卸载模型释放内存
ollama stop qwen2.5-coder:7b

# 查看卸载后的可用内存
free -h  # 或在 Activity Monitor 查看
```

#### 开发时内存余量建议

| 场景 | 建议空闲内存 | 操作 |
|------|-------------|------|
| 轻量开发（简单补全） | 6GB+ | 正常加载模型 |
| 重度开发（大型项目） | 8GB+ | 关闭 Chrome 标签页 |
| 需要编译/构建 | 10GB+ | 临时 `ollama stop` 停止模型 |

### 可选：配置云端 API 作为 Fallback

```yaml
# ~/.openclaw/config.yaml

providers:
  ollama:
    enabled: true
    name: qwen2.5-coder:7b
    api_base: http://localhost:11434
    # 简单任务走本地
    max_tokens: 2048
  
  openai:
    enabled: true
    api_key: sk-xxxxx  # 你的 API Key
    # 复杂任务走云端
    model: gpt-4o
    fallback_threshold: 2048  # token 超过此值自动切换
```

---

## 十一、常用命令速查

### Ollama 命令

```bash
ollama list              # 查看已下载模型
ollama ps                # 查看正在运行的模型及内存占用
ollama pull <model>       # 拉取新模型
ollama run <model>        # 运行模型（交互式）
ollama stop <model>       # 停止模型，释放内存
ollama show <model>       # 查看模型信息
ollama rm <model>         # 删除模型
ollama serve              # 启动 Ollama 服务
ollama --version          # 查看版本
```

### OpenClaw 命令

```bash
openclaw --version        # 查看版本
openclaw status           # 查看服务状态
openclaw gateway          # 启动网关
openclaw dashboard        # 启动控制台
openclaw chat "问题"      # 命令行对话
openclaw config set <key> <value>  # 设置配置
openclaw config get <key>         # 获取配置
openclaw restart          # 重启服务
openclaw onboard          # 重新初始化
openclaw help             # 查看帮助
```

### 实用脚本

```bash
# 一键查看 Ollama 和 OpenClaw 状态
#!/bin/bash
echo "=== Ollama 状态 ==="
ollama ps
echo ""
echo "=== OpenClaw 状态 ==="
openclaw status
echo ""
echo "=== 内存使用 ==="
vm_stat | head -5
```

---

## 十二、常见问题排查

### 问题 1：Metal 加速未生效

**症状**：模型运行很慢，使用 CPU 推理

**排查步骤**：

```bash
# 1. 确认环境变量已生效
echo $OLLAMA_METAL
# 应输出：1

# 2. 确认 M4 芯片被识别
system_profiler SPHardwareDataType | grep "Chip"
# 应显示：Apple M4

# 3. 手动设置环境变量后重启
export OLLAMA_METAL=1
pkill -f ollama
ollama serve
```

**解决方案**：

```bash
# 在 ~/.zshrc 中确认添加了：
export OLLAMA_METAL=1

# 然后执行
source ~/.zshrc
```

---

### 问题 2：内存不足 / Swap 卡顿

**症状**：系统变卡，硬盘灯闪烁，提示内存不足

**排查步骤**：

```bash
# 1. 查看内存压力
vm_stat 1 | grep -E "Pages free|Pages active|Pages speculative"

# 2. 查看 Swap 使用
sysctl -a | grep swap

# 3. 查看哪个进程占用最多内存
ps aux --sort=-%mem | head -10
```

**解决方案**：

```bash
# 1. 立即停止模型释放内存
ollama stop qwen2.5-coder:7b

# 2. 减少同时运行的 Chrome 标签页

# 3. 永久优化：降低上下文窗口
export OLLAMA_CONTEXT_WINDOW=4096

# 4. 设置更短的超时时间
export OLLAMA_KEEP_ALIVE=2m

# 5. 重启应用
source ~/.zshrc
```

---

### 问题 3：端口被占用

**症状**：`Error: listen tcp 11434: address already in use`

**排查步骤**：

```bash
# 1. 查看端口占用
lsof -i :11434  # Ollama 端口
lsof -i :18789  # OpenClaw 端口

# 2. 查看进程
ps aux | grep -E "ollama|openclaw"
```

**解决方案**：

```bash
# 方案一：停止现有进程
pkill -f ollama
pkill -f openclaw

# 方案二：使用其他端口（修改环境变量）
export OLLAMA_HOST=127.0.0.1:11435
ollama serve

# 然后更新 OpenClaw 配置
openclaw config set model.api_base http://localhost:11435
```

---

### 问题 4：模型加载失败

**症状**：`Error: model not found` 或加载超时

**排查步骤**：

```bash
# 1. 确认模型已下载
ollama list

# 2. 确认模型名称正确
ollama show qwen2.5-coder:7b

# 3. 重新拉取（如文件损坏）
ollama rm qwen2.5-coder:7b
ollama pull qwen2.5-coder:7b
```

**解决方案**：

```bash
# 完全重新安装模型
ollama stop qwen2.5-coder:7b
ollama rm qwen2.5-coder:7b
ollama pull qwen2.5-coder:7b
```

---

### 问题 5：openclaw 命令找不到

**症状**：`zsh: command not found: openclaw`

**排查步骤**：

```bash
# 1. 确认安装位置
which openclaw
ls -la /usr/local/bin/openclaw
```

**解决方案**：

```bash
# 方案一：添加到 PATH
export PATH="/usr/local/bin:$PATH"

# 方案二：重新安装
curl -sSL https://get.openclaw.tech/install.sh | bash

# 方案三：手动安装到 PATH
cd ~/Downloads
tar -xzf openclaw-darwin-arm64.tar.gz
sudo cp openclaw /usr/local/bin/

# 方案四：使用 brew 安装
brew install openclaw
```

---

## 十三、进阶：混合模式配置

### 配置多模型路由

```yaml
# ~/.openclaw/config.yaml

server:
  host: localhost
  port: 18789

# 路由规则
routing:
  # 按任务类型自动选择模型
  rules:
    - name: "代码补全"
      match: "code_completion"
      provider: ollama
      model: qwen2.5-coder:7b
      max_tokens: 512
    
    - name: "简单对话"
      match: "simple_chat"
      provider: ollama
      model: qwen2.5-coder:7b
      max_tokens: 1024
    
    - name: "复杂推理"
      match: "complex_reasoning"
      provider: openai
      model: gpt-4o
      threshold: 2048

# 模型提供商配置
providers:
  ollama:
    enabled: true
    api_base: http://localhost:11434
    timeout: 120s
    keep_alive: 5m
  
  openai:
    enabled: true  # 按需启用
    api_key: ${OPENAI_API_KEY}  # 使用环境变量
    base_url: https://api.openai.com/v1
```

### 环境变量管理

```bash
# 添加到 ~/.zshrc
export OPENAI_API_KEY="sk-xxxxx"  # 你的 API Key
export OPENAI_API_BASE="https://api.openai.com/v1"

# 敏感信息使用更安全的方式
# 可选：使用 1Password CLI 或 GPG 加密存储
```

### 使用示例

```bash
# 本地简单任务（免费）
openclaw chat "帮我写个 hello world"

# 标记为复杂任务（走云端）
openclaw chat --provider openai "分析这段代码的设计模式"

# 查看当前使用的模型
openclaw status
```

---

## 快速启动清单

```bash
# 一次性执行完整安装流程（按顺序复制执行）

# 1. 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. 配置 M4 优化（复制第五章完整配置到 ~/.zshrc）
nano ~/.zshrc
# [粘贴配置内容]
source ~/.zshrc

# 3. 拉取模型
ollama pull qwen2.5-coder:7b

# 4. 安装 OpenClaw
curl -sSL https://get.openclaw.tech/install.sh | bash

# 5. 初始化
openclaw onboard --install-daemon

# 6. 绑定模型
openclaw config set model.provider ollama
openclaw config set model.name qwen2.5-coder:7b
openclaw config set model.api_base http://localhost:11434

# 7. 启动
openclaw gateway &
openclaw dashboard

# 8. 打开浏览器访问
open http://localhost:18789
```

---

## 附录：资源链接

| 资源 | 链接 |
|------|------|
| Ollama 官网 | https://ollama.com |
| Ollama 模型库 | https://ollama.com/library |
| OpenClaw 官网 | https://openclaw.tech |
| OpenClaw GitHub | https://github.com/openclaw/openclaw |
| Qwen2.5-Coder | https://huggingface.co/Qwen/Qwen2.5-Coder-7B |

---

> 📝 **文档版本**：v1.0  
> 🔄 **最后更新**：2024年  
> 🎯 **适用设备**：Mac Mini M4 24GB  
> 💡 **问题反馈**：如有疑问，请查看 README 或提交 Issue

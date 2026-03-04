# 进阶 Algolia AI 本地化搜索

本文将介绍如何将本地运行的 AI 模型（如 **Ollama** 或 **vLLM**）接入 Algolia AI 搜索，实现本地模型的问答功能。

## 1. 准备本地模型接口

以 **Ollama** 为例（最常用的本地运行方案）：

- 在本地启动模型（如 `ollama run llama3`）。
- Ollama 默认运行在 `http://localhost:11434`。
- **验证：** 在浏览器访问 `http://localhost:11434`，看到 "Ollama is running" 表示正常。
- 它的 OpenAI 兼容路径通常是 `http://localhost:11434/v1`。
  使用 **Cloudflare Tunnel (cloudflared)** 将本地 AI 模型接入 Algolia 是目前最稳定、安全的方案，因为它不需要在路由器上做端口转发，且支持自动 HTTPS 加密。

### 2. 安装并配置 Cloudflare Tunnel

安装 cloudflared 工具：

- **macOS：** `brew install cloudflare/cloudflare/cloudflared`
- **Linux：** 参考 [Cloudflare 文档](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)
- **Windows：** 从 [Release 页面](https://github.com/cloudflare/cloudflared/releases) 下载并安装

安装完成后，通过 `cloudflared --version` 验证。

#### 2.1 登录授权

执行 `cloudflared tunnel login`。这会弹出一个浏览器窗口，让你选择一个 Cloudflare 托管的域名进行授权。

#### 2.2 创建隧道

如果你有自己的域名接入了 Cloudflare，建议使用此方式。

1. **登录：** `cloudflared tunnel login`。
2. **创建隧道：** `cloudflared tunnel create algolia-ai`。
3. **你会得到一串长 ID**（例如：`eb7244a0-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）。**请立即复制这串 ID**。

### 2.3 回到阿里云 DNS 添加记录（最关键）

创建一条新的 DNS 记录：

- **记录类型**：`CNAME`
- **主机记录**：`ai`（子域名）
- **解析请求来源**：`默认`
- **记录值**：`刚才那一串长ID.cfargotunnel.com`
- **TTL**：`10分钟`

### 2.3 下载并部署证书到 Mac Mini

1. 在阿里云控制台点击“下载”，选择 **Nginx** 格式。
2. 解压后你会得到两个文件：`.pem`（证书）和 `.key`（私钥）。
3. 将这两个文件存放在 Mac Mini 上 `~/.cloudflared/` 配置文件同级的目录下，例如：`~/.cloudflared/cert.pem` 和 `~/.cloudflared/cert.key`。

### 2. 创建 `config.yml` 启用 HTTPS 转发

在本地创建一个配置文件（建议路径：`~/.cloudflared/config.yml`），内容如下：

```yaml
tunnel: <你的Tunnel-ID>
credentials-file: ~/.cloudflared/<你的Tunnel-ID>.json

ingress:
  - hostname: 你的域名.xxx.com
    # 关键修改：将流量指向本地带证书的服务
    service: https://localhost:11434
    originRequest:
      # 由于是本地自签或手动挂载证书，跳过 TLS 校验以防隧道报错
      noTLSVerify: true
  - service: http_status:404
```

### 2.4 配置本地流量转发 (config.yml)

在本地创建一个配置文件（建议路径：`~/.cloudflared/config.yml`），内容如下：

```yaml
tunnel: <你的Tunnel-ID>
credentials-file: /root/.cloudflared/<你的Tunnel-ID>.json # Windows请写实际路径

ingress:
  - hostname: ai.frontend-m.online
    service: http://localhost:11434 # 指向你的 Ollama 端口
  - service: http_status:404
```

**执行启动命令：**

```bash
cloudflared tunnel run algolia-service

```

下载

如果你没有域名，这种方式最简单，会生成一个随机域名。

1. **下载并运行：**

```bash
cloudflared tunnel --url http://localhost:11434 --http-host-header="localhost:11434"

```

2. **获取 URL：** 在控制台日志中找到类似 `https://random-word-xyz.trycloudflare.com` 的链接。这就是你填入 Algolia 的 **Base URL**。

3. **启动：**

```bash
cloudflared tunnel run --url http://localhost:11434 algolia-ai

```

---

### 第三步：在 Algolia 后台配置

回到你截图中的界面，选择 **Custom OpenAI-Compatible** 并填写：

| 配置项            | 填写内容                                       | 备注                                    |
| ----------------- | ---------------------------------------------- | --------------------------------------- |
| **Provider Name** | `My Local AI`                                  | 随便起个名字                            |
| **Base URL**      | `https://your-tunnel-url.trycloudflare.com/v1` | **注意：** 必须加 `/v1` 后缀            |
| **API Key**       | `ollama` (或其他任意字符)                      | 本地默认不校验，但 Algolia 要求必填     |
| **Model Name**    | `llama3` 或 `qwen2.5`                          | 必须与你本地 `ollama list` 里的名称一致 |

---

### ⚠️ 安全重要提示

**你的本地 API 现在暴露在公网上了。** 为了防止别人消耗你的硬件资源，建议在 Cloudflare 控制台进行以下加固：

1. **Zero Trust 访问控制：** 在 Cloudflare Dashboard 开启 **Access**，配置仅允许来自 Algolia 服务器 IP 或特定 Header 的请求。
2. **防火墙规则：** 限制并发请求频率（Rate Limiting）。

---

### 下一步建议

**你想先尝试用临时域名快速跑通一次搜索对话，还是直接配置稳定域名并开启安全验证？**

## 3. 在 Algolia 中配置

选择 **`Custom OpenAI-Compatible`** 后，填入以下信息：

- **Base URL (Endpoint):** 填入你的公网 URL（例如 `https://your-unique-id.ngrok-free.app/v1`）。
- **API Key:** 如果你的本地服务没设密码，可以随便填一个字符串（如 `ollama`），因为这个字段必填。
- **Model Name:** 填写你本地运行的具体模型名称（例如 `llama3` 或 `qwen2.5`）。

---

## 💡 进阶提示

如果你不仅仅是想做“问答”，而是想做**向量搜索（Vector Search）**，请确保你的本地模型支持 `embeddings` 接口。

- **测试是否成功：** 配置完成后，你可以使用 Algolia 的预览功能发一个请求。如果本地终端有日志滚动，说明链路已经打通了。

**需要我帮你写一个具体的 Ngrok 启动脚本或者 Ollama 配置命令吗？**

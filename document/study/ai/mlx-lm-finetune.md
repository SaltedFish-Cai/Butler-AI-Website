# Qwen2 模型微调指南 (Mac mini M4 24G)

本项目使用 **MLX-LM** 库在 Mac mini M4 24G 上对 Qwen2-1.5B 模型进行 LoRA 微调，以适应鱼病护理相关的问答任务。

项目地址：[https://gitee.com/saltedfish-Cai/ai-study-project/tree/master/unsloth-finetune](https://gitee.com/saltedfish-Cai/ai-study-project/tree/master/unsloth-finetune)

:::warning 注意
该项目只可以在 Apple Silicon 芯片的 Mac 上运行。
:::

## 1. 项目结构

```
unsloth-finetune/
├── data/
│   ├── fish_care_dataset.json     # 原始训练数据
│   ├── train.jsonl                # 处理后的训练数据
│   ├── valid.jsonl                # 处理后的验证数据
│   ├── test.jsonl                 # 测试数据
├── lora_adapter/                  # LoRA权重（微调后生成）
├── lora_qwen2_1.5b/               # LoRA权重（微调后生成）
├── huggingface_model/             # 转换后的Hugging Face格式模型
├── ollama_model/                  # 转换后的GGUF格式模型
├── process_data.py                # 数据处理脚本
├── finetune.py                    # 微调脚本
├── inference.py                   # 推理脚本
├── inference-chat.py              # 聊天推理脚本
├── server.py                      # Web服务器脚本
├── convert_to_huggingface.py      # 转换为Hugging Face格式脚本
├── convert_to_gguf.py             # 转换为GGUF格式脚本
├── lora_config.yaml               # LoRA配置文件
├── Modelfile                      # Ollama模型配置文件
├── ollama-use.md                  # Ollama使用指南
└── README.md                      # 本说明文件
```

## 2. 环境设置

### 2.1 创建虚拟环境

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2.2 安装依赖

```bash
# 基础依赖
python3 -m pip install mlx-lm transformers datasets pandas

# 格式转换依赖
python3 -m pip install peft torch huggingface-hub safetensors

# Web服务器依赖
python3 -m pip install flask

# 退出虚拟环境
deactivate
```

## 3. 数据准备

### 3.1 数据格式

训练数据使用 JSONL 格式，包含以下字段：

- `question`: 问题描述
- `answer`: 参考答案

### 3.2 处理数据

```bash
# 激活虚拟环境
source venv/bin/activate

# 处理数据
python3 process_data.py

# 退出虚拟环境
deactivate
```

这将生成`data/train.jsonl`和`data/valid.jsonl`文件，并创建训练所需的目录结构。

## 4. 模型微调

### 4.1 开始微调

```bash
# 激活虚拟环境
source venv/bin/activate

# 开始微调
python3 -m mlx_lm lora \
--model Qwen/Qwen2-1.5B \
--train \
--data ./data \
--fine-tune-type dora \
--batch-size 4 \
--iters 40 \
--learning-rate 1e-4 \
--max-seq-length 1024 \
--grad-accumulation-steps 2 \
--seed 42 \
--save-every 100 \
--adapter-path ./lora_qwen2_1.5b \
--test \
--steps-per-eval 50 \
--steps-per-report 10 \
-c lora_config.yaml

# 退出虚拟环境
deactivate
```

### 4.2 微调参数说明

这些参数是用于 Qwen2-1.5B 模型微调的命令行参数，每个参数都有特定的作用：

| 参数                             | 作用               | 说明                                                                             |
| -------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| `--model Qwen/Qwen2-1.5B`        | 指定模型           | 选择 Qwen2-1.5B 模型作为基础模型，用于微调                                       |
| `--train`                        | 开启训练模式       | 指示脚本进入训练状态，而不是仅进行推理或评估                                     |
| `--data data`                    | 指定数据目录       | 指向包含训练和验证数据的目录，该目录下应包含 `train.jsonl` 和 `valid.jsonl` 文件 |
| `--fine-tune-type dora`          | 指定微调类型       | 选择使用 DoRA (Depth-wise Orthogonal Rank Adaptation) 方法进行参数高效微调       |
| `--batch-size 4`                 | 设置批处理大小     | 每次处理的样本数量，设为 4 适合内存受限的设备（如 Mac mini M4 24G）              |
| `--iters 40`                     | 设置训练迭代次数   | 模型将训练 40 个迭代，约等于 0.4 个 epoch（基于 100 条样本的数据）               |
| `--learning-rate 2e-4`           | 设置学习率         | 优化器的学习率为 0.0002，控制模型参数更新的步长                                  |
| `--max-seq-length 1024`          | 设置最大序列长度   | 限制输入序列的最大长度为 1024 个 token，防止内存溢出                             |
| `--grad-accumulation-steps 2`    | 设置梯度累加步数   | 每 2 个批次更新一次模型参数，模拟更大的批次大小                                  |
| `--seed 42`                      | 设置随机种子       | 固定随机种子为 42，确保可重复性                                                  |
| `--save-every 100`               | 设置保存频率       | 每训练 100 步就保存一次模型检查点，防止训练中断                                  |
| `--adapter-path lora_qwen2_1.5b` | 指定适配器保存路径 | 训练完成后，LoRA 权重将保存到 `lora_qwen2_1.5b` 目录                             |
| `--test`                         | 开启测试集评估     | 训练完成后，使用测试集评估模型性能，无需手动设置数值                             |
| `--steps-per-eval 10`            | 设置验证频率       | 每训练 10 步就进行一次验证评估，计算验证损失                                     |
| `--steps-per-report 5`           | 设置报告频率       | 每训练 5 步就报告一次训练进度和损失值                                            |
| `-c lora_config.yaml`            | 加载自定义配置文件 | 从 `lora_config.yaml` 文件加载 LoRA 配置参数，包括 rank、alpha、dropout 等       |

这些参数共同控制了微调过程的各个方面，包括数据来源、训练策略、优化设置和结果保存位置。通过调整这些参数，可以根据不同的硬件配置和训练需求获得最佳的微调效果。

**lora_config.yaml**

| 参数                         | 作用                 | 说明                                                      |
| ---------------------------- | -------------------- | --------------------------------------------------------- |
| lora_rank:8                  | 设置 LoRA 秩         | LoRA 层的秩，控制 LoRA 矩阵的大小，影响模型参数数量和效率 |
| lora_alpha:16                | 设置 LoRA 缩放因子   | LoRA 层的缩放因子，影响 LoRA 矩阵的缩放比例               |
| lora_dropout:0.05            | 设置 LoRA dropout 率 | LoRA 层的 dropout 率，防止过拟合                          |
| warmup_steps:100             | 设置预热步数         | 训练开始前的步数，用于学习率 warmup                       |
| weight_decay:0.0001          | 设置权重衰减         | 优化器的权重衰减系数，防止过拟合                          |
| optimizer: adamw             | 设置优化器           | 选择 adamw 优化器，比 adam 效果更好                       |
| gradient_checkpointing: true | 开启梯度检查点       | 降低显存占用，适合内存受限的设备                          |

## 5. 模型推理

### 5.1 使用微调后的模型

```bash
# 激活虚拟环境
source venv/bin/activate

# 执行推理
python3 inference.py

# 运行聊天脚本
python3 inference-chat.py

# 退出虚拟环境
deactivate
```

## 6. Web 服务器和 API 接口

### 6.1 启动 Web 服务器

```bash
# 激活虚拟环境
source venv/bin/activate

# 安装Flask依赖
python3 -m pip install  flask

# 启动服务器
python3 inference-chat-server.py

# 退出虚拟环境
deactivate
```

服务器将运行在 `http://127.0.0.1:5001`。

### 6.2 访问聊天界面

打开浏览器，访问 `http://127.0.0.1:5001` 即可看到交互式聊天界面。

### 6.3 API 接口使用

#### 6.3.1 聊天接口

```bash
curl -X POST http://127.0.0.1:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好"}'
```

响应示例：

```json
{
  "response": "你好！我是鱼病护理助手，有什么可以帮助你的吗？"
}
```

#### 6.3.2 清空历史接口

```bash
curl -X POST http://127.0.0.1:5001/api/clear
```

响应示例：

```json
{
  "status": "success"
}
```

## 7. 注意事项

1. **内存要求**：Qwen2-1.5B 模型在 Mac mini M4 24G 上运行时，批处理大小建议设为 1
2. **网络连接**：首次运行需要下载模型，确保网络连接稳定
3. **训练时间**：微调 30 步约需要 10-15 分钟
4. **推理性能**：微调后的模型在 Mac M4 芯片上推理速度较快，响应时间约 1-2 秒

## 8. 常见问题

### 8.1 模型下载失败

如果遇到网络超时问题，可以尝试：

1. 使用科学上网
2. 从 Hugging Face 手动下载模型文件
3. 选择更小的模型（如 Qwen2-0.5B）

### 8.2 内存不足

如果遇到内存不足错误：

1. 减小批处理大小
2. 使用更小的模型
3. 启用梯度检查点（--grad-checkpoint）

### 8.3 推理结果不理想

如果推理结果质量不高：

1. 增加训练步数
2. 调整学习率
3. 增加训练数据量
4. 调整推理参数（温度、top_p 等）

## 9. 预期效果

微调后的模型应该能够：

- 准确回答鱼病护理相关的问题
- 提供详细、专业的养殖建议
- 保持回答的一致性和准确性
- 适应不同类型的问题格式

## 10. 要在其他地方使用您微调完的模型，您需要执行以下步骤：

### 10.1 复制模型文件

首先，将以下文件复制到目标位置：

- **LoRA 适配器文件**：`lora_adapter/` 目录（包含 `adapter_config.json` 和 `adapters.safetensors`）
- **推理脚本**：`inference.py`（可选，用于参考）

### 10.2 在新环境中设置

#### 10.2.1 创建虚拟环境

```bash
python3 -m venv venv
source venv/bin/activate
```

#### 10.2.2 安装依赖

```bash
python3 -m pip install mlx-lm transformers datasets pandas
```

### 10.2.3 加载和使用模型

在新环境中创建推理脚本，代码示例：

```python
from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler

def infer_model(prompt, model_path="Qwen/Qwen2-1.5B", adapter_path="lora_adapter"):
    """使用微调后的模型进行推理"""
    # 加载模型和分词器，同时加载LoRA权重
    model, tokenizer = load(
        model_path,
        adapter_path=adapter_path
    )

    # 创建采样器
    sampler = make_sampler(
        temp=0.7,
        top_p=0.9
    )

    # 生成回复
    response = generate(
        model,
        tokenizer,
        prompt=prompt,
        max_tokens=512,
        sampler=sampler
    )

    return response

# 测试
if __name__ == "__main__":
    prompt = "### Instruction:\n孔雀鱼多久换一次水？\n\n### Response:\n"
    response = infer_model(prompt)
    print(response)
```

### 10.2.4 注意事项

1. **网络连接**：首次运行需要下载原始 Qwen2-1.5B 模型，确保网络稳定
2. **硬件要求**：推荐在 Mac M 系列芯片或其他支持 MLX 的设备上运行
3. **路径配置**：确保 `adapter_path` 指向正确的 LoRA 适配器目录
4. **依赖版本**：使用与微调时相同版本的 mlx-lm 库，避免兼容性问题

### 10.2.5 验证模型

运行推理脚本测试模型是否正常工作：

```bash
# 激活虚拟环境
source venv/bin/activate

# 运行推理脚本
python3 inference.py

# 运行聊天脚本
python3 inference-chat.py
```

如果输出符合预期，说明模型已成功迁移并可以正常使用。

这样，您就可以在任何支持 MLX 的环境中使用您微调好的鱼病护理模型了。

## 11. 模型格式转换

### 11.1 转换为 Hugging Face 格式

```bash
# 激活虚拟环境
source venv/bin/activate

# 执行转换
python3 convert_to_huggingface.py \
  --model-name Qwen/Qwen2-1.5B \
  --adapter-path lora_qwen2_1.5b \
  --output-dir huggingface_model

# 退出虚拟环境
deactivate
```

转换后的模型将保存在 `huggingface_model` 目录中，包含完整的 Hugging Face 格式文件。

### 11.2 转换为 GGUF 格式（用于 Ollama）

```bash
# 激活虚拟环境
source venv/bin/activate

# 执行转换
python3 convert_to_gguf.py \
  --hf-model-dir huggingface_model \
  --output-file ollama_model/qwen2-fish.gguf \
  --quantize Q4_K_M \
  --base-model Qwen/Qwen2-1.5B

# 退出虚拟环境
deactivate
```

转换后的 GGUF 格式模型将保存在 `ollama_model` 目录中，可直接用于 Ollama 部署。

## 12. Ollama 部署指南

### 12.1 编写 Modelfile

在 `ollama_model` 目录中创建 `Modelfile` 文件，内容如下：

```dockerfile
# 指定模型权重路径(按实际路径修改)
FROM ./ollama_model/qwen2-fish.gguf

# 推理参数配置
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 1024
PARAMETER stop "<|endoftext|>"
PARAMETER stop "###"

# 对话模板（必须与微调时使用的模板一致）
TEMPLATE """### Instruction:
{{ .Prompt }}

### Response:
"""

# 默认系统提示
SYSTEM """你是一个专业的鱼病护理助手，基于MLX微调，回答关于鱼类养殖、疾病防治等问题，简洁准确、符合专业知识。"""
```

### 12.2 创建 Ollama 模型

```bash
# 进入模型目录
cd ollama_model

# 创建Ollama模型
ollama create fish-care-assistant -f ./Modelfile
```

### 12.3 运行模型

```bash
# 命令行交互
ollama run fish-care-assistant

# API调用
curl http://localhost:11434/api/chat -d '{
  "model": "fish-care-assistant",
  "messages": [
    {"role": "user", "content": "孔雀鱼多久换一次水？"}
  ]
}'
```

### 12.4 使用聊天方式

您可以使用 `ollama-web-chat.py` 脚本启动一个基于 Flask 的 Web 聊天界面，与模型进行交互。

```bash
# 激活虚拟环境
source venv/bin/activate

# 运行聊天界面
python3 ollama-web-chat.py
```

打开浏览器，访问 `http://localhost:5000` 即可开始聊天。

## 13. 项目改进和新功能

### 13.1 新增功能

- **模型格式转换**：支持将 MLX 格式的微调模型转换为 Hugging Face 格式和 GGUF 格式
- **Ollama 部署**：提供完整的 Ollama 部署指南，支持本地高效推理
- **简化的微调流程**：优化了微调脚本，减少了配置复杂度
- **Web 界面**：提供了基于 Flask 的 Web 聊天界面

### 13.2 技术改进

- **使用 DoRA 微调**：采用 Depth-wise Orthogonal Rank Adaptation 方法，提高微调效果
- **自动权重合并**：在转换为 GGUF 格式时自动合并 LoRA 权重
- **优化的推理速度**：针对 Apple Silicon 芯片进行了性能优化
- **完整的工具链**：从数据处理、微调、转换到部署，提供全流程工具

## 14. 总结

本项目提供了一个完整的 Qwen2 模型微调解决方案，特别针对 Apple Silicon 芯片的 Mac 设备进行了优化。通过以下步骤，您可以快速构建和部署自己的专业领域模型：

1. **数据准备**：使用 `process_data.py` 处理原始训练数据
2. **模型微调**：使用 `finetune.py` 或 `mlx_lm lora` 命令进行 LoRA 微调
3. **模型转换**：使用 `convert_to_huggingface.py` 和 `convert_to_gguf.py` 转换模型格式
4. **部署使用**：通过 Ollama 或 Web 界面部署和使用模型

该项目不仅提供了技术实现，还包含了完整的文档和示例，适合作为 AI 模型微调的学习资源。

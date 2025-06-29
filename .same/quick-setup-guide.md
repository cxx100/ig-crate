# 🚀 快速配置指南 - RapidAPI 密钥

## 📍 立即开始使用真实 Instagram API

### 1️⃣ 获取您的 RapidAPI 密钥

#### 步骤 A: 访问 RapidAPI
1. 打开浏览器，访问：https://rapidapi.com/
2. 登录您的账户（如果还没有账户，请先注册）

#### 步骤 B: 找到您的 Instagram API
1. 在 RapidAPI 控制台中查找您已购买的 Instagram API
2. 常见的服务名称：
   - **Instagram47** ✅ (推荐)
   - **Instagram API v1.2**
   - **Instagram Scraper API**

#### 步骤 C: 复制 API 密钥
1. 进入您的 API 服务页面
2. 找到 **"X-RapidAPI-Key"** 字段
3. 复制整个密钥（通常很长，类似：`a1b2c3d4e5f6...`)

### 2️⃣ 配置项目

#### 在您的项目中：
1. 找到 `.env.local` 文件（在项目根目录）
2. 找到这一行：
   ```env
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
   ```
3. 将 `your_rapidapi_key_here` 替换为您刚复制的真实密钥
4. 保存文件

#### 示例配置：
```env
# 将下面的密钥替换为您的真实密钥
NEXT_PUBLIC_RAPIDAPI_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
NEXT_PUBLIC_RAPIDAPI_HOST=instagram47.p.rapidapi.com
NEXT_PUBLIC_API_MODE=rapidapi
```

### 3️⃣ 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
bun run dev
```

### 4️⃣ 测试配置

1. 打开您的应用程序
2. 查看页面上的 **"API 配置状态"** 卡片
3. 点击 **"测试 API 连接"** 按钮
4. 如果显示绿色 ✅ "API 连接成功"，配置完成！

### 5️⃣ 开始使用

现在您可以：
- 🔍 搜索任何真实的 Instagram 用户
- 📊 获取真实的粉丝数和统计数据
- 🖼️ 查看最新帖子的真实图片
- 🏷️ 查看验证状态和账户类型

## 🆘 常见问题

### ❌ "API 密钥无效"
- 检查密钥是否完整复制
- 确保没有多余的空格
- 验证您的 RapidAPI 账户状态

### ❌ "请求频率超限"
- 查看您的 RapidAPI 套餐限制
- 等待几分钟后重试
- 考虑升级您的套餐

### ❌ "用户不存在"
- 确保用户名正确拼写
- 某些私密账户可能无法访问
- 尝试搜索知名公开账户如 `instagram`

## 🎉 配置成功！

配置完成后，您的 Instagram Profile Viewer 将显示：
- 🟢 **绿色状态指示器** "Live API"
- ✅ **"API 连接成功"** 消息
- 📊 **真实的 Instagram 数据**

立即尝试搜索一些用户名，享受真实的 Instagram 数据体验！

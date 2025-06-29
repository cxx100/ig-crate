# RapidAPI Instagram API 配置指南

## 🔧 配置步骤

### 1. 获取 RapidAPI 密钥
1. 访问 [RapidAPI](https://rapidapi.com/) 并登录您的账户
2. 搜索 "Instagram" API 服务
3. 选择您已购买的 Instagram API 服务
4. 在 API 页面找到您的 `X-RapidAPI-Key`
5. 复制这个密钥

### 2. 配置环境变量
1. 在项目根目录找到 `.env.local` 文件
2. 将您的 RapidAPI 密钥粘贴到文件中：
```env
NEXT_PUBLIC_RAPIDAPI_KEY=your_actual_rapidapi_key_here
NEXT_PUBLIC_RAPIDAPI_HOST=instagram47.p.rapidapi.com
NEXT_PUBLIC_API_MODE=rapidapi
```

### 3. 常见的 Instagram API 服务

#### 推荐的 RapidAPI Instagram 服务:
- **Instagram47** (`instagram47.p.rapidapi.com`)
- **Instagram API v1.2** (`instagram-api-v12.p.rapidapi.com`)
- **Instagram Scraper** (`instagram-scraper-api2.p.rapidapi.com`)

### 4. 更新 API Host (如需要)
如果您使用的不是 `instagram47.p.rapidapi.com`，请更新 `.env.local` 中的 host：
```env
NEXT_PUBLIC_RAPIDAPI_HOST=your_actual_api_host.p.rapidapi.com
```

## 🧪 测试配置

### 验证 API 配置
1. 保存 `.env.local` 文件
2. 重启开发服务器: `bun run dev`
3. 在应用中搜索任意真实的 Instagram 用户名
4. 检查是否返回真实数据

### 常见问题排除

#### ❌ "RapidAPI key not configured"
- 检查 `.env.local` 文件中的密钥是否正确
- 确保密钥没有多余的空格或引号

#### ❌ "API request failed: 401"
- RapidAPI 密钥无效或已过期
- 检查您的 RapidAPI 账户状态

#### ❌ "API request failed: 429"
- 达到 API 调用限制
- 检查您的 RapidAPI 套餐限制

#### ❌ "User not found"
- 用户名不存在或账户为私人账户
- 某些 API 无法访问私人账户

## 📊 API 响应示例

### 成功响应
```json
{
  "username": "example_user",
  "full_name": "Example User",
  "biography": "This is a bio",
  "profile_pic_url": "https://...",
  "follower_count": 1234,
  "following_count": 567,
  "media_count": 89,
  "is_verified": false,
  "is_private": false
}
```

## 🔒 安全提示

1. **永远不要提交 `.env.local` 到版本控制**
2. **定期轮换您的 API 密钥**
3. **监控您的 API 使用量和费用**
4. **遵守 Instagram 和 RapidAPI 的服务条款**

## 💰 费用管理

- 大多数 RapidAPI Instagram 服务按请求数量计费
- 建议设置用量警报
- 考虑实现客户端缓存以减少 API 调用

## 🛠️ 开发模式

如果想临时切换回演示模式，设置：
```env
NEXT_PUBLIC_API_MODE=mock
```

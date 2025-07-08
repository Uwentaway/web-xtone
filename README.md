# 飞鸟飞信 - 安全匿名传话助手

一个基于React + Go + MySQL的匿名短信发送平台，支持微信支付和阿里云短信服务。

## 功能特性

- 🔐 **安全匿名**: 保护用户隐私，匿名发送短信
- 💰 **微信支付**: 集成微信支付，按量计费
- 📱 **多端登录**: 支持微信登录和手机号登录
- ⏰ **定时发送**: 支持定时发送功能
- 📊 **账单管理**: 完整的支付和退款记录
- 🎨 **现代UI**: 基于Tailwind CSS的现代化界面

## 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS
- Lucide React (图标)
- Vite (构建工具)

### 后端
- Go 1.21
- Gin (Web框架)
- GORM (ORM)
- MySQL 8.0
- 微信支付API v3
- 阿里云短信服务

## 快速开始

### 使用Docker部署 (推荐)

1. **克隆项目**
```bash
git clone <repository-url>
cd feiniao-feixin
```

2. **配置环境变量**
```bash
cp backend/.env.example backend/.env
# 编辑 backend/.env 文件，填入真实的配置信息
```

3. **一键部署**
```bash
chmod +x deploy.sh
./deploy.sh
```

4. **访问应用**
- 应用地址: http://localhost:8081
- 数据库: localhost:3306

### 手动部署

#### 前端部署

```bash
# 安装依赖
npm install

# 构建
npm run build

# 预览
npm run preview
```

#### 后端部署

```bash
cd backend

# 安装依赖
go mod tidy

# 创建数据库
mysql -u root -p123 < database.sql

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 运行
go run main.go
```

## 配置说明

### 环境变量配置

在 `backend/.env` 文件中配置以下参数：

```env
# 数据库配置
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123
DB_NAME=anonymous_messaging

# 服务器配置
SERVER_PORT=8081
JWT_SECRET=your_jwt_secret_key_here

# 微信支付配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_MERCHANT_ID=your_wechat_merchant_id
WECHAT_MERCHANT_KEY=your_wechat_merchant_key
WECHAT_CERT_PATH=./certs/apiclient_cert.pem
WECHAT_KEY_PATH=./certs/apiclient_key.pem

# 阿里云短信配置
ALIYUN_ACCESS_KEY_ID=your_aliyun_access_key_id
ALIYUN_ACCESS_KEY_SECRET=your_aliyun_access_key_secret
ALIYUN_SMS_SIGN_NAME=飞鸟飞信
ALIYUN_SMS_TEMPLATE_CODE=SMS_ANONYMOUS_MSG
ALIYUN_SMS_REGION=cn-hangzhou
```

### 微信支付证书

将微信支付证书文件放置在 `certs/` 目录下：
- `apiclient_cert.pem` - 商户证书
- `apiclient_key.pem` - 商户私钥

## API接口

### 认证相关
- `POST /api/auth/login` - 用户登录
- `GET /api/user` - 获取用户信息

### 消息相关
- `POST /api/messages/send` - 发送消息
- `GET /api/messages` - 获取消息列表
- `POST /api/messages/calculate-cost` - 计算发送费用

### 支付相关
- `POST /api/payment/wechat/config` - 获取微信支付配置
- `POST /api/payment/wechat/notify` - 微信支付回调

### 账单相关
- `GET /api/bills` - 获取账单列表
- `GET /api/bills/summary` - 获取账单汇总

## Docker命令

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重新构建
docker-compose build --no-cache
```

## 生产环境部署

### 1. 安全配置
- 修改默认密码和密钥
- 配置防火墙规则
- 启用HTTPS

### 2. 性能优化
- 配置Redis缓存
- 启用Nginx反向代理
- 配置CDN

### 3. 监控告警
- 配置日志收集
- 设置健康检查
- 配置监控告警

## 注意事项

1. **生产环境安全**
   - 请务必修改所有默认密码
   - 配置真实的微信支付和阿里云短信参数
   - 启用HTTPS和安全头

2. **服务商配置**
   - 微信支付需要企业资质
   - 阿里云短信需要实名认证
   - 短信模板需要审核通过

3. **法律合规**
   - 遵守相关法律法规
   - 保护用户隐私
   - 防止滥用和垃圾信息

## 许可证

MIT License

## 支持

如有问题，请提交Issue或联系开发团队。
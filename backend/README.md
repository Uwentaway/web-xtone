# Anonymous Messaging Backend

这是一个用 Go 语言开发的匿名短信发送服务后端。

## 功能特性

- 用户认证（微信登录、手机号登录）
- 短信发送服务（阿里云短信）
- 微信支付集成
- 订单管理
- 账单管理
- MySQL 数据库存储

## 环境要求

- Go 1.21+
- MySQL 5.7+
- 阿里云短信服务账号（可选）
- 微信支付商户账号（可选）

## 安装和运行

1. 克隆项目并进入目录
```bash
cd backend
```

2. 安装依赖
```bash
go mod tidy
```

3. 创建数据库
```bash
mysql -u root -p123 < database.sql
```

4. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入相应的配置信息
```

5. 运行服务
```bash
go run main.go
```

服务将在 http://127.0.0.1:8081 启动

## API 接口

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

## 数据库表结构

- `users` - 用户表
- `orders` - 订单表
- `messages` - 消息表
- `bills` - 账单表
- `system_config` - 系统配置表
- `payment_records` - 支付记录表
- `refund_records` - 退款记录表

## 配置说明

### 数据库配置
- `DB_HOST` - 数据库主机地址
- `DB_PORT` - 数据库端口
- `DB_USER` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_NAME` - 数据库名称

### 微信支付配置
- `WECHAT_APP_ID` - 微信应用ID
- `WECHAT_MERCHANT_ID` - 微信商户号
- `WECHAT_MERCHANT_KEY` - 微信商户密钥
- `WECHAT_CERT_PATH` - 微信支付证书路径
- `WECHAT_KEY_PATH` - 微信支付私钥路径

### 阿里云短信配置
- `ALIYUN_ACCESS_KEY_ID` - 阿里云AccessKeyId
- `ALIYUN_ACCESS_KEY_SECRET` - 阿里云AccessKeySecret
- `ALIYUN_SMS_SIGN_NAME` - 短信签名
- `ALIYUN_SMS_TEMPLATE_CODE` - 短信模板代码
- `ALIYUN_SMS_REGION` - 阿里云区域

## 注意事项

1. 如果没有配置阿里云短信服务，系统会使用模拟发送
2. 如果没有配置微信支付，系统会使用模拟支付
3. 生产环境请务必配置真实的服务商信息
4. 请妥善保管各种密钥和证书文件
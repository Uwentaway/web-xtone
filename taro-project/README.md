# 飞鸟飞信微信小程序

基于 Taro 3.x 开发的飞鸟飞信微信小程序版本。

## 功能特性

- 🔐 **微信登录**: 一键微信授权登录
- 📱 **发送短信**: 匿名发送短信功能
- ⏰ **定时发送**: 支持定时发送功能
- 💰 **微信支付**: 集成微信小程序支付
- 📊 **账单管理**: 查看消费记录和账单
- ⚙️ **设置中心**: 个性化设置选项

## 技术栈

- **框架**: Taro 3.6.22
- **语言**: TypeScript
- **UI**: 原生小程序组件 + 自定义样式
- **状态管理**: Component State
- **网络请求**: Taro.request
- **本地存储**: Taro Storage API

## 开发环境

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- 微信开发者工具

### 安装依赖

```bash
cd taro-project
npm install
```

### 开发命令

```bash
# 微信小程序开发模式
npm run dev:weapp

# 微信小程序构建
npm run build:weapp

# H5开发模式
npm run dev:h5

# H5构建
npm run build:h5
```

## 项目结构

```
taro-project/
├── config/                 # 配置文件
│   ├── index.js            # 主配置
│   ├── dev.js              # 开发环境配置
│   └── prod.js             # 生产环境配置
├── src/
│   ├── app.config.ts       # 小程序配置
│   ├── app.tsx             # 入口组件
│   ├── app.scss            # 全局样式
│   ├── pages/              # 页面
│   │   ├── login/          # 登录页
│   │   ├── messages/       # 消息页
│   │   ├── profile/        # 个人中心
│   │   ├── bills/          # 账单页
│   │   └── settings/       # 设置页
│   └── utils/              # 工具函数
│       ├── api.ts          # API接口
│       └── wechat.ts       # 微信相关
├── project.config.json     # 小程序项目配置
├── package.json
└── README.md
```

## 页面说明

### 1. 登录页 (`/pages/login/index`)
- 微信一键登录
- 手机号登录（开发中）
- 用户协议确认

### 2. 消息页 (`/pages/messages/index`)
- 发送短信表单
- 定时发送设置
- 费用计算显示
- 消息历史记录

### 3. 个人中心 (`/pages/profile/index`)
- 用户信息展示
- 使用统计
- 功能入口导航

### 4. 账单页 (`/pages/bills/index`)
- 消费统计汇总
- 交易记录列表
- 支出/退款分类

### 5. 设置页 (`/pages/settings/index`)
- 通知设置
- 隐私设置
- 缓存管理
- 关于信息

## 配置说明

### 小程序配置

在 `project.config.json` 中配置：

```json
{
  "appid": "your_miniprogram_appid",
  "projectname": "feiniao-feixin-miniprogram"
}
```

### API配置

在 `config/dev.js` 和 `config/prod.js` 中配置后端API地址：

```javascript
// 开发环境
defineConstants: {
  API_BASE_URL: '"http://127.0.0.1:8081/api"'
}

// 生产环境
defineConstants: {
  API_BASE_URL: '"https://your-domain.com/api"'
}
```

## 微信小程序特性

### 1. 微信登录
- 使用 `wx.login()` 获取登录凭证
- 使用 `wx.getUserProfile()` 获取用户信息
- 后端验证并返回用户token

### 2. 微信支付
- 使用 `wx.requestPayment()` 调起支付
- 支持统一下单和支付结果回调
- 集成支付状态查询

### 3. 本地存储
- 使用 `Taro.setStorageSync()` 存储数据
- 支持用户设置、消息记录等本地缓存
- 自动同步登录状态

### 4. 消息通知
- 支持订阅消息推送
- 发送状态实时通知
- 可配置通知开关

## 部署说明

### 1. 构建小程序

```bash
npm run build:weapp
```

### 2. 微信开发者工具

1. 打开微信开发者工具
2. 导入项目，选择 `dist` 目录
3. 配置 AppID
4. 预览和上传代码

### 3. 小程序发布

1. 在微信公众平台提交审核
2. 审核通过后发布上线
3. 配置服务器域名白名单

## 注意事项

### 1. 域名配置
- 在微信公众平台配置 `request` 合法域名
- 添加后端API域名到白名单
- HTTPS协议是必需的

### 2. 权限申请
- 用户信息权限：`scope.userInfo`
- 支付权限：需要企业主体
- 消息推送：配置消息模板

### 3. 兼容性
- 支持微信版本 >= 7.0.0
- 基础库版本 >= 2.19.4
- iOS/Android 双平台兼容

## 开发调试

### 1. 真机调试
```bash
# 开启开发模式
npm run dev:weapp

# 在微信开发者工具中开启真机调试
```

### 2. 网络调试
- 开发环境可以访问本地API
- 生产环境需要配置HTTPS域名
- 使用代理工具进行网络调试

### 3. 性能优化
- 启用分包加载
- 图片资源压缩
- 代码分割和懒加载

## 常见问题

### 1. 登录失败
- 检查AppID配置
- 确认用户授权状态
- 验证后端接口可用性

### 2. 支付失败
- 确认商户号配置
- 检查支付参数格式
- 验证签名算法

### 3. 网络请求失败
- 检查域名白名单
- 确认HTTPS证书有效
- 验证接口返回格式

## 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 支持微信登录
- 实现短信发送功能
- 集成微信支付
- 添加账单管理
- 完善设置功能

## 许可证

MIT License
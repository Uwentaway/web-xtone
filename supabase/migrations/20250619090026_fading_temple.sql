-- 用户表
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    wechat_openid VARCHAR(100) UNIQUE,
    wechat_unionid VARCHAR(100),
    nickname VARCHAR(50),
    avatar_url VARCHAR(255),
    balance DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_wechat_openid (wechat_openid)
);

-- 订单表
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_no VARCHAR(32) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('wechat', 'alipay', 'balance') DEFAULT 'wechat',
    payment_transaction_id VARCHAR(100),
    description VARCHAR(255),
    message_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- 消息表
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36),
    recipient_phone VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    character_count INT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'scheduled', 'sending', 'sent', 'failed', 'cancelled') DEFAULT 'pending',
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    failed_reason VARCHAR(255),
    sms_provider ENUM('aliyun', 'tencent', 'huawei') DEFAULT 'aliyun',
    sms_message_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_at (scheduled_at),
    INDEX idx_created_at (created_at)
);

-- 账单表
CREATE TABLE bills (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36),
    type ENUM('payment', 'refund', 'consumption', 'recharge') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- 系统配置表
CREATE TABLE system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认配置
INSERT INTO system_config (config_key, config_value, description) VALUES
('sms_price_per_60_chars', '1.00', '每60字符短信价格（元）'),
('wechat_merchant_id', '', '微信商户号'),
('wechat_merchant_key', '', '微信商户密钥'),
('aliyun_access_key_id', '', '阿里云AccessKeyId'),
('aliyun_access_key_secret', '', '阿里云AccessKeySecret'),
('aliyun_sms_sign_name', '', '阿里云短信签名'),
('aliyun_sms_template_code', '', '阿里云短信模板代码');

-- 短信模板表
CREATE TABLE sms_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    template_code VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认短信模板
INSERT INTO sms_templates (name, template_code, content) VALUES
('匿名消息', 'SMS_ANONYMOUS_MSG', '您收到一条匿名消息：${content}');

-- 支付记录表
CREATE TABLE payment_records (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    payment_method ENUM('wechat', 'alipay') NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    callback_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_status (status)
);

-- 退款记录表
CREATE TABLE refund_records (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    refund_amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(255),
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    refund_transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
);
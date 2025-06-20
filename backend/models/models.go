package models

import (
	"time"
	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	ID           string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Phone        string    `json:"phone" gorm:"uniqueIndex;type:varchar(20);not null"`
	WechatOpenID string    `json:"wechat_openid" gorm:"uniqueIndex;type:varchar(100)"`
	WechatUnionID string   `json:"wechat_unionid" gorm:"type:varchar(100)"`
	Nickname     string    `json:"nickname" gorm:"type:varchar(50)"`
	AvatarURL    string    `json:"avatar_url" gorm:"type:varchar(255)"`
	Balance      float64   `json:"balance" gorm:"type:decimal(10,2);default:0.00"`
	Status       string    `json:"status" gorm:"type:enum('active','suspended','deleted');default:'active'"`
	LoginType    string    `json:"login_type" gorm:"type:enum('wechat','phone');default:'phone'"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Order 订单模型
type Order struct {
	ID                   string     `json:"id" gorm:"primaryKey;type:varchar(36)"`
	UserID               string     `json:"user_id" gorm:"type:varchar(36);not null;index"`
	OrderNo              string     `json:"order_no" gorm:"uniqueIndex;type:varchar(32);not null"`
	Amount               float64    `json:"amount" gorm:"type:decimal(10,2);not null"`
	Status               string     `json:"status" gorm:"type:enum('pending','paid','failed','refunded','cancelled');default:'pending';index"`
	PaymentMethod        string     `json:"payment_method" gorm:"type:enum('wechat','alipay','balance');default:'wechat'"`
	PaymentTransactionID string     `json:"payment_transaction_id" gorm:"type:varchar(100)"`
	Description          string     `json:"description" gorm:"type:varchar(255)"`
	MessageID            string     `json:"message_id" gorm:"type:varchar(36)"`
	CreatedAt            time.Time  `json:"created_at" gorm:"index"`
	PaidAt               *time.Time `json:"paid_at"`
	RefundedAt           *time.Time `json:"refunded_at"`
	CancelledAt          *time.Time `json:"cancelled_at"`
	User                 User       `json:"user" gorm:"foreignKey:UserID"`
}

// Message 消息模型
type Message struct {
	ID             string     `json:"id" gorm:"primaryKey;type:varchar(36)"`
	UserID         string     `json:"user_id" gorm:"type:varchar(36);not null;index"`
	OrderID        string     `json:"order_id" gorm:"type:varchar(36);index"`
	RecipientPhone string     `json:"recipient_phone" gorm:"type:varchar(20);not null"`
	Content        string     `json:"content" gorm:"type:text;not null"`
	CharacterCount int        `json:"character_count" gorm:"not null"`
	Cost           float64    `json:"cost" gorm:"type:decimal(10,2);not null"`
	Status         string     `json:"status" gorm:"type:enum('pending','scheduled','sending','sent','failed','cancelled');default:'pending';index"`
	ScheduledAt    *time.Time `json:"scheduled_at" gorm:"index"`
	SentAt         *time.Time `json:"sent_at"`
	FailedReason   string     `json:"failed_reason" gorm:"type:varchar(255)"`
	SMSProvider    string     `json:"sms_provider" gorm:"type:enum('aliyun','tencent','huawei');default:'aliyun'"`
	SMSMessageID   string     `json:"sms_message_id" gorm:"type:varchar(100)"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	User           User       `json:"user" gorm:"foreignKey:UserID"`
	Order          Order      `json:"order" gorm:"foreignKey:OrderID"`
}

// Bill 账单模型
type Bill struct {
	ID            string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	UserID        string    `json:"user_id" gorm:"type:varchar(36);not null;index"`
	OrderID       string    `json:"order_id" gorm:"type:varchar(36);index"`
	Type          string    `json:"type" gorm:"type:enum('payment','refund','consumption','recharge');not null;index"`
	Amount        float64   `json:"amount" gorm:"type:decimal(10,2);not null"`
	BalanceBefore float64   `json:"balance_before" gorm:"type:decimal(10,2);not null"`
	BalanceAfter  float64   `json:"balance_after" gorm:"type:decimal(10,2);not null"`
	Description   string    `json:"description" gorm:"type:varchar(255)"`
	CreatedAt     time.Time `json:"created_at" gorm:"index"`
	User          User      `json:"user" gorm:"foreignKey:UserID"`
	Order         Order     `json:"order" gorm:"foreignKey:OrderID"`
}

// SystemConfig 系统配置模型
type SystemConfig struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	ConfigKey   string    `json:"config_key" gorm:"uniqueIndex;type:varchar(100);not null"`
	ConfigValue string    `json:"config_value" gorm:"type:text"`
	Description string    `json:"description" gorm:"type:varchar(255)"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// PaymentRecord 支付记录模型
type PaymentRecord struct {
	ID            string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	OrderID       string    `json:"order_id" gorm:"type:varchar(36);not null;index"`
	PaymentMethod string    `json:"payment_method" gorm:"type:enum('wechat','alipay');not null"`
	TransactionID string    `json:"transaction_id" gorm:"uniqueIndex;type:varchar(100);not null"`
	Amount        float64   `json:"amount" gorm:"type:decimal(10,2);not null"`
	Status        string    `json:"status" gorm:"type:enum('pending','success','failed');default:'pending';index"`
	CallbackData  string    `json:"callback_data" gorm:"type:text"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Order         Order     `json:"order" gorm:"foreignKey:OrderID"`
}

// RefundRecord 退款记录模型
type RefundRecord struct {
	ID                  string     `json:"id" gorm:"primaryKey;type:varchar(36)"`
	OrderID             string     `json:"order_id" gorm:"type:varchar(36);not null;index"`
	RefundAmount        float64    `json:"refund_amount" gorm:"type:decimal(10,2);not null"`
	Reason              string     `json:"reason" gorm:"type:varchar(255)"`
	Status              string     `json:"status" gorm:"type:enum('pending','success','failed');default:'pending';index"`
	RefundTransactionID string     `json:"refund_transaction_id" gorm:"type:varchar(100)"`
	CreatedAt           time.Time  `json:"created_at"`
	ProcessedAt         *time.Time `json:"processed_at"`
	Order               Order      `json:"order" gorm:"foreignKey:OrderID"`
}
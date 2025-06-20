package services

import (
	"fmt"
	"math"
	"time"

	"anonymous-messaging-backend/config"
	"anonymous-messaging-backend/models"
	"github.com/google/uuid"
)

type MessageService struct {
	smsService     *SMSService
	paymentService *PaymentService
}

func NewMessageService() (*MessageService, error) {
	smsService, err := NewSMSService()
	if err != nil {
		return nil, err
	}

	paymentService, err := NewPaymentService()
	if err != nil {
		return nil, err
	}

	return &MessageService{
		smsService:     smsService,
		paymentService: paymentService,
	}, nil
}

func (m *MessageService) CalculateCost(content string) float64 {
	charCount := len([]rune(content))
	units := int(math.Ceil(float64(charCount) / 60.0))
	return float64(units) * 1.0 // 每60字符1元
}

func (m *MessageService) CreateOrder(userID string, amount float64, description string) (*models.Order, error) {
	order := &models.Order{
		ID:            uuid.New().String(),
		UserID:        userID,
		OrderNo:       generateOrderNo(),
		Amount:        amount,
		Status:        "pending",
		PaymentMethod: "wechat",
		Description:   description,
		CreatedAt:     time.Now(),
	}

	if err := config.DB.Create(order).Error; err != nil {
		return nil, fmt.Errorf("创建订单失败: %v", err)
	}

	return order, nil
}

func (m *MessageService) SendMessage(userID, phone, content string, scheduledAt *time.Time) (*models.Message, error) {
	cost := m.CalculateCost(content)
	
	// 1. 创建订单
	order, err := m.CreateOrder(userID, cost, fmt.Sprintf("发送短信 - %d字符", len([]rune(content))))
	if err != nil {
		return nil, err
	}

	// 2. 处理支付
	paymentResult, err := m.paymentService.ProcessPayment(order.ID, cost)
	if err != nil || !paymentResult.Success {
		// 支付失败，更新订单状态
		order.Status = "failed"
		config.DB.Save(order)
		return nil, fmt.Errorf("支付失败: %v", paymentResult.Error)
	}

	// 3. 支付成功，更新订单状态
	now := time.Now()
	order.Status = "paid"
	order.PaidAt = &now
	order.PaymentTransactionID = paymentResult.TransactionID
	config.DB.Save(order)

	// 4. 创建消息记录
	message := &models.Message{
		ID:             uuid.New().String(),
		UserID:         userID,
		OrderID:        order.ID,
		RecipientPhone: phone,
		Content:        content,
		CharacterCount: len([]rune(content)),
		Cost:           cost,
		Status:         "pending",
		ScheduledAt:    scheduledAt,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if err := config.DB.Create(message).Error; err != nil {
		return nil, fmt.Errorf("创建消息记录失败: %v", err)
	}

	// 5. 如果不是定时发送，立即发送短信
	if scheduledAt == nil {
		go m.sendSMSAsync(message)
	}

	return message, nil
}

func (m *MessageService) sendSMSAsync(message *models.Message) {
	// 更新消息状态为发送中
	message.Status = "sending"
	config.DB.Save(message)

	// 发送短信
	smsRequest := SMSRequest{
		PhoneNumber: message.RecipientPhone,
		Content:     message.Content,
	}

	smsResponse, err := m.smsService.SendSMS(smsRequest)
	if err != nil || !smsResponse.Success {
		// 发送失败
		message.Status = "failed"
		message.FailedReason = smsResponse.Error
		config.DB.Save(message)

		// 退款
		m.refundOrder(message.OrderID, message.Cost, "短信发送失败")
		return
	}

	// 发送成功
	now := time.Now()
	message.Status = "sent"
	message.SentAt = &now
	message.SMSMessageID = smsResponse.MessageID
	config.DB.Save(message)
}

func (m *MessageService) refundOrder(orderID string, amount float64, reason string) {
	// 处理退款
	refundResult, err := m.paymentService.RefundPayment(orderID, amount, reason)
	if err != nil || !refundResult.Success {
		return
	}

	// 更新订单状态
	var order models.Order
	if err := config.DB.First(&order, "id = ?", orderID).Error; err != nil {
		return
	}

	now := time.Now()
	order.Status = "refunded"
	order.RefundedAt = &now
	config.DB.Save(&order)

	// 创建退款记录
	refundRecord := &models.RefundRecord{
		ID:                  uuid.New().String(),
		OrderID:             orderID,
		RefundAmount:        amount,
		Reason:              reason,
		Status:              "success",
		RefundTransactionID: refundResult.TransactionID,
		CreatedAt:           time.Now(),
		ProcessedAt:         &now,
	}
	config.DB.Create(refundRecord)
}

func generateOrderNo() string {
	return fmt.Sprintf("XT%d%04d", time.Now().Unix(), time.Now().Nanosecond()%10000)
}
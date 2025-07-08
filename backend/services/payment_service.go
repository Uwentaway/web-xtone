package services

import (
	"context"
	"crypto/rand"
	"fmt"
	"math/big"
	"os"
	"time"

	"anonymous-messaging-backend/models"
	"github.com/google/uuid"
	"github.com/wechatpay-apiv3/wechatpay-go/core"
	"github.com/wechatpay-apiv3/wechatpay-go/core/option"
	"github.com/wechatpay-apiv3/wechatpay-go/services/payments/jsapi"
	"github.com/wechatpay-apiv3/wechatpay-go/utils"
)

type PaymentService struct {
	client     *core.Client
	appID      string
	merchantID string
}

type WechatPayConfig struct {
	AppID     string `json:"appId"`
	TimeStamp string `json:"timeStamp"`
	NonceStr  string `json:"nonceStr"`
	Package   string `json:"package"`
	SignType  string `json:"signType"`
	PaySign   string `json:"paySign"`
}

type PaymentResult struct {
	Success       bool   `json:"success"`
	TransactionID string `json:"transaction_id,omitempty"`
	Error         string `json:"error,omitempty"`
}

func NewPaymentService() (*PaymentService, error) {
	appID := os.Getenv("WECHAT_APP_ID")
	merchantID := os.Getenv("WECHAT_MERCHANT_ID")
	merchantKey := os.Getenv("WECHAT_MERCHANT_KEY")
	certPath := os.Getenv("WECHAT_CERT_PATH")
	keyPath := os.Getenv("WECHAT_KEY_PATH")

	if appID == "" || merchantID == "" {
		return &PaymentService{
			appID:      appID,
			merchantID: merchantID,
		}, nil
	}

	opts := []core.ClientOption{
		option.WithWechatPayAutoAuthCipher(merchantID, merchantKey, certPath, keyPath),
	}

	client, err := core.NewClient(context.Background(), opts...)
	if err != nil {
		return nil, fmt.Errorf("创建微信支付客户端失败: %v", err)
	}

	return &PaymentService{
		client:     client,
		appID:      appID,
		merchantID: merchantID,
	}, nil
}

func (p *PaymentService) GetWechatPayConfig(orderID string, amount float64) (*WechatPayConfig, error) {
	// 如果没有配置微信支付信息，返回模拟配置
	if p.client == nil {
		return &WechatPayConfig{
			AppID:     "mock_app_id",
			TimeStamp: fmt.Sprintf("%d", time.Now().Unix()),
			NonceStr:  generateNonceStr(),
			Package:   fmt.Sprintf("prepay_id=wx%d", time.Now().Unix()),
			SignType:  "RSA",
			PaySign:   "mock_pay_sign",
		}, nil
	}

	svc := jsapi.JsapiApiService{Client: p.client}
	
	req := jsapi.PrepayRequest{
		Appid:       core.String(p.appID),
		Mchid:       core.String(p.merchantID),
		Description: core.String("飞鸟飞信短信服务"),
		OutTradeNo:  core.String(orderID),
		NotifyUrl:   core.String("http://127.0.0.1:8081/api/payment/wechat/notify"),
		Amount: &jsapi.Amount{
			Total:    core.Int64(int64(amount * 100)), // 转换为分
			Currency: core.String("CNY"),
		},
	}

	resp, _, err := svc.PrepayWithRequestPayment(context.Background(), req)
	if err != nil {
		return nil, fmt.Errorf("创建微信支付订单失败: %v", err)
	}

	return &WechatPayConfig{
		AppID:     *resp.Appid,
		TimeStamp: *resp.TimeStamp,
		NonceStr:  *resp.NonceStr,
		Package:   *resp.Package,
		SignType:  *resp.SignType,
		PaySign:   *resp.PaySign,
	}, nil
}

func (p *PaymentService) ProcessPayment(orderID string, amount float64) (*PaymentResult, error) {
	// 模拟支付处理
	time.Sleep(2 * time.Second)
	
	// 95% 成功率
	n, _ := rand.Int(rand.Reader, big.NewInt(100))
	if n.Int64() < 95 {
		return &PaymentResult{
			Success:       true,
			TransactionID: fmt.Sprintf("wx_%d_%s", time.Now().Unix(), uuid.New().String()[:8]),
		}, nil
	} else {
		return &PaymentResult{
			Success: false,
			Error:   "支付失败",
		}, nil
	}
}

func (p *PaymentService) RefundPayment(orderID string, amount float64, reason string) (*PaymentResult, error) {
	// 模拟退款处理
	time.Sleep(1 * time.Second)
	
	return &PaymentResult{
		Success:       true,
		TransactionID: fmt.Sprintf("refund_%d_%s", time.Now().Unix(), uuid.New().String()[:8]),
	}, nil
}

func generateNonceStr() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 32)
	for i := range b {
		n, _ := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		b[i] = charset[n.Int64()]
	}
	return string(b)
}
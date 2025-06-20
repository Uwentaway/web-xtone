package services

import (
	"fmt"
	"os"
	"time"

	"github.com/aliyun/alibaba-cloud-sdk-go/services/dysmsapi"
	"github.com/aliyun/alibaba-cloud-sdk-go/sdk"
	"github.com/aliyun/alibaba-cloud-sdk-go/sdk/auth/credentials"
)

type SMSService struct {
	client       *dysmsapi.Client
	signName     string
	templateCode string
}

type SMSRequest struct {
	PhoneNumber  string `json:"phone_number"`
	Content      string `json:"content"`
	TemplateCode string `json:"template_code,omitempty"`
	SignName     string `json:"sign_name,omitempty"`
}

type SMSResponse struct {
	Success   bool   `json:"success"`
	MessageID string `json:"message_id,omitempty"`
	Error     string `json:"error,omitempty"`
	Code      string `json:"code,omitempty"`
}

func NewSMSService() (*SMSService, error) {
	accessKeyId := os.Getenv("ALIYUN_ACCESS_KEY_ID")
	accessKeySecret := os.Getenv("ALIYUN_ACCESS_KEY_SECRET")
	region := os.Getenv("ALIYUN_SMS_REGION")
	signName := os.Getenv("ALIYUN_SMS_SIGN_NAME")
	templateCode := os.Getenv("ALIYUN_SMS_TEMPLATE_CODE")

	if accessKeyId == "" || accessKeySecret == "" {
		return nil, fmt.Errorf("阿里云短信服务配置不完整")
	}

	config := sdk.NewConfig()
	credential := credentials.NewAccessKeyCredential(accessKeyId, accessKeySecret)
	client, err := dysmsapi.NewClientWithOptions(region, config, credential)
	if err != nil {
		return nil, fmt.Errorf("创建阿里云短信客户端失败: %v", err)
	}

	return &SMSService{
		client:       client,
		signName:     signName,
		templateCode: templateCode,
	}, nil
}

func (s *SMSService) SendSMS(request SMSRequest) (*SMSResponse, error) {
	// 如果没有配置阿里云信息，返回模拟成功
	if s.client == nil {
		return &SMSResponse{
			Success:   true,
			MessageID: fmt.Sprintf("mock_%d", time.Now().Unix()),
		}, nil
	}

	req := dysmsapi.CreateSendSmsRequest()
	req.Scheme = "https"
	req.PhoneNumbers = request.PhoneNumber
	req.SignName = s.signName
	if request.SignName != "" {
		req.SignName = request.SignName
	}
	req.TemplateCode = s.templateCode
	if request.TemplateCode != "" {
		req.TemplateCode = request.TemplateCode
	}
	req.TemplateParam = fmt.Sprintf(`{"content":"%s"}`, request.Content)

	response, err := s.client.SendSms(req)
	if err != nil {
		return &SMSResponse{
			Success: false,
			Error:   fmt.Sprintf("发送短信失败: %v", err),
		}, err
	}

	if response.Code == "OK" {
		return &SMSResponse{
			Success:   true,
			MessageID: response.BizId,
		}, nil
	} else {
		return &SMSResponse{
			Success: false,
			Error:   response.Message,
			Code:    response.Code,
		}, fmt.Errorf("短信发送失败: %s", response.Message)
	}
}

func (s *SMSService) QuerySMSStatus(messageID string) (*SMSResponse, error) {
	// 模拟查询状态
	return &SMSResponse{
		Success: true,
		Code:    "DELIVERED",
	}, nil
}
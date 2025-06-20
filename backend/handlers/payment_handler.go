package handlers

import (
	"net/http"

	"anonymous-messaging-backend/services"
	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	paymentService *services.PaymentService
}

type WechatPayRequest struct {
	OrderID string  `json:"order_id" binding:"required"`
	Amount  float64 `json:"amount" binding:"required"`
}

func NewPaymentHandler() (*PaymentHandler, error) {
	paymentService, err := services.NewPaymentService()
	if err != nil {
		return nil, err
	}

	return &PaymentHandler{
		paymentService: paymentService,
	}, nil
}

func (h *PaymentHandler) GetWechatPayConfig(c *gin.Context) {
	var req WechatPayRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数错误",
		})
		return
	}

	config, err := h.paymentService.GetWechatPayConfig(req.OrderID, req.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    config,
	})
}

func (h *PaymentHandler) WechatPayNotify(c *gin.Context) {
	// 处理微信支付回调
	// 这里需要验证签名和处理支付结果
	c.JSON(http.StatusOK, gin.H{
		"code":    "SUCCESS",
		"message": "成功",
	})
}
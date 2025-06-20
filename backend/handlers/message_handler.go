package handlers

import (
	"net/http"
	"time"

	"anonymous-messaging-backend/config"
	"anonymous-messaging-backend/models"
	"anonymous-messaging-backend/services"
	"github.com/gin-gonic/gin"
)

type MessageHandler struct {
	messageService *services.MessageService
}

type SendMessageRequest struct {
	Phone       string     `json:"phone" binding:"required"`
	Content     string     `json:"content" binding:"required"`
	ScheduledAt *time.Time `json:"scheduled_at,omitempty"`
}

type SendMessageResponse struct {
	Success bool           `json:"success"`
	Message string         `json:"message"`
	Data    models.Message `json:"data,omitempty"`
}

func NewMessageHandler() (*MessageHandler, error) {
	messageService, err := services.NewMessageService()
	if err != nil {
		return nil, err
	}

	return &MessageHandler{
		messageService: messageService,
	}, nil
}

func (h *MessageHandler) SendMessage(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "未授权",
		})
		return
	}

	var req SendMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数错误",
		})
		return
	}

	message, err := h.messageService.SendMessage(userID, req.Phone, req.Content, req.ScheduledAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, SendMessageResponse{
		Success: true,
		Message: "消息发送成功",
		Data:    *message,
	})
}

func (h *MessageHandler) GetMessages(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "未授权",
		})
		return
	}

	var messages []models.Message
	if err := config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取消息列表失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    messages,
	})
}

func (h *MessageHandler) CalculateCost(c *gin.Context) {
	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数错误",
		})
		return
	}

	cost := h.messageService.CalculateCost(req.Content)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"cost":    cost,
	})
}
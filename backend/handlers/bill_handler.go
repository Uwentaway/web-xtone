package handlers

import (
	"net/http"

	"anonymous-messaging-backend/config"
	"anonymous-messaging-backend/models"
	"github.com/gin-gonic/gin"
)

type BillHandler struct{}

func NewBillHandler() *BillHandler {
	return &BillHandler{}
}

func (h *BillHandler) GetBills(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "未授权",
		})
		return
	}

	var bills []models.Bill
	if err := config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&bills).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取账单失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    bills,
	})
}

func (h *BillHandler) GetBillSummary(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "未授权",
		})
		return
	}

	var totalPayment, totalRefund float64

	// 计算总支出
	config.DB.Model(&models.Bill{}).
		Where("user_id = ? AND type = ?", userID, "payment").
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalPayment)

	// 计算总退款
	config.DB.Model(&models.Bill{}).
		Where("user_id = ? AND type = ?", userID, "refund").
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalRefund)

	c.JSON(http.StatusOK, gin.H{
		"success":       true,
		"total_payment": totalPayment,
		"total_refund":  totalRefund,
	})
}
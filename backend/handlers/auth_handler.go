package handlers

import (
	"net/http"
	"time"

	"anonymous-messaging-backend/config"
	"anonymous-messaging-backend/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuthHandler struct{}

type LoginRequest struct {
	Phone        string `json:"phone"`
	WechatOpenID string `json:"wechat_openid,omitempty"`
	Nickname     string `json:"nickname,omitempty"`
	AvatarURL    string `json:"avatar_url,omitempty"`
	LoginType    string `json:"login_type"` // "phone" or "wechat"
}

type LoginResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	User    models.User `json:"user,omitempty"`
	Token   string      `json:"token,omitempty"`
}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数错误",
		})
		return
	}

	var user models.User
	var err error

	if req.LoginType == "wechat" && req.WechatOpenID != "" {
		// 微信登录
		err = config.DB.Where("wechat_openid = ?", req.WechatOpenID).First(&user).Error
		if err != nil {
			// 用户不存在，创建新用户
			user = models.User{
				ID:            uuid.New().String(),
				Phone:         req.Phone,
				WechatOpenID:  req.WechatOpenID,
				Nickname:      req.Nickname,
				AvatarURL:     req.AvatarURL,
				LoginType:     "wechat",
				Status:        "active",
				CreatedAt:     time.Now(),
				UpdatedAt:     time.Now(),
			}
			if err := config.DB.Create(&user).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"message": "创建用户失败",
				})
				return
			}
		}
	} else {
		// 手机号登录
		err = config.DB.Where("phone = ?", req.Phone).First(&user).Error
		if err != nil {
			// 用户不存在，创建新用户
			user = models.User{
				ID:        uuid.New().String(),
				Phone:     req.Phone,
				LoginType: "phone",
				Status:    "active",
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
			if err := config.DB.Create(&user).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"message": "创建用户失败",
				})
				return
			}
		}
	}

	// 生成JWT token（这里简化处理，实际应该使用JWT）
	token := uuid.New().String()

	c.JSON(http.StatusOK, LoginResponse{
		Success: true,
		Message: "登录成功",
		User:    user,
		Token:   token,
	})
}

func (h *AuthHandler) GetUserInfo(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "未授权",
		})
		return
	}

	var user models.User
	if err := config.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "用户不存在",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user":    user,
	})
}
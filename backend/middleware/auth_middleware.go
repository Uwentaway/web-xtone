package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从请求头获取token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "缺少授权头",
			})
			c.Abort()
			return
		}

		// 解析Bearer token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "无效的授权格式",
			})
			c.Abort()
			return
		}

		// 这里应该验证JWT token，简化处理直接使用token作为用户ID
		// 实际项目中应该解析JWT获取用户信息
		userID := tokenString // 简化处理
		
		c.Set("user_id", userID)
		c.Next()
	}
}
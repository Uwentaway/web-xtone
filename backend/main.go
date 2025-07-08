package main

import (
	"log"
	"os"

	"anonymous-messaging-backend/config"
	"anonymous-messaging-backend/handlers"
	"anonymous-messaging-backend/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// 连接数据库
	config.ConnectDatabase()

	// 创建Gin实例
	r := gin.Default()

	// 配置CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:5173", "http://127.0.0.1:5173"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	corsConfig.AllowCredentials = true
	r.Use(cors.New(corsConfig))

	// 初始化处理器
	authHandler := handlers.NewAuthHandler()
	
	messageHandler, err := handlers.NewMessageHandler()
	if err != nil {
		log.Fatal("Failed to initialize message handler:", err)
	}
	
	paymentHandler, err := handlers.NewPaymentHandler()
	if err != nil {
		log.Fatal("Failed to initialize payment handler:", err)
	}
	
	billHandler := handlers.NewBillHandler()

	// 路由组
	api := r.Group("/api")
	{
		// 认证相关
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
		}

		// 需要认证的路由
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			// 用户信息
			protected.GET("/user", authHandler.GetUserInfo)

			// 消息相关
			messages := protected.Group("/messages")
			{
				messages.POST("/send", messageHandler.SendMessage)
				messages.GET("/", messageHandler.GetMessages)
				messages.POST("/calculate-cost", messageHandler.CalculateCost)
			}

			// 支付相关
			payment := protected.Group("/payment")
			{
				payment.POST("/wechat/config", paymentHandler.GetWechatPayConfig)
			}

			// 账单相关
			bills := protected.Group("/bills")
			{
				bills.GET("/", billHandler.GetBills)
				bills.GET("/summary", billHandler.GetBillSummary)
			}
		}

		// 支付回调（不需要认证）
		api.POST("/payment/wechat/notify", paymentHandler.WechatPayNotify)
	}

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"message": "飞鸟飞信 Backend is running",
		})
	})

	// 启动服务器
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
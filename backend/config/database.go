package config

import (
	"fmt"
	"log"
	"os"

	"anonymous-messaging-backend/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port, dbname)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 自动迁移数据库表结构
	err = database.AutoMigrate(
		&models.User{},
		&models.Order{},
		&models.Message{},
		&models.Bill{},
		&models.SystemConfig{},
		&models.PaymentRecord{},
		&models.RefundRecord{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = database
	log.Println("Database connected successfully")
}
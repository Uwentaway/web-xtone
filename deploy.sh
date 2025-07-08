#!/bin/bash

# 飞鸟飞信部署脚本

set -e

echo "🚀 开始部署飞鸟飞信..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p certs
mkdir -p ssl
mkdir -p logs

# 检查环境变量配置
if [ ! -f "backend/.env" ]; then
    echo "⚙️  创建环境配置文件..."
    cp backend/.env.example backend/.env
    echo "⚠️  请编辑 backend/.env 文件，填入真实的配置信息"
fi

# 构建并启动服务
echo "🔨 构建Docker镜像..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 检查应用健康状态
echo "🏥 检查应用健康状态..."
if curl -f http://localhost:8081/health > /dev/null 2>&1; then
    echo "✅ 应用启动成功！"
    echo "🌐 访问地址: http://localhost:8081"
else
    echo "❌ 应用启动失败，请检查日志"
    docker-compose logs app
    exit 1
fi

echo "🎉 部署完成！"
echo ""
echo "📋 服务信息:"
echo "   - 应用地址: http://localhost:8081"
echo "   - MySQL: localhost:3306"
echo "   - Redis: localhost:6379"
echo ""
echo "📝 常用命令:"
echo "   - 查看日志: docker-compose logs -f"
echo "   - 停止服务: docker-compose down"
echo "   - 重启服务: docker-compose restart"
echo "   - 查看状态: docker-compose ps"
echo ""
echo "⚠️  注意事项:"
echo "   1. 请确保已配置真实的微信支付和阿里云短信参数"
echo "   2. 生产环境请修改默认密码和密钥"
echo "   3. 如需HTTPS，请配置SSL证书并启用nginx的HTTPS配置"
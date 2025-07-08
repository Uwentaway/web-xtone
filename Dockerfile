# 前端构建阶段
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制前端源码并构建
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./

RUN npm run build

# 后端构建阶段
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app/backend

# 安装必要的包
RUN apk add --no-cache git

# 复制go mod文件
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# 复制后端源码
COPY backend/ ./

# 构建后端应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 最终运行阶段
FROM alpine:latest

# 安装必要的包
RUN apk --no-cache add ca-certificates tzdata
RUN mkdir /app

WORKDIR /app

# 从构建阶段复制文件
COPY --from=backend-builder /app/backend/main .
COPY --from=frontend-builder /app/frontend/dist ./static
COPY backend/.env.example ./.env

# 创建证书目录
RUN mkdir -p ./certs

# 暴露端口
EXPOSE 8081

# 设置时区
ENV TZ=Asia/Shanghai

# 运行应用
CMD ["./main"]
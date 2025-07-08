# 后端独立Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 安装必要的包
RUN apk add --no-cache git ca-certificates tzdata

# 复制go mod文件
COPY go.mod go.sum ./
RUN go mod download

# 复制源码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 最终镜像
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
RUN mkdir /app

WORKDIR /app

# 复制二进制文件
COPY --from=builder /app/main .
COPY --from=builder /app/.env.example ./.env

# 创建证书目录
RUN mkdir -p ./certs

# 暴露端口
EXPOSE 8081

# 设置时区
ENV TZ=Asia/Shanghai

# 运行应用
CMD ["./main"]
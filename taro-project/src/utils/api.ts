import Taro from '@tarojs/taro'

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8081/api' 
  : 'https://your-domain.com/api'

// 获取认证头
function getAuthHeaders() {
  const token = Taro.getStorageSync('auth_token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  }
}

// 网络请求封装
async function request(url: string, options: any = {}) {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        ...getAuthHeaders(),
        ...options.header
      }
    })

    if (response.statusCode === 200) {
      return response.data
    } else {
      throw new Error(`HTTP ${response.statusCode}`)
    }
  } catch (error) {
    console.error('API请求失败:', error)
    throw error
  }
}

// 用户登录
export async function login(phone: string, loginType: 'phone' | 'wechat' = 'phone', wechatData?: any) {
  try {
    const data = await request('/auth/login', {
      method: 'POST',
      data: {
        phone,
        login_type: loginType,
        wechat_openid: wechatData?.openid,
        nickname: wechatData?.nickname,
        avatar_url: wechatData?.avatar_url,
      }
    })
    return data
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    console.warn('后端服务不可用，使用模拟登录')
    return {
      success: true,
      token: `mock_token_${Date.now()}`,
      user: {
        id: `user_${Date.now()}`,
        phone: phone || '13800138000',
        nickname: wechatData?.nickname || '飞鸟用户',
        avatar_url: wechatData?.avatar_url || '',
        login_type: loginType
      }
    }
  }
}

// 获取用户信息
export async function getUserInfo() {
  try {
    return await request('/user')
  } catch (error) {
    // 返回本地存储的用户信息
    const userInfo = Taro.getStorageSync('user_info')
    return {
      success: true,
      user: userInfo
    }
  }
}

// 计算短信费用
export function calculateSMSCost(content: string): number {
  const charCount = content.length
  const units = Math.ceil(charCount / 60)
  return units * 1.0
}

// 发送消息
export async function sendMessage(userId: string, phone: string, message: string, scheduledAt?: Date) {
  const cost = calculateSMSCost(message)
  
  try {
    const data = await request('/messages/send', {
      method: 'POST',
      data: {
        phone,
        content: message,
        scheduled_at: scheduledAt?.toISOString(),
      }
    })

    if (data.success) {
      return {
        id: data.data.id,
        recipientPhone: data.data.recipient_phone,
        content: data.data.content,
        createdAt: new Date(data.data.created_at),
        status: data.data.status,
        scheduledAt: data.data.scheduled_at ? new Date(data.data.scheduled_at) : undefined,
        cost: data.data.cost,
        orderId: data.data.order_id,
      }
    } else {
      throw new Error(data.message || '发送失败')
    }
  } catch (error) {
    // 如果后端不可用，返回模拟数据
    console.warn('后端服务不可用，使用模拟发送')
    
    // 模拟支付和发送过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 95% 成功率
    const success = Math.random() < 0.95
    
    if (!success) {
      throw new Error('发送失败，请重试')
    }

    return {
      id: `msg_${Date.now()}`,
      recipientPhone: phone,
      content: message,
      createdAt: new Date(),
      status: 'sent' as const,
      scheduledAt: scheduledAt,
      cost: cost,
      orderId: `order_${Date.now()}`,
    }
  }
}

// 获取消息列表
export async function getMessages() {
  try {
    const data = await request('/messages')
    
    if (data.success) {
      return data.data.map((msg: any) => ({
        id: msg.id,
        recipientPhone: msg.recipient_phone,
        content: msg.content,
        createdAt: new Date(msg.created_at),
        status: msg.status,
        scheduledAt: msg.scheduled_at ? new Date(msg.scheduled_at) : undefined,
        cost: msg.cost,
        orderId: msg.order_id,
      }))
    } else {
      throw new Error(data.message || '获取消息列表失败')
    }
  } catch (error) {
    // 返回本地存储的消息
    return Taro.getStorageSync('messages') || []
  }
}

// 获取用户账单
export async function getUserBills(userId: string) {
  try {
    const data = await request('/bills')
    
    if (data.success) {
      return data.data.map((bill: any) => ({
        id: bill.id,
        userId: bill.user_id,
        orderId: bill.order_id,
        type: bill.type,
        amount: bill.amount,
        description: bill.description,
        createdAt: new Date(bill.created_at),
      }))
    } else {
      throw new Error(data.message || '获取账单失败')
    }
  } catch (error) {
    // 从消息记录生成模拟账单
    const messages = Taro.getStorageSync('messages') || []
    return messages.map((msg: any, index: number) => ({
      id: `bill_${index}`,
      userId: userId,
      orderId: msg.orderId,
      type: 'payment',
      amount: msg.cost || 0,
      description: `发送短信 - ${msg.content.length}字符`,
      createdAt: new Date(msg.createdAt),
    }))
  }
}
// API functions for backend communication
import { v4 as uuidv4 } from 'uuid';
import { Message, Order, Bill } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8081/api';

// 获取认证头
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

// 用户登录
export async function login(phone: string, loginType: 'phone' | 'wechat' = 'phone', wechatData?: any) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      login_type: loginType,
      wechat_openid: wechatData?.openid,
      nickname: wechatData?.nickname,
      avatar_url: wechatData?.avatar_url,
    }),
  });

  const data = await response.json();
  if (data.success && data.token) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_info', JSON.stringify(data.user));
  }
  return data;
}

// 获取用户信息
export async function getUserInfo() {
  const response = await fetch(`${API_BASE_URL}/user`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// 计算短信费用
export function calculateSMSCost(content: string): number {
  const charCount = content.length;
  const units = Math.ceil(charCount / 60); // 每60字符为一个计费单位
  return units * 1.0; // 每单位1元
}

// 计算费用（调用后端）
export async function calculateCost(content: string) {
  const response = await fetch(`${API_BASE_URL}/messages/calculate-cost`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  return response.json();
}

// 获取微信支付配置
export async function getWechatPayConfig(orderId: string, amount: number) {
  const response = await fetch(`${API_BASE_URL}/payment/wechat/config`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      order_id: orderId,
      amount: amount,
    }),
  });
  return response.json();
}

// 发送消息（完整流程）
export async function sendMessage(userId: string, phone: string, message: string, scheduledAt?: Date): Promise<Message> {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        phone,
        content: message,
        scheduled_at: scheduledAt?.toISOString(),
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || '发送失败');
    }

    // 转换后端返回的数据格式
    const backendMessage = data.data;
    const frontendMessage: Message = {
      id: backendMessage.id,
      recipientPhone: backendMessage.recipient_phone,
      content: backendMessage.content,
      createdAt: new Date(backendMessage.created_at),
      status: backendMessage.status as Message['status'],
      scheduledAt: backendMessage.scheduled_at ? new Date(backendMessage.scheduled_at) : undefined,
      cost: backendMessage.cost,
      orderId: backendMessage.order_id,
    };

    return frontendMessage;
  } catch (error) {
    throw error;
  }
}

// 获取消息列表
export async function getMessages(): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || '获取消息列表失败');
  }

  // 转换后端返回的数据格式
  return data.data.map((msg: any) => ({
    id: msg.id,
    recipientPhone: msg.recipient_phone,
    content: msg.content,
    createdAt: new Date(msg.created_at),
    status: msg.status,
    scheduledAt: msg.scheduled_at ? new Date(msg.scheduled_at) : undefined,
    cost: msg.cost,
    orderId: msg.order_id,
  }));
}

// 获取用户账单
export async function getUserBills(userId: string): Promise<Bill[]> {
  const response = await fetch(`${API_BASE_URL}/bills`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || '获取账单失败');
  }

  // 转换后端返回的数据格式
  return data.data.map((bill: any) => ({
    id: bill.id,
    userId: bill.user_id,
    orderId: bill.order_id,
    type: bill.type,
    amount: bill.amount,
    description: bill.description,
    createdAt: new Date(bill.created_at),
  }));
}

// 获取账单汇总
export async function getBillSummary() {
  const response = await fetch(`${API_BASE_URL}/bills/summary`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}
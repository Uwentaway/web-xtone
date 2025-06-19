// Simulated API functions
import { v4 as uuidv4 } from 'uuid';
import { Message, Order, Bill } from '../types';

// 计算短信费用
export function calculateSMSCost(content: string): number {
  const charCount = content.length;
  const units = Math.ceil(charCount / 60); // 每60字符为一个计费单位
  return units * 1.0; // 每单位1元
}

// 创建订单
export async function createOrder(userId: string, amount: number, description: string): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order: Order = {
        id: uuidv4(),
        userId,
        amount,
        status: 'pending',
        createdAt: new Date(),
        description
      };
      resolve(order);
    }, 500);
  });
}

// 微信支付
export async function wechatPay(orderId: string, amount: number): Promise<{ success: boolean; transactionId?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟支付成功率90%
      const success = Math.random() < 0.9;
      if (success) {
        resolve({
          success: true,
          transactionId: `wx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
      } else {
        resolve({ success: false });
      }
    }, 2000);
  });
}

// 发送短信
export async function sendSMS(phone: string, content: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟短信发送成功率95%
      const success = Math.random() < 0.95;
      if (success) {
        resolve({
          success: true,
          messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
      } else {
        resolve({
          success: false,
          error: '短信发送失败'
        });
      }
    }, 1500);
  });
}

// 退款
export async function refundOrder(orderId: string, amount: number, reason: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟退款成功
      resolve({ success: true });
    }, 1000);
  });
}

// 发送消息（完整流程）
export async function sendMessage(userId: string, phone: string, message: string, scheduledAt?: Date): Promise<Message> {
  try {
    const cost = calculateSMSCost(message);
    
    // 1. 创建订单
    const order = await createOrder(userId, cost, `发送短信 - ${message.length}字符`);
    
    // 2. 支付
    const paymentResult = await wechatPay(order.id, cost);
    
    if (!paymentResult.success) {
      throw new Error('支付失败');
    }
    
    // 3. 创建消息记录
    const newMessage: Message = {
      id: uuidv4(),
      recipientPhone: phone,
      content: message,
      createdAt: new Date(),
      status: scheduledAt ? 'pending' : 'pending',
      scheduledAt,
      cost,
      orderId: order.id
    };
    
    // 4. 如果不是定时发送，立即发送短信
    if (!scheduledAt) {
      const smsResult = await sendSMS(phone, message);
      
      if (smsResult.success) {
        newMessage.status = 'sent';
      } else {
        newMessage.status = 'failed';
        // 发送失败，退款
        await refundOrder(order.id, cost, '短信发送失败');
      }
    }
    
    return newMessage;
  } catch (error) {
    throw error;
  }
}

// 获取用户账单
export async function getUserBills(userId: string): Promise<Bill[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟账单数据
      const bills: Bill[] = [
        {
          id: '1',
          userId,
          orderId: 'order_1',
          type: 'payment',
          amount: 2.00,
          description: '发送短信 - 120字符',
          createdAt: new Date('2024-01-15 14:30:00')
        },
        {
          id: '2',
          userId,
          orderId: 'order_2',
          type: 'refund',
          amount: 1.00,
          description: '短信发送失败退款',
          createdAt: new Date('2024-01-14 10:15:00')
        }
      ];
      resolve(bills);
    }, 1000);
  });
}
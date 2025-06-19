export interface Message {
  id: string;
  recipientPhone: string;
  content: string;
  createdAt: Date;
  status: 'sent' | 'failed' | 'pending';
  scheduledAt?: Date;
  cost: number;
  orderId: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en';
  notifications: boolean;
  saveHistory: boolean;
}

export interface User {
  id: string;
  phone: string;
  isLoggedIn: boolean;
  balance: number;
}

export interface Order {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  paidAt?: Date;
  refundedAt?: Date;
  messageId?: string;
  description: string;
}

export interface Bill {
  id: string;
  userId: string;
  orderId: string;
  type: 'payment' | 'refund';
  amount: number;
  description: string;
  createdAt: Date;
}
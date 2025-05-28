export interface Message {
  id: string;
  recipientPhone: string;
  content: string;
  createdAt: Date;
  status: 'sent' | 'failed' | 'pending';
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en';
  notifications: boolean;
  saveHistory: boolean;
}
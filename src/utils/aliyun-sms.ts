// 阿里云短信服务配置和方法

// 阿里云短信配置（后端配置）
export const ALIYUN_SMS_CONFIG = {
  // 这些配置应该在后端设置，前端不应该暴露
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
  signName: process.env.ALIYUN_SMS_SIGN_NAME || '飞鸟飞信',
  templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE || 'SMS_ANONYMOUS_MSG',
  endpoint: 'https://dysmsapi.aliyuncs.com'
};

// 短信发送接口（需要后端实现）
export interface SMSRequest {
  phoneNumber: string;
  content: string;
  templateCode?: string;
  signName?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  code?: string;
}

// 发送短信（调用后端API）
export async function sendAliyunSMS(request: SMSRequest): Promise<SMSResponse> {
  try {
    // 这里应该调用后端API发送短信
    // const response = await fetch('/api/sms/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request)
    // });
    // return response.json();
    
    // 临时模拟发送
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() < 0.95; // 95%成功率
        if (success) {
          resolve({
            success: true,
            messageId: `aliyun_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          });
        } else {
          resolve({
            success: false,
            error: '短信发送失败',
            code: 'SEND_FAILED'
          });
        }
      }, 1500);
    });
  } catch (error) {
    return {
      success: false,
      error: '网络错误'
    };
  }
}

// 查询短信发送状态
export async function querySMSStatus(messageId: string): Promise<{
  success: boolean;
  status?: 'DELIVERED' | 'FAILED' | 'UNKNOWN';
  error?: string;
}> {
  try {
    // 调用后端API查询状态
    // const response = await fetch(`/api/sms/status/${messageId}`);
    // return response.json();
    
    // 临时模拟
    return {
      success: true,
      status: 'DELIVERED'
    };
  } catch (error) {
    return {
      success: false,
      error: '查询失败'
    };
  }
}
// 微信支付相关配置和方法
import wx from 'weixin-js-sdk';

// 微信支付配置（需要从后端获取）
interface WechatPayConfig {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

// 微信商户配置（后端配置）
export const WECHAT_MERCHANT_CONFIG = {
  // 这些配置应该在后端设置，前端不应该暴露
  merchantId: process.env.WECHAT_MERCHANT_ID || '', // 微信商户号
  merchantKey: process.env.WECHAT_MERCHANT_KEY || '', // 商户密钥
  notifyUrl: process.env.WECHAT_NOTIFY_URL || '', // 支付回调地址
};

// 调起微信支付
export function invokeWechatPay(config: WechatPayConfig): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    wx.chooseWXPay({
      timestamp: config.timeStamp,
      nonceStr: config.nonceStr,
      package: config.package,
      signType: config.signType,
      paySign: config.paySign,
      success: () => {
        resolve({ success: true });
      },
      fail: (error) => {
        resolve({ success: false, error: error.errMsg });
      }
    });
  });
}

// 获取微信支付配置（需要调用后端API）
export async function getWechatPayConfig(orderId: string, amount: number): Promise<WechatPayConfig> {
  // 这里应该调用后端API获取支付配置
  // const response = await fetch('/api/wechat/pay/config', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ orderId, amount })
  // });
  // return response.json();
  
  // 临时模拟数据
  return {
    appId: 'your_app_id',
    timeStamp: Date.now().toString(),
    nonceStr: Math.random().toString(36).substr(2, 15),
    package: `prepay_id=wx${Date.now()}`,
    signType: 'MD5',
    paySign: 'mock_pay_sign'
  };
}
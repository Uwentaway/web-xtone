// 微信支付相关配置和方法
import wx from 'weixin-js-sdk';
import { getWechatPayConfig } from './api';

// 微信支付配置（需要从后端获取）
interface WechatPayConfig {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

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

// 处理微信支付流程
export async function processWechatPayment(orderId: string, amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. 获取微信支付配置
    const configResponse = await getWechatPayConfig(orderId, amount);
    
    if (!configResponse.success) {
      return {
        success: false,
        error: configResponse.message || '获取支付配置失败'
      };
    }

    // 2. 调起微信支付
    const payResult = await invokeWechatPay(configResponse.data);
    
    return payResult;
  } catch (error) {
    return {
      success: false,
      error: '支付异常，请重试'
    };
  }
}
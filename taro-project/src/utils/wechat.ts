import Taro from '@tarojs/taro'

// 微信支付配置
interface WechatPayConfig {
  appId: string
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
}

// 调起微信支付
export function invokeWechatPay(config: WechatPayConfig): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    Taro.requestPayment({
      timeStamp: config.timeStamp,
      nonceStr: config.nonceStr,
      package: config.package,
      signType: config.signType,
      paySign: config.paySign,
      success: () => {
        resolve({ success: true })
      },
      fail: (error) => {
        resolve({ success: false, error: error.errMsg })
      }
    })
  })
}

// 获取微信支付配置
export async function getWechatPayConfig(orderId: string, amount: number): Promise<any> {
  try {
    // 这里应该调用后端API获取支付配置
    // const response = await request('/payment/wechat/config', {
    //   method: 'POST',
    //   data: { order_id: orderId, amount }
    // })
    
    // 模拟返回支付配置
    return {
      success: true,
      data: {
        appId: 'mock_app_id',
        timeStamp: String(Math.floor(Date.now() / 1000)),
        nonceStr: Math.random().toString(36).substr(2, 15),
        package: `prepay_id=wx${Date.now()}`,
        signType: 'RSA',
        paySign: 'mock_pay_sign'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: '获取支付配置失败'
    }
  }
}

// 处理微信支付流程
export async function processWechatPayment(orderId: string, amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. 获取微信支付配置
    const configResponse = await getWechatPayConfig(orderId, amount)
    
    if (!configResponse.success) {
      return {
        success: false,
        error: configResponse.message || '获取支付配置失败'
      }
    }

    // 2. 调起微信支付
    const payResult = await invokeWechatPay(configResponse.data)
    
    return payResult
  } catch (error) {
    return {
      success: false,
      error: '支付异常，请重试'
    }
  }
}

// 获取微信用户信息
export async function getWechatUserInfo(): Promise<any> {
  try {
    const userInfo = await Taro.getUserProfile({
      desc: '用于完善用户资料'
    })
    return {
      success: true,
      userInfo: userInfo.userInfo
    }
  } catch (error) {
    return {
      success: false,
      error: '获取用户信息失败'
    }
  }
}

// 微信登录
export async function wechatLogin(): Promise<any> {
  try {
    const loginRes = await Taro.login()
    
    if (!loginRes.code) {
      throw new Error('获取微信登录凭证失败')
    }

    return {
      success: true,
      code: loginRes.code
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || '微信登录失败'
    }
  }
}
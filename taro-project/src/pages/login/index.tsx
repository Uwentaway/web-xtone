import { Component } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { login } from '../../utils/api'
import './index.scss'

interface LoginState {
  loading: boolean
  error: string
}

export default class Login extends Component<{}, LoginState> {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: ''
    }
  }

  componentDidMount() {
    // 检查是否已登录
    const token = Taro.getStorageSync('auth_token')
    if (token) {
      this.navigateToMain()
    }
  }

  navigateToMain = () => {
    Taro.switchTab({
      url: '/pages/messages/index'
    })
  }

  handleWechatLogin = async () => {
    try {
      this.setState({ loading: true, error: '' })

      // 获取微信登录信息
      const loginRes = await Taro.login()
      
      if (!loginRes.code) {
        throw new Error('获取微信登录凭证失败')
      }

      // 获取用户信息
      const userInfoRes = await Taro.getUserProfile({
        desc: '用于完善用户资料'
      })

      // 调用后端登录接口
      const response = await login('', 'wechat', {
        code: loginRes.code,
        nickname: userInfoRes.userInfo.nickName,
        avatar_url: userInfoRes.userInfo.avatarUrl
      })

      if (response.success) {
        // 保存登录信息
        Taro.setStorageSync('auth_token', response.token)
        Taro.setStorageSync('user_info', response.user)
        
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        this.navigateToMain()
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error) {
      console.error('微信登录失败:', error)
      this.setState({ 
        error: error.message || '登录失败，请重试' 
      })
      
      Taro.showToast({
        title: '登录失败',
        icon: 'error'
      })
    } finally {
      this.setState({ loading: false })
    }
  }

  handlePhoneLogin = () => {
    // 小程序中手机号登录需要特殊处理
    Taro.showModal({
      title: '提示',
      content: '手机号登录功能正在开发中，请使用微信登录',
      showCancel: false
    })
  }

  render() {
    const { loading, error } = this.state

    return (
      <View className='login-page'>
        <View className='login-container'>
          {/* Logo Section */}
          <View className='logo-section'>
            <View className='logo-icon'>
              <Text className='logo-text'>📱</Text>
            </View>
            <Text className='app-title'>飞鸟飞信</Text>
            <Text className='app-subtitle'>安全、匿名的传话助手</Text>
          </View>

          {/* Login Form */}
          <View className='login-form'>
            {error && (
              <View className='error-message'>
                <Text className='error-text'>{error}</Text>
              </View>
            )}

            <Button
              className='login-btn wechat-btn'
              onClick={this.handleWechatLogin}
              loading={loading}
              disabled={loading}
            >
              <Text className='btn-text'>微信一键登录</Text>
            </Button>

            <View className='divider'>
              <Text className='divider-text'>或</Text>
            </View>

            <Button
              className='login-btn phone-btn'
              onClick={this.handlePhoneLogin}
              disabled={loading}
            >
              <Text className='btn-text'>手机号登录</Text>
            </Button>
          </View>

          {/* Footer */}
          <View className='login-footer'>
            <Text className='footer-text'>
              登录即表示您同意我们的服务条款和隐私政策
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
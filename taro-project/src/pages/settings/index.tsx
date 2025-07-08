import { Component } from 'react'
import { View, Text, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface SettingsState {
  notifications: boolean
  saveHistory: boolean
  autoLogin: boolean
}

export default class Settings extends Component<{}, SettingsState> {

  constructor(props) {
    super(props)
    this.state = {
      notifications: true,
      saveHistory: true,
      autoLogin: true
    }
  }

  componentDidMount() {
    this.loadSettings()
  }

  loadSettings = () => {
    const settings = Taro.getStorageSync('app_settings') || {}
    this.setState({
      notifications: settings.notifications !== false,
      saveHistory: settings.saveHistory !== false,
      autoLogin: settings.autoLogin !== false
    })
  }

  saveSettings = (newSettings: Partial<SettingsState>) => {
    const currentSettings = Taro.getStorageSync('app_settings') || {}
    const updatedSettings = { ...currentSettings, ...newSettings }
    Taro.setStorageSync('app_settings', updatedSettings)
    this.setState(newSettings)
  }

  handleNotificationsChange = (e) => {
    const value = e.detail.value
    this.saveSettings({ notifications: value })
    
    if (value) {
      // 请求通知权限
      Taro.requestSubscribeMessage({
        tmplIds: ['your_template_id'], // 需要配置消息模板ID
        success: () => {
          Taro.showToast({
            title: '通知已开启',
            icon: 'success'
          })
        },
        fail: () => {
          Taro.showToast({
            title: '通知权限获取失败',
            icon: 'error'
          })
        }
      })
    }
  }

  handleSaveHistoryChange = (e) => {
    const value = e.detail.value
    this.saveSettings({ saveHistory: value })
    
    if (!value) {
      Taro.showModal({
        title: '确认清除',
        content: '关闭历史记录保存将清除已保存的消息记录，确定继续吗？',
        success: (res) => {
          if (res.confirm) {
            Taro.removeStorageSync('messages')
            Taro.showToast({
              title: '历史记录已清除',
              icon: 'success'
            })
          } else {
            this.setState({ saveHistory: true })
          }
        }
      })
    }
  }

  handleAutoLoginChange = (e) => {
    const value = e.detail.value
    this.saveSettings({ autoLogin: value })
  }

  handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？这将不会影响您的登录状态。',
      success: (res) => {
        if (res.confirm) {
          // 保留登录信息，清除其他缓存
          const authToken = Taro.getStorageSync('auth_token')
          const userInfo = Taro.getStorageSync('user_info')
          
          Taro.clearStorageSync()
          
          if (authToken) Taro.setStorageSync('auth_token', authToken)
          if (userInfo) Taro.setStorageSync('user_info', userInfo)
          
          Taro.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
        }
      }
    })
  }

  handleAbout = () => {
    Taro.showModal({
      title: '关于飞鸟飞信',
      content: '飞鸟飞信 v1.0.0\n\n一个安全、匿名的传话助手\n\n© 2024 飞鸟飞信团队',
      showCancel: false,
      confirmText: '确定'
    })
  }

  handleBack = () => {
    Taro.navigateBack()
  }

  render() {
    const { notifications, saveHistory, autoLogin } = this.state

    return (
      <View className='settings-page'>
        <View className='container'>
          {/* Header */}
          <View className='page-header'>
            <Text className='back-btn' onClick={this.handleBack}>‹</Text>
            <Text className='page-title'>设置</Text>
          </View>

          {/* Settings Groups */}
          <View className='card'>
            <Text className='section-title'>通知设置</Text>
            
            <View className='setting-item'>
              <View className='setting-info'>
                <Text className='setting-icon'>🔔</Text>
                <View className='setting-text'>
                  <Text className='setting-name'>消息通知</Text>
                  <Text className='setting-desc'>接收发送状态通知</Text>
                </View>
              </View>
              <Switch
                checked={notifications}
                onChange={this.handleNotificationsChange}
                color='#667eea'
              />
            </View>
          </View>

          <View className='card'>
            <Text className='section-title'>隐私设置</Text>
            
            <View className='setting-item'>
              <View className='setting-info'>
                <Text className='setting-icon'>💾</Text>
                <View className='setting-text'>
                  <Text className='setting-name'>保存历史记录</Text>
                  <Text className='setting-desc'>在本地保存发送记录</Text>
                </View>
              </View>
              <Switch
                checked={saveHistory}
                onChange={this.handleSaveHistoryChange}
                color='#667eea'
              />
            </View>

            <View className='setting-item'>
              <View className='setting-info'>
                <Text className='setting-icon'>🔐</Text>
                <View className='setting-text'>
                  <Text className='setting-name'>自动登录</Text>
                  <Text className='setting-desc'>下次启动时自动登录</Text>
                </View>
              </View>
              <Switch
                checked={autoLogin}
                onChange={this.handleAutoLoginChange}
                color='#667eea'
              />
            </View>
          </View>

          <View className='card'>
            <Text className='section-title'>其他</Text>
            
            <View className='setting-item clickable' onClick={this.handleClearCache}>
              <View className='setting-info'>
                <Text className='setting-icon'>🗑️</Text>
                <View className='setting-text'>
                  <Text className='setting-name'>清除缓存</Text>
                  <Text className='setting-desc'>清除应用缓存数据</Text>
                </View>
              </View>
              <Text className='setting-arrow'>›</Text>
            </View>

            <View className='setting-item clickable' onClick={this.handleAbout}>
              <View className='setting-info'>
                <Text className='setting-icon'>ℹ️</Text>
                <View className='setting-text'>
                  <Text className='setting-name'>关于</Text>
                  <Text className='setting-desc'>版本信息和帮助</Text>
                </View>
              </View>
              <Text className='setting-arrow'>›</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
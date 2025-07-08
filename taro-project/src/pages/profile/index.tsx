import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface ProfileState {
  userInfo: any
  messageCount: number
  totalCost: number
}

export default class Profile extends Component<{}, ProfileState> {

  constructor(props) {
    super(props)
    this.state = {
      userInfo: null,
      messageCount: 0,
      totalCost: 0
    }
  }

  componentDidMount() {
    this.loadUserInfo()
    this.loadStatistics()
  }

  loadUserInfo = () => {
    const userInfo = Taro.getStorageSync('user_info')
    this.setState({ userInfo })
  }

  loadStatistics = () => {
    const messages = Taro.getStorageSync('messages') || []
    const messageCount = messages.length
    const totalCost = messages.reduce((sum, msg) => sum + (msg.cost || 0), 0)
    
    this.setState({ messageCount, totalCost })
  }

  navigateToBills = () => {
    Taro.navigateTo({
      url: '/pages/bills/index'
    })
  }

  navigateToSettings = () => {
    Taro.navigateTo({
      url: '/pages/settings/index'
    })
  }

  handleLogout = async () => {
    const result = await Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消'
    })

    if (result.confirm) {
      // 清除本地存储
      Taro.clearStorageSync()
      
      // 跳转到登录页
      Taro.reLaunch({
        url: '/pages/login/index'
      })
    }
  }

  render() {
    const { userInfo, messageCount, totalCost } = this.state

    if (!userInfo) {
      return (
        <View className='profile-page'>
          <View className='container'>
            <Text>加载中...</Text>
          </View>
        </View>
      )
    }

    return (
      <View className='profile-page'>
        <View className='container'>
          {/* User Info Card */}
          <View className='card user-card'>
            <View className='user-info'>
              <View className='avatar'>
                <Text className='avatar-text'>👤</Text>
              </View>
              <View className='user-details'>
                <Text className='user-name'>
                  {userInfo.nickname || userInfo.phone || '飞鸟用户'}
                </Text>
                <Text className='user-type'>飞鸟飞信用户</Text>
              </View>
            </View>
          </View>

          {/* Statistics Card */}
          <View className='card stats-card'>
            <Text className='card-title'>使用统计</Text>
            <View className='stats-grid'>
              <View className='stat-item'>
                <Text className='stat-number'>{messageCount}</Text>
                <Text className='stat-label'>发送消息</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-number'>¥{totalCost.toFixed(2)}</Text>
                <Text className='stat-label'>总消费</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className='card menu-card'>
            <View className='menu-item' onClick={this.navigateToBills}>
              <View className='menu-item-content'>
                <Text className='menu-icon'>📊</Text>
                <Text className='menu-text'>账单明细</Text>
              </View>
              <Text className='menu-arrow'>›</Text>
            </View>

            <View className='menu-item' onClick={this.navigateToSettings}>
              <View className='menu-item-content'>
                <Text className='menu-icon'>⚙️</Text>
                <Text className='menu-text'>设置</Text>
              </View>
              <Text className='menu-arrow'>›</Text>
            </View>

            <View className='menu-item' onClick={this.handleLogout}>
              <View className='menu-item-content'>
                <Text className='menu-icon'>🚪</Text>
                <Text className='menu-text'>退出登录</Text>
              </View>
              <Text className='menu-arrow'>›</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
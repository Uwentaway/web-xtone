import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

class App extends Component<PropsWithChildren> {

  componentDidMount() {
    // 检查登录状态
    this.checkLoginStatus()
  }

  checkLoginStatus = () => {
    const token = Taro.getStorageSync('auth_token')
    const userInfo = Taro.getStorageSync('user_info')
    
    if (!token || !userInfo) {
      // 未登录，跳转到登录页
      Taro.reLaunch({
        url: '/pages/login/index'
      })
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    return this.props.children
  }
}

export default App
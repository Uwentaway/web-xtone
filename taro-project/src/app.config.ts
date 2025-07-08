export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/messages/index',
    'pages/profile/index',
    'pages/bills/index',
    'pages/settings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#5B21B6',
    navigationBarTitleText: '飞鸟飞信',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f8f9fa'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#5B21B6',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/messages/index',
        text: '悄悄话',
        iconPath: 'assets/icons/message.png',
        selectedIconPath: 'assets/icons/message-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/icons/user.png',
        selectedIconPath: 'assets/icons/user-active.png'
      }
    ]
  },
  permission: {
    'scope.userInfo': {
      desc: '用于完善用户资料'
    }
  },
  requiredPrivateInfos: ['getLocation'],
  lazyCodeLoading: 'requiredComponents'
})

function defineAppConfig(config) {
  return config
}
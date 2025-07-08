import { Component } from 'react'
import { View, Text, Textarea, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { sendMessage, calculateCost } from '../../utils/api'
import './index.scss'

interface Message {
  id: string
  recipientPhone: string
  content: string
  createdAt: Date
  status: 'sent' | 'failed' | 'pending'
  cost: number
}

interface MessagesState {
  phone: string
  message: string
  loading: boolean
  error: string
  cost: number
  showScheduler: boolean
  scheduledDate: string
  scheduledTime: string
  messages: Message[]
}

export default class Messages extends Component<{}, MessagesState> {

  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      message: '',
      loading: false,
      error: '',
      cost: 0,
      showScheduler: false,
      scheduledDate: '',
      scheduledTime: '',
      messages: []
    }
  }

  componentDidMount() {
    this.loadMessages()
  }

  loadMessages = () => {
    const savedMessages = Taro.getStorageSync('messages') || []
    this.setState({ messages: savedMessages })
  }

  calculateMessageCost = (content: string) => {
    const charCount = content.length
    const units = Math.ceil(charCount / 60)
    return units * 1.0
  }

  handleMessageChange = (e) => {
    const content = e.detail.value
    const cost = this.calculateMessageCost(content)
    this.setState({ 
      message: content,
      cost: cost
    })
  }

  handlePhoneChange = (e) => {
    this.setState({ phone: e.detail.value })
  }

  handleSendMessage = async () => {
    const { phone, message, scheduledDate, scheduledTime, showScheduler } = this.state

    if (!phone.trim()) {
      this.setState({ error: '请输入手机号' })
      return
    }

    if (!message.trim()) {
      this.setState({ error: '请输入短信内容' })
      return
    }

    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      this.setState({ error: '请输入有效的手机号码' })
      return
    }

    let scheduledAt: Date | undefined
    if (showScheduler && scheduledDate && scheduledTime) {
      scheduledAt = new Date(`${scheduledDate} ${scheduledTime}`)
      if (scheduledAt <= new Date()) {
        this.setState({ error: '定时发送时间必须晚于当前时间' })
        return
      }
    }

    try {
      this.setState({ loading: true, error: '' })

      // 显示支付确认
      const confirmResult = await Taro.showModal({
        title: '确认支付',
        content: `发送费用：¥${this.state.cost.toFixed(2)}\n确认发送吗？`,
        confirmText: '确认支付',
        cancelText: '取消'
      })

      if (!confirmResult.confirm) {
        this.setState({ loading: false })
        return
      }

      // 调用发送接口
      const userInfo = Taro.getStorageSync('user_info')
      const newMessage = await sendMessage(userInfo.id, phone, message, scheduledAt)

      // 保存到本地存储
      const messages = [...this.state.messages, newMessage]
      this.setState({ 
        messages,
        phone: '',
        message: '',
        cost: 0,
        scheduledDate: '',
        scheduledTime: '',
        showScheduler: false
      })
      Taro.setStorageSync('messages', messages)

      Taro.showToast({
        title: '发送成功',
        icon: 'success'
      })

    } catch (error) {
      console.error('发送失败:', error)
      this.setState({ error: '发送失败，请稍后再试' })
      
      Taro.showToast({
        title: '发送失败',
        icon: 'error'
      })
    } finally {
      this.setState({ loading: false })
    }
  }

  toggleScheduler = () => {
    this.setState({ showScheduler: !this.state.showScheduler })
  }

  handleDateChange = (e) => {
    this.setState({ scheduledDate: e.detail.value })
  }

  handleTimeChange = (e) => {
    this.setState({ scheduledTime: e.detail.value })
  }

  formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  render() {
    const { 
      phone, 
      message, 
      loading, 
      error, 
      cost, 
      showScheduler, 
      scheduledDate, 
      scheduledTime,
      messages 
    } = this.state

    const maxMessageLength = 200

    return (
      <View className='messages-page'>
        <View className='container'>
          {/* Message Form */}
          <View className='card'>
            {error && (
              <View className='error-message'>
                <Text className='error-text'>{error}</Text>
              </View>
            )}

            <View className='input-group'>
              <Text className='input-label'>对方手机号</Text>
              <Input
                className='input-field'
                type='number'
                placeholder='请输入对方手机号码'
                value={phone}
                onInput={this.handlePhoneChange}
              />
            </View>

            <View className='input-group'>
              <Text className='input-label'>短信内容</Text>
              <Textarea
                className='textarea-field'
                placeholder='请输入想要发送的信息...'
                value={message}
                onInput={this.handleMessageChange}
                maxlength={maxMessageLength}
                showConfirmBar={false}
                adjustPosition={false}
              />
              <View className='message-info'>
                <View className='message-actions'>
                  <Text 
                    className='action-btn'
                    onClick={this.toggleScheduler}
                  >
                    ⏰ 定时发送
                  </Text>
                </View>
                <Text className='char-count'>
                  {message.length}/{maxMessageLength}
                </Text>
              </View>
            </View>

            {/* 定时发送设置 */}
            {showScheduler && (
              <View className='scheduler-section'>
                <Text className='scheduler-title'>📅 定时发送设置</Text>
                <View className='scheduler-inputs'>
                  <View className='scheduler-input'>
                    <Text className='scheduler-label'>日期</Text>
                    <Picker
                      mode='date'
                      value={scheduledDate}
                      onChange={this.handleDateChange}
                    >
                      <View className='picker-view'>
                        <Text className='picker-text'>
                          {scheduledDate || '选择日期'}
                        </Text>
                      </View>
                    </Picker>
                  </View>
                  <View className='scheduler-input'>
                    <Text className='scheduler-label'>时间</Text>
                    <Picker
                      mode='time'
                      value={scheduledTime}
                      onChange={this.handleTimeChange}
                    >
                      <View className='picker-view'>
                        <Text className='picker-text'>
                          {scheduledTime || '选择时间'}
                        </Text>
                      </View>
                    </Picker>
                  </View>
                </View>
              </View>
            )}

            {/* 费用显示 */}
            {message && (
              <View className='cost-section'>
                <View className='cost-info'>
                  <Text className='cost-label'>字符数: {message.length}</Text>
                  <Text className='cost-amount'>费用: ¥{cost.toFixed(2)}</Text>
                </View>
                <Text className='cost-note'>
                  按60字符计费，每60字符¥1.00
                </Text>
              </View>
            )}

            <Button
              className='send-btn'
              onClick={this.handleSendMessage}
              loading={loading}
              disabled={loading || !message.trim()}
            >
              {loading ? '处理中...' : cost > 0 ? `支付 ¥${cost.toFixed(2)} 并发送` : '发送'}
            </Button>
          </View>

          {/* Message History */}
          {messages.length > 0 && (
            <View className='card'>
              <Text className='section-title'>最近消息</Text>
              <View className='messages-list'>
                {messages.map((msg) => (
                  <View key={msg.id} className='message-item'>
                    <View className='message-header'>
                      <Text className='message-phone'>
                        +{msg.recipientPhone.substring(0, 3)}****{msg.recipientPhone.substring(7)}
                      </Text>
                      <Text className='message-time'>
                        {this.formatDate(msg.createdAt)}
                      </Text>
                    </View>
                    <Text className='message-content'>{msg.content}</Text>
                    <View className='message-footer'>
                      <Text className='message-cost'>¥{msg.cost.toFixed(2)}</Text>
                      <Text className={`message-status ${msg.status}`}>
                        {msg.status === 'sent' ? '已发送' : 
                         msg.status === 'failed' ? '发送失败' : '发送中'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface Bill {
  id: string
  type: 'payment' | 'refund'
  amount: number
  description: string
  createdAt: Date
}

interface BillsState {
  bills: Bill[]
  totalPayment: number
  totalRefund: number
  loading: boolean
}

export default class Bills extends Component<{}, BillsState> {

  constructor(props) {
    super(props)
    this.state = {
      bills: [],
      totalPayment: 0,
      totalRefund: 0,
      loading: true
    }
  }

  componentDidMount() {
    this.loadBills()
  }

  loadBills = () => {
    // 模拟从消息记录生成账单数据
    const messages = Taro.getStorageSync('messages') || []
    
    const bills: Bill[] = messages.map((msg, index) => ({
      id: `bill_${index}`,
      type: 'payment' as const,
      amount: msg.cost || 0,
      description: `发送短信 - ${msg.content.length}字符`,
      createdAt: new Date(msg.createdAt)
    }))

    const totalPayment = bills
      .filter(b => b.type === 'payment')
      .reduce((sum, b) => sum + b.amount, 0)
    
    const totalRefund = bills
      .filter(b => b.type === 'refund')
      .reduce((sum, b) => sum + b.amount, 0)

    this.setState({
      bills,
      totalPayment,
      totalRefund,
      loading: false
    })
  }

  formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  getBillTypeText = (type: Bill['type']) => {
    switch (type) {
      case 'payment':
        return '支出'
      case 'refund':
        return '退款'
      default:
        return '其他'
    }
  }

  handleBack = () => {
    Taro.navigateBack()
  }

  render() {
    const { bills, totalPayment, totalRefund, loading } = this.state

    return (
      <View className='bills-page'>
        <View className='container'>
          {/* Header */}
          <View className='page-header'>
            <Text className='back-btn' onClick={this.handleBack}>‹</Text>
            <Text className='page-title'>账单明细</Text>
          </View>

          {/* Summary */}
          <View className='summary-grid'>
            <View className='summary-item payment'>
              <Text className='summary-icon'>📉</Text>
              <Text className='summary-label'>总支出</Text>
              <Text className='summary-amount'>¥{totalPayment.toFixed(2)}</Text>
            </View>
            <View className='summary-item refund'>
              <Text className='summary-icon'>📈</Text>
              <Text className='summary-label'>总退款</Text>
              <Text className='summary-amount'>¥{totalRefund.toFixed(2)}</Text>
            </View>
          </View>

          {/* Bills List */}
          <View className='card'>
            <Text className='card-title'>交易记录</Text>
            
            {loading ? (
              <View className='loading-container'>
                <Text className='loading-text'>加载中...</Text>
              </View>
            ) : bills.length === 0 ? (
              <View className='empty-container'>
                <Text className='empty-icon'>📋</Text>
                <Text className='empty-title'>暂无账单记录</Text>
                <Text className='empty-subtitle'>您的交易记录将会显示在这里</Text>
              </View>
            ) : (
              <View className='bills-list'>
                {bills.map((bill) => (
                  <View key={bill.id} className='bill-item'>
                    <View className='bill-content'>
                      <View className='bill-info'>
                        <Text className='bill-icon'>
                          {bill.type === 'payment' ? '📉' : '📈'}
                        </Text>
                        <View className='bill-details'>
                          <Text className='bill-description'>{bill.description}</Text>
                          <Text className='bill-time'>{this.formatDate(bill.createdAt)}</Text>
                        </View>
                      </View>
                      <View className='bill-amount-section'>
                        <Text className={`bill-amount ${bill.type}`}>
                          {bill.type === 'payment' ? '-' : '+'}¥{bill.amount.toFixed(2)}
                        </Text>
                        <Text className='bill-type'>{this.getBillTypeText(bill.type)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}
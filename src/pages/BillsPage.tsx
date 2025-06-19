import React, { useState, useEffect } from 'react';
import { ArrowLeft, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { Bill } from '../types';
import dayjs from 'dayjs';

interface BillsPageProps {
  onBack: () => void;
  userId: string;
}

const BillsPage: React.FC<BillsPageProps> = ({ onBack, userId }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟获取账单数据
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        const mockBills: Bill[] = [
          {
            id: '1',
            userId,
            orderId: 'order_1',
            type: 'payment',
            amount: 2.00,
            description: '发送短信 - 120字符',
            createdAt: new Date('2024-01-15 14:30:00')
          },
          {
            id: '2',
            userId,
            orderId: 'order_2',
            type: 'refund',
            amount: 1.00,
            description: '短信发送失败退款',
            createdAt: new Date('2024-01-14 10:15:00')
          },
          {
            id: '3',
            userId,
            orderId: 'order_3',
            type: 'payment',
            amount: 1.00,
            description: '发送短信 - 60字符',
            createdAt: new Date('2024-01-13 16:45:00')
          },
          {
            id: '4',
            userId,
            orderId: 'order_4',
            type: 'payment',
            amount: 3.00,
            description: '发送短信 - 180字符',
            createdAt: new Date('2024-01-12 09:20:00')
          }
        ];
        setBills(mockBills);
        setLoading(false);
      }, 1000);
    };

    fetchBills();
  }, [userId]);

  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  const getBillIcon = (type: Bill['type']) => {
    switch (type) {
      case 'payment':
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      case 'refund':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      default:
        return <Receipt className="h-5 w-5 text-white/70" />;
    }
  };

  const getBillTypeText = (type: Bill['type']) => {
    switch (type) {
      case 'payment':
        return '支出';
      case 'refund':
        return '退款';
      default:
        return '其他';
    }
  };

  const totalPayment = bills.filter(b => b.type === 'payment').reduce((sum, b) => sum + b.amount, 0);
  const totalRefund = bills.filter(b => b.type === 'refund').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-white">账单明细</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
            <span className="text-white/70 text-sm">总支出</span>
          </div>
          <p className="text-white text-2xl font-semibold">¥{totalPayment.toFixed(2)}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-white/70 text-sm">总退款</span>
          </div>
          <p className="text-white text-2xl font-semibold">¥{totalRefund.toFixed(2)}</p>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">交易记录</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-full p-4 mb-4">
              <Receipt className="h-8 w-8 text-white/70" />
            </div>
            <h4 className="text-lg font-medium text-white">暂无账单记录</h4>
            <p className="mt-2 text-sm text-white/70">
              您的交易记录将会显示在这里
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bills.map((bill) => (
              <div 
                key={bill.id}
                className="bg-white/5 rounded-lg p-4 transition-all duration-200 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getBillIcon(bill.type)}
                    <div>
                      <h4 className="text-white font-medium">{bill.description}</h4>
                      <p className="text-white/70 text-sm">{formatDate(bill.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      bill.type === 'payment' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {bill.type === 'payment' ? '-' : '+'}¥{bill.amount.toFixed(2)}
                    </p>
                    <p className="text-white/60 text-sm">{getBillTypeText(bill.type)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillsPage;
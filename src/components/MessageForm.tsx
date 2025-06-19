import React, { useState } from 'react';
import { Send, Image, UserCircle, Clock, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

interface MessageFormProps {
  onSend: (phone: string, message: string, scheduledAt?: Date) => Promise<void>;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSend }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const maxMessageLength = 200;
  const pricePerUnit = 1; // 1元每60字
  const charsPerUnit = 60;

  // 计算费用
  const calculateCost = (text: string) => {
    const charCount = text.length;
    const units = Math.ceil(charCount / charsPerUnit);
    return units * pricePerUnit;
  };

  const cost = calculateCost(message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError('请输入手机号');
      return;
    }
    
    if (!message.trim()) {
      setError('请输入短信内容');
      return;
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('请输入有效的手机号码');
      return;
    }

    let scheduledAt: Date | undefined;
    if (showScheduler && scheduledDate && scheduledTime) {
      scheduledAt = dayjs(`${scheduledDate} ${scheduledTime}`).toDate();
      if (scheduledAt <= new Date()) {
        setError('定时发送时间必须晚于当前时间');
        return;
      }
    }
    
    try {
      setIsLoading(true);
      setError('');
      await onSend(phone, message, scheduledAt);
      setPhone('');
      setMessage('');
      setScheduledDate('');
      setScheduledTime('');
      setShowScheduler(false);
    } catch (err) {
      setError('发送失败，请稍后再试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 生成时间选项
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeStr);
      }
    }
    return options;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
      {error && (
        <div className="bg-red-500/20 text-white px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-white/90">
            对方手机号
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="tel"
              id="phone"
              placeholder="请输入对方手机号码"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-white/90">
            短信内容
          </label>
          <div className="relative">
            <textarea
              id="message"
              placeholder="请输入想要发送的信息..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={maxMessageLength}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <div className="flex items-center justify-between mt-2 text-sm text-white/70">
              <div className="flex space-x-3">
                <button 
                  type="button"
                  className="flex items-center hover:text-purple-400 transition-colors duration-200"
                >
                  <Image className="h-4 w-4 mr-1" />
                  <span>图片</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowScheduler(!showScheduler)}
                  className={`flex items-center transition-colors duration-200 ${
                    showScheduler ? 'text-purple-400' : 'hover:text-purple-400'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  <span>定时发送</span>
                </button>
              </div>
              <span>{message.length}/{maxMessageLength}</span>
            </div>
          </div>
        </div>

        {/* 定时发送设置 */}
        {showScheduler && (
          <div className="space-y-3 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2 text-white/90">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">定时发送设置</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/70 mb-1">日期</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={dayjs().format('YYYY-MM-DD')}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">时间</label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">选择时间</option>
                  {generateTimeOptions().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 费用显示 */}
        {message && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between items-center text-white/90">
              <span>字符数: {message.length}</span>
              <span className="font-semibold">费用: ¥{cost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-white/70 mt-1">
              按60字符计费，每60字符¥1.00
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
            isLoading || !message.trim()
              ? 'bg-purple-400/50 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              {cost > 0 ? `支付 ¥${cost.toFixed(2)} 并发送` : '发送'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageForm;
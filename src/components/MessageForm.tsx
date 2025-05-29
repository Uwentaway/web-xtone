import React, { useState } from 'react';
import { Send, Image, UserCircle, Clock } from 'lucide-react';

interface MessageFormProps {
  onSend: (phone: string, message: string) => Promise<void>;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSend }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const maxMessageLength = 200;

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
    
    try {
      setIsLoading(true);
      setError('');
      await onSend(phone, message);
      setPhone('');
      setMessage('');
    } catch (err) {
      setError('发送失败，请稍后再试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
                  className="flex items-center hover:text-purple-400 transition-colors duration-200"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  <span>定时发送</span>
                </button>
              </div>
              <span>{message.length}/{maxMessageLength}</span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
            isLoading 
              ? 'bg-purple-400/50 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              发送中...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              发送
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageForm;
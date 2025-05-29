import React, { useState } from 'react';
import { Phone, Lock, ChevronRight, MessageSquareText } from 'lucide-react';

interface LoginPageProps {
  onLogin: (phone: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isGettingCode, setIsGettingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleGetCode = () => {
    if (!phone.match(/^1[3-9]\d{9}$/)) {
      setError('请输入正确的手机号码');
      return;
    }
    
    setIsGettingCode(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGettingCode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.match(/^1[3-9]\d{9}$/)) {
      setError('请输入正确的手机号码');
      return;
    }

    if (!code) {
      setError('请输入验证码');
      return;
    }

    if (!agreed) {
      setError('请阅读并同意用户协议');
      return;
    }

    setError('');
    onLogin(phone);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      <div className="text-center mb-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 rounded-2xl shadow-lg flex items-center justify-center mb-4 transform hover:rotate-6 transition-transform duration-300">
            <MessageSquareText className="h-12 w-12 text-white" />
          </div>
          <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 text-transparent bg-clip-text">
            <h1 className="text-4xl font-bold mb-2">信通</h1>
          </div>
        </div>
        <p className="text-white/70">安全、匿名的通信工具</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 text-white px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg pl-10 pr-4 py-3 placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入验证码"
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg pl-10 pr-32 py-3 placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleGetCode}
                disabled={isGettingCode}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-purple-600/80 text-white text-sm rounded-md hover:bg-purple-700/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGettingCode ? `${countdown}秒后重试` : '获取验证码'}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
            />
            <label htmlFor="agreement" className="text-sm text-white/70">
              我已阅读并同意
              <button type="button" className="text-purple-400 hover:text-purple-300 ml-1">
                《用户协议》
              </button>
              和
              <button type="button" className="text-purple-400 hover:text-purple-300 ml-1">
                《隐私政策》
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-blue-600 transition-colors"
          >
            <span>登录/注册</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
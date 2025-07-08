import React, { useState, useEffect } from 'react';
import { MessageSquareText, ChevronRight } from 'lucide-react';
import wx from 'weixin-js-sdk';

interface LoginPageProps {
  onLogin: (phone: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleWeChatLogin = () => {
    if (!agreed) {
      setError('请阅读并同意用户协议');
      return;
    }

    // In a real app, you would:
    // 1. Get the WeChat authorization URL from your backend
    // 2. Redirect to WeChat OAuth page
    // 3. Handle the callback with authorization code
    // 4. Exchange the code for user info
    wx.ready(() => {
      wx.getUserInfo({
        success: (res) => {
          // Here you would validate the user info with your backend
          // For demo purposes, we'll just log in with a fake phone number
          onLogin('13800138000');
        },
        fail: () => {
          setError('微信授权失败，请重试');
        }
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
      <div className="text-center mb-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg flex items-center justify-center mb-4 transform hover:rotate-6 transition-transform duration-300">
            <MessageSquareText className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white">信通</h1>
          <h1 className="text-4xl font-bold mb-2 text-white">飞鸟飞信</h1>
        </div>
        <p className="text-white/70">安全、匿名的通信工具</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-500/20 text-white px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
            <button type="button" className="text-white hover:text-white/80 ml-1">
              《用户协议》
            </button>
            和
            <button type="button" className="text-white hover:text-white/80 ml-1">
              《隐私政策》
            </button>
          </label>
        </div>

        <button
          onClick={handleWeChatLogin}
          className="w-full bg-white/10 hover:bg-white/20 text-white py-4 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 backdrop-blur-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.2 15.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm7.6 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm-7.6-5.3c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm7.6 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm7.2 2.7c0-4.4-4.3-8-9.6-8-5.3 0-9.6 3.6-9.6 8 0 4.4 4.3 8 9.6 8 1.1 0 2.2-.2 3.2-.5l2.9 1.7-.8-2.8c2.7-1.7 4.3-4.1 4.3-6.4z"/>
          </svg>
          <span>微信一键登录</span>
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-white/50 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">或</span>
          </div>
        </div>

        <button
          onClick={() => onLogin('13800138000')} // For demo purposes
          className="w-full bg-white/10 hover:bg-white/20 text-white py-4 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 backdrop-blur-lg"
        >
          <span>手机号登录</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
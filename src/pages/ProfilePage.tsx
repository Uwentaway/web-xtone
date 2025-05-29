import React from 'react';
import { Settings, Message } from '../types';
import { User, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

interface ProfilePageProps {
  messages: Message[];
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onNavigate: (page: 'settings') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  messages,
  settings,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        {/* Account Section */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-purple-600/20 p-4 rounded-full">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">未登录</h2>
            <p className="text-white/70">登录后可以同步消息记录</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white/70 text-sm">发送消息</h3>
            <p className="text-white text-2xl font-semibold mt-1">{messages.length}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white/70 text-sm">成功率</h3>
            <p className="text-white text-2xl font-semibold mt-1">
              {messages.length > 0 
                ? Math.round((messages.filter(m => m.status === 'sent').length / messages.length) * 100)
                : 0}%
            </p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-2">
          <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200">
            登录账号
          </button>
          <button className="w-full bg-white/10 text-white py-3 px-4 rounded-lg hover:bg-white/20 transition-colors duration-200">
            注册账号
          </button>
        </div>
      </div>

      {/* Settings Link */}
      <button
        onClick={() => onNavigate('settings')}
        className="w-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl shadow-lg p-6 flex items-center justify-between group hover:bg-white/20 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-5 w-5 text-white" />
          <span className="text-white font-medium">设置</span>
        </div>
        <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors duration-200" />
      </button>
    </div>
  );
};

export default ProfilePage;
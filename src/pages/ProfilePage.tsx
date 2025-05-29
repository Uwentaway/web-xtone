import React from 'react';
import { Settings, Message, User } from '../types';
import { User as UserIcon, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

interface ProfilePageProps {
  messages: Message[];
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onNavigate: (page: 'settings') => void;
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  messages,
  settings,
  onNavigate,
  user
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        {/* Account Section */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-purple-600/20 p-4 rounded-full">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.phone}</h2>
            <p className="text-white/70">已登录</p>
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
      </div>

      {/* Settings Link */}
      <button
        onClick={() => onNavigate('settings')}
        className="w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 flex items-center justify-between group hover:bg-white/20 transition-colors duration-200"
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
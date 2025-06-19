import React from 'react';
import { Settings, Message, User } from '../types';
import { User as UserIcon, Settings as SettingsIcon, ChevronRight, Receipt, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface ProfilePageProps {
  messages: Message[];
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onNavigate: (page: 'settings' | 'bills') => void;
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  messages,
  settings,
  onNavigate,
  user
}) => {
  const formatDate = (date: Date) => {
    return dayjs(date).format('MM-DD HH:mm');
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        {/* Account Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-purple-600/20 p-4 rounded-full">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.phone}</h2>
            <p className="text-white/70">信通用户</p>
          </div>
        </div>
      </div>

      {/* Bills Link */}
      <button
        onClick={() => onNavigate('bills')}
        className="w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 flex items-center justify-between group hover:bg-white/20 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <Receipt className="h-5 w-5 text-white" />
          <span className="text-white font-medium">账单</span>
        </div>
        <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors duration-200" />
      </button>

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

      {/* Message History */}
      {settings.saveHistory && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">消息记录</h3>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-full p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-white/70" />
              </div>
              <h4 className="text-lg font-medium text-white">暂无消息记录</h4>
              <p className="mt-2 text-sm text-white/70">
                您发送的消息将会显示在这里
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className="bg-white/5 rounded-lg p-4 transition-all duration-200 hover:bg-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex space-x-2 items-center">
                      <div className="bg-purple-600/20 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-white">
                        +{message.recipientPhone.substring(0, 3)}****{message.recipientPhone.substring(7)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      {getStatusIcon(message.status)}
                      <span className="ml-1">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm line-clamp-2 mb-2">
                    {message.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>费用: ¥{message.cost.toFixed(2)}</span>
                    {message.scheduledAt && (
                      <span>定时: {formatDate(message.scheduledAt)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
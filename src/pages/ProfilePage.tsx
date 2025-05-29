import React, { useState } from 'react';
import { Settings, Message } from '../types';
import SettingsPanel from '../components/SettingsPanel';
import { Settings as SettingsIcon } from 'lucide-react';

interface ProfilePageProps {
  messages: Message[];
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  messages,
  settings, 
  onSettingsChange 
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">个人设置</h2>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-purple-600/20 text-white hover:bg-purple-600/30 transition-colors duration-200"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <h3 className="text-white font-medium">主题设置</h3>
              <p className="text-white/70 text-sm mt-1">
                当前主题：{settings.theme === 'light' ? '浅色' : settings.theme === 'dark' ? '深色' : '跟随系统'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <h3 className="text-white font-medium">消息通知</h3>
              <p className="text-white/70 text-sm mt-1">
                {settings.notifications ? '已开启' : '已关闭'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <h3 className="text-white font-medium">历史记录</h3>
              <p className="text-white/70 text-sm mt-1">
                {settings.saveHistory ? '保存历史记录' : '不保存历史记录'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <h3 className="text-white font-medium">语言设置</h3>
              <p className="text-white/70 text-sm mt-1">
                {settings.language === 'zh-CN' ? '中文' : 'English'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
};

export default ProfilePage;
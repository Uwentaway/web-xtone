import React, { useState } from 'react';
import { Settings } from '../types';
import SettingsPanel from '../components/SettingsPanel';
import { ArrowLeft, Moon, BellRing, Clock, Languages } from 'lucide-react';

interface SettingsPageProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  settings, 
  onSettingsChange,
  onBack
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        <h2 className="text-xl font-semibold text-white">设置</h2>
      </div>

      <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {/* Theme Setting */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Moon className="h-5 w-5 text-purple-400" />
              <div className="text-left">
                <h3 className="text-white font-medium">主题设置</h3>
                <p className="text-white/70 text-sm mt-1">
                  {settings.theme === 'light' ? '浅色' : settings.theme === 'dark' ? '深色' : '跟随系统'}
                </p>
              </div>
            </div>
          </button>

          {/* Notifications Setting */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <BellRing className="h-5 w-5 text-green-400" />
              <div className="text-left">
                <h3 className="text-white font-medium">消息通知</h3>
                <p className="text-white/70 text-sm mt-1">
                  {settings.notifications ? '已开启' : '已关闭'}
                </p>
              </div>
            </div>
          </button>

          {/* History Setting */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <div className="text-left">
                <h3 className="text-white font-medium">历史记录</h3>
                <p className="text-white/70 text-sm mt-1">
                  {settings.saveHistory ? '保存历史记录' : '不保存历史记录'}
                </p>
              </div>
            </div>
          </button>

          {/* Language Setting */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Languages className="h-5 w-5 text-yellow-400" />
              <div className="text-left">
                <h3 className="text-white font-medium">语言设置</h3>
                <p className="text-white/70 text-sm mt-1">
                  {settings.language === 'zh-CN' ? '中文' : 'English'}
                </p>
              </div>
            </div>
          </button>
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

export default SettingsPage;
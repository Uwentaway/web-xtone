import React from 'react';
import { X, Moon, Sun, BellRing, BellOff, Languages, Clock } from 'lucide-react';
import { Settings } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        className={`w-full max-w-md mx-4 rounded-xl overflow-hidden shadow-xl transform transition-all
          ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">设置</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-purple-500" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium">显示主题</span>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value as Settings['theme'])}
                className={`px-3 py-2 rounded-md border ${
                  settings.theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
                <option value="system">跟随系统</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-blue-500" />
                <span className="font-medium">语言</span>
              </div>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value as Settings['language'])}
                className={`px-3 py-2 rounded-md border ${
                  settings.theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="zh-CN">中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.notifications ? (
                <BellRing className="h-5 w-5 text-green-500" />
              ) : (
                <BellOff className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">通知提醒</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Save History */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-500" />
              <span className="font-medium">保存历史记录</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.saveHistory}
                onChange={(e) => updateSetting('saveHistory', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
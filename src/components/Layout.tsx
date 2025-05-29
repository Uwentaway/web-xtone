import React, { useState, useEffect } from 'react';
import { MessageSquareText, User } from 'lucide-react';
import { Settings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'messages' | 'profile';
  onTabChange: (tab: 'messages' | 'profile') => void;
  settings: Settings;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  settings 
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/10 dark:bg-gray-900/10 shadow-lg backdrop-blur-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquareText className="h-6 w-6 text-white" />
            <h1 className="ml-2 text-xl font-bold text-white">信通</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-24">
        {children}
      </main>

      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white/10 dark:bg-gray-900/10 border-t border-white/10 dark:border-gray-800/10 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            <button
              className={`flex flex-col items-center justify-center w-1/2 h-full transition-colors duration-200 ${
                activeTab === 'messages' 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => onTabChange('messages')}
            >
              <MessageSquareText className="h-6 w-6" />
              <span className="text-xs mt-1">悄悄话</span>
            </button>
            <button
              className={`flex flex-col items-center justify-center w-1/2 h-full transition-colors duration-200 ${
                activeTab === 'profile' 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => onTabChange('profile')}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">我的</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
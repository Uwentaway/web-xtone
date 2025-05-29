import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { Message, Settings } from './types';
import { sendMessage } from './utils/api';

type Page = 'messages' | 'profile' | 'settings';

function App() {
  // State
  const [activePage, setActivePage] = useState<Page>('messages');
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    language: 'zh-CN',
    notifications: true,
    saveHistory: true,
  });
  const [messages, setMessages] = useState<Message[]>([]);

  // Check system preference for dark mode
  useEffect(() => {
    if (settings.theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDarkMode);
    } else {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings.theme]);

  // Load saved messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('anonymousMessages');
    if (savedMessages && settings.saveHistory) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        })));
      } catch (error) {
        console.error('Failed to parse saved messages', error);
      }
    }
  }, [settings.saveHistory]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (settings.saveHistory && messages.length > 0) {
      localStorage.setItem('anonymousMessages', JSON.stringify(messages));
    }
  }, [messages, settings.saveHistory]);

  // Handle sending a new message
  const handleSendMessage = async (phone: string, message: string) => {
    try {
      const newMessage = await sendMessage(phone, message);
      if (settings.saveHistory) {
        setMessages(prev => [newMessage, ...prev]);
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleNavigate = (page: Page) => {
    setActivePage(page);
  };

  return (
    <Layout 
      activeTab={activePage === 'settings' ? 'profile' : activePage}
      onTabChange={handleNavigate}
      settings={settings}
    >
      {activePage === 'messages' ? (
        <MessagesPage 
          messages={messages}
          saveMessages={settings.saveHistory}
          onSendMessage={handleSendMessage}
        />
      ) : activePage === 'profile' ? (
        <ProfilePage 
          messages={messages}
          settings={settings}
          onSettingsChange={setSettings}
          onNavigate={handleNavigate}
        />
      ) : (
        <SettingsPage
          settings={settings}
          onSettingsChange={setSettings}
          onBack={() => handleNavigate('profile')}
        />
      )}
    </Layout>
  );
}

export default App;
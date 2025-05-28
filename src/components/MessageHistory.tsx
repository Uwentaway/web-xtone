import React from 'react';
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Message } from '../types';

interface MessageHistoryProps {
  messages: Message[];
  isEmpty: boolean;
}

const MessageHistory: React.FC<MessageHistoryProps> = ({ messages, isEmpty }) => {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <div className="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full p-4 mb-4">
          <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">暂无消息记录</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          您发送的消息将会显示在这里
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">最近消息</h3>
      <div className="space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-lg p-4 transition-all duration-200 hover:shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div className="flex space-x-2 items-center">
                <div className="bg-purple-100/80 dark:bg-purple-900/30 backdrop-blur-sm p-2 rounded-full">
                  <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">+{message.recipientPhone.substring(0, 3)}****{message.recipientPhone.substring(7)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                {getStatusIcon(message.status)}
                <span className="ml-1">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
              {message.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;
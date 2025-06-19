import React from 'react';
import MessageForm from '../components/MessageForm';
import { Message } from '../types';

interface MessagesPageProps {
  messages: Message[];
  saveMessages: boolean;
  onSendMessage: (phone: string, message: string, scheduledAt?: Date) => Promise<void>;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ 
  messages, 
  saveMessages,
  onSendMessage 
}) => {
  return (
    <div className="space-y-6">
      <MessageForm onSend={onSendMessage} />
    </div>
  );
};

export default MessagesPage;
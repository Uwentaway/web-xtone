import React from 'react';
import MessageForm from '../components/MessageForm';
import MessageHistory from '../components/MessageHistory';
import { Message } from '../types';

interface MessagesPageProps {
  messages: Message[];
  saveMessages: boolean;
  onSendMessage: (phone: string, message: string) => Promise<void>;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ 
  messages, 
  saveMessages,
  onSendMessage 
}) => {
  return (
    <div className="space-y-6">
      <MessageForm onSend={onSendMessage} />
      
      {saveMessages && (
        <div className="mt-8">
          <MessageHistory 
            messages={messages} 
            isEmpty={messages.length === 0} 
          />
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
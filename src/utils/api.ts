// Simulated API functions
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types';

// Simulate sending a message to the server
export async function sendMessage(phone: string, message: string): Promise<Message> {
  // In a real app, this would be a fetch call to your API
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate random success (90%) or failure (10%)
      const success = Math.random() < 0.9;
      
      if (success) {
        const newMessage: Message = {
          id: uuidv4(),
          recipientPhone: phone,
          content: message,
          createdAt: new Date(),
          status: 'sent'
        };
        resolve(newMessage);
      } else {
        reject(new Error('发送失败，请重试'));
      }
    }, 1500); // 1.5 second delay to simulate network request
  });
}
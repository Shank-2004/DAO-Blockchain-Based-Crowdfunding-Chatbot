
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { Action } from '../services/chatbotService';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onAction: (action: Action) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, onAction, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="flex flex-col flex-grow h-full overflow-hidden">
      <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <Message key={msg.id + index} message={msg} onAction={onAction} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-brand-secondary/50">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};


import React from 'react';
import { ChatMessage, MessageSender } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';
import { ActionButtons } from './ActionButtons';
import { Action } from '../services/chatbotService';

interface MessageProps {
  message: ChatMessage;
  onAction: (action: Action) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onAction }) => {
  const isUser = message.sender === MessageSender.USER;
  const isActionResponse = message.isActionResponse;

  return (
    <div className={`flex items-start gap-3 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
          <BotIcon />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`max-w-lg p-3 rounded-lg w-full ${isUser ? 'bg-brand-primary text-white' : 'bg-brand-secondary'}`}
        >
          <p className={`whitespace-pre-wrap ${isActionResponse ? 'italic text-brand-text-secondary' : ''}`}>{message.text}</p>
          {message.component && <div className="mt-2">{message.component}</div>}
        </div>
        {message.actions && message.actions.length > 0 && (
          <ActionButtons actions={message.actions} onAction={onAction} />
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

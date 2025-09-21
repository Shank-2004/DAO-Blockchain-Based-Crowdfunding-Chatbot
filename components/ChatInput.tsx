
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-grow bg-brand-secondary/50 border border-brand-secondary rounded-lg px-4 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg p-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SendIcon />
      </button>
    </form>
  );
};

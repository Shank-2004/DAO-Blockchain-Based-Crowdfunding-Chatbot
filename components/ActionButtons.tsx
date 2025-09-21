
import React from 'react';
import { Action } from '../services/chatbotService';

interface ActionButtonsProps {
  actions: Action[];
  onAction: (action: Action) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ actions, onAction }) => {
  return (
    <div className="flex space-x-2 mt-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(action)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            action.style === 'primary' 
              ? 'bg-brand-accent text-brand-background hover:bg-brand-accent/80' 
              : 'bg-brand-secondary hover:bg-brand-secondary/70 text-brand-text'
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};


import React from 'react';
import { BotIcon } from './icons/BotIcon';

interface WalletConnectProps {
  onConnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text font-sans flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
      <div className="bg-brand-surface p-8 rounded-xl shadow-2xl border border-brand-secondary/50 max-w-md">
        <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center mx-auto mb-6">
          <BotIcon />
        </div>
        <h1 className="text-3xl font-bold text-brand-text mb-2">Welcome to the DAO Helper</h1>
        <p className="text-brand-text-secondary mb-8">
          Connect your wallet to interact with crowdfunding projects, vote on proposals, and earn rewards.
        </p>
        <button
          onClick={onConnect}
          className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

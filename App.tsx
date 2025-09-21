
import React, { useState, useEffect, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatMessage, MessageSender, UserProfile } from './types';
import { getBotResponse, Action } from './services/chatbotService';
import { mockBlockchain } from './services/mockBlockchainService';
import { WalletConnect } from './components/WalletConnect';
import { WalletIcon } from './components/icons/WalletIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleConnectWallet = () => {
    const profile = mockBlockchain.connectWallet();
    setUserProfile(profile);
  };

  const handleAction = useCallback(async (action: Action) => {
    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: MessageSender.USER,
      text: action.payload.displayText || `Confirming action: ${action.type}`,
      isActionResponse: true,
    };
    addMessage(userMessage);

    const botResponse = await getBotResponse(action.payload.command, true);
    addMessage(botResponse);
    setIsLoading(false);
  }, [addMessage]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !userProfile) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: MessageSender.USER,
      text,
    };
    addMessage(userMessage);
    setIsLoading(true);

    const botResponse = await getBotResponse(text, false);
    addMessage(botResponse);
    setIsLoading(false);
  }, [addMessage, userProfile]);
  
  useEffect(() => {
    if (userProfile) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        sender: MessageSender.BOT,
        text: "Welcome to the DAO Crowdfunding Assistant! Your wallet is connected. Try asking me to 'show projects' to get started, or 'help' for more commands.",
      };
      setMessages([welcomeMessage]);
    }
  }, [userProfile]);

  if (!userProfile) {
    return <WalletConnect onConnect={handleConnectWallet} />;
  }

  return (
    <div className="min-h-screen bg-brand-background text-brand-text font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[90vh] flex flex-col bg-brand-surface rounded-xl shadow-2xl border border-brand-secondary/50">
        <header className="p-4 border-b border-brand-secondary/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-brand-accent animate-pulse"></div>
            <h1 className="text-xl font-bold text-brand-text">DAO Helper</h1>
            <span className="text-sm text-brand-text-secondary">Online</span>
          </div>
          <div className="flex items-center space-x-2 bg-brand-secondary/50 px-3 py-1.5 rounded-md">
            <WalletIcon />
            <span className="text-xs font-mono text-brand-text-secondary">{`${userProfile.address.slice(0, 6)}...${userProfile.address.slice(-4)}`}</span>
          </div>
        </header>
        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSendMessage}
          onAction={handleAction} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default App;


import { ReactNode } from 'react';
import { Action } from './services/chatbotService';

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  isActionResponse?: boolean;
  component?: ReactNode;
  actions?: Action[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  deadline: Date;
  contributors: Contributor[];
  proposals: Proposal[];
  status: 'active' | 'successful' | 'failed';
}

export interface Contributor {
  address: string;
  amount: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  votes: {
    yes: number;
    no: number;
  };
  voters: string[]; // addresses who have voted
}

export type ContributionTier = 'Bronze' | 'Silver' | 'Gold';

export interface NFTBadge {
  id: string;
  name: string;
  tier: ContributionTier;
  project: string;
  date: Date;
}

export interface UserProfile {
  address: string;
  reputation: number;
  nfts: NFTBadge[];
  contributions: Contributor[];
}

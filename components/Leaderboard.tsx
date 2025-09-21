
import React from 'react';
import { Contributor } from '../types';

interface LeaderboardProps {
  contributors: Contributor[];
}

const rankEmojis = ['🥇', '🥈', '🥉'];

export const Leaderboard: React.FC<LeaderboardProps> = ({ contributors }) => {
    return (
        <div className="mt-2 p-3 bg-brand-surface/50 rounded-lg border border-brand-secondary/50 text-sm">
            <div className="space-y-2">
                {contributors.slice(0, 5).map((c, index) => (
                    <div key={c.address} className="flex items-center justify-between p-2 rounded-md bg-brand-secondary/50">
                        <div className="flex items-center">
                            <span className="text-lg w-6 text-center">{rankEmojis[index] || index + 1}</span>
                            <span className="font-mono text-xs ml-2">{`${c.address.slice(0, 6)}...${c.address.slice(-4)}`}</span>
                        </div>
                        <span className="font-mono text-brand-accent font-bold">{c.amount.toFixed(2)} ETH</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

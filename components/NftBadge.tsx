
import React from 'react';
import { NFTBadge as NFTBadgeType } from '../types';

interface NftBadgeProps {
  nft: NFTBadgeType;
}

const tierColors = {
  Gold: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  Silver: 'bg-gray-400/20 border-gray-400 text-gray-300',
  Bronze: 'bg-orange-600/20 border-orange-600 text-orange-500',
};

export const NftBadge: React.FC<NftBadgeProps> = ({ nft }) => {
    return (
        <div className={`p-2 rounded-md border text-xs flex justify-between items-center ${tierColors[nft.tier]}`}>
            <div>
                <span className={`font-bold py-0.5 px-1.5 rounded-sm text-xs mr-2 ${tierColors[nft.tier].replace('border-', 'bg-').replace('/20', '')} text-brand-background`}>
                    {nft.tier.toUpperCase()}
                </span>
                <span className="font-medium">{nft.name}</span>
            </div>
            <span className="font-mono text-xs opacity-70">{nft.date.toLocaleDateString()}</span>
        </div>
    );
};

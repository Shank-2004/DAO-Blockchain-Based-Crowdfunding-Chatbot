
import React from 'react';
import { UserProfile } from '../types';
import { NftBadge } from './NftBadge';

interface UserProfileCardProps {
    profile: UserProfile;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
    return (
        <div className="mt-2 p-4 bg-brand-surface/50 rounded-lg border border-brand-secondary/50 text-sm">
            <h3 className="font-bold text-brand-accent text-base">My DAO Profile</h3>
            <div className="mt-3 space-y-3">
                <div>
                    <div className="text-xs text-brand-text-secondary">Wallet Address</div>
                    <div className="font-mono text-xs">{profile.address}</div>
                </div>
                <div>
                    <div className="text-xs text-brand-text-secondary">Reputation Score</div>
                    <div className="font-bold text-lg">{profile.reputation}</div>
                </div>
                <div>
                    <div className="text-xs text-brand-text-secondary mb-2">NFT Badges ({profile.nfts.length})</div>
                    {profile.nfts.length > 0 ? (
                        <div className="space-y-2">
                            {profile.nfts.map(nft => <NftBadge key={nft.id} nft={nft} />)}
                        </div>
                    ) : (
                        <p className="text-brand-text-secondary text-xs italic">You have not earned any NFT badges yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

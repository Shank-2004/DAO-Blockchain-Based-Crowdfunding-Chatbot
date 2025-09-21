
import { Project, Proposal, UserProfile, Contributor, NFTBadge, ContributionTier } from '../types';

let projects: Project[] = [
  {
    id: 'PA',
    name: 'Project Alpha',
    description: 'A decentralized solar energy grid.',
    fundingGoal: 10,
    currentFunding: 4.2,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    contributors: [{ address: '0x123...', amount: 2 }, { address: '0x456...', amount: 2.2 }],
    proposals: [
      { id: 'P1', title: 'Increase Marketing Budget', description: 'Allocate 1 ETH for marketing.', votes: { yes: 1, no: 0 }, voters:['0x123...'] },
      { id: 'P2', title: 'Change Project Goal', description: 'Adjust the final product scope.', votes: { yes: 0, no: 0 }, voters: [] }
    ],
    status: 'active',
  },
  {
    id: 'PB',
    name: 'Project Beta',
    description: 'An open-source platform for scientific research.',
    fundingGoal: 25,
    currentFunding: 26.5,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Ended 2 days ago
    contributors: [],
    proposals: [],
    status: 'successful',
  },
    {
    id: 'PF',
    name: 'Project Fail',
    description: 'A project that did not meet its funding goal.',
    fundingGoal: 50,
    currentFunding: 5,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Ended 5 days ago
    contributors: [{ address: '0xabc...', amount: 5 }],
    proposals: [],
    status: 'failed',
  }
];

class MockBlockchainService {
  currentUser: UserProfile | null = null;

  connectWallet(): UserProfile {
    const mockAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    this.currentUser = {
      address: mockAddress,
      reputation: 0,
      nfts: [],
      contributions: [],
    };
    return this.currentUser;
  }

  getUserProfile(): UserProfile | null {
    return this.currentUser;
  }

  getProjects(): Project[] {
    return projects;
  }

  findProject(idOrName: string): Project | undefined {
    return projects.find(p => p.id.toLowerCase() === idOrName.toLowerCase() || p.name.toLowerCase().includes(idOrName.toLowerCase()));
  }
  
  getLeaderboard(projectId: string): Contributor[] {
    const project = this.findProject(projectId);
    if (!project) return [];
    return [...project.contributors].sort((a, b) => b.amount - a.amount);
  }

  private getContributionTier(amount: number): ContributionTier {
    if (amount >= 5) return 'Gold';
    if (amount >= 1) return 'Silver';
    return 'Bronze';
  }

  contribute(projectId: string, amount: number): { success: boolean; message: string; txHash?: string; mintedNFT?: NFTBadge } {
    if (!this.currentUser) return { success: false, message: "No wallet connected." };
    const project = this.findProject(projectId);
    if (!project) return { success: false, message: "Project not found." };
    if (project.status !== 'active') return { success: false, message: `Project is not active. Current status: ${project.status}.`};

    project.currentFunding += amount;
    
    // Add or update contribution
    const existingContribution = project.contributors.find(c => c.address === this.currentUser!.address);
    if (existingContribution) {
        existingContribution.amount += amount;
    } else {
        project.contributors.push({ address: this.currentUser.address, amount });
    }
    
    this.currentUser.contributions.push({ address: project.id, amount });

    // Mint NFT badge
    const tier = this.getContributionTier(amount);
    const mintedNFT: NFTBadge = {
      id: `NFT-${project.id}-${this.currentUser.nfts.length + 1}`,
      name: `${project.name} Contributor Badge`,
      tier: tier,
      project: project.name,
      date: new Date(),
    };
    this.currentUser.nfts.push(mintedNFT);
    this.currentUser.reputation += amount * 10; // Add reputation points

    if (project.currentFunding >= project.fundingGoal) {
        project.status = 'successful';
    }

    return { 
      success: true, 
      message: `Successfully contributed ${amount} ETH to ${project.name}.`,
      txHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      mintedNFT,
    };
  }
  
  vote(projectId: string, proposalId: string, vote: 'yes' | 'no'): { success: boolean; message: string; } {
    if (!this.currentUser) return { success: false, message: "No wallet connected." };
    const project = this.findProject(projectId);
    if (!project) return { success: false, message: "Project not found." };
    
    const proposal = project.proposals.find(p => p.id.toLowerCase() === proposalId.toLowerCase());
    if (!proposal) return { success: false, message: "Proposal not found." };

    if (!project.contributors.some(c => c.address === this.currentUser!.address)) {
      return { success: false, message: `You must be a contributor to ${project.name} to vote.` };
    }
    
    if (proposal.voters.includes(this.currentUser.address)) {
      return { success: false, message: "You have already voted on this proposal." };
    }

    proposal.votes[vote]++;
    proposal.voters.push(this.currentUser.address);
    this.currentUser.reputation += 5; // Add reputation for voting

    return { success: true, message: `Your vote of '${vote.toUpperCase()}' for proposal ${proposal.id} has been recorded.` };
  }

  withdraw(projectId: string): { success: boolean; message: string; } {
    if (!this.currentUser) return { success: false, message: "No wallet connected." };
    const project = this.findProject(projectId);
    if (!project) return { success: false, message: "Project not found." };
    if (project.status !== 'failed') return { success: false, message: "Funds can only be withdrawn from failed projects."};

    const contribution = project.contributors.find(c => c.address === this.currentUser!.address);
    if (!contribution) return { success: false, message: "You have not contributed to this project."};

    const withdrawnAmount = contribution.amount;
    project.contributors = project.contributors.filter(c => c.address !== this.currentUser!.address);
    project.currentFunding -= withdrawnAmount;

    return { success: true, message: `Successfully withdrew your ${withdrawnAmount} ETH from ${project.name}.`};
  }
}

export const mockBlockchain = new MockBlockchainService();

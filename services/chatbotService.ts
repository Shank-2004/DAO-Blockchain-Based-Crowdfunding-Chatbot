// FIX: Import React to use React.createElement for creating component instances.
import React, { ReactNode } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, MessageSender, Project } from '../types';
import { mockBlockchain } from './mockBlockchainService';
import { ProjectCard } from '../components/ProjectCard';
import { UserProfileCard } from '../components/UserProfileCard';
import { NftBadge } from '../components/NftBadge';
import { Leaderboard } from '../components/Leaderboard';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export enum ActionType {
  CONFIRM_CONTRIBUTION = 'CONFIRM_CONTRIBUTION',
  CONFIRM_VOTE = 'CONFIRM_VOTE',
  CONFIRM_WITHDRAWAL = 'CONFIRM_WITHDRAWAL',
}

export interface Action {
  type: ActionType;
  label: string;
  style: 'primary' | 'secondary';
  payload: {
    displayText?: string;
    command: string;
  };
}

const createBotMessage = (text: string, component?: ReactNode, actions?: Action[]): ChatMessage => ({
  id: Date.now().toString() + Math.random(),
  sender: MessageSender.BOT,
  text,
  component,
  actions,
});

const handleShowProjects = (): ChatMessage => {
  const projects = mockBlockchain.getProjects();
  if (projects.length === 0) {
    return createBotMessage("There are no active projects right now.");
  }
  // FIX: Replace JSX with React.createElement to be valid in a .ts file.
  return createBotMessage(
    `Here are the current projects:`,
    React.createElement('div', { className: "space-y-4" },
      projects.map(p => React.createElement(ProjectCard, { key: p.id, project: p }))
    )
  );
};

const handleStatus = (projectName: string): ChatMessage => {
  if (!projectName) {
    return createBotMessage("Please specify a project name or ID. For example: 'status Project Alpha'.");
  }
  const project = mockBlockchain.findProject(projectName);
  if (!project) {
    return createBotMessage(`Sorry, I couldn't find a project called "${projectName}".`);
  }

  let actions: Action[] | undefined;
  if (project.status === 'failed' && project.contributors.some(c => c.address === mockBlockchain.currentUser?.address)) {
     actions = [{
        type: ActionType.CONFIRM_WITHDRAWAL,
        label: `Withdraw Funds`,
        style: 'primary',
        payload: { 
            displayText: `Requesting withdrawal from ${project.name}`,
            command: `_confirm_withdraw ${project.id}` 
        },
     }];
  }
  // FIX: Replace JSX with React.createElement to be valid in a .ts file.
  return createBotMessage(
    `Here is the status for ${project.name}:`,
    React.createElement(ProjectCard, { project: project }),
    actions
  );
};

const handleContribution = (projectName: string, amount: number, isConfirmed: boolean): ChatMessage => {
  if (!projectName || !amount) {
    return createBotMessage("Please format your request like: 'contribute <amount> ETH to <project name>'.");
  }
  const project = mockBlockchain.findProject(projectName);

  if (!project) {
    return createBotMessage(`Sorry, I couldn't find a project called "${projectName}".`);
  }
  
  if (isConfirmed) {
      const result = mockBlockchain.contribute(project.id, amount);
      if (result.success) {
          // FIX: Replace JSX with React.createElement to be valid in a .ts file.
          return createBotMessage(
            `${result.message}\nTransaction Hash: ${result.txHash}`,
            result.mintedNFT ? React.createElement(NftBadge, { nft: result.mintedNFT }) : undefined
          );
      }
      return createBotMessage(`Contribution failed: ${result.message}`);
  } else {
      return createBotMessage(
        `You are about to contribute ${amount} ETH to ${project.name}. Please confirm.`,
        undefined,
        [
          { type: ActionType.CONFIRM_CONTRIBUTION, label: 'Confirm Contribution', style: 'primary', payload: { command: `_confirm_contribute ${amount} to ${projectName}`, displayText: `Contributing ${amount} ETH to ${project.name}` } },
          { type: ActionType.CONFIRM_CONTRIBUTION, label: 'Cancel', style: 'secondary', payload: { command: '_cancel', displayText: 'Canceling contribution' } },
        ]
      );
  }
};

const handleVote = (projectName: string, proposalId: string, voteChoice: 'yes' | 'no', isConfirmed: boolean): ChatMessage => {
    if (!voteChoice || !proposalId || !projectName) {
        return createBotMessage("Please use the format: 'vote <yes/no> on <proposal ID> for <project name>'");
    }
    const project = mockBlockchain.findProject(projectName);
    if (!project) return createBotMessage(`Project "${projectName}" not found.`);

    if (isConfirmed) {
        const result = mockBlockchain.vote(project.id, proposalId, voteChoice);
        return createBotMessage(result.message);
    } else {
        return createBotMessage(
            `You are about to vote '${voteChoice.toUpperCase()}' on proposal ${proposalId} for ${project.name}. Please confirm.`,
            undefined,
            [
              { type: ActionType.CONFIRM_VOTE, label: 'Confirm Vote', style: 'primary', payload: { command: `_confirm_vote ${voteChoice} on ${proposalId} for ${projectName}`, displayText: `Voting ${voteChoice.toUpperCase()} on ${proposalId}` } },
              { type: ActionType.CONFIRM_VOTE, label: 'Cancel', style: 'secondary', payload: { command: '_cancel', displayText: 'Canceling vote' } },
            ]
        );
    }
}

const handleWithdrawal = (projectId: string): ChatMessage => {
    const result = mockBlockchain.withdraw(projectId);
    return createBotMessage(result.message);
};

const handleShowProfile = (): ChatMessage => {
    const profile = mockBlockchain.getUserProfile();
    if (!profile) return createBotMessage("Your wallet is not connected.");
    // FIX: Replace JSX with React.createElement to be valid in a .ts file.
    return createBotMessage("Here is your user profile:", React.createElement(UserProfileCard, { profile: profile }));
};

const handleLeaderboard = (projectName: string): ChatMessage => {
    if (!projectName) return createBotMessage("Please specify which project's leaderboard you want to see.");
    const project = mockBlockchain.findProject(projectName);
    if (!project) return createBotMessage(`Project "${projectName}" not found.`);
    const leaderboardData = mockBlockchain.getLeaderboard(project.id);
    if (leaderboardData.length === 0) return createBotMessage(`There are no contributors to ${project.name} yet.`);
    // FIX: Replace JSX with React.createElement to be valid in a .ts file.
    return createBotMessage(`Showing leaderboard for ${project.name}:`, React.createElement(Leaderboard, { contributors: leaderboardData }));
}

const handleHelp = (): ChatMessage => {
    return createBotMessage(
`Here are some things you can ask me:
- **"Show all projects"**: Lists all crowdfunding projects.
- **"What's the status of Project Alpha?"**: Shows detailed status of a project.
- **"I want to contribute 0.5 eth to Project Alpha"**: Initiate a contribution.
- **"Vote yes on P1 for Project Alpha"**: Vote on a proposal.
- **"Show me the leaderboard for Project Alpha"**: See top contributors.
- **"Show my profile"**: Check your wallet, NFTs, and reputation.`
    );
}

const parseConfirmation = (input: string) => {
    const parts = input.split(' ');
    const command = parts.shift();
    
    switch (command) {
        case '_confirm_contribute': {
            const amount = parseFloat(parts[0]);
            const projectName = parts.slice(2).join(' ');
            return handleContribution(projectName, amount, true);
        }
        case '_confirm_vote': {
            const voteChoice = parts[0] as 'yes' | 'no';
            const proposalId = parts[2];
            const projectName = parts.slice(4).join(' ');
            return handleVote(projectName, proposalId, voteChoice, true);
        }
        case '_confirm_withdraw':
            return handleWithdrawal(parts[0]);
        default:
            return createBotMessage("Unknown confirmation action.");
    }
};

const systemInstruction = `You are a helpful assistant for a crowdfunding DAO platform. Your job is to understand the user's request and map it to one of the available intents. Respond ONLY with a JSON object containing the 'intent' and any 'parameters' you extract. Do not add any other text.
Available intents:
- 'show_projects': User wants to see all projects.
- 'get_status': User wants the status of a specific project. Parameters: 'projectName'.
- 'contribute': User wants to contribute funds. Parameters: 'projectName', 'amount'.
- 'vote': User wants to vote on a proposal. Parameters: 'projectName', 'proposalId', 'voteChoice' (must be 'yes' or 'no').
- 'get_leaderboard': User wants to see the top contributors for a project. Parameters: 'projectName'.
- 'show_profile': User wants to see their own profile/wallet info.
- 'help': User is asking for help or is saying hello.
- 'unknown': If you cannot determine the intent from the user's message.
Example: If the user says "show me the status for the solar grid project", you respond with: {"intent": "get_status", "parameters": {"projectName": "Project Alpha"}}
Example: If the user says "i'd like to donate 0.5 eth to project beta", you respond with: {"intent": "contribute", "parameters": {"projectName": "Project Beta", "amount": 0.5}}
Example: "leaderboard for alpha" -> {"intent": "get_leaderboard", "parameters": {"projectName": "Project Alpha"}}
Example: "my wallet" -> {"intent": "show_profile", "parameters": {}}
`;

const intentSchema = {
    type: Type.OBJECT,
    properties: {
        intent: { type: Type.STRING },
        parameters: { 
            type: Type.OBJECT,
            properties: {
                projectName: { type: Type.STRING, nullable: true },
                amount: { type: Type.NUMBER, nullable: true },
                proposalId: { type: Type.STRING, nullable: true },
                voteChoice: { type: Type.STRING, nullable: true },
            },
        },
    }
};


export const getBotResponse = async (input: string, isAction: boolean): Promise<ChatMessage> => {
  if (input.startsWith('_confirm_')) {
      return parseConfirmation(input);
  }
  if (input === '_cancel') {
      return createBotMessage("Action canceled.");
  }
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction}\nUser message: "${input}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: intentSchema,
        },
    });

    const result = JSON.parse(response.text);
    const { intent, parameters } = result;
    
    switch (intent) {
      case 'show_projects':
        return handleShowProjects();
      case 'get_status':
        return handleStatus(parameters.projectName);
      case 'contribute':
        return handleContribution(parameters.projectName, parameters.amount, false);
      case 'vote':
        return handleVote(parameters.projectName, parameters.proposalId, parameters.voteChoice, false);
      case 'get_leaderboard':
        return handleLeaderboard(parameters.projectName);
      case 'show_profile':
        return handleShowProfile();
      case 'help':
        return handleHelp();
      default:
        return createBotMessage("I'm not sure how to help with that. Try 'help' for a list of commands.");
    }
  } catch (error) {
    console.error("Error processing bot response:", error);
    return createBotMessage("Sorry, I had a little trouble understanding that. Could you please rephrase?");
  }
};

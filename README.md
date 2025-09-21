Crowdfunding DAO Chatbot
An advanced, AI-powered chatbot that provides a seamless, conversational interface for interacting with a simulated crowdfunding Decentralized Autonomous Organization (DAO). Built with React, TypeScript, and the Google Gemini API, this project demonstrates how complex Web3 concepts like contributions, governance voting, and NFT rewards can be made intuitive and accessible to a mainstream audience.
✨ Core Features
🤖 Conversational AI Interface: Interact using natural language instead of rigid commands. The Gemini-powered NLU understands your intent, whether you want to "donate 1 eth to Project Alpha" or "see the leaderboard for the solar grid project."
🔗 Simulated Wallet Connection: A one-click wallet connection flow creates a persistent mock identity (0x... address) for your session, providing a realistic entry point into the dApp.
💸 Crowdfunding & Contributions: Discover active projects, view detailed statuses (funding progress, deadlines), and contribute simulated ETH. Contributions are confirmed through an interactive, two-step process to mimic real wallet transactions.
🗳️ DAO Governance & Voting: As a contributor, you automatically become a DAO member with voting rights. Vote on key project proposals directly from the chat interface, with safeguards to prevent double-voting.
🏆 Gamified Rewards & NFTs: Earn tiered NFT badges (Gold, Silver, Bronze) based on your contribution amounts. The bot confirms the "minting" of your badge, which is then added to your user profile.
👤 User Profiles & Reputation: Track your activity with a personal DAO profile. View your wallet address, total reputation score (earned from contributing and voting), and a gallery of all your collected NFT badges.
📊 Transparent Leaderboards: Promote community engagement and transparency by viewing a real-time leaderboard of the top contributors for any project.
🛡️ Trustless Refunds: Experience the safety of smart contracts. If a project fails to meet its funding goal, the chatbot automatically provides an option to withdraw your funds securely.
🎨 Sleek, Modern UI: A responsive and aesthetically pleasing interface built with Tailwind CSS, featuring smooth animations and a clean, dark-mode design system.
🛠️ Tech Stack
Frontend: React, TypeScript, Tailwind CSS
AI / Natural Language: Google Gemini API (gemini-2.5-flash)
State Management: React Hooks (useState, useEffect, useCallback)
Architecture: A clean, component-based architecture with a clear separation of concerns:
components/: Reusable React components for the UI.
services/chatbotService.ts: Core logic for processing user input, calling the Gemini API, and orchestrating responses.
services/mockBlockchainService.ts: A custom-built backend simulation written in TypeScript. It manages all state for projects, users, contributions, and votes, acting as a stand-in for a real blockchain.
🚀 Getting Started
Follow these instructions to get a local copy up and running.
Prerequisites
Node.js (v18 or later)
npm or yarn
A Google Gemini API Key. You can get one from Google AI Studio.
Installation & Setup
Clone the repository:

git clone https://github.com/your-username/dao-chatbot.git
cd dao-chatbot
Install dependencies:

npm install
Set up Environment Variables:
The application loads the Gemini API key from environment variables. While the project is set up for a serverless environment like Google AI Studio, you would typically create a .env file in the root for local development:

API_KEY=YOUR_GEMINI_API_KEY
Run the application:
This project is designed to run within the Google AI Studio environment. To run it locally, you would need to set up a development server (like Vite or Create React App) and ensure the process.env.API_KEY is correctly populated.

/
├── components/          # UI Components (ChatWindow, ProjectCard, etc.)
│   ├── icons/           # SVG icon components
│   └── ...
├── services/
│   ├── chatbotService.ts   # Main chatbot logic, Gemini API integration
│   └── mockBlockchainService.ts # Simulates blockchain state and logic
├── types.ts             # TypeScript type definitions for the app
├── App.tsx              # Main application component
├── index.html           # Entry HTML file
└── index.tsx            # React entry point

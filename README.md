# Conflux eSpace Transaction Visualizer

An interactive educational tool for learning how blockchain transactions work on Conflux eSpace. This visualizer simulates the complete transaction lifecycle from creation to confirmation, helping users understand the underlying mechanics of blockchain technology.

## Features

- **Wallet Generation**: Generate simulated Conflux eSpace testnet wallets
- **Transaction Simulation**: Send simulated CFX transactions with real-time visualization
- **Educational Modes**: 
  - Beginner Mode: Simple language and analogies
  - Technical Mode: Detailed blockchain terminology
- **Interactive Learning**: Step-by-step transaction flow visualization
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS

## Conflux eSpace vs Core Space

This application has been updated to work with **Conflux eSpace** instead of Conflux Core:

- **Address Format**: Uses Ethereum-compatible `0x` addresses (instead of Conflux Core's `cfxtest:aat` format)
- **EVM Compatibility**: Fully compatible with Ethereum Virtual Machine
- **Wallet Support**: Works with MetaMask and other EVM-compatible wallets
- **Developer Tools**: Can use standard Ethereum development tools like Hardhat

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**: Navigate to `http://localhost:3000`

## How It Works

1. **Generate Wallet**: Create a simulated Conflux eSpace testnet wallet
2. **Send Transaction**: Enter recipient address and amount
3. **Watch Progress**: See your transaction move through each stage:
   - Created (transaction object created)
   - Signed (signed with private key)
   - Broadcasted (sent to network)
   - Pending (waiting in mempool)
   - Included (added to block)
   - Confirmed (finalized)

## Educational Value

This tool helps users understand:
- How digital wallets work
- The transaction lifecycle on blockchain
- Gas fees and network operations
- Block inclusion and confirmation
- The security model of blockchain transactions

## Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Lucide React
- **Blockchain**: Conflux eSpace simulation
- **Development**: ESLint, PostCSS

## Contributing

This is an educational project. Feel free to fork and modify for your learning needs.

## License

MIT License - see LICENSE file for details.
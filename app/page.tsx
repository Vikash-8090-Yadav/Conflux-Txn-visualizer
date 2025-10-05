"use client"

import { useState } from "react"
import { WalletGenerator } from "@/components/wallet-generator"
import { TransactionSender } from "@/components/transaction-sender"
import { TransactionVisualizer } from "@/components/transaction-visualizer"
import { DataPanel } from "@/components/data-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { WelcomeModal } from "@/components/welcome-modal"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export type TransactionStage =
  | "idle"
  | "created"
  | "signed"
  | "broadcasted"
  | "pending"
  | "included"
  | "confirmed"
  | "error"

export interface TransactionData {
  hash?: string
  from?: string
  to?: string
  value?: string
  nonce?: number
  gas?: string
  gasPrice?: string
  data?: string
  blockNumber?: number
  blockHash?: string
  timestamp?: number
  status?: number
  gasUsed?: string
  logs?: any[]
  error?: string
}

export default function ConfluxVisualizer() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [privateKey, setPrivateKey] = useState<string>("")
  const [balance, setBalance] = useState<string>("0")
  const [stage, setStage] = useState<TransactionStage>("idle")
  const [txData, setTxData] = useState<TransactionData>({})
  const [showJson, setShowJson] = useState(false)
  const [beginnerMode, setBeginnerMode] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  const handleWalletGenerated = (address: string, key: string, bal: string) => {
    setWalletAddress(address)
    setPrivateKey(key)
    setBalance(bal)
  }

  const handleTransactionUpdate = (newStage: TransactionStage, data: TransactionData) => {
    setStage(newStage)
    setTxData((prev) => ({ ...prev, ...data }))
    
    // Note: For real blockchain integration, balance would be updated automatically
    // when querying the blockchain. For simulation purposes, we'll keep the 
    // current balance display as-is since we're showing real balance from the explorer.
  }

  const handleBalanceUpdate = (newBalance: string) => {
    setBalance(newBalance)
    console.log(`💳 Wallet balance updated to: ${newBalance} CFX`)
  }

  const handleReset = () => {
    setStage("idle")
    setTxData({})
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-balance">
                {beginnerMode ? "Learn How Digital Money Works" : "Conflux eSpace Transaction Visualizer"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {beginnerMode ? "Interactive Blockchain Learning" : "Educational Conflux eSpace Explorer"}
              </p>
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBeginnerMode(!beginnerMode)}
              className="flex items-center gap-2"
            >
              {beginnerMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{beginnerMode ? "Simple Mode" : "Technical Mode"}</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 mb-6">
          <WalletGenerator onWalletGenerated={handleWalletGenerated} address={walletAddress} privateKey={privateKey} balance={balance} />

          {walletAddress && (
            <TransactionSender
              walletAddress={walletAddress}
              privateKey={privateKey}
              balance={balance}
              onTransactionUpdate={handleTransactionUpdate}
              onReset={handleReset}
              currentStage={stage}
              onBalanceUpdate={handleBalanceUpdate}
            />
          )}
        </div>

        {stage !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            <TransactionVisualizer stage={stage} txData={txData} beginnerMode={beginnerMode} />

            <DataPanel
              txData={txData}
              stage={stage}
              showJson={showJson}
              onToggleJson={() => setShowJson(!showJson)}
              beginnerMode={beginnerMode}
            />
          </motion.div>
        )}
      </main>

      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            {beginnerMode
              ? "This is a learning tool - no real money is used"
              : "Simulated Conflux eSpace Testnet • Educational Tool for Learning Blockchain Transactions"}
          </p>
        </div>
      </footer>
    </div>
  )
}

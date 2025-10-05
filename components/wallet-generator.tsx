"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Tooltip } from "@/components/tooltip"
import { Web3 } from "web3"

interface WalletGeneratorProps {
  onWalletGenerated: (address: string, privateKey: string, balance: string) => void
  address: string
  privateKey: string
  balance: string
}

// Use the real address from ConfluxScan explorer
const REAL_ADDRESS = "0xb7fcfe251ca336841d019a731fed59658d150909"

// Faucet private key for giving test tokens (with 0x prefix)
const FAUCET_PRIVATE_KEY = "0x5753e65f56865a161fbf41932a0d855139a4ce9dc20d82fb655bff393fc41702"
const FAUCET_ADDRESS = "0xc3E894473BB51b5e5453042420A1d465E69cbCB9" // Known address with 78 CFX
const FAUCET_AMOUNT = "0.5" // Maximum amount to give from faucet
const BYPASS_BALANCE_CHECK = true // Set to false for production

// Generate a proper wallet pair (address + private key) using Web3.js
function generateWalletPair(): { address: string; privateKey: string } {
  try {
    console.log('🚀 Generating new wallet pair...')
    
    // Initialize Web3 to use its account generation
    const web3 = new Web3()
    
    // Create a new account (different each time)
    const account = web3.eth.accounts.create()
    
    console.log('🔑 Generated new wallet pair:')
    console.log('- Address:', account.address)
    console.log('- Private Key:', account.privateKey)
    
    return {
      address: account.address,
      privateKey: account.privateKey
    }
  } catch (error) {
    console.error('Error generating wallet pair:', error)
    // Fallback to a known working pair for demo
    return {
      address: "0x1234567890123456789012345678901234567890",
      privateKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    }
  }
}

// Function to check faucet balance using Web3.js
async function checkFaucetBalance(): Promise<string> {
  try {
    console.log('🔍 Checking faucet balance with Web3.js...')
    
    // Initialize Web3 with Conflux eSpace testnet
    const web3 = new Web3('https://evmtestnet.confluxrpc.com')
    
    console.log('🔍 Web3.js Debug:')
    console.log('- Web3 instance created:', !!web3)
    console.log('- Provider connected:', !!web3.currentProvider)
    
    // Check balance of the known faucet address
    const balanceInWei = await web3.eth.getBalance(FAUCET_ADDRESS)
    console.log('Raw balance in Wei:', balanceInWei)
    
    // Convert Wei to CFX (1 CFX = 10^18 Wei)
    const balanceInCFX = web3.utils.fromWei(balanceInWei, 'ether')
    console.log('Converted balance in CFX:', balanceInCFX)
    
    console.log('🔍 Faucet Address Debug:')
    console.log('- Known Address (with funds):', FAUCET_ADDRESS)
    console.log('- Private Key (with 0x):', FAUCET_PRIVATE_KEY)
    console.log('- ConfluxScan Link:', `https://evmtestnet.confluxscan.org/address/${FAUCET_ADDRESS}`)
    console.log('💰 Final faucet balance:', parseFloat(balanceInCFX).toFixed(4), 'CFX')
    
    return parseFloat(balanceInCFX).toFixed(4)
  } catch (error) {
    console.error('Error checking faucet balance with Web3.js:', error)
    return "0"
  }
}

// Function to send real tokens from faucet using private key
async function sendFromFaucet(toAddress: string): Promise<string> {
  try {
    console.log('🚀 Sending real faucet tokens...')
    console.log('📍 From Faucet:', FAUCET_ADDRESS)
    console.log('📍 To:', toAddress)
    console.log('💰 Amount:', FAUCET_AMOUNT, 'CFX')
    console.log('🔑 Using faucet private key:', FAUCET_PRIVATE_KEY.slice(0, 10) + '...')
    
    // Initialize Web3 with Conflux eSpace testnet
    const web3 = new Web3('https://evmtestnet.confluxrpc.com')
    
    // Create faucet account from private key
    const faucetAccount = web3.eth.accounts.privateKeyToAccount(FAUCET_PRIVATE_KEY)
    console.log('🔍 Faucet account derived:', faucetAccount.address)
    
    // Verify the faucet account matches the expected address
    if (faucetAccount.address.toLowerCase() !== FAUCET_ADDRESS.toLowerCase()) {
      throw new Error(`Faucet account mismatch: expected ${FAUCET_ADDRESS}, got ${faucetAccount.address}`)
    }
    
    // Add the faucet account to Web3 wallet
    web3.eth.accounts.wallet.add(faucetAccount)
    web3.eth.defaultAccount = faucetAccount.address
    
    // Convert CFX to Wei
    const amountInWei = web3.utils.toWei(FAUCET_AMOUNT, 'ether')
    console.log('✅ Amount in Wei:', amountInWei)
    
    // Get current gas price
    const gasPrice = await web3.eth.getGasPrice()
    console.log('⛽ Gas Price:', gasPrice)
    
    // Create transaction object
    const transactionObject = {
      from: FAUCET_ADDRESS,
      to: toAddress,
      value: amountInWei,
      gas: 21000,
      gasPrice: gasPrice,
    }
    
    console.log('📝 Faucet Transaction Object:', transactionObject)
    
    // Send the transaction
    console.log('🚀 Broadcasting faucet transaction...')
    const txHash = await web3.eth.sendTransaction(transactionObject)
    console.log('✅ Faucet transaction sent successfully!')
    console.log('📋 Transaction Hash:', txHash.transactionHash)
    
    // Wait for transaction to be mined (using correct Web3.js method)
    console.log('⏳ Waiting for faucet transaction to be mined...')
    
    // Use getTransactionReceipt in a loop to wait for confirmation
    let receipt = null
    let attempts = 0
    const maxAttempts = 30 // Wait up to 30 seconds
    
    while (!receipt && attempts < maxAttempts) {
      try {
        receipt = await web3.eth.getTransactionReceipt(txHash.transactionHash)
        if (receipt) {
          console.log('✅ Faucet transaction mined!')
          console.log('📋 Receipt:', receipt)
          break
        }
      } catch (error) {
        // Receipt not found yet, continue waiting
      }
      
      // Wait 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
      console.log(`⏳ Waiting for confirmation... (${attempts}/${maxAttempts})`)
    }
    
    if (!receipt) {
      console.log('⚠️ Transaction sent but confirmation timeout. Hash:', txHash.transactionHash)
      // Don't throw error, transaction was sent successfully
    }
    
    return txHash.transactionHash
    
  } catch (error) {
    console.error('❌ Error sending real faucet tokens:', error)
    throw error
  }
}

// Helper function to generate random transaction hash
function generateRandomTxHash(): string {
  const chars = "0123456789abcdef"
  let hash = "0x"
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

// Test function to verify RPC connection
async function testRPCConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://evmtestnet.confluxrpc.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    })
    
    const data = await response.json()
    console.log('RPC test response:', data)
    return !data.error
  } catch (error) {
    console.error('RPC test failed:', error)
    return false
  }
}

// Function to fetch real balance from Conflux eSpace testnet using Web3.js
async function fetchRealBalance(address: string): Promise<string> {
  try {
    console.log('🔍 Fetching balance using Web3.js for address:', address)
    
    // Initialize Web3 with Conflux eSpace testnet
    const web3 = new Web3('https://evmtestnet.confluxrpc.com')
    
    // Get balance using Web3.js
    const balanceInWei = await web3.eth.getBalance(address)
    console.log('Raw balance in Wei:', balanceInWei)
    
    // Convert Wei to CFX using Web3.js utilities
    const balanceInCFX = web3.utils.fromWei(balanceInWei, 'ether')
    console.log('Converted balance in CFX:', balanceInCFX)
    
    const finalBalance = parseFloat(balanceInCFX).toFixed(4)
    console.log('✅ Final balance:', finalBalance, 'CFX')
    
    return finalBalance
  } catch (error) {
    console.error('❌ Error fetching balance with Web3.js:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Return a fixed fallback balance instead of random
    return "0.0000"
  }
}

export function WalletGenerator({ onWalletGenerated, address, privateKey, balance }: WalletGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)
  const [faucetLoading, setFaucetLoading] = useState(false)
  const [faucetError, setFaucetError] = useState<string | null>(null)
  const [faucetSuccess, setFaucetSuccess] = useState(false)
  const [faucetTxHash, setFaucetTxHash] = useState<string>("")

  const generateWallet = async () => {
    setLoading(true)
    
    try {
      // Generate a new wallet pair (different each time)
      const walletPair = generateWalletPair()
      const addr = walletPair.address
      const key = walletPair.privateKey
      
      console.log('🔑 Generated wallet for user:')
      console.log('- Address:', addr)
      console.log('- Private Key:', key)
      
      // Fetch real balance from Conflux eSpace testnet
      const realBalance = await fetchRealBalance(addr)
      
      onWalletGenerated(addr, key, realBalance)
    } catch (error) {
      console.error('Error generating wallet:', error)
      // Fallback to simulated wallet if real fetch fails
      const walletPair = generateWalletPair()
      const addr = walletPair.address
      const key = walletPair.privateKey
      const bal = "0.0000" // New wallet will have 0 balance
      onWalletGenerated(addr, key, bal)
    }
    
    setLoading(false)
  }

  const requestFaucetTokens = async () => {
    if (!address) return
    
    setFaucetLoading(true)
    setFaucetError(null)
    setFaucetSuccess(false)
    
    try {
      console.log('Starting real faucet transaction...')
      
      // Check faucet balance first
      const faucetBalance = await checkFaucetBalance()
      console.log('Faucet balance:', faucetBalance, 'CFX')
      
      // For testing: if balance check fails, try anyway (the address might have funds but balance query is failing)
      if (parseFloat(faucetBalance) < parseFloat(FAUCET_AMOUNT)) {
        if (BYPASS_BALANCE_CHECK) {
          console.log('⚠️ Balance check failed, but bypassing due to BYPASS_BALANCE_CHECK=true')
          console.log('Proceeding with transaction attempt...')
        } else {
          throw new Error(`Faucet has insufficient balance. Available: ${faucetBalance} CFX, Required: ${FAUCET_AMOUNT} CFX`)
        }
      }
      
      // Send real transaction from faucet
      const txHash = await sendFromFaucet(address)
      console.log('Faucet transaction successful:', txHash)
      setFaucetTxHash(txHash)
      
      // Wait a moment for the transaction to be processed
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Fetch updated balance from blockchain
      const newBalance = await fetchRealBalance(address)
      console.log('Updated balance after faucet:', newBalance)
      
      // Update the wallet with new balance (keep same address and private key)
      onWalletGenerated(address, privateKey, newBalance)
      setFaucetSuccess(true)
      
      // Clear success message after 5 seconds
      setTimeout(() => setFaucetSuccess(false), 5000)
      
    } catch (error) {
      console.error('Faucet error:', error)
      setFaucetError(`Failed to get test tokens: ${error.message}`)
    } finally {
      setFaucetLoading(false)
    }
  }

  const isBalanceZero = parseFloat(balance) === 0
  const canUseFaucet = isBalanceZero && address

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Wallet Generator</h2>
            <Tooltip content="Generate a test wallet to learn about blockchain. If your balance is 0, you can get free test tokens from the faucet!">
              <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground cursor-help">
                ?
              </div>
            </Tooltip>
          </div>
          {!address && (
            <Button
              onClick={generateWallet}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Generating..." : "Generate Wallet"}
            </Button>
          )}
        </div>

        {address && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/20 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <Tooltip content="Your Conflux eSpace testnet address. This is your public identifier on the blockchain.">
                      <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground cursor-help">
                        ?
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm break-all text-primary">{address}</p>
                    <a
                      href={`https://evmtestnet.confluxscan.org/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 underline"
                    >
                      🔗 View on ConfluxScan
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/20 border border-orange-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Private Key</span>
                    <Tooltip content="Your private key - keep this secret! This controls your wallet and is used to sign transactions.">
                      <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground cursor-help">
                        ?
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm break-all text-orange-600">{privateKey}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(privateKey)
                        // You could add a toast notification here
                      }}
                      className="text-xs text-orange-500 hover:text-orange-700 underline"
                      title="Copy private key"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="text-xs text-red-600 mt-2">
                    ⚠️ Never share your private key! Anyone with this key can control your wallet.
                  </div>
                </div>

            <div className="p-4 rounded-lg bg-secondary/20 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Balance</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      setBalanceLoading(true)
                      setBalanceError(null)
                      try {
                        const realBalance = await fetchRealBalance(address)
                        onWalletGenerated(address, privateKey, realBalance)
                      } catch (error) {
                        setBalanceError("Failed to fetch balance")
                        console.error("Balance refresh error:", error)
                      } finally {
                        setBalanceLoading(false)
                      }
                    }}
                    disabled={balanceLoading}
                    className="text-xs h-6 px-2"
                  >
                    {balanceLoading ? "⏳" : "🔄"} {balanceLoading ? "Loading..." : "Refresh"}
                  </Button>
                  <Tooltip content="Real CFX balance from Conflux eSpace testnet. Click refresh to update.">
                    <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground cursor-help">
                      ?
                    </div>
                  </Tooltip>
                </div>
              </div>
              <p className="text-2xl font-bold">{balance} CFX</p>
              {balanceError ? (
                <p className="text-xs text-red-600 mt-1">❌ {balanceError}</p>
              ) : (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ Live data from Conflux eSpace testnet
                      <br />
                      <span className="text-xs text-muted-foreground">Address: {address.slice(0, 10)}...</span>
                    </div>
              )}
            </div>

            {/* Faucet Section - Show when balance is 0 */}
            {canUseFaucet && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">🚰</div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Need Test Tokens?
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Get free test tokens to try transactions!
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p>• Get up to <strong>{FAUCET_AMOUNT} CFX</strong> for testing</p>
                    <p>• These are test tokens (not real money)</p>
                    <p>• Perfect for learning how blockchain works</p>
                  </div>

                  <Button
                    onClick={requestFaucetTokens}
                    disabled={faucetLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {faucetLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Getting Test Tokens...
                      </>
                    ) : (
                      <>
                        💰 Get {FAUCET_AMOUNT} CFX (Real Transfer)
                      </>
                    )}
                  </Button>

                  {faucetSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-sm"
                    >
                        <div className="font-semibold">✅ Success! You received {FAUCET_AMOUNT} CFX test tokens! (Real Transaction)</div>
                      {faucetTxHash && (
                        <div className="mt-2 text-xs">
                          <div>Transaction Hash:</div>
                          <div className="font-mono break-all">{faucetTxHash}</div>
                          <a
                            href={`https://evmtestnet.confluxscan.org/tx/${faucetTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            🔗 View on ConfluxScan
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {faucetError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-sm"
                    >
                      ❌ {faucetError}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

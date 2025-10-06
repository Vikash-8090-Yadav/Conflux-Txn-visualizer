"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Tooltip } from "@/components/tooltip"
import type { TransactionStage, TransactionData } from "@/app/page"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Web3 } from "web3"

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false })

interface DataPanelProps {
  txData: TransactionData
  stage: TransactionStage
  showJson: boolean
  onToggleJson: () => void
  beginnerMode: boolean
}

interface RealTimeData {
  transaction?: any
  receipt?: any
  block?: any
  gasPrice?: string
  blockNumber?: string
  timestamp?: string
  loading: boolean
  error?: string
}

export function DataPanel({ txData, stage, showJson, onToggleJson, beginnerMode }: DataPanelProps) {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({ loading: false })
  const [refreshCount, setRefreshCount] = useState(0)

  // Fetch real-time data from blockchain
  const fetchRealTimeData = async () => {
    if (!txData.hash || stage === "idle") return

    setRealTimeData(prev => ({ ...prev, loading: true, error: undefined }))

    try {
      console.log('🔍 Fetching real-time transaction data for:', txData.hash)
      const web3 = new Web3('https://evmtestnet.confluxrpc.com')

      // Fetch transaction details
      const transaction = await web3.eth.getTransaction(txData.hash)
      console.log('📋 Transaction:', transaction)

      // Fetch transaction receipt
      const receipt = await web3.eth.getTransactionReceipt(txData.hash)
      console.log('📄 Receipt:', receipt)

      // Get current gas price
      const gasPrice = await web3.eth.getGasPrice()
      const gasPriceInCFX = web3.utils.fromWei(gasPrice, 'ether')

      // Get current block number
      const blockNumber = await web3.eth.getBlockNumber()

      // If we have a receipt, get block details
      let block = null
      let timestamp = null
      if (receipt && receipt.blockNumber) {
        block = await web3.eth.getBlock(receipt.blockNumber)
        timestamp = new Date(Number(block.timestamp) * 1000).toLocaleString()
      }

      setRealTimeData({
        transaction,
        receipt,
        block,
        gasPrice: gasPriceInCFX,
        blockNumber: blockNumber.toString(),
        timestamp,
        loading: false
      })

      console.log('✅ Real-time data fetched successfully')

    } catch (error) {
      console.error('❌ Error fetching real-time data:', error)
      setRealTimeData(prev => ({ 
        ...prev, 
        loading: false, 
        error: `Failed to fetch real-time data: ${error.message}` 
      }))
    }
  }

  // Auto-fetch when transaction hash is available
  useEffect(() => {
    if (txData.hash && stage !== "idle") {
      fetchRealTimeData()
    }
  }, [txData.hash, stage, refreshCount])

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{beginnerMode ? "Transaction Details" : "Transaction Data"}</h2>
          {beginnerMode && (
            <p className="text-xs text-muted-foreground">The important information about your transfer</p>
          )}
          {realTimeData.loading && (
            <p className="text-xs text-blue-600 mt-1">🔄 Fetching real-time data from blockchain...</p>
          )}
          {realTimeData.error && (
            <p className="text-xs text-red-600 mt-1">❌ {realTimeData.error}</p>
          )}
        </div>
        <div className="flex gap-2">
          {txData.hash && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setRefreshCount(prev => prev + 1)}
              disabled={realTimeData.loading}
            >
              {realTimeData.loading ? "🔄" : "🔄"} Refresh
            </Button>
          )}
          {!beginnerMode && (
            <Button variant="outline" size="sm" onClick={onToggleJson}>
              {showJson ? "Simple View" : "Raw Data"}
            </Button>
          )}
        </div>
      </div>

      {showJson && !beginnerMode ? (
        <div className="rounded-lg overflow-hidden bg-secondary/20 p-4">
          <ReactJson
            src={txData}
            theme="monokai"
            collapsed={false}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            style={{ background: "transparent", fontSize: "13px" }}
          />
        </div>
      ) : (
        <Tabs defaultValue="transaction" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transaction">{beginnerMode ? "Transfer" : "Transaction"}</TabsTrigger>
            <TabsTrigger value="block">{beginnerMode ? "Package" : "Block"}</TabsTrigger>
            <TabsTrigger value="receipt">{beginnerMode ? "Receipt" : "Receipt"}</TabsTrigger>
          </TabsList>

          <TabsContent value="transaction" className="space-y-3 mt-4">
            <DataRow
              label={beginnerMode ? "Transaction ID" : "Hash"}
              value={txData.hash || "-"}
              tooltip={
                beginnerMode
                  ? "A unique ID for this transaction, like a tracking number"
                  : "Unique identifier for this transaction"
              }
              mono
              beginnerMode={beginnerMode}
              realTimeValue={realTimeData.transaction?.hash}
              loading={realTimeData.loading}
            />
            <DataRow
              label={beginnerMode ? "Sent From" : "From"}
              value={txData.from || "-"}
              tooltip={beginnerMode ? "Your wallet address (like your account number)" : "Sender's address"}
              mono
              beginnerMode={beginnerMode}
              realTimeValue={realTimeData.transaction?.from}
              loading={realTimeData.loading}
            />
            <DataRow
              label={beginnerMode ? "Sent To" : "To"}
              value={txData.to || "-"}
              tooltip={beginnerMode ? "The recipient's wallet address" : "Recipient's address"}
              mono
              beginnerMode={beginnerMode}
              realTimeValue={realTimeData.transaction?.to}
              loading={realTimeData.loading}
            />
            <DataRow
              label="Amount"
              value={txData.value ? `${txData.value} CFX` : "-"}
              tooltip={beginnerMode ? "How much money you're sending" : "Amount of CFX being transferred"}
              beginnerMode={beginnerMode}
              realTimeValue={realTimeData.transaction?.value ? `${realTimeData.transaction.value} Wei` : undefined}
              loading={realTimeData.loading}
            />
            {!beginnerMode && (
              <>
                <DataRow
                  label="Nonce"
                  value={txData.nonce?.toString() || "-"}
                  tooltip="Transaction count from sender's address. Prevents replay attacks."
                  beginnerMode={beginnerMode}
                  realTimeValue={realTimeData.transaction?.nonce?.toString()}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Gas Price"
                  value={txData.gasPrice ? `${txData.gasPrice} CFX` : "-"}
                  tooltip="Price per unit of gas for this transaction"
                  beginnerMode={beginnerMode}
                  realTimeValue={realTimeData.transaction?.gasPrice ? `${realTimeData.transaction.gasPrice} Wei` : undefined}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Gas Limit"
                  value={txData.gas || "-"}
                  tooltip="Maximum gas units allowed for this transaction"
                  beginnerMode={beginnerMode}
                  realTimeValue={realTimeData.transaction?.gas?.toString()}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Current Gas Price"
                  value={realTimeData.gasPrice ? `${realTimeData.gasPrice} CFX` : "-"}
                  tooltip="Current gas price on the network"
                  beginnerMode={beginnerMode}
              loading={realTimeData.loading}
            />
              </>
            )}
          </TabsContent>

          <TabsContent value="block" className="space-y-3 mt-4">
            <DataRow
              label={beginnerMode ? "Package Number" : "Block Number"}
              value={txData.blockNumber?.toString() || "-"}
              tooltip={
                beginnerMode
                  ? "Your transaction was grouped with others in package #" + (txData.blockNumber || "?")
                  : "The block that includes this transaction"
              }
              beginnerMode={beginnerMode}
              realTimeValue={realTimeData.receipt?.blockNumber?.toString()}
              loading={realTimeData.loading}
            />
            <DataRow
              label="Current Block"
              value={realTimeData.blockNumber || "-"}
              tooltip="Latest block number on the network"
              beginnerMode={beginnerMode}
              loading={realTimeData.loading}
            />
            {!beginnerMode && (
              <>
                <DataRow
                  label="Block Hash"
                  value={txData.blockHash || "-"}
                  tooltip="Unique identifier of the block"
                  mono
                  beginnerMode={beginnerMode}
                  realTimeValue={realTimeData.receipt?.blockHash}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Transaction Index"
                  value={realTimeData.receipt?.transactionIndex?.toString() || "-"}
                  tooltip="Position of this transaction within the block"
                  beginnerMode={beginnerMode}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Block Gas Used"
                  value={realTimeData.block?.gasUsed?.toString() || "-"}
                  tooltip="Total gas used by all transactions in this block"
                  beginnerMode={beginnerMode}
                  loading={realTimeData.loading}
                />
              </>
            )}
            <DataRow
              label={beginnerMode ? "When" : "Timestamp"}
              value={txData.timestamp ? new Date(txData.timestamp * 1000).toLocaleString() : "-"}
              tooltip={beginnerMode ? "When your transaction was processed" : "When the block was mined"}
              beginnerMode={beginnerMode}
              realTimeValue={realTimeData.timestamp}
              loading={realTimeData.loading}
            />
          </TabsContent>

          <TabsContent value="receipt" className="space-y-3 mt-4">
            <DataRow
              label="Status"
              value={txData.status !== undefined ? (txData.status === 1 ? "✓ Success" : "✗ Failed") : "-"}
              tooltip={
                beginnerMode
                  ? "Whether your money was successfully sent"
                  : "Whether the transaction executed successfully"
              }
              beginnerMode={beginnerMode}
              realTimeValue={realTimeData.receipt?.status === 1 ? "✓ Success" : realTimeData.receipt?.status === 0 ? "✗ Failed" : undefined}
              loading={realTimeData.loading}
            />
            <DataRow
              label="Confirmations"
              value={realTimeData.receipt && realTimeData.blockNumber ? 
                (parseInt(realTimeData.blockNumber) - parseInt(realTimeData.receipt.blockNumber)).toString() : "-"}
              tooltip="Number of blocks mined since this transaction"
              beginnerMode={beginnerMode}
              loading={realTimeData.loading}
            />
            {!beginnerMode && (
              <>
                <DataRow
                  label="Gas Used"
                  value={txData.gasUsed || "-"}
                  tooltip="Actual amount of gas consumed by this transaction"
                  beginnerMode={beginnerMode}
                  realTimeValue={realTimeData.receipt?.gasUsed?.toString()}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Effective Gas Price"
                  value={realTimeData.receipt?.effectiveGasPrice ? `${realTimeData.receipt.effectiveGasPrice} Wei` : "-"}
                  tooltip="Actual gas price paid for this transaction"
                  beginnerMode={beginnerMode}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Cumulative Gas Used"
                  value={realTimeData.receipt?.cumulativeGasUsed?.toString() || "-"}
                  tooltip="Total gas used by all transactions up to this point in the block"
                  beginnerMode={beginnerMode}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Logs"
                  value={txData.logs ? `${txData.logs.length} events` : "-"}
                  tooltip="Events emitted during transaction execution"
                  beginnerMode={beginnerMode}
                  realTimeValue={realTimeData.receipt?.logs ? `${realTimeData.receipt.logs.length} events` : undefined}
                  loading={realTimeData.loading}
                />
                <DataRow
                  label="Contract Address"
                  value={realTimeData.receipt?.contractAddress || "-"}
                  tooltip="Address of contract created (if any)"
                  mono
                  beginnerMode={beginnerMode}
                  loading={realTimeData.loading}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </Card>
  )
}

function DataRow({
  label,
  value,
  tooltip,
  mono = false,
  beginnerMode,
  realTimeValue,
  loading = false,
}: {
  label: string
  value: string
  tooltip: string
  mono?: boolean
  beginnerMode: boolean
  realTimeValue?: string
  loading?: boolean
}) {
  const displayValue = realTimeValue !== undefined ? realTimeValue : value
  const isRealTime = realTimeValue !== undefined && realTimeValue !== value

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
        isRealTime ? "bg-green-50 border-green-200" : "bg-secondary/20 border-border/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {isRealTime && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Live
          </span>
        )}
        {loading && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full animate-pulse">
            Loading...
          </span>
        )}
        <Tooltip content={tooltip}>
          <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground cursor-help">
            ?
          </div>
        </Tooltip>
      </div>
      <div className="text-right max-w-[60%]">
        <span className={`text-sm break-all ${mono ? "font-mono" : ""} ${
          isRealTime ? "text-green-700 font-semibold" : ""
        }`}>
          {displayValue}
        </span>
        {isRealTime && value !== realTimeValue && (
          <div className="text-xs text-muted-foreground mt-1 line-through">
            {value}
          </div>
        )}
      </div>
    </motion.div>
  )
}

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
  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{beginnerMode ? "Transaction Details" : "Transaction Data"}</h2>
          {beginnerMode && (
            <p className="text-xs text-muted-foreground">The important information about your transfer</p>
          )}
        </div>
        {!beginnerMode && (
          <Button variant="outline" size="sm" onClick={onToggleJson}>
            {showJson ? "Simple View" : "Raw Data"}
          </Button>
        )}
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
            />
            <DataRow
              label={beginnerMode ? "Sent From" : "From"}
              value={txData.from || "-"}
              tooltip={beginnerMode ? "Your wallet address (like your account number)" : "Sender's address"}
              mono
              beginnerMode={beginnerMode}
            />
            <DataRow
              label={beginnerMode ? "Sent To" : "To"}
              value={txData.to || "-"}
              tooltip={beginnerMode ? "The recipient's wallet address" : "Recipient's address"}
              mono
              beginnerMode={beginnerMode}
            />
            <DataRow
              label="Amount"
              value={txData.value ? `${txData.value} CFX` : "-"}
              tooltip={beginnerMode ? "How much money you're sending" : "Amount of CFX being transferred"}
              beginnerMode={beginnerMode}
            />
            {!beginnerMode && (
              <>
                <DataRow
                  label="Nonce"
                  value={txData.nonce?.toString() || "-"}
                  tooltip="Transaction count from sender's address. Prevents replay attacks."
                  beginnerMode={beginnerMode}
                />
                <DataRow
                  label="Gas Price"
                  value={txData.gasPrice ? `${txData.gasPrice} CFX` : "-"}
                  tooltip="Price per unit of gas for this transaction"
                  beginnerMode={beginnerMode}
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
            />
            {!beginnerMode && (
              <DataRow
                label="Block Hash"
                value={txData.blockHash || "-"}
                tooltip="Unique identifier of the block"
                mono
                beginnerMode={beginnerMode}
              />
            )}
            <DataRow
              label={beginnerMode ? "When" : "Timestamp"}
              value={txData.timestamp ? new Date(txData.timestamp * 1000).toLocaleString() : "-"}
              tooltip={beginnerMode ? "When your transaction was processed" : "When the block was mined"}
              beginnerMode={beginnerMode}
            />
          </TabsContent>

          <TabsContent value="receipt" className="space-y-3 mt-4">
            <DataRow
              label="Status"
              value={txData.status !== undefined ? (txData.status === 0 ? "✓ Success" : "✗ Failed") : "-"}
              tooltip={
                beginnerMode
                  ? "Whether your money was successfully sent"
                  : "Whether the transaction executed successfully"
              }
              beginnerMode={beginnerMode}
            />
            {!beginnerMode && (
              <>
                <DataRow
                  label="Gas Used"
                  value={txData.gasUsed || "-"}
                  tooltip="Actual amount of gas consumed by this transaction"
                  beginnerMode={beginnerMode}
                />
                <DataRow
                  label="Logs"
                  value={txData.logs ? `${txData.logs.length} events` : "-"}
                  tooltip="Events emitted during transaction execution"
                  beginnerMode={beginnerMode}
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
}: {
  label: string
  value: string
  tooltip: string
  mono?: boolean
  beginnerMode: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between p-3 rounded-lg bg-secondary/20 border border-border/50"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Tooltip content={tooltip}>
          <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground cursor-help">
            ?
          </div>
        </Tooltip>
      </div>
      <span className={`text-sm text-right break-all max-w-[60%] ${mono ? "font-mono" : ""}`}>{value}</span>
    </motion.div>
  )
}

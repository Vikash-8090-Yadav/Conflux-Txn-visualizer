"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tooltip } from "@/components/tooltip"
import type { TransactionStage, TransactionData } from "@/app/page"
import { Check, X, Mail, Lock, Send, Clock, Package, CheckCircle2 } from "lucide-react"

interface TransactionVisualizerProps {
  stage: TransactionStage
  txData: TransactionData
  beginnerMode: boolean
}

const stages = [
  {
    id: "created",
    label: "Created",
    simpleLabel: "📝 Writing Your Letter",
    description: "Transaction object created with recipient and amount",
    simpleDescription: "You've written down who to send money to and how much",
    analogy: "Like writing a letter with the recipient's address and a check inside",
    icon: Mail,
    emoji: "📝",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  {
    id: "signed",
    label: "Signed",
    simpleLabel: "🔒 Sealing the Envelope",
    description: "Transaction signed with your private key",
    simpleDescription: "You've sealed it with your unique signature so no one can tamper with it",
    analogy: "Like signing a check and sealing the envelope - only you can do this",
    icon: Lock,
    emoji: "🔒",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
  },
  {
    id: "broadcasted",
    label: "Broadcasted",
    simpleLabel: "📮 Dropping in the Mailbox",
    description: "Transaction sent to the network",
    simpleDescription: "Your transaction is sent out to the blockchain network",
    analogy: "Like dropping your letter in the mailbox - it's now in the postal system",
    icon: Send,
    emoji: "📮",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
  {
    id: "pending",
    label: "Pending in Mempool",
    simpleLabel: "⏳ Waiting at the Post Office",
    description: "Waiting to be included in a block",
    simpleDescription: "Your transaction is waiting in line with others to be processed",
    analogy: "Like your letter waiting at the post office to be sorted and delivered",
    icon: Clock,
    emoji: "⏳",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "included",
    label: "Included in Block",
    simpleLabel: "🚚 Out for Delivery",
    description: "Transaction added to a block by a miner",
    simpleDescription: "Your transaction has been grouped with others and is being delivered",
    analogy: "Like your letter being loaded onto a delivery truck with other mail",
    icon: Package,
    emoji: "🚚",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    simpleLabel: "🎉 Delivered Successfully",
    description: "Transaction finalized with receipt",
    simpleDescription: "Your money has arrived and the transaction is complete!",
    analogy: "Like getting a delivery confirmation - the letter has been received",
    icon: CheckCircle2,
    emoji: "🎉",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
]

export function TransactionVisualizer({ stage, txData, beginnerMode }: TransactionVisualizerProps) {
  const currentIndex = stages.findIndex((s) => s.id === stage)
  const isError = stage === "error"

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          {beginnerMode ? "📬 Your Transaction Journey" : "🔄 Transaction Lifecycle"}
        </h2>
        {beginnerMode && (
          <div className="text-sm text-muted-foreground">
            <p>Watch your money travel step by step through the blockchain</p>
            <p className="text-xs mt-1 text-blue-600">💡 Each step shows how your transaction moves from creation to delivery</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {stages.map((stageItem, index) => {
          const isActive = index === currentIndex
          const isComplete = index < currentIndex
          const isPending = index > currentIndex
          const Icon = stageItem.icon

          return (
            <motion.div
              key={stageItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                  isActive
                    ? `${stageItem.bgColor} ${stageItem.color} border-current shadow-lg`
                    : isComplete
                      ? `${stageItem.bgColor} border-current`
                      : "bg-secondary/10 border-border"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? "border-current bg-white/50"
                      : isComplete
                        ? "border-current bg-white/30"
                        : "border-border bg-secondary"
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <span className="text-2xl">{stageItem.emoji}</span>
                    </motion.div>
                  ) : (
                    <span className="text-xl opacity-50">{stageItem.emoji}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${isActive ? "text-primary text-glow" : ""}`}>
                      {beginnerMode ? stageItem.simpleLabel : stageItem.label}
                    </h3>
                    <Tooltip content={beginnerMode ? stageItem.analogy : stageItem.description}>
                      <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground cursor-help">
                        ?
                      </div>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {beginnerMode ? stageItem.simpleDescription : stageItem.description}
                  </p>

                  {beginnerMode && isActive && (
                    <p className="text-xs text-primary/80 mt-2 italic">{stageItem.analogy}</p>
                  )}

                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                      className="h-1 bg-primary rounded-full mt-3"
                    />
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div
                  className={`absolute left-[37px] top-[76px] w-0.5 h-4 transition-colors ${
                    isComplete ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </motion.div>
          )
        })}

        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-4 p-4 rounded-lg border border-destructive bg-destructive/10"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-destructive bg-destructive/20">
              <X className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">
                {beginnerMode ? "Oops! Something went wrong" : "Transaction Failed"}
              </h3>
              <p className="text-sm text-destructive/80">
                {beginnerMode
                  ? "Don't worry! This happens sometimes. Try sending again."
                  : txData.error || "An error occurred"}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {stage === "confirmed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-4xl mb-2"
          >
            🎉
          </motion.div>
          <h3 className="font-semibold text-primary mb-1">
            {beginnerMode ? "Success! Your money arrived!" : "Transaction Confirmed"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {beginnerMode
              ? "Your transaction is now permanent and can't be changed"
              : "Transaction has been finalized on the blockchain"}
          </p>
        </motion.div>
      )}
    </Card>
  )
}

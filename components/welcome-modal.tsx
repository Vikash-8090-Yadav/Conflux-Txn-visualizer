"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Mail, Package, Truck, Home, CheckCircle2 } from "lucide-react"

interface WelcomeModalProps {
  onClose: () => void
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 bg-card border-primary/30 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-balance mb-2">Welcome to Conflux eSpace Learning!</h2>
                <p className="text-muted-foreground">Let's understand how digital money moves on Conflux eSpace, step by step</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Real-world analogy */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Think of it like sending a letter
                </h3>
                <div className="grid grid-cols-5 gap-2 text-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs">Write letter</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs">Seal envelope</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs">Mail it</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs">Delivered</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* What you'll learn */}
              <div>
                <h3 className="font-semibold mb-3">What you'll learn:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>How to create a digital wallet (like opening a bank account)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>How to send digital money to someone else</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>What happens behind the scenes when you send money</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Why blockchain is secure and trustworthy</span>
                  </li>
                </ul>
              </div>

              {/* Simple mode toggle info */}
              <div className="bg-secondary/20 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Beginner Mode is ON:</strong> We'll use simple language and hide
                  technical details. You can toggle this anytime in the top right corner.
                </p>
              </div>

              <Button onClick={onClose} className="w-full" size="lg">
                Let's Get Started!
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

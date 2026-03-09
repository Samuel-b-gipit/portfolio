"use client";

/**
 * Chat window component
 * Expandable panel with messages and input
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble, TypingIndicator } from "./message-bubble";
import { ChatInput } from "./chat-input";
import type { Message } from "@/lib/types/chat";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  suggestedPrompts?: string[];
}

export function ChatWindow({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  error,
  suggestedPrompts = [
    "What projects have you built?",
    "Tell me about your experience",
    "What technologies do you use?",
  ],
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Filter out system messages for display
  const displayMessages = messages.filter((msg) => msg.role !== "system");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-6 z-40 w-100 max-w-[calc(100vw-3rem)]"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="shadow-2xl overflow-hidden flex flex-col h-150 max-h-[80vh]">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <CardTitle className="text-lg font-semibold">
                Ask about Samuel
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {displayMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="text-muted-foreground mb-4">
                      <p className="text-sm mb-2">
                        Hi! I'm here to answer questions about Samuel's
                        projects, experience, and skills.
                      </p>
                      <p className="text-xs">Try one of these prompts:</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full max-w-sm">
                      {suggestedPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => onSendMessage(prompt)}
                          className="text-left justify-start h-auto py-2 px-3 whitespace-normal"
                          disabled={isLoading}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {displayMessages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}

                    {isLoading && <TypingIndicator />}

                    {error && (
                      <motion.div
                        className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">Error</p>
                          <p className="text-xs opacity-90">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </ScrollArea>

              {/* Input */}
              <ChatInput
                onSend={onSendMessage}
                isLoading={isLoading}
                disabled={!!error}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

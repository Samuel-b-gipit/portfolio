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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const prevMessageCountRef = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    userScrolledUp.current = distanceFromBottom > 50;
  };

  // Auto-scroll to bottom, but not if the user has manually scrolled up
  useEffect(() => {
    const currentCount = messages.length;
    const newMessageAdded = currentCount > prevMessageCountRef.current;
    prevMessageCountRef.current = currentCount;

    if (newMessageAdded) {
      // A new message was added — reset scroll tracking and jump to bottom
      userScrolledUp.current = false;
    }

    if (!userScrolledUp.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Filter out system messages for display
  const displayMessages = messages.filter((msg) => msg.role !== "system");

  // Only show the typing indicator while waiting for the first streaming chunk
  const lastMessage = displayMessages[displayMessages.length - 1];
  const showTypingIndicator =
    isLoading &&
    (!lastMessage ||
      lastMessage.role === "user" ||
      (lastMessage.role === "assistant" && !lastMessage.content));

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
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4"
              >
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
                    {displayMessages.map((message) => {
                      // Hide empty assistant messages while waiting for the first chunk
                      if (message.role === "assistant" && !message.content)
                        return null;
                      return (
                        <MessageBubble key={message.id} message={message} />
                      );
                    })}

                    {showTypingIndicator && <TypingIndicator />}

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
              </div>

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

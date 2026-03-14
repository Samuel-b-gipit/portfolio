"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Sparkles } from "lucide-react";
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

  useEffect(() => {
    const currentCount = messages.length;
    const newMessageAdded = currentCount > prevMessageCountRef.current;
    prevMessageCountRef.current = currentCount;

    if (newMessageAdded) userScrolledUp.current = false;

    if (!userScrolledUp.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const displayMessages = messages.filter((msg) => msg.role !== "system");

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
          className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          <div className="flex h-[min(600px,80vh)] flex-col overflow-hidden rounded-2xl border border-border/30 bg-background/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-cta)" }}
                >
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Ask about Samuel
                  </h3>
                  <p className="text-[10px] text-foreground/40">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-card/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-3"
            >
              {displayMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <p className="mb-1 text-sm text-foreground/50">
                    Hi! Ask me anything about Samuel&apos;s work.
                  </p>
                  <p className="mb-4 text-xs text-foreground/30">
                    Try one of these:
                  </p>

                  <div className="flex w-full max-w-sm flex-col gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => onSendMessage(prompt)}
                        disabled={isLoading}
                        className="whitespace-normal rounded-xl border border-border/30 bg-card/30 px-3 py-2 text-left text-xs text-foreground/60 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/50 hover:text-foreground disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {displayMessages.map((message) => {
                    if (message.role === "assistant" && !message.content)
                      return null;
                    return <MessageBubble key={message.id} message={message} />;
                  })}

                  {showTypingIndicator && <TypingIndicator />}

                  {error && (
                    <motion.div
                      className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <div>
                        <p className="font-medium">Error</p>
                        <p className="opacity-80">{error}</p>
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

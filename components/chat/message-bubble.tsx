"use client";

/**
 * Message bubble component
 * Displays individual chat messages with role-based styling
 */

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types/chat";

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export function MessageBubble({
  message,
  isLatest = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // Don't render system messages
  if (message.role === "system") {
    return null;
  }

  return (
    <motion.div
      className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "flex-1 max-w-[80%] rounded-lg px-4 py-2.5",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        <div className="text-sm whitespace-pre-wrap wrap-break-word">
          {message.content}
        </div>

        {/* Timestamp (optional) */}
        {message.createdAt && (
          <div
            className={cn(
              "text-xs mt-1 opacity-70",
              isUser ? "text-right" : "text-left",
            )}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Typing indicator for when assistant is generating a response
 */
export function TypingIndicator() {
  return (
    <motion.div
      className="flex gap-3 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="shrink-0 h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
        <Bot className="h-4 w-4" />
      </div>

      <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2.5">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-current"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

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

  if (message.role === "system") return null;

  return (
    <motion.div
      className={cn("flex gap-2.5 mb-3", isUser && "flex-row-reverse")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs",
          isUser
            ? "text-primary-foreground"
            : "border border-border/40 bg-card/60 text-foreground/60",
        )}
        style={isUser ? { background: "var(--gradient-cta)" } : undefined}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md text-primary-foreground"
            : "rounded-bl-md border border-border/30 bg-card/50 text-foreground/80 backdrop-blur-sm",
        )}
        style={isUser ? { background: "var(--gradient-cta)" } : undefined}
      >
        <div className="whitespace-pre-wrap wrap-break-word">
          {message.content}
        </div>

        {message.createdAt && (
          <div
            className={cn(
              "mt-1 text-[10px] opacity-50",
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

export function TypingIndicator() {
  return (
    <motion.div
      className="flex gap-2.5 mb-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="shrink-0 h-7 w-7 rounded-full border border-border/40 bg-card/60 text-foreground/60 flex items-center justify-center">
        <Bot className="h-3.5 w-3.5" />
      </div>

      <div className="rounded-2xl rounded-bl-md border border-border/30 bg-card/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-foreground/40"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

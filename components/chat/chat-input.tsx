"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  isLoading = false,
  placeholder = "Ask about Samuel's projects or experience...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled || isLoading) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = input.trim().length > 0 && !disabled && !isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-border/30 bg-background/50 p-3 backdrop-blur-sm"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-border/30 bg-card/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/30 backdrop-blur-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all min-h-10 max-h-25"
      />

      <motion.button
        type="submit"
        disabled={!canSend}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: canSend ? "var(--gradient-cta)" : "var(--color-muted)",
        }}
        whileHover={canSend ? { scale: 1.05 } : {}}
        whileTap={canSend ? { scale: 0.95 } : {}}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </motion.button>
    </form>
  );
}

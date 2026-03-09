/**
 * TypeScript types for chat functionality
 */

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatConfig {
  apiEndpoint: string;
  welcomeMessage?: string;
  suggestedPrompts?: string[];
  maxMessages?: number;
}

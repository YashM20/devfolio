"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { Send, MessageCircle, X, Bot, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Context for AI Assistant
type AiAssistantContextProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  messages: any[];
  sendMessage: (message: any) => void;
  setMessages: (messages: any[]) => void;
  error: any;
  onMessageSent?: (message: string) => void;
  onResponse?: (response: string) => void;
  onError?: (error: string) => void;
};

const AiAssistantContext = React.createContext<AiAssistantContextProps | null>(
  null
);

function useAiAssistant() {
  const context = React.useContext(AiAssistantContext);
  if (!context) {
    throw new Error(
      "useAiAssistant must be used within an AiAssistantProvider."
    );
  }
  return context;
}

// Provider component
interface AiAssistantProviderProps {
  children: React.ReactNode;
  onMessageSent?: (message: string) => void;
  onResponse?: (response: string) => void;
  onError?: (error: string) => void;
}

function AiAssistantProvider({
  children,
  onMessageSent,
  onResponse,
  onError,
}: AiAssistantProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  const { messages, sendMessage, setMessages, error } = useChat({
    onFinish: () => {
      setIsTyping(false);
      // Extract the last assistant message content
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        if (lastMessage.parts) {
          const textParts = lastMessage.parts
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join("");
          onResponse?.(textParts);
        }
      }
    },
    onError: (error) => {
      setIsTyping(false);
      onError?.(error.message);
    },
  });

  const contextValue = React.useMemo<AiAssistantContextProps>(
    () => ({
      isOpen,
      setIsOpen,
      isTyping,
      setIsTyping,
      messages,
      sendMessage,
      setMessages,
      error,
      onMessageSent,
      onResponse,
      onError,
    }),
    [
      isOpen,
      setIsOpen,
      isTyping,
      setIsTyping,
      messages,
      sendMessage,
      setMessages,
      error,
      onMessageSent,
      onResponse,
      onError,
    ]
  );

  return (
    <AiAssistantContext.Provider value={contextValue}>
      {children}
    </AiAssistantContext.Provider>
  );
}

// Trigger button variants
const aiAssistantTriggerVariants = cva(
  "focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground border",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      position: {
        "bottom-right": "absolute bottom-4 right-4 z-50",
        "bottom-center": "absolute bottom-4 left-1/2 z-50 -translate-x-1/2",
        "bottom-left": "absolute bottom-4 left-4 z-50",
        "top-right": "absolute right-4 top-4 z-50",
        "top-center": "absolute left-1/2 top-4 z-50 -translate-x-1/2",
        "top-left": "absolute left-4 top-4 z-50",
        static: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  }
);

// Trigger component
interface AiAssistantTriggerProps
  extends VariantProps<typeof aiAssistantTriggerVariants> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  value?: string | ReadonlyArray<string> | number;
  autoFocus?: boolean;
  tabIndex?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  id?: string;
  title?: string;
  role?: string;
  style?: React.CSSProperties;
}

function AiAssistantTrigger({
  className,
  variant,
  size,
  position,
  asChild = false,
  children,
  ...props
}: AiAssistantTriggerProps) {
  const { isOpen, setIsOpen } = useAiAssistant();

  if (isOpen) return null;

  const handleClick = () => setIsOpen(true);

  if (asChild) {
    return (
      <Slot
        className={cn(
          aiAssistantTriggerVariants({ variant, size, position, className })
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={cn(
        aiAssistantTriggerVariants({ variant, size, position, className })
      )}
      onClick={handleClick}
      {...props}
    >
      {children || (
        <>
          <MessageCircle className="h-4 w-4" />
          Chat
        </>
      )}
    </motion.button>
  );
}

// Chat container variants
const aiAssistantChatVariants = cva(
  "bg-background flex flex-col overflow-hidden rounded-lg border shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent shadow-none",
        outline: "border-2",
      },
      size: {
        default: "h-[32rem] w-96",
        sm: "h-80 w-80",
        lg: "h-[40rem] w-[28rem]",
        full: "h-full w-full",
      },
      position: {
        "bottom-right": "fixed bottom-4 right-4 z-50",
        "bottom-center": "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        "bottom-left": "fixed bottom-4 left-4 z-50",
        "top-right": "fixed right-4 top-4 z-50",
        "top-center": "fixed left-1/2 top-4 z-50 -translate-x-1/2",
        "top-left": "fixed left-4 top-4 z-50",
        static: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  }
);

// Chat container component
interface AiAssistantChatProps
  extends React.ComponentProps<typeof motion.div>,
    VariantProps<typeof aiAssistantChatVariants> {}

function AiAssistantChat({
  className,
  variant,
  size,
  position,
  children,
  ...props
}: AiAssistantChatProps) {
  const { isOpen } = useAiAssistant();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className={cn(
          aiAssistantChatVariants({ variant, size, position }),
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Header component
function AiAssistantHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-muted/50 flex items-center justify-between border-b p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Header title component
function AiAssistantHeaderTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <h3 className="font-semibold">{children || "AI Assistant"}</h3>
    </div>
  );
}

// Header actions component
function AiAssistantHeaderActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { setMessages, setIsOpen } = useAiAssistant();

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children || (
        <>
          <button
            onClick={() => setMessages([])}
            className="hover:bg-accent rounded p-1 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-accent rounded p-1 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

// Messages container component
function AiAssistantMessages({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { messages } = useAiAssistant();

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={cn(
        "flex h-80 flex-1 flex-col space-y-4 overflow-y-auto p-4",
        className
      )}
      {...props}
    >
      {children}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Empty state component
function AiAssistantEmptyState({
  className,
  children,
  suggestions = [],
  ...props
}: React.ComponentProps<"div"> & { suggestions?: string[] }) {
  const { messages } = useAiAssistant();

  if (messages.length > 0) return null;

  return (
    <div className={cn("py-8 text-center", className)} {...props}>
      {children || (
        <>
          <Bot className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground mb-4">
            Hi! How can I help you today?
          </p>
          {suggestions.length > 0 && (
            <AiAssistantSuggestions suggestions={suggestions} />
          )}
        </>
      )}
    </div>
  );
}

// Suggestions component
function AiAssistantSuggestions({
  suggestions,
  className,
  ...props
}: React.ComponentProps<"div"> & { suggestions: string[] }) {
  const { isTyping, sendMessage, onMessageSent } = useAiAssistant();

  const handleSuggestionClick = (suggestion: string) => {
    if (isTyping) return;
    onMessageSent?.(suggestion);
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: suggestion }],
    });
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <p className="text-muted-foreground mb-2 text-sm">Try asking:</p>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          className="hover:bg-accent block w-full rounded border p-2 text-left text-sm transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

// Message list component
function AiAssistantMessageList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { messages, isTyping, error } = useAiAssistant();

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {messages.map((message, index) => (
        <AiAssistantMessage key={message.id || index} message={message} />
      ))}
      {isTyping && <AiAssistantTypingIndicator />}
      {error && <AiAssistantError error={error} />}
    </div>
  );
}

// Individual message component
function AiAssistantMessage({
  message,
  className,
  ...props
}: React.ComponentProps<typeof motion.div> & { message: any }) {
  // Helper function to render message content
  const renderMessageContent = (message: any) => {
    if (message.parts) {
      return message.parts
        .filter((part: any) => part.type === "text")
        .map((part: any, i: number) => (
          <div key={i} className="whitespace-pre-wrap">
            {part.text}
          </div>
        ));
    }
    return <div className="whitespace-pre-wrap">{message.content || ""}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        message.role === "user" ? "justify-end" : "justify-start",
        className
      )}
      {...props}
    >
      {message.role === "assistant" && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {renderMessageContent(message)}
      </div>

      {message.role === "user" && (
        <div className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}

// Typing indicator component
function AiAssistantTypingIndicator({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex gap-3", className)}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-muted rounded-lg px-3 py-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-2 w-2 rounded-full bg-current"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Error component
function AiAssistantError({
  error,
  className,
  ...props
}: React.ComponentProps<"div"> & { error: any }) {
  return (
    <div
      className={cn(
        "border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm",
        className
      )}
      {...props}
    >
      {error.message}
    </div>
  );
}

// Input form component
function AiAssistantInput({
  placeholder = "Ask me anything...",
  maxLength = 1000,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  placeholder?: string;
  maxLength?: number;
}) {
  const { isTyping, sendMessage, onMessageSent } = useAiAssistant();
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const message = input.trim();
    onMessageSent?.(message);
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: message }],
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("border-t p-4", className)}
      {...props}
    >
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring max-h-[120px] min-h-[44px] w-full resize-none rounded-lg border p-3 pr-12 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isTyping}
            rows={1}
          />
          {input.length > maxLength * 0.8 && (
            <div className="text-muted-foreground absolute bottom-2 right-2 text-xs">
              {input.length}/{maxLength}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

// Main AI Assistant component that combines everything
interface AiAssistantProps extends Omit<AiAssistantProviderProps, "children"> {
  children?: React.ReactNode;
  triggerProps?: Partial<AiAssistantTriggerProps>;
  chatProps?: Partial<AiAssistantChatProps>;
  title?: string;
  placeholder?: string;
  suggestions?: string[];
  maxInputLength?: number;
}

function AiAssistant({
  children,
  triggerProps = {},
  chatProps = {},
  title = "AI Assistant",
  placeholder = "Ask me anything...",
  suggestions = [],
  maxInputLength = 1000,
  ...providerProps
}: AiAssistantProps) {
  return (
    <AiAssistantProvider {...providerProps}>
      {children || (
        <>
          <AiAssistantTrigger {...triggerProps} />
          <AiAssistantChat {...chatProps}>
            <AiAssistantHeader>
              <AiAssistantHeaderTitle>{title}</AiAssistantHeaderTitle>
              <AiAssistantHeaderActions />
            </AiAssistantHeader>
            <AiAssistantMessages>
              <AiAssistantEmptyState suggestions={suggestions} />
              <AiAssistantMessageList />
            </AiAssistantMessages>
            <AiAssistantInput
              placeholder={placeholder}
              maxLength={maxInputLength}
            />
          </AiAssistantChat>
        </>
      )}
    </AiAssistantProvider>
  );
}

export {
  AiAssistant,
  AiAssistantProvider,
  AiAssistantTrigger,
  AiAssistantChat,
  AiAssistantHeader,
  AiAssistantHeaderTitle,
  AiAssistantHeaderActions,
  AiAssistantMessages,
  AiAssistantEmptyState,
  AiAssistantSuggestions,
  AiAssistantMessageList,
  AiAssistantMessage,
  AiAssistantTypingIndicator,
  AiAssistantError,
  AiAssistantInput,
  useAiAssistant,
};

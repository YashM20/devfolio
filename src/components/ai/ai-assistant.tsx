"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { useQueryState, parseAsBoolean } from "nuqs";
import {
  Send,
  MessageCircle,
  X,
  Sparkles,
  User,
  Bot,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RealismButton, Markdown } from "@/components/common";
import { USER } from "@/data/user";
import { cn } from "@/lib/utils";
import { posthogEvents, generateAIChatSessionId } from "@/lib/posthog-events";

const MAX_INPUT_LENGTH = 1024;
const WARNING_THRESHOLD = MAX_INPUT_LENGTH - 128;

export function AiAssistant() {
  const [isOpen, setIsOpen] = useQueryState(
    "ai",
    parseAsBoolean.withDefault(false)
  );
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => generateAIChatSessionId());
  const messageStartTimeRef = useRef<number | null>(null);

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, setMessages } = useChat({
    onFinish: () => {
      console.log("✅ Chat onFinish called");
      setIsTyping(false);
      setError(null);

      // Track response received
      if (messageStartTimeRef.current) {
        const responseTime = Date.now() - messageStartTimeRef.current;
        posthogEvents.ai.responseReceived(responseTime, undefined, sessionId);
        messageStartTimeRef.current = null;
      }
    },
    onError: (error: any) => {
      console.log("❌ Chat onError called:", error);
      setIsTyping(false);

      let errorMessage = "Something went wrong. Please try again.";

      // Try to extract error message from the response
      if (error.message) {
        try {
          // Check if the error message is a JSON string
          const parsedError = JSON.parse(error.message);
          if (parsedError.error) {
            errorMessage = parsedError.error;
          } else {
            errorMessage = error.message;
          }
        } catch {
          // If parsing fails, use the original message
          errorMessage = error.message;
        }
      }

      // Handle specific error cases
      if (errorMessage.includes("Daily message limit reached")) {
        errorMessage =
          "⏰ Daily message limit reached (100 messages per day). Please try again tomorrow.";
      } else if (errorMessage.includes("Daily global message limit reached")) {
        errorMessage =
          "🌐 Daily global message limit reached. Please try again tomorrow.";
      } else if (errorMessage.includes("Rate limit")) {
        errorMessage =
          "⚡ Too many requests. Please wait a moment and try again.";
      }

      setError(errorMessage);
      console.error("Chat error:", error);

      // Track error
      let errorType = "unknown_error";
      if (errorMessage.includes("Daily message limit")) {
        errorType = "daily_limit_reached";
      } else if (errorMessage.includes("Daily global message limit")) {
        errorType = "global_limit_reached";
      } else if (errorMessage.includes("Rate limit")) {
        errorType = "rate_limit";
      }

      posthogEvents.ai.responseError(errorType, sessionId);
      messageStartTimeRef.current = null;
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "44px"; // Reset to min height
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 128; // max-h-32 = 128px
      textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [input]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "44px"; // Reset to min height
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 128; // max-h-32 = 128px
      textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [input]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open chat with Ctrl/Cmd + I
      if ((e.ctrlKey || e.metaKey) && e.key === "i" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
      // Close chat with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Track chat open/close events
  useEffect(() => {
    if (isOpen) {
      posthogEvents.ai.chatOpened({ session_id: sessionId });
    } else if (!isOpen && messages.length > 0) {
      posthogEvents.ai.chatClosed({
        conversation_length: messages.length,
        session_id: sessionId,
      });
    }
  }, [isOpen, sessionId, messages.length]);

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("🚀 Form submit triggered - input:", input);
    e.preventDefault();

    if (!input.trim()) {
      console.log("⚠️ Form submit blocked - empty input");
      return;
    }

    if (input.trim().length > MAX_INPUT_LENGTH) {
      console.log("⚠️ Form submit blocked - input too long");
      setError(
        `Message is too long. Please keep it under ${MAX_INPUT_LENGTH} characters.`
      );
      return;
    }

    if (isTyping) {
      console.log("⚠️ Form submit blocked - already typing");
      return;
    }

    console.log("✅ Form submit proceeding - calling sendMessage");
    setError(null); // Clear any previous errors
    setIsTyping(true);
    messageStartTimeRef.current = Date.now();

    // Track message sent
    posthogEvents.ai.messageSent(input.length, messages.length, sessionId);

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
    // Allow Shift+Enter for new lines (default behavior)
  };

  const handleClearChat = () => {
    console.log("🗑️ Clear chat triggered");

    // Track chat cleared
    posthogEvents.ai.chatCleared(messages.length, sessionId);

    setMessages([]);
    setError(null);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isTyping) {
      console.log("⚠️ Suggestion blocked - already typing");
      return;
    }

    setError(null);
    setIsTyping(true);
    messageStartTimeRef.current = Date.now();

    // Track suggestion clicked
    posthogEvents.ai.suggestionClicked(suggestion, sessionId);

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: suggestion }],
    });
  };

  const suggestions = [
    "What's Yash's experience?",
    "Tell me about his projects",
    "Show me his tech stack",
    "Reveal project case studies",
    "What are his key achievements?",
    "Dive into his developer journey",
  ];

  return (
    <>
      {/* Floating Chat Button - Bottom Center */}
      <motion.div
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1,
        }}
      >
        <div className={cn(isOpen && "hidden")}>
          <RealismButton onClick={() => setIsOpen(true)}>Ask Me</RealismButton>
        </div>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="z-1 absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            ></motion.div>

            {/* Chat Container */}
            <motion.div
              className={cn(
                "z-2 relative flex h-full max-h-[98vh] w-full max-w-[clamp(300px,800px,95vw)] flex-col",
                "bg-background/95 border-border border backdrop-blur-md dark:border-white/10 dark:bg-[radial-gradient(circle_200px_at_50%_0%,#1a1a1a,#0a0a0a)]",
                "overflow-hidden rounded-3xl shadow-2xl"
              )}
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 50,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 50,
                filter: "blur(10px)",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Header */}
              <div className="border-border bg-muted/50 flex items-center justify-between border-b p-4 dark:border-white/5 dark:bg-gradient-to-r dark:from-white/5 dark:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="border-primary/30 h-10 w-10 border-2 dark:border-cyan-400/30">
                      <AvatarImage src={USER.avatar} alt={USER.displayName} />
                      <AvatarFallback className="from-primary to-primary/80 text-primary-foreground bg-gradient-to-br dark:from-cyan-500 dark:to-blue-500">
                        {USER.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="border-background absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 bg-green-500 dark:border-black dark:bg-cyan-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold">
                      AI Assistant
                    </h3>
                    <p className="text-muted-foreground text-sm dark:text-cyan-300/70">
                      Ask me about {USER.firstName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearChat}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted dark:text-white/70 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-300"
                      title="Clear chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted dark:text-white/70 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-300"
                    title="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="relative flex h-full max-h-full w-full overflow-hidden">
                <ScrollArea className="w-full">
                  <div className="w-full space-y-4 overflow-x-auto p-4">
                    {messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="px-4 py-8 text-center"
                      >
                        <div className="relative mb-6">
                          <div className="from-primary/20 to-primary/10 absolute inset-0 rounded-full bg-gradient-to-r blur-2xl dark:from-cyan-400/20 dark:to-blue-500/20" />
                          <Sparkles className="text-primary relative z-10 mx-auto h-12 w-12 dark:text-cyan-400" />
                        </div>

                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                          Hi! I&apos;m {USER.firstName}&apos;s AI assistant
                        </h3>
                        <p className="text-muted-foreground mb-6 text-sm">
                          Ask me anything about his experience, projects, or
                          skills!
                        </p>

                        <div className="mb-6 space-y-3">
                          <p className="text-primary/60 text-xs font-medium dark:text-cyan-300/60">
                            Try asking:
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {suggestions.map((suggestion, index) => (
                              <motion.button
                                key={suggestion}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                className="from-primary/20 to-primary/10 border-primary/30 text-primary hover:from-primary/30 hover:to-primary/20 hover:border-primary/50 rounded-full border bg-gradient-to-r px-3 py-1.5 text-xs transition-all duration-200 hover:scale-105 dark:border-cyan-400/30 dark:from-cyan-500/20 dark:to-blue-500/20 dark:text-cyan-300 dark:hover:border-cyan-400/50 dark:hover:from-cyan-500/30 dark:hover:to-blue-500/30"
                              >
                                {suggestion}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div className="text-muted-foreground space-y-2 text-xs">
                          <p>💡 Tips:</p>
                          <div className="space-y-1 text-center">
                            <p>
                              • Press{" "}
                              <kbd className="bg-muted border-border rounded border px-1.5 py-0.5 text-xs">
                                Ctrl+I
                              </kbd>{" "}
                              to quickly open this chat
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {messages.map((message: any, index: number) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "flex w-full gap-3",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="border-primary/30 h-8 w-8 border dark:border-cyan-400/30">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-xs text-white dark:from-emerald-500 dark:to-emerald-900">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "min-w-0 max-w-[85%] overflow-hidden rounded-2xl px-4 py-3 text-sm",
                            message.role === "user"
                              ? "from-primary/20 to-primary/10 text-foreground border-primary/30 border bg-gradient-to-r dark:border-cyan-400/30 dark:from-cyan-500/20 dark:to-blue-500/20"
                              : "bg-muted/50 text-foreground border-border border dark:border-white/10 dark:bg-gradient-to-r dark:from-white/10 dark:to-white/5"
                          )}
                        >
                          {message.parts ? (
                            message.parts
                              .filter((part: any) => {
                                // Filter out step-related parts and empty content
                                if (typeof part === "object" && part.type) {
                                  return (
                                    !part.type.includes("step") &&
                                    part.type !== "tool-result" &&
                                    !part.type.startsWith("tool-")
                                  );
                                }
                                return true;
                              })
                              .map((part: any, i: number) => {
                                switch (part.type) {
                                  case "text":
                                    return message.role === "assistant" ? (
                                      <div
                                        key={i}
                                        className="prose prose-sm dark:prose-invert min-w-0 max-w-none"
                                        style={{
                                          wordBreak: "break-word",
                                          overflowWrap: "anywhere",
                                        }}
                                      >
                                        <Markdown>{part.text}</Markdown>
                                      </div>
                                    ) : (
                                      <p
                                        key={i}
                                        className="whitespace-pre-wrap"
                                      >
                                        {part.text}
                                      </p>
                                    );
                                  case "tool-call":
                                    return (
                                      <div
                                        key={i}
                                        className="mb-1 mt-2 text-xs opacity-70"
                                      >
                                        <div className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                                          <span className="animate-spin">
                                            ⚙️
                                          </span>
                                          <span>Using {part.toolName}...</span>
                                        </div>
                                      </div>
                                    );
                                  case "tool-result":
                                    // Don't show tool results in UI, they're used internally
                                    return null;
                                  case "tool-searchProjects":
                                  case "tool-searchBlogPosts":
                                  case "tool-getTechStack":
                                  case "tool-getExperience":
                                  case "tool-generateCodeSnippet":
                                    return (
                                      <div
                                        key={i}
                                        className="mt-2 text-xs opacity-70"
                                      >
                                        <details>
                                          <summary>🔧 Tool Call</summary>
                                          <pre className="mt-1 overflow-auto text-xs">
                                            {JSON.stringify(part, null, 2)}
                                          </pre>
                                        </details>
                                      </div>
                                    );
                                  case "step-start":
                                  case "step-finish":
                                    // Hide step markers from UI - they're used for internal processing
                                    return null;
                                  default:
                                    // Only show non-step content to users
                                    if (
                                      typeof part === "object" &&
                                      part.type &&
                                      part.type.includes("step")
                                    ) {
                                      return null; // Hide any step-related content
                                    }

                                    return (
                                      <div key={i}>
                                        {typeof part === "string" ? (
                                          message.role === "assistant" ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
                                              <Markdown>{part}</Markdown>
                                            </div>
                                          ) : (
                                            <p className="whitespace-pre-wrap">
                                              {part}
                                            </p>
                                          )
                                        ) : (
                                          // Only show non-step objects
                                          !part.type?.includes("step") && (
                                            <p className="whitespace-pre-wrap">
                                              {JSON.stringify(part)}
                                            </p>
                                          )
                                        )}
                                      </div>
                                    );
                                }
                              })
                          ) : message.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
                              <Markdown>{message.content}</Markdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                        </div>

                        {message.role === "user" && (
                          <Avatar className="border-primary/30 h-8 w-8 border dark:border-cyan-400/30">
                            <AvatarFallback className="from-primary to-primary/80 text-primary-foreground bg-gradient-to-br text-xs dark:from-cyan-500 dark:to-blue-900">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <Avatar className="border-primary/30 h-8 w-8 border dark:border-white/20">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-xs text-white dark:from-purple-500 dark:to-blue-500">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted/50 text-foreground border-border rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-black/20">
                          <motion.div
                            className="flex gap-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <span>●</span>
                            <span>●</span>
                            <span>●</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <Avatar className="h-8 w-8 border border-red-400/20">
                          <AvatarFallback className="bg-red-500/20 text-xs text-red-400 dark:text-red-400">
                            <X className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                          <p className="text-sm">{error}</p>
                          <button
                            onClick={() => setError(null)}
                            className="mt-2 text-xs text-red-600 underline hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
                          >
                            Dismiss
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Progressive Blur Overlays */}
                <div className="from-background/40 via-background/20 pointer-events-none absolute -top-1 left-0 right-0 z-10 h-2 bg-gradient-to-bl to-transparent backdrop-blur-sm dark:from-black/40 dark:via-black/20 dark:to-transparent" />
                <div className="from-background/40 via-background/20 pointer-events-none absolute -bottom-1 left-0 right-0 z-10 h-2 bg-gradient-to-tr to-transparent backdrop-blur-sm dark:from-black/40 dark:via-black/20 dark:to-transparent" />
              </div>

              {/* Input */}
              <div className="border-border bg-muted/50 flex border-t p-4 dark:border-white/5 dark:bg-gradient-to-r dark:from-white/5 dark:to-transparent">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex w-full items-end gap-2"
                >
                  <div className="relative flex-1">
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= MAX_INPUT_LENGTH) {
                          setInput(newValue);
                          if (error && error.includes("too long")) {
                            setError(null);
                          }
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything... "
                      className={cn(
                        "bg-background/50 border-border text-foreground placeholder:text-muted-foreground h-10 max-h-32 resize-none dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/50",
                        "focus:border-primary/20 focus:ring-0 dark:focus:border-white/20",
                        "rounded-2xl px-4 py-3 transition-all duration-200",
                        input.length >= WARNING_THRESHOLD &&
                          "border-yellow-400/50 dark:border-yellow-400/50",
                        input.length >= MAX_INPUT_LENGTH &&
                          "border-red-400/50 dark:border-red-400/50"
                      )}
                      disabled={isTyping}
                      autoComplete="off"
                      spellCheck="false"
                      data-testid="chat-input"
                      rows={1}
                      maxLength={MAX_INPUT_LENGTH}
                    />
                    {input.trim() && input.length > WARNING_THRESHOLD / 1.5 && (
                      <div
                        className={cn(
                          "absolute bottom-2 right-2 text-xs",
                          input.length >= WARNING_THRESHOLD &&
                            input.length < MAX_INPUT_LENGTH &&
                            "text-yellow-500 dark:text-yellow-400",
                          input.length >= MAX_INPUT_LENGTH &&
                            "text-red-500 dark:text-red-400",
                          input.length < WARNING_THRESHOLD &&
                            "text-muted-foreground"
                        )}
                      >
                        {input.length}/{MAX_INPUT_LENGTH}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isTyping || !input.trim()}
                    className={cn(
                      "relative transform-gpu cursor-pointer rounded-full border-none p-[1.5px] text-[1rem]",
                      "bg-[radial-gradient(circle_40px_at_80%_-10%,#ffffff,#181b1b)] dark:bg-[radial-gradient(circle_40px_at_80%_-10%,#ffffff,#181b1b)]",
                      "transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.99]",
                      "hover:shadow-[0_8px_30px_rgba(0,81,255,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,225,255,0.12)]",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "h-10 w-10"
                    )}
                    onClick={() => console.log("📤 Send button clicked")}
                  >
                    <div className="absolute bottom-0 left-0 h-full w-[40px] rounded-full bg-[radial-gradient(circle_30px_at_0%_100%,#3fe9ff,#0000ff80,transparent)] shadow-[-6px_6px_15px_#0051ff1a]" />

                    <div className="relative z-[3] flex items-center justify-center rounded-full bg-[radial-gradient(circle_40px_at_80%_-50%,#777777,#0f1111)] px-[10px] py-[10px] font-medium text-white">
                      <span className="absolute left-0 top-0 h-full w-full rounded-full bg-[radial-gradient(circle_30px_at_0%_100%,#00e1ff1a,#0000ff11,transparent)]" />
                      <Send className="relative z-10 h-4 w-4" />
                    </div>

                    <div className="absolute right-0 top-0 z-[-1] h-[50%] w-[55%] rounded-[80px] shadow-[0_0_15px_#ffffff25]" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

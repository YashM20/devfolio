'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useChat } from 'ai/react'
import { Send, MessageCircle, X, Sparkles, User, Bot, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { RealismButton } from '@/components/common'
import { USER } from '@/data/user'
import { cn } from '@/lib/utils'

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  console.log('🔍 AiAssistant render - isOpen:', isOpen, 'isTyping:', isTyping, 'error:', error)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onFinish: () => {
      console.log('✅ Chat onFinish called')
      setIsTyping(false)
      setError(null)
    },
    onResponse: () => {
      console.log('📨 Chat onResponse called')
      setIsTyping(true)
      setError(null)
    },
    onError: async (error) => {
      console.log('❌ Chat onError called:', error)
      setIsTyping(false)
      
      let errorMessage = 'Something went wrong. Please try again.'
      
      // Try to extract error message from the response
      if (error.message) {
        try {
          // Check if the error message is a JSON string
          const parsedError = JSON.parse(error.message)
          if (parsedError.error) {
            errorMessage = parsedError.error
          } else {
            errorMessage = error.message
          }
        } catch {
          // If parsing fails, use the original message
          errorMessage = error.message
        }
      }
      
      // Handle specific error cases
      if (errorMessage.includes('Daily message limit reached')) {
        errorMessage = '⏰ Daily message limit reached (100 messages per day). Please try again tomorrow.'
      } else if (errorMessage.includes('Daily global message limit reached')) {
        errorMessage = '🌐 Daily global message limit reached. Please try again tomorrow.'
      } else if (errorMessage.includes('Rate limit')) {
        errorMessage = '⚡ Too many requests. Please wait a moment and try again.'
      }
      
      setError(errorMessage)
      console.error('Chat error:', error)
    },
  })

  console.log('🔍 useChat state - messages:', messages.length, 'input:', input, 'isLoading:', isLoading)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open chat with Ctrl/Cmd + /
      if ((e.ctrlKey || e.metaKey) && e.key === '/' && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
      }
      // Close chat with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log('🚀 Form submit triggered - input:', input, 'isLoading:', isLoading)
    e.preventDefault()
    
    if (!input.trim()) {
      console.log('⚠️ Form submit blocked - empty input')
      return
    }
    
    if (isLoading) {
      console.log('⚠️ Form submit blocked - already loading')
      return
    }
    
    console.log('✅ Form submit proceeding - calling handleSubmit')
    setError(null) // Clear any previous errors
    setIsTyping(true)
    handleSubmit(e)
  }

  const handleClearChat = () => {
    console.log('🗑️ Clear chat triggered')
    setMessages([])
    setError(null)
    setIsTyping(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Simulate typing the suggestion
    handleInputChange({ target: { value: suggestion } } as any)
    // Auto-submit the suggestion
    setTimeout(() => {
      const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true })
      handleFormSubmit(syntheticEvent as any)
    }, 100)
  }

  const suggestions = [
    "What's Yash's experience?",
    "Tell me about his projects",
    "What technologies does he use?",
    "Show me his latest work"
  ]

  return (
    <>
      {/* Floating Chat Button - Bottom Center */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1
        }}
      >
        <div className={cn(isOpen && "hidden")}>
          <RealismButton onClick={() => setIsOpen(true)}>
            Ask Me
          </RealismButton>
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
              className="absolute inset-0 bg-black/20 dark:bg-black/20 backdrop-blur-sm z-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            ></motion.div>

            {/* Chat Container */}
            <motion.div
              className={cn(
                "flex flex-col relative w-full max-w-md max-h-[90vh] z-2",
                "bg-background/95 dark:bg-[radial-gradient(circle_200px_at_50%_0%,#1a1a1a,#0a0a0a)] backdrop-blur-md border border-border dark:border-white/10",
                "rounded-3xl shadow-2xl overflow-hidden",
              )}
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50,
                filter: "blur(10px)"
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50,
                filter: "blur(10px)"
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border dark:border-white/5 bg-muted/50 dark:bg-gradient-to-r dark:from-white/5 dark:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-primary/30 dark:border-cyan-400/30">
                      <AvatarImage src={USER.avatar} alt={USER.displayName} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 dark:from-cyan-500 dark:to-blue-500 text-primary-foreground">
                        {USER.displayName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 dark:bg-cyan-400 rounded-full border-2 border-background dark:border-black"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Assistant</h3>
                    <p className="text-sm text-muted-foreground dark:text-cyan-300/70">Ask me about {USER.firstName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearChat}
                      className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-cyan-300 hover:bg-muted dark:hover:bg-cyan-400/10"
                      title="Clear chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-cyan-300 hover:bg-muted dark:hover:bg-cyan-400/10"
                    title="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex relative w-full max-h-[100%] overflow-hidden">
                <ScrollArea className="w-full">
                  <div className="space-y-4 p-4">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center py-8 px-4"
                    >
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 dark:from-cyan-400/20 dark:to-blue-500/20 rounded-full blur-2xl" />
                        <Sparkles className="h-12 w-12 mx-auto text-primary dark:text-cyan-400 relative z-10" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Hi! I'm {USER.firstName}'s AI assistant
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Ask me anything about his experience, projects, or skills!
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <p className="text-xs text-primary/60 dark:text-cyan-300/60 font-medium">Try asking:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {suggestions.map((suggestion, index) => (
                            <motion.button
                              key={suggestion}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 text-xs bg-gradient-to-r from-primary/20 to-primary/10 dark:from-cyan-500/20 dark:to-blue-500/20 
                                       border border-primary/30 dark:border-cyan-400/30 rounded-full text-primary dark:text-cyan-300 
                                       hover:from-primary/30 hover:to-primary/20 dark:hover:from-cyan-500/30 dark:hover:to-blue-500/30 hover:border-primary/50 dark:hover:border-cyan-400/50
                                       transition-all duration-200 hover:scale-105"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        💡 Tip: Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Ctrl+/</kbd> to quickly open this chat
                      </p>
                    </motion.div>
                  )}
                  
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 border border-primary/30 dark:border-cyan-400/30">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-500 dark:to-emerald-900 text-white text-xs">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                          message.role === 'user'
                            ? "bg-gradient-to-r from-primary/20 to-primary/10 dark:from-cyan-500/20 dark:to-blue-500/20 text-foreground border border-primary/30 dark:border-cyan-400/30"
                            : "bg-muted/50 dark:bg-gradient-to-r dark:from-white/10 dark:to-white/5 text-foreground border border-border dark:border-white/10"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 border border-primary/30 dark:border-cyan-400/30">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 dark:from-cyan-500 dark:to-blue-900 text-primary-foreground text-xs">
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
                      <Avatar className="h-8 w-8 border border-primary/30 dark:border-white/20">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-500 dark:to-blue-500 text-white text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted/50 dark:bg-black/20 text-foreground border border-border dark:border-white/10 rounded-2xl px-4 py-3">
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
                        <AvatarFallback className="bg-red-500/20 text-red-400 dark:text-red-400 text-xs">
                          <X className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-400/20 rounded-2xl px-4 py-3 max-w-[80%]">
                        <p className="text-sm">{error}</p>
                        <button
                          onClick={() => setError(null)}
                          className="text-xs text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100 mt-2 underline"
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
                <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none z-10
                               bg-gradient-to-bl from-background/40 via-background/20 to-transparent dark:from-black/40 dark:via-black/20 dark:to-transparent backdrop-blur-sm" />
                <div className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none z-10
                               bg-gradient-to-tr from-background/40 via-background/20 to-transparent dark:from-black/40 dark:via-black/20 dark:to-transparent backdrop-blur-sm" />
              </div>

              {/* Input */}
              <div className="flex p-4 border-t border-border dark:border-white/5 bg-muted/50 dark:bg-gradient-to-r dark:from-white/5 dark:to-transparent">
                <form onSubmit={handleFormSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything..."
                    className={cn(
                      "flex-1 bg-background/50 dark:bg-white/5 border-border dark:border-white/10 text-foreground placeholder:text-muted-foreground dark:placeholder:text-white/50",
                      "focus:border-primary/20 dark:focus:border-white/20 focus:ring-0",
                      "rounded-2xl transition-all duration-200"
                    )}
                    disabled={isLoading}
                    autoComplete="off"
                    spellCheck="false"
                    data-testid="chat-input"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "relative cursor-pointer rounded-full border-none p-[1.5px] text-[1rem] transform-gpu",
                      "bg-[radial-gradient(circle_40px_at_80%_-10%,#ffffff,#181b1b)] dark:bg-[radial-gradient(circle_40px_at_80%_-10%,#ffffff,#181b1b)]",
                      "transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.99]",
                      "hover:shadow-[0_8px_30px_rgba(0,81,255,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,225,255,0.12)]",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "h-10 w-10"
                    )}
                    onClick={() => console.log('📤 Send button clicked')}
                  >
                    <div
                      className="absolute left-0 bottom-0 h-full w-[40px] rounded-full
                                 bg-[radial-gradient(circle_30px_at_0%_100%,#3fe9ff,#0000ff80,transparent)]
                                 shadow-[-6px_6px_15px_#0051ff1a]"
                    />

                    <div
                      className="relative z-[3] rounded-full px-[10px] py-[10px] text-white font-medium
                                 bg-[radial-gradient(circle_40px_at_80%_-50%,#777777,#0f1111)]
                                 flex items-center justify-center"
                    >
                      <span className="absolute left-0 top-0 h-full w-full rounded-full
                                       bg-[radial-gradient(circle_30px_at_0%_100%,#00e1ff1a,#0000ff11,transparent)]" />
                      <Send className="h-4 w-4 relative z-10" />
                    </div>

                    <div
                      className="absolute top-0 right-0 z-[-1] h-[50%] w-[55%] rounded-[80px]
                                 shadow-[0_0_15px_#ffffff25]"
                    />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 
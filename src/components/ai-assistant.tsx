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
    onError: (error) => {
      console.log('❌ Chat onError called:', error)
      setIsTyping(false)
      setError(error.message || 'Something went wrong. Please try again.')
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
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Container */}
            <motion.div
              className={cn(
                "flex flex-col relative w-full max-w-md h-fit md:h-[700px] z-2",
                "bg-[radial-gradient(circle_200px_at_50%_0%,#1a1a1a,#0a0a0a)] backdrop-blur-md border border-white/10",
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
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-cyan-400/30">
                      <AvatarImage src={USER.avatar} alt={USER.displayName} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                        {USER.displayName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border-2 border-black"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <p className="text-sm text-cyan-300/70">Ask me about {USER.firstName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearChat}
                      className="text-white/70 hover:text-cyan-300 hover:bg-cyan-400/10"
                      title="Clear chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-cyan-300 hover:bg-cyan-400/10"
                    title="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-[400px] md:h-[500px]">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center py-8 px-4"
                    >
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl" />
                        <Sparkles className="h-12 w-12 mx-auto text-cyan-400 relative z-10" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Hi! I'm {USER.firstName}'s AI assistant
                      </h3>
                      <p className="text-sm text-white/70 mb-6">
                        Ask me anything about his experience, projects, or skills!
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <p className="text-xs text-cyan-300/60 font-medium">Try asking:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {suggestions.map((suggestion, index) => (
                            <motion.button
                              key={suggestion}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                                       border border-cyan-400/30 rounded-full text-cyan-300 
                                       hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/50
                                       transition-all duration-200 hover:scale-105"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-xs text-white/40">
                        💡 Tip: Press <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20">Ctrl+/</kbd> to quickly open this chat
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
                        <Avatar className="h-8 w-8 border border-cyan-400/30">
                          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                          message.role === 'user'
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-400/30"
                            : "bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/10"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 border border-cyan-400/30">
                          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs">
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
                      <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-black/20 text-white border border-white/10 rounded-2xl px-4 py-3">
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
                        <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">
                          <X className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-red-500/10 text-red-200 border border-red-400/20 rounded-2xl px-4 py-3 max-w-[80%]">
                        <p className="text-sm">{error}</p>
                        <button
                          onClick={() => setError(null)}
                          className="text-xs text-red-300 hover:text-red-100 mt-2 underline"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                <form onSubmit={handleFormSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything..."
                    className={cn(
                      "flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/50",
                      "focus:border-cyan-400/40 focus:ring-cyan-400/20",
                      "rounded-2xl"
                    )}
                    disabled={isLoading}
                    autoComplete="off"
                    spellCheck="false"
                    data-testid="chat-input"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "bg-gradient-to-r from-cyan-500 to-blue-500",
                      "hover:from-cyan-600 hover:to-blue-600",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "rounded-2xl"
                    )}
                    onClick={() => console.log('📤 Send button clicked')}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                {(() => {
                  console.log('🔍 Input section rendered successfully')
                  return null
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 
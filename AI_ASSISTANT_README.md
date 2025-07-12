# AI Assistant Implementation

## Overview

I've successfully implemented an AI assistant for your portfolio using Next.js AI SDK and Google Gemini. The assistant provides a floating chat interface with glassmorphism effects and smooth animations.

## Features

### 🎨 **Beautiful UI Design**
- Floating chat button with gradient background and rotation animation
- Glassmorphism modal with backdrop blur and transparency effects
- Smooth physics-based animations using Framer Motion
- Responsive design that works on all screen sizes

### 🤖 **AI Capabilities**
- Powered by Google Gemini 1.5 Flash model
- Context-aware responses about your experience, projects, and skills
- Real-time streaming responses
- Typing indicators and smooth message animations

### 🛠️ **Smart Tools**
The AI assistant has access to several tools to provide accurate information:

1. **`searchProjects`** - Search through your projects by technology or keyword
2. **`searchBlogPosts`** - Find relevant blog posts from your content
3. **`getTechStack`** - Get information about your tech stack, optionally filtered by category
4. **`getExperience`** - Retrieve detailed work experience information

### 📊 **Personal Context**
The assistant is loaded with comprehensive information about you:
- Personal information (name, bio, location, etc.)
- Current job positions and companies
- Work experience and employment history
- Project portfolio with descriptions and tech stacks
- Technical skills and expertise
- Blog posts and content

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm add @ai-sdk/google
```
(Already completed)

### 2. Set Environment Variables
Create a `.env.local` file in your project root:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key_here
```

### 3. Get Google Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new API key
4. Copy the key and add it to your `.env.local` file

### 4. Test the Assistant
1. Start your development server: `pnpm dev`
2. Look for the floating sparkles button in the bottom-right corner
3. Click it to open the chat interface
4. Try asking questions like:
   - "What projects has Yash worked on?"
   - "Tell me about your experience with React"
   - "What technologies do you use?"
   - "Do you have any blog posts about Next.js?"

## Files Created/Modified

### New Files:
- `src/app/api/chat/route.ts` - AI chat API endpoint
- `src/components/ai-assistant.tsx` - Main chat UI component

### Modified Files:
- `src/app/(app)/layout.tsx` - Added AI assistant to app layout
- `package.json` - Added @ai-sdk/google dependency

## How It Works

1. **Chat Interface**: The floating button opens a glassmorphism modal with chat functionality
2. **API Route**: `/api/chat` handles AI requests using Google Gemini
3. **Context Loading**: Your personal information is loaded as system context
4. **Tool Integration**: The AI can search through your data using predefined tools
5. **Streaming**: Responses are streamed in real-time for better UX

## Customization

### Styling
- The glassmorphism effects are implemented with Tailwind CSS
- Gradient backgrounds and animations can be customized in the component
- The chat bubble colors and layouts are easily modifiable

### AI Behavior
- Modify the `personalContext` in `src/app/api/chat/route.ts` to adjust AI responses
- Add new tools or modify existing ones to extend functionality
- Adjust the Gemini model settings for different response styles

### Animation
- Motion effects are implemented with Framer Motion
- Animation timings and physics can be adjusted in the component
- Add new animations by modifying the motion components

## Troubleshooting

### Common Issues:
1. **API Key Not Working**: Ensure your Google Gemini API key is correct and active
2. **Chat Not Loading**: Check browser console for errors and API responses
3. **Styling Issues**: Ensure all Tailwind classes are properly configured
4. **Motion Not Working**: Verify Framer Motion is properly installed

### Testing Tips:
- Use browser DevTools to inspect API calls
- Check the Network tab for chat API requests
- Use console.log in the API route for debugging
- Test with different question types to verify tool functionality

## Next Steps

The AI assistant is now fully integrated and ready to use! Users can:
- Ask questions about your background and experience
- Get information about your projects and tech stack
- Search through your blog content
- Learn about your professional journey

The assistant provides a modern, interactive way for visitors to learn about you and your work. 
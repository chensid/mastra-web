# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript web application built with Vite that integrates with the Mastra AI framework. The app demonstrates AI agent functionality using both direct Mastra client streaming and AI SDK's chat interface.

## Key Technologies

- **Build Tool**: Vite (using `rolldown-vite@7.1.17` fork)
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **UI Components**: shadcn/ui (New York style)
- **AI Integration**:
  - `@mastra/client-js` for direct Mastra API interactions
  - `@ai-sdk/react` + `ai` SDK for chat functionality
- **Compiler**: React Compiler enabled (via `babel-plugin-react-compiler`)
- **Package Manager**: pnpm

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build              # Runs TypeScript compilation + Vite build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

## Architecture

### Entry Point
- `src/main.tsx` - Standard React app initialization with StrictMode
- `src/App.tsx` - Main application component with dual AI interaction patterns

### AI Integration Pattern

The application demonstrates two approaches for interacting with Mastra agents:

1. **Direct Mastra Client Streaming** (src/App.tsx:14-26):
   - Uses `mastraClient.getAgent()` to get agent instance
   - Calls `agent.stream()` for streaming responses
   - Processes chunks via `processDataStream()` with `onChunk` callback
   - Extracts text from `step-finish` chunks

2. **AI SDK Chat Interface** (src/App.tsx:29-40):
   - Uses `useChat()` hook from `@ai-sdk/react`
   - Configures `DefaultChatTransport` with Mastra API endpoint
   - Endpoint format: `${VITE_MASTRA_API_URL}/api/chat/{agentName}`
   - Provides standard chat UI patterns (messages, input, submit)

### Configuration

- **Mastra Client** (src/lib/mastra-client.ts): Singleton instance configured with `VITE_MASTRA_API_URL` from environment variables
- **Path Aliases**: `@/*` maps to `src/*` (configured in both tsconfig.json and vite.config.ts)
- **Environment Variables**: `.env` file contains `VITE_MASTRA_API_URL` for Mastra backend connection

### UI Components

- Located in `src/components/ui/`
- Follows shadcn/ui conventions (New York style)
- ESLint ignores `src/components/ui/**` (generated components)
- Uses `cn()` utility from `src/lib/utils.ts` for className merging

### Styling

- Tailwind CSS v4 via Vite plugin (not PostCSS)
- Global styles in `src/index.css`
- CSS variables enabled for theming
- Base color: neutral

## Important Notes

- **Vite Version**: Project uses `rolldown-vite@7.1.17` fork instead of standard Vite
- **React Compiler**: Enabled and may impact dev/build performance
- **Vercel Speed Insights**: Integrated for performance monitoring
- **TypeScript**: Uses project references (tsconfig.app.json for app, tsconfig.node.json for config files)

## Testing Current Agent

The app includes a hardcoded test for `weatherAgent` that queries "深圳天气" (Shenzhen weather in Chinese). When adding new agents or testing, update the agent name and message content accordingly.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js Instagram Profile Viewer application that allows users to view public Instagram profiles anonymously. The application supports multiple API configurations and includes user authentication.

## Development Commands

**Important**: Make sure bun is in your PATH:
```bash
export PATH="$HOME/.bun/bin:$PATH"
```

If bun is not installed, install it first:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Development
- `bunx next dev -H 0.0.0.0` - Start development server (accessible from all network interfaces)
- `bun dev` - Alternative development command

### Build and Production
- `next build` - Build the application for production
- `next start` - Start production server

### Code Quality
- `bunx biome lint --write && bunx tsc --noEmit` - Run linting and type checking
- `bunx biome format --write` - Format code using Biome

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Supabase Auth
- **Package Manager**: Bun
- **Code Quality**: Biome (linter & formatter)

### Key Directories
- `src/app/` - Next.js app router pages and layouts
- `src/components/` - Reusable UI components (shadcn/ui based)
- `src/contexts/` - React contexts (Auth, Language)
- `src/lib/` - Utility libraries and API configurations

### API Configuration
The app supports multiple Instagram API backends:
- **Mock Mode**: For development/testing with fake data
- **RapidAPI**: Third-party Instagram API service
- **Custom API**: Self-hosted Instagram API

Configuration is managed through environment variables in `src/lib/api-config.ts`.

### Authentication System
- Uses Supabase for user authentication
- Context-based auth state management in `src/contexts/AuthContext.tsx`
- Supports sign up, sign in, password reset, and session management
- Gracefully handles missing Supabase configuration

### Instagram API Service
- Centralized API service in `src/lib/instagram-api.ts`
- Handles different API response formats
- Includes error handling and rate limiting
- Supports URL parsing and username extraction

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_API_MODE` - API mode (mock/rapidapi/custom)
- `NEXT_PUBLIC_RAPIDAPI_KEY` - RapidAPI key (if using RapidAPI)
- `NEXT_PUBLIC_RAPIDAPI_HOST` - RapidAPI host (if using RapidAPI)

## Code Style

- Uses Biome for formatting and linting
- Double quotes for strings
- Space indentation
- Tailwind CSS for styling
- shadcn/ui component library
- TypeScript strict mode enabled

## Setup Instructions

1. **Install dependencies**: `bun install`
2. **Set up environment**: Copy `.env.example` to `.env.local` and configure your API keys
3. **Start development**: `bun run dev`
4. **Access the app**: Open http://localhost:3000

## Important Notes

- The project requires bun as the package manager. Make sure it's installed and in your PATH.
- The app gracefully handles missing API configurations and shows appropriate error messages.
- All API calls include proper error handling and user-friendly error messages.
- The codebase follows defensive programming practices for API integrations.
- You may see a TLS warning when starting - this is safe to ignore in development.
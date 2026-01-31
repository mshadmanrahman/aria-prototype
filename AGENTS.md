# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ARIA-powered search prototypes demonstrating AI assistant integration for educations.com. Two interactive prototypes showcase different approaches to conversational search for study abroad programs.

## Development Commands

### Local Testing
```bash
# No build required - open HTML files directly in browser
open prototype1.html   # Chat widget prototype
open prototype2.html   # Conversational search prototype
open index.html        # Landing page
```

### Local Development Server
```bash
python3 -m http.server 3000
```

### Deployment
```bash
vercel --prod          # Deploy to production
vercel                 # Preview deployment
```

## Architecture

### Core Files

- **`aria-engine.js`** - Shared conversation engine used by both prototypes
  - `ARIAEngine` class manages conversation state, mock program data, and response generation
  - `detectIntent()` - Identifies user goals from natural language
  - `extractEntities()` - Extracts fields, countries, levels from messages
  - `generateResponse()` - Orchestrates response generation with typing simulation
  - `searchPrograms()` - Filters mock program database

- **`prototype1.html` + `prototype1.js`** - Chat widget beside traditional search
  - Floating ARIA button opens slide-in chat panel
  - Lead generation form flow: country → field → capture user details

- **`prototype2.html` + `prototype2.js`** - Full-screen conversational search
  - Replaces search bar with conversation input
  - Full-screen modal conversation experience

- **`shared-styles.css`** - Brand-consistent styles shared across prototypes

### Conversation Flow

1. User message → `detectIntent()` + `extractEntities()`
2. Update `currentContext` with extracted entities
3. Check for missing required info (level, country)
4. Either ask clarifying questions or return program results

### Data Flow

```
User Input → ARIAEngine.generateResponse() → {message, chips, programs}
                     ↓
         currentContext accumulates:
         - field, specificField
         - level (Bachelor's/Master's/PhD)
         - country
         - budgetConcern
```

## Brand Specifications

- Primary Color: `#a3164d` (educations.com magenta)
- ARIA Color: `#10b981` (green/teal gradient)
- Must maintain visual consistency with educations.com

## Key Patterns

- Chips provide quick-select options for conversation flow
- Typing indicators use `simulateTyping()` for natural delays
- `escapeHtml()` used for XSS prevention in user message display
- Lead gen form appears after field selection in prototype1

## Notes

- This is a simulation/demo - no real AI backend
- Mock program database is hardcoded in `aria-engine.js`
- Images are static assets (PNG) for country flags, icons, and hero images

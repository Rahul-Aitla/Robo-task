# Technical Write-up: CampaignAI Studio

## AI Models Used
- **Google Gemini 2.0 Flash** for content generation

## Why This Model
Gemini 2.0 Flash is the latest and most advanced model from Google, offering exceptional creative writing capabilities with blazing-fast response times and a generous free tier. It excels at understanding context, maintaining brand voice, and producing engaging, audience-specific copy with consistent quality. The model's enhanced multimodal capabilities and large context window ensure comprehensive campaign generation.

## How AI is Used in the App
1. **User Input Processing**: Product description and target audience are combined into a carefully crafted prompt
2. **Structured Generation**: Gemini 1.5 Flash generates a complete campaign including a strategic content plan and 5 diverse post ideas (2 carousels, 2 static posts, 1 reel)
3. **Schema Validation**: Zod schemas ensure consistent, structured JSON output with all required fields
4. **Content Delivery**: Results include ready-to-use captions, hooks, CTAs, hashtags, and detailed AI image prompts

## Architecture & Components

**Frontend:**
- Next.js 16 App Router with TypeScript for type safety and modern React features
- shadcn/ui components built on Radix UI for accessible, customizable UI
- Tailwind CSS v4 for responsive, utility-first styling

**Backend:**
- Next.js API routes handle AI generation server-side, keeping API keys secure
- Vercel AI SDK simplifies Google Gemini integration with structured outputs
- Zod for runtime type validation and schema enforcement

**Key Features:**
- Real-time campaign generation with loading states
- Copy-to-clipboard functionality for all content
- Responsive design with gradient backgrounds and smooth animations
- Visual post type indicators (carousel/reel/static)

**Deployment:**
Optimized for Vercel with serverless functions, ensuring fast global delivery and automatic scaling.

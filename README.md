# CampaignAI Studio 🚀

An AI-powered social media campaign generator that helps founders and marketers create complete Instagram campaigns in seconds.

## ✨ Features

- **AI-Powered Content Generation**: Generate comprehensive Instagram campaigns using Google Gemini 2.0 Flash
- **Complete Campaign Strategy**: Get a content plan tailored to your product and audience
- **5 Diverse Post Ideas**: Mix of carousels, reels, and static posts
- **Ready-to-Use Content**: Captions, hooks, CTAs, and hashtags for each post
- **AI Image Prompts**: Detailed prompts for generating visuals with any AI image tool
- **Free High-Quality Image Generation**: Generate professional images using Segmind SDXL API (free, no API key!)
- **Automatic Prompt Enhancement**: Prompts are enhanced for better quality results
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Copy-to-Clipboard**: Easily copy any content with one click

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **AI**: Google Gemini 1.5 Flash via Vercel AI SDK
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd campaign-studio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

1. **Enter Product Description**: Describe your product or service
2. **Specify Target Audience**: Define who you're trying to reach
3. **Generate Campaign**: Click the button and watch the AI create your campaign
4. **Copy & Use**: Copy any content with the clipboard buttons and use in your marketing

## 🎯 Example Input

**Product Description:**
```
I sell eco-friendly water bottles made from recycled materials. They keep drinks cold for 24 hours and come in vibrant colors.
```

**Target Audience:**
```
College students interested in sustainability and eco-friendly lifestyle
```

## 🏗️ Project Structure

```
campaign-studio/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint for AI generation
│   ├── globals.css               # Global styles with custom utilities
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main application page
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
└── public/                       # Static assets
```

## 🎨 Key Features Explained

### AI Integration
- Uses Google Gemini 1.5 Flash for fast, cost-effective, high-quality content generation
- Structured output with Zod schema validation ensures consistent results
- Prompt engineering optimized for marketing content

### UI/UX
- Gradient backgrounds and smooth animations for premium feel
- Responsive design works on all devices
- Copy-to-clipboard functionality for easy content usage
- Visual indicators for different post types (carousel/reel/static)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your `GOOGLE_GENERATIVE_AI_API_KEY` in Environment Variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📝 Technical Write-up

**AI Models Used:**
Google Gemini 1.5 Flash for content generation

**Why This Model:**
Gemini 1.5 Flash offers exceptional creative writing capabilities with fast response times and generous free tier, making it perfect for generating marketing content. It excels at understanding context, maintaining brand voice, and producing engaging, audience-specific copy with consistent quality.

**How AI is Used:**
1. User input (product + audience) is processed into a structured prompt
2. Gemini 1.5 Flash generates a complete campaign with content plan and 5 post ideas
3. Zod schema validation ensures consistent, structured output
4. Results include captions, hooks, CTAs, hashtags, and image prompts

**Architecture:**
- Next.js App Router with TypeScript for type safety
- API routes handle AI generation server-side (keeps API keys secure)
- Vercel AI SDK simplifies Gemini integration with structured outputs
- shadcn/ui components provide beautiful, accessible UI
- Tailwind CSS for rapid, responsive styling

**Deployment:**
Optimized for Vercel with serverless functions, ensuring fast global delivery and automatic scaling.

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 👨‍💻 Author

Built as a technical assignment to demonstrate full-stack AI application development.

---

**Note**: This is a demo application. For production use, consider adding:
- User authentication
- Rate limiting
- Database for saving campaigns
- Payment integration
- More AI models (image generation, etc.)

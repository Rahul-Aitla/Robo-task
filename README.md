# CampaignAI Studio 🚀

An AI-powered social media campaign generator that helps founders and marketers create complete Instagram campaigns in seconds. Now with campaign history and scheduling!

## ✨ Features

- **AI-Powered Content Generation**: Generate comprehensive Instagram campaigns using **Groq (Llama 3.3)** for lightning-fast results.
- **Complete Campaign Strategy**: Get a content plan tailored to your product and audience.
- **5 Diverse Post Ideas**: Mix of carousels, reels, and static posts.
- **Ready-to-Use Content**: Captions, hooks, CTAs, and hashtags for each post.
- **AI Image & Video Generation**: 
  - High-quality images via Segmind SDXL.
  - Video generation via Hugging Face models.
- **Campaign History**: Automatically saves your generated campaigns to Supabase.
- **Content Calendar**: Schedule your posts and view them in an interactive calendar.
- **Beautiful UI**: Modern, responsive design with smooth animations.
- **Copy-to-Clipboard**: Easily copy any content with one click.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **AI (Text)**: Groq (Llama 3.3 70B Versatile) via Vercel AI SDK
- **AI (Media)**: Segmind (Images), Hugging Face (Video)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Groq API key ([Get one here](https://console.groq.com/keys))
- Supabase Project ([Create one here](https://supabase.com))

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
# AI Services
GROQ_API_KEY=your_groq_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the Database:
   - Go to your Supabase project's SQL Editor.
   - Copy the contents of `supabase_schema.sql` from this repository.
   - Run the SQL query to create the necessary tables and policies.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

1. **Enter Product Description**: Describe your product or service
2. **Specify Target Audience**: Define who you're trying to reach
3. **Generate Campaign**: Click the button and watch the AI create your campaign
4. **Save & Schedule**: Campaigns are automatically saved. Click "Schedule" on any post to add it to your calendar.
5. **View Calendar**: Access the calendar from the sidebar to see your scheduled content.

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
│   │   ├── generate/         # Groq text generation
│   │   ├── generate-image/   # Image generation
│   │   └── generate-video/   # Video generation
│   ├── calendar/             # Calendar page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main application page
├── components/
│   ├── app-sidebar.tsx       # Navigation sidebar
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── types.ts              # Type definitions
└── supabase_schema.sql       # Database schema
```

## 🎨 Key Features Explained

### AI Integration
- **Groq (Llama 3.3)**: Delivers near-instant text generation for campaign strategies and posts.
- **Multi-Modal**: Generates text, images, and videos in one workflow.

### Persistence & Scheduling
- **Supabase Integration**: All campaigns are persisted to a PostgreSQL database.
- **Interactive Calendar**: Visual planning of your content with status tracking.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your Environment Variables (`GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📝 Technical Write-up

**AI Models Used:**
- **Groq (Llama 3.3-70b)**: For instant campaign strategy and copy generation.
- **Segmind SDXL**: For high-fidelity image generation.
- **Hugging Face (Zeroscope)**: For AI video generation.

**Why These Models:**
We switched to **Groq** to leverage its LPU inference engine, delivering near-instant text generation that makes the app feel real-time. **Llama 3.3** offers the perfect balance of creativity and instruction-following for marketing content. **Supabase** was added to provide persistent storage and real-time capabilities for the new calendar feature.

**How AI is Used:**
1. **Contextual Analysis**: The AI analyzes the product and target audience to determine the best tone and content strategy.
2. **Structured Generation**: Groq generates a JSON-structured response containing the strategy and 5 distinct post types (Reels, Carousels, Static).
3. **Visual Synthesis**: Image prompts created by the text model are sent to Segmind to generate matching visuals.

**Architecture:**
- **Frontend**: Next.js 16 App Router for server-side rendering and optimal performance.
- **Backend/DB**: Supabase (PostgreSQL) for storing campaigns and managing the content calendar.
- **Styling**: Tailwind CSS v4 with shadcn/ui for a premium, accessible interface.
- **AI Layer**: Vercel AI SDK for standardized API interactions.

**Deployment:**
Optimized for Vercel with serverless functions, ensuring fast global delivery and automatic scaling.

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
GROQ_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 👨‍💻 Author

Built as a technical assignment to demonstrate full-stack AI application development.

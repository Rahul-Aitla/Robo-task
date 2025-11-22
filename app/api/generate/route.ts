import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const PostIdeaSchema = z.object({
    type: z.enum(['carousel', 'reel', 'static']),
    title: z.string(),
    caption: z.string(),
    script: z.string().optional(),
    hook: z.string(),
    cta: z.string(),
    hashtags: z.array(z.string()),
    imagePrompt: z.string(),
});

const CampaignSchema = z.object({
    contentPlan: z.string(),
    posts: z.array(PostIdeaSchema),
});

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
    try {
        // Check if API key is present
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GOOGLE_GENERATIVE_AI_API_KEY is not configured. Please add it to your .env.local file.' },
                { status: 500 }
            );
        }

        const { productDescription, targetAudience } = await req.json();

        if (!productDescription || !targetAudience) {
            return NextResponse.json(
                { error: 'Product description and target audience are required' },
                { status: 400 }
            );
        }

        const prompt = `You are an expert social media marketing strategist. Create a comprehensive Instagram campaign for a founder/marketer.

Product: ${productDescription}
Target Audience: ${targetAudience}

Generate:
1. A brief content plan (2-3 sentences) explaining the campaign strategy
2. Exactly 5 diverse post ideas with the following mix:
   - 2 carousel posts (educational/storytelling)
   - 2 static posts (quotes/announcements)
   - 1 reel idea (engaging/trending)

For each post, provide:
- A catchy title (max 10 words)
- A complete caption (80-120 words) with engaging hook
- A powerful hook (one sentence to grab attention)
- A clear CTA (one sentence call-to-action)
- 8-10 relevant hashtags (mix of popular and niche)
- A detailed image prompt (2-3 sentences describing composition, lighting, mood, colors, style)
- [IMPORTANT] If the post type is 'reel', provide a 'script' field with a 30-60 second script including visual cues and spoken audio. Leave empty for other types.

Make the content authentic, engaging, and tailored to the target audience. Focus on value-driven content that builds trust and drives engagement.`;

        // Retry logic with exponential backoff
        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                if (attempt > 0) {
                    // Wait before retrying (exponential backoff: 2s, 4s, 8s)
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.log(`Retrying after ${waitTime}ms...`);
                    await wait(waitTime);
                }

                const result = await generateObject({
                    model: google('gemini-2.0-flash-exp'),
                    schema: CampaignSchema,
                    prompt,
                });

                return NextResponse.json(result.object);
            } catch (error: any) {
                lastError = error;
                console.error(`Attempt ${attempt + 1} failed:`, error?.message);

                // If it's a rate limit error, continue to retry
                if (error?.message?.includes('Quota exceeded') || error?.message?.includes('rate limit')) {
                    continue;
                }
                // For other errors, throw immediately
                throw error;
            }
        }

        // If all retries failed
        throw lastError;

    } catch (error: any) {
        console.error('Error generating campaign:', error);

        // Provide more detailed error message
        const errorMessage = error?.message || error?.toString() || 'Unknown error';

        // Check if it's a quota/rate limit error
        if (errorMessage.includes('Quota exceeded') || errorMessage.includes('rate limit')) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please wait a minute and try again. The free tier has limits on requests per minute.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: `Failed to generate campaign: ${errorMessage}. Please check your API key.` },
            { status: 500 }
        );
    }
}

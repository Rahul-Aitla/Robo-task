import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
    try {
        // Check if API key is present
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GROQ_API_KEY is not configured. Please add it to your .env.local file.' },
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

Generate a JSON response with the following structure:
{
  "contentPlan": "A brief content plan (2-3 sentences) explaining the campaign strategy",
  "posts": [
    {
      "type": "carousel" | "reel" | "static",
      "title": "A catchy title (max 10 words)",
      "caption": "A complete caption (80-120 words) with engaging hook",
      "hook": "A powerful hook (one sentence to grab attention)",
      "cta": "A clear CTA (one sentence call-to-action)",
      "hashtags": ["#tag1", "#tag2", ...],
      "imagePrompt": "A detailed image prompt (2-3 sentences)",
      "script": "If type is 'reel', provide a 30-60 second script. Otherwise empty string."
    }
  ]
}

Requirements:
1. Generate exactly 5 diverse post ideas:
   - 2 carousel posts (educational/storytelling)
   - 2 static posts (quotes/announcements)
   - 1 reel idea (engaging/trending)
2. Make the content authentic, engaging, and tailored to the target audience.
3. IMPORTANT: Return ONLY the raw JSON object. Do not wrap it in markdown code blocks. Do not add any text before or after.`;

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

                const { text } = await generateText({
                    model: groq('llama-3.3-70b-versatile'),
                    prompt,
                });

                // Clean up the response if it contains markdown
                const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
                const result = JSON.parse(cleanText);

                return NextResponse.json(result);
            } catch (error: any) {
                lastError = error;
                console.error(`Attempt ${attempt + 1} failed:`, error?.message);

                // If it's a rate limit error, continue to retry
                if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
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
        if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please wait a minute and try again. Groq free tier has limits.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: `Failed to generate campaign: ${errorMessage}. Please check your API key.` },
            { status: 500 }
        );
    }
}

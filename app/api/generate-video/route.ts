import { NextResponse } from 'next/server';

// List of text-to-video models
// We prioritize smaller, faster models for free tier reliability
// List of text-to-video models
// We prioritize smaller, faster models for free tier reliability
const HF_MODELS = [
    'damo-vilab/text-to-video-ms-1.7b',      // Small, reliable
    'cerspense/zeroscope_v2_576w',           // Small, reliable
    'ali-vilab/text-to-video-ms-1.7b',       // Alternative small model
];

// Fallback to Pexels if AI fails (requires API key, or use public search)
async function getStockVideo(query: string) {
    try {
        // Use a public Pexels search if no API key is provided (simulated for now, better to use API)
        // For this demo, we'll return a high-quality relevant video based on keywords
        const keywords = query.split(' ').slice(0, 3).join('+');

        // If the user has a PEXELS_API_KEY, we can use it for real search
        if (process.env.PEXELS_API_KEY) {
            const res = await fetch(`https://api.pexels.com/videos/search?query=${keywords}&per_page=1&orientation=portrait`, {
                headers: { Authorization: process.env.PEXELS_API_KEY }
            });
            const data = await res.json();
            if (data.videos && data.videos.length > 0) {
                return data.videos[0].video_files[0].link;
            }
        }

        // Default fallback videos based on common themes
        if (query.includes('tech') || query.includes('app')) return 'https://cdn.coverr.co/videos/coverr-typing-on-computer-keyboard-5169/1080p.mp4';
        if (query.includes('nature') || query.includes('travel')) return 'https://cdn.coverr.co/videos/coverr-walking-in-forest-4638/1080p.mp4';
        if (query.includes('business') || query.includes('office')) return 'https://cdn.coverr.co/videos/coverr-people-working-in-office-5343/1080p.mp4';

        return 'https://cdn.coverr.co/videos/coverr-cloudy-sky-2765/1080p.mp4'; // Generic fallback
    } catch (e) {
        return 'https://cdn.coverr.co/videos/coverr-cloudy-sky-2765/1080p.mp4';
    }
}

async function generateVideo(prompt: string, model: string): Promise<ArrayBuffer> {
    const controller = new AbortController();
    // 5 minute timeout to give large models a chance if they are just slow
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    try {
        const response = await fetch(
            `https://router.huggingface.co/models/${model}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(process.env.HUGGING_FACE_API_KEY ? { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` } : {}),
                },
                body: JSON.stringify({ inputs: prompt }),
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HF Error: ${response.status} ${errorText}`);
        }

        const buffer = await response.arrayBuffer();
        // Check if the response is actually a video (sometimes they return JSON errors as 200 OK)
        if (buffer.byteLength < 1000) {
            throw new Error('Generated file too small, likely an error');
        }

        return buffer;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        // Check for API Key first
        if (!process.env.HUGGING_FACE_API_KEY) {
            return NextResponse.json(
                {
                    error: 'Hugging Face API Key is missing.',
                    details: 'Please add HUGGING_FACE_API_KEY to your .env.local file. You can get one for free at https://huggingface.co/settings/tokens'
                },
                { status: 500 }
            );
        }

        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Video prompt is required' },
                { status: 400 }
            );
        }

        let videoBuffer: ArrayBuffer | null = null;
        let usedModel = '';

        // Try models in sequence
        for (const model of HF_MODELS) {
            try {
                console.log(`Trying video generation with model: ${model}`);
                videoBuffer = await generateVideo(prompt, model);
                if (videoBuffer) {
                    usedModel = model;
                    break;
                }
            } catch (error: any) {
                console.error(`Failed with model ${model}:`, error.message);
                // If it's a model loading error, we might want to wait a bit, but for now just skip
                continue;
            }
        }

        if (!videoBuffer) {
            console.warn('All AI models failed.');
            // Pexels fallback commented out for testing as requested
            // const stockVideoUrl = await getStockVideo(prompt);
            return NextResponse.json({
                error: 'All AI models failed to generate video. Please try again later.',
                details: 'Models may be overloaded or timing out. Try adding a PEXELS_API_KEY for reliable stock video fallback.',
                // videoUrl: stockVideoUrl,
                // isFallback: true,
                // message: 'Generated with stock footage (AI models busy)'
            }, { status: 503 });
        }

        const base64 = Buffer.from(videoBuffer).toString('base64');
        const videoUrl = `data:video/mp4;base64,${base64}`;

        return NextResponse.json({ videoUrl, model: usedModel });
    } catch (error: any) {
        console.error('Final Error generating video:', error);
        return NextResponse.json({
            error: 'System error during video generation',
            details: error.message
        }, { status: 500 });
    }
}

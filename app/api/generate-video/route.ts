import { NextResponse } from 'next/server';
const HF_MODELS = [
    'damo-vilab/text-to-video-ms-1.7b',
    'cerspense/zeroscope_v2_576w'
];

// Fallback video (Abstract tech background) to use when APIs are overloaded
const FALLBACK_VIDEO_URL = 'https://cdn.coverr.co/videos/coverr-cloudy-sky-2765/1080p.mp4';

async function generateVideo(prompt: string, model: string): Promise<ArrayBuffer> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s hard timeout per model

    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
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
            throw new Error(`HF Error: ${response.status} ${response.statusText}`);
        }

        return response.arrayBuffer();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Video prompt is required' },
                { status: 400 }
            );
        }

        let videoBuffer: ArrayBuffer | null = null;

        // Try models in sequence with strict timeout
        for (const model of HF_MODELS) {
            try {
                console.log(`Trying video generation with model: ${model}`);
                videoBuffer = await generateVideo(prompt, model);
                if (videoBuffer) break;
            } catch (error) {
                console.error(`Failed with model ${model}:`, error);
                continue; // Try next model
            }
        }

        if (!videoBuffer) {
            console.warn('All models failed or timed out. Returning fallback video.');
            return NextResponse.json({
                videoUrl: FALLBACK_VIDEO_URL,
                isFallback: true,
                message: 'Generated with fallback (AI models busy)'
            });
        }

        const base64 = Buffer.from(videoBuffer).toString('base64');
        const videoUrl = `data:video/mp4;base64,${base64}`;

        return NextResponse.json({ videoUrl });
    } catch (error: any) {
        console.error('Final Error generating video:', error);
        // Always return fallback on system error to keep UI working
        return NextResponse.json({
            videoUrl: FALLBACK_VIDEO_URL,
            isFallback: true,
            message: 'Generated with fallback (System error)'
        });
    }
}

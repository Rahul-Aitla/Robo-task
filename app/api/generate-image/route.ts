import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Image prompt is required' },
                { status: 400 }
            );
        }

        // Enhanced prompt for better quality
        const enhancedPrompt = `${prompt}, professional photography, high quality, detailed, 4k, instagram worthy`;

        // Try multiple free APIs in order of quality

        // Option 1: Segmind API (Free, good quality)
        try {
            const segmindResponse = await fetch(
                'https://api.segmind.com/v1/sdxl1.0-txt2img',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: enhancedPrompt,
                        negative_prompt: 'blurry, bad quality, distorted, ugly, low resolution, watermark',
                        samples: 1,
                        scheduler: 'UniPC',
                        num_inference_steps: 25,
                        guidance_scale: 8,
                        seed: Math.floor(Math.random() * 1000000),
                        img_width: 1024,
                        img_height: 1024,
                        base64: false,
                    }),
                }
            );

            if (segmindResponse.ok) {
                const imageBlob = await segmindResponse.blob();
                const arrayBuffer = await imageBlob.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const imageUrl = `data:image/jpeg;base64,${base64}`;
                return NextResponse.json({ imageUrl, provider: 'segmind' });
            }
        } catch (error) {
            console.log('Segmind failed, trying next provider...');
        }

        // Option 2: Pollinations with enhanced settings
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true&model=flux`;

        return NextResponse.json({ imageUrl, provider: 'pollinations' });

    } catch (error: any) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Failed to generate image. Please try again.' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, startImage, prompt, negativePrompt, aspectRatio, cfgScale } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    if (!startImage || !prompt) {
      return NextResponse.json({ error: 'Start image and prompt are required' }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: apiKey,
    });

    const input = {
      prompt,
      duration: 5,
      cfg_scale: cfgScale,
      aspect_ratio: aspectRatio,
      negative_prompt: negativePrompt || '',
      image: startImage,
    };

    const output = await replicate.run('kwaivgi/kling-v1.6-standard', { input });

    if (!output || typeof output !== 'string') {
      throw new Error('Invalid response from Replicate API');
    }

    return NextResponse.json({ url: output });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
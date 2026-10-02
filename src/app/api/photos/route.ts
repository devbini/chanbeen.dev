import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    if (!imageBaseUrl) {
        return NextResponse.json({ error: 'Photo archive is not configured.' }, { status: 503 });
    }

    try {
        const response = await fetch(`${imageBaseUrl.replace(/\/$/, '')}/photos/photos.json`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error('Photo archive request failed.');

        const photos: unknown = await response.json();
        if (!Array.isArray(photos)) throw new Error('Invalid photo archive.');

        return NextResponse.json(photos, {
            headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' },
        });
    } catch {
        return NextResponse.json({ error: 'Unable to load the photo archive.' }, { status: 502 });
    }
}

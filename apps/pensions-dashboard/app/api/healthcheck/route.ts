import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    { image_sha: process.env.IMAGE_SHA ?? 'no sha' },
    { status: 200 },
  );
}

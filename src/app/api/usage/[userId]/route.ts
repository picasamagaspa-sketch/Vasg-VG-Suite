import { NextRequest, NextResponse } from 'next/server';

// Mock in-memory storage for usage data
// In production, replace with a real database (PostgreSQL, MongoDB, Redis, etc.)
const usageStore = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const usage = usageStore.get(userId) || {
      userId,
      dayStartTime: Date.now(),
      dailyAccessCount: 0,
      generationCount: 0,
      isPro: false,
    };

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Failed to get usage:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve usage data' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const usage = await request.json();
    usageStore.set(userId, { ...usage, userId });

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Failed to update usage:', error);
    return NextResponse.json(
      { error: 'Failed to update usage data' },
      { status: 500 }
    );
  }
}

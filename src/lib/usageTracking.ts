// Usage Tracking and Rate Limiting System
// Tracks free tier user limits and enforces pro upgrade blocking

interface UserUsageData {
  userId: string;
  dayStartTime: number; // Timestamp of when today started for this user
  dailyAccessCount: number;
  generationCount: number;
  isPro: boolean;
  proExpiresAt?: number;
}

const FREE_TIER_DAILY_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_FREE_TIER_DAILY_LIMIT || '2',
  10
);
const FREE_TIER_GENERATION_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_FREE_TIER_GENERATION_LIMIT || '2',
  10
);

/**
 * Get user usage data from localStorage (client-side) or database (server-side)
 */
export async function getUserUsage(userId: string): Promise<UserUsageData> {
  try {
    // Try to fetch from API/database first
    const response = await fetch(`/api/usage/${userId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Failed to fetch usage from API:', error);
  }

  // Fallback: use localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`usage_${userId}`);
    if (stored) {
      const data = JSON.parse(stored);
      // Reset daily count if a new day has started
      if (isNewDay(data.dayStartTime)) {
        return resetDailyUsage(userId);
      }
      return data;
    }
  }

  return initializeUserUsage(userId);
}

/**
 * Initialize a new user with zero usage
 */
function initializeUserUsage(userId: string): UserUsageData {
  return {
    userId,
    dayStartTime: Date.now(),
    dailyAccessCount: 0,
    generationCount: 0,
    isPro: false,
  };
}

/**
 * Reset daily usage counters (called when a new day starts)
 */
function resetDailyUsage(userId: string): UserUsageData {
  const resetData: UserUsageData = {
    userId,
    dayStartTime: Date.now(),
    dailyAccessCount: 0,
    generationCount: 0,
    isPro: false,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`usage_${userId}`, JSON.stringify(resetData));
  }

  return resetData;
}

/**
 * Check if a new day has started since the last reset
 */
function isNewDay(previousDayStart: number): boolean {
  const now = new Date();
  const previous = new Date(previousDayStart);
  return (
    now.getDate() !== previous.getDate() ||
    now.getMonth() !== previous.getMonth() ||
    now.getFullYear() !== previous.getFullYear()
  );
}

/**
 * Increment daily access count
 */
export async function recordDailyAccess(userId: string): Promise<void> {
  const usage = await getUserUsage(userId);

  if (isNewDay(usage.dayStartTime)) {
    usage.dayStartTime = Date.now();
    usage.dailyAccessCount = 1;
  } else {
    usage.dailyAccessCount += 1;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(`usage_${userId}`, JSON.stringify(usage));
  }

  // Sync to database
  await fetch(`/api/usage/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usage),
  }).catch(() => {
    // Silently fail if API is unavailable
  });
}

/**
 * Increment generation count
 */
export async function recordGeneration(userId: string): Promise<void> {
  const usage = await getUserUsage(userId);

  if (isNewDay(usage.dayStartTime)) {
    usage.dayStartTime = Date.now();
    usage.dailyAccessCount = 0;
    usage.generationCount = 1;
  } else {
    usage.generationCount += 1;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(`usage_${userId}`, JSON.stringify(usage));
  }

  // Sync to database
  await fetch(`/api/usage/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usage),
  }).catch(() => {
    // Silently fail if API is unavailable
  });
}

/**
 * Check if user has exceeded daily access limit
 */
export async function hasExceededDailyLimit(userId: string): Promise<boolean> {
  const usage = await getUserUsage(userId);

  if (usage.isPro) {
    return false; // Pro users have unlimited daily access
  }

  return usage.dailyAccessCount >= FREE_TIER_DAILY_LIMIT;
}

/**
 * Check if user has exceeded generation limit
 */
export async function hasExceededGenerationLimit(userId: string): Promise<boolean> {
  const usage = await getUserUsage(userId);

  if (usage.isPro) {
    return false; // Pro users have unlimited generations
  }

  return usage.generationCount >= FREE_TIER_GENERATION_LIMIT;
}

/**
 * Get remaining usage for free tier user
 */
export async function getRemainingUsage(userId: string) {
  const usage = await getUserUsage(userId);

  if (usage.isPro) {
    return {
      dailyAccessRemaining: -1, // Unlimited
      generationRemaining: -1, // Unlimited
      isPro: true,
    };
  }

  return {
    dailyAccessRemaining: Math.max(0, FREE_TIER_DAILY_LIMIT - usage.dailyAccessCount),
    generationRemaining: Math.max(0, FREE_TIER_GENERATION_LIMIT - usage.generationCount),
    isPro: false,
  };
}

/**
 * Upgrade user to pro
 */
export async function upgradeUserToPro(userId: string, expiresAt?: number): Promise<void> {
  const usage = await getUserUsage(userId);
  usage.isPro = true;
  usage.proExpiresAt = expiresAt || Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  if (typeof window !== 'undefined') {
    localStorage.setItem(`usage_${userId}`, JSON.stringify(usage));
  }

  // Sync to database
  await fetch(`/api/usage/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usage),
  }).catch(() => {
    // Silently fail if API is unavailable
  });
}

/**
 * Downgrade user to free tier
 */
export async function downgradeUserToFree(userId: string): Promise<void> {
  const usage = await getUserUsage(userId);
  usage.isPro = false;
  usage.proExpiresAt = undefined;

  if (typeof window !== 'undefined') {
    localStorage.setItem(`usage_${userId}`, JSON.stringify(usage));
  }

  // Sync to database
  await fetch(`/api/usage/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usage),
  }).catch(() => {
    // Silently fail if API is unavailable
  });
}

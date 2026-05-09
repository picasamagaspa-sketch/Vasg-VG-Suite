import { useEffect, useState, useCallback } from 'react';
import {
  hasExceededDailyLimit,
  hasExceededGenerationLimit,
  getRemainingUsage,
  recordDailyAccess,
  recordGeneration,
} from '@/lib/usageTracking';

interface UseProUpgradeReturn {
  isLimitExceeded: boolean;
  remainingGenerations: number;
  remainingDailyAccess: number;
  isPro: boolean;
  recordUsage: (type: 'access' | 'generation') => Promise<void>;
  showUpgradeModal: boolean;
  closeUpgradeModal: () => void;
}

export function useProUpgrade(userId: string): UseProUpgradeReturn {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState(0);
  const [remainingDailyAccess, setRemainingDailyAccess] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const proUpgradeBlocking = process.env.NEXT_PUBLIC_PRO_UPGRADE_BLOCKING === 'true';

  const checkUsage = useCallback(async () => {
    if (!proUpgradeBlocking) return;

    const dailyExceeded = await hasExceededDailyLimit(userId);
    const generationExceeded = await hasExceededGenerationLimit(userId);
    const remaining = await getRemainingUsage(userId);

    setIsLimitExceeded(dailyExceeded || generationExceeded);
    setRemainingGenerations(remaining.generationRemaining);
    setRemainingDailyAccess(remaining.dailyAccessRemaining);
    setIsPro(remaining.isPro);

    if ((dailyExceeded || generationExceeded) && !remaining.isPro) {
      setShowUpgradeModal(true);
    }
  }, [userId, proUpgradeBlocking]);

  useEffect(() => {
    checkUsage();
  }, [checkUsage]);

  const recordUsage = useCallback(
    async (type: 'access' | 'generation') => {
      if (type === 'access') {
        await recordDailyAccess(userId);
      } else if (type === 'generation') {
        await recordGeneration(userId);
      }
      await checkUsage();
    },
    [userId, checkUsage]
  );

  return {
    isLimitExceeded,
    remainingGenerations,
    remainingDailyAccess,
    isPro,
    recordUsage,
    showUpgradeModal,
    closeUpgradeModal: () => setShowUpgradeModal(false),
  };
}

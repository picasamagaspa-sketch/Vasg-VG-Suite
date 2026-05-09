import { FC } from 'react';

interface UsageCounterProps {
  remaining: number;
  limit: number;
  label: string;
  type?: 'normal' | 'warning' | 'critical';
}

export const UsageCounter: FC<UsageCounterProps> = ({
  remaining,
  limit,
  label,
  type = 'normal',
}) => {
  const percentage = (remaining / limit) * 100;
  let counterType = 'normal';

  if (remaining === 0) {
    counterType = 'limit-reached';
  } else if (percentage < 30) {
    counterType = 'warning';
  }

  return (
    <div className={`usage-counter ${counterType}`}>
      <span>{label}:</span>
      <strong>
        {remaining}/{limit}
      </strong>
    </div>
  );
};

export default UsageCounter;

import { FC } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingGenerations: number;
  remainingDailyAccess: number;
  monthlyPrice?: string;
}

export const UpgradeModal: FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  remainingGenerations,
  remainingDailyAccess,
  monthlyPrice = '$29.99',
}) => {
  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    // Redirect to checkout or subscription page
    window.location.href = '/checkout';
  };

  return (
    <div className="upgrade-modal-overlay">
      <div className="upgrade-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <span className="modal-badge">🚀 Unlock Pro</span>
          <h2>You've reached your free tier limit</h2>
        </div>

        <div className="modal-content">
          <p className="modal-subtitle">Upgrade to Pro for unlimited access</p>

          <div className="limit-display">
            {remainingGenerations === 0 && (
              <div className="limit-item">
                <span className="limit-icon">🪝</span>
                <div>
                  <strong>Generations Limit Reached</strong>
                  <p>You've used your 2 free generations for today</p>
                </div>
              </div>
            )}
            {remainingDailyAccess === 0 && (
              <div className="limit-item">
                <span className="limit-icon">📅</span>
                <div>
                  <strong>Daily Access Limit Reached</strong>
                  <p>You've reached your 2 free app sessions today</p>
                </div>
              </div>
            )}
          </div>

          <div className="benefits-list">
            <h3>Pro includes:</h3>
            <ul>
              <li>✓ Unlimited daily access</li>
              <li>✓ Unlimited hook generations</li>
              <li>✓ Unlimited captions & scripts</li>
              <li>✓ Advanced 30-day planner</li>
              <li>✓ Priority support</li>
              <li>✓ Content calendar sync</li>
            </ul>
          </div>

          <div className="pricing-section">
            <p className="pricing-label">Monthly subscription</p>
            <p className="pricing-amount">{monthlyPrice}</p>
            <p className="pricing-note">Cancel anytime, no commitment</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Maybe later
          </button>
          <button className="btn btn-primary" onClick={handleUpgradeClick}>
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;

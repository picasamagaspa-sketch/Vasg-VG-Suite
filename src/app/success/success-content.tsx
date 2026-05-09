'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate verification of payment
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const sessionId = searchParams.get('session_id');

  return (
    <div className="success-shell">
      <div className="success-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <h2>Processing your payment...</h2>
            <p>Setting up your Pro account</p>
          </div>
        ) : (
          <div className="success-content">
            <div className="success-icon">✅</div>

            <h1>Welcome to Pro! 🎉</h1>
            <p className="success-subtitle">Your subscription is now active.</p>

            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Plan</span>
                <span className="detail-value">VASG-VG Pro (Monthly)</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Billing</span>
                <span className="detail-value">$29.99 per month</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value active">✓ Active</span>
              </div>
            </div>

            <div className="quick-wins">
              <h3>You now have:</h3>
              <ul>
                <li>♾️ Unlimited daily access</li>
                <li>⚡ Unlimited content generation</li>
                <li>🎯 All 8 niches + 4 content types</li>
                <li>🚀 Priority support</li>
              </ul>
            </div>

            <div className="next-steps">
              <h3>Next Steps</h3>
              <ol>
                <li>Check your email for confirmation and receipt</li>
                <li>Return to the app to start generating unlimited content</li>
                <li>Manage your subscription in account settings</li>
              </ol>
            </div>

            <div className="action-buttons">
              <a href="/" className="btn btn-primary btn-large">
                Return to App
              </a>
              <a href="/#generator-section" className="btn btn-ghost">
                Start Generating
              </a>
            </div>

            <div className="support-info">
              <p>
                Questions? <a href="#">Contact support</a> or check out our{' '}
                <a href="#">FAQ</a>.
              </p>
            </div>

            {sessionId && (
              <p className="session-id">
                Session ID: {sessionId}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

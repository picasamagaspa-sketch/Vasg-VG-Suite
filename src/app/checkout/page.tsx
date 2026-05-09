'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const monthlyPrice = 2999; // $29.99 in cents
  const annualPrice = 29900; // $299.00 in cents (save $60/year)
  const displayPrice = billingCycle === 'monthly' ? 29.99 : 299.00;
  const savings = billingCycle === 'annual' ? '$60/year' : 'Save $60/year with annual';

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Call your backend to create a Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          billingCycle,
          priceAmount: billingCycle === 'monthly' ? monthlyPrice : annualPrice,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-shell">
      <div className="checkout-container">
        {/* Left Column - Checkout Form */}
        <div className="checkout-form-section">
          <div className="checkout-header">
            <a href="/" className="back-link">← Back</a>
            <h1>Upgrade to Pro</h1>
            <p>Unlock unlimited content generation and never hit a limit again.</p>
          </div>

          <div className="billing-toggle">
            <button
              className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual
              <span className="save-badge">Save 20%</span>
            </button>
          </div>

          <div className="price-display">
            <div className="price-amount">
              <span className="currency">$</span>
              <span className="amount">{displayPrice.toFixed(2)}</span>
              <span className="period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>
            <p className="price-note">{savings}</p>
          </div>

          <form className="checkout-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="card">Card details</label>
              <div className="card-input-placeholder">
                <span>💳</span>
                <span>Mock Stripe Card Element</span>
                <span className="small-text">Enter any test card number</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Expiry</label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  value="12/26"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvc">CVC</label>
                <input
                  id="cvc"
                  type="text"
                  placeholder="CVC"
                  disabled
                  value="123"
                />
              </div>
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" defaultChecked />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-large checkout-btn"
              onClick={handleCheckout}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Processing... ⏳' : `Pay $${displayPrice.toFixed(2)}`}
            </button>

            <p className="security-note">
              🔒 Secure checkout powered by Stripe. Your payment information is encrypted.
            </p>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-item">
              <span>VASG-VG Pro {billingCycle === 'annual' ? '(Annual)' : '(Monthly)'}</span>
              <span className="price">${displayPrice.toFixed(2)}</span>
            </div>

            {billingCycle === 'annual' && (
              <div className="summary-item discount">
                <span>Annual Discount (20%)</span>
                <span className="price">-$60.00</span>
              </div>
            )}

            <div className="summary-divider" />

            <div className="summary-item total">
              <span>Total</span>
              <span className="price">${displayPrice.toFixed(2)}</span>
            </div>

            <h4>What's Included</h4>
            <ul className="benefits-list">
              <li>✓ Unlimited daily app access</li>
              <li>✓ Unlimited content generations</li>
              <li>✓ All 8 niches unlocked</li>
              <li>✓ All 6 content types</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Content calendar sync</li>
              <li>✓ API access (coming soon)</li>
            </ul>

            <div className="guarantee-box">
              <strong>7-Day Money-Back Guarantee</strong>
              <p>Not satisfied? Get a full refund within 7 days, no questions asked.</p>
            </div>

            <div className="faq-section">
              <h4>Frequently Asked</h4>

              <div className="faq-item">
                <strong>When does billing start?</strong>
                <p>Your subscription starts immediately after payment is processed.</p>
              </div>

              <div className="faq-item">
                <strong>Can I cancel anytime?</strong>
                <p>Yes, cancel your subscription anytime from your account settings.</p>
              </div>

              <div className="faq-item">
                <strong>What payment methods are accepted?</strong>
                <p>We accept all major credit cards via Stripe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

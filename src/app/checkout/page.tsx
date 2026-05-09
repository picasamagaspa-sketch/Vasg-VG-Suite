'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.pk_live_51RCxLjFjfxVYxw6RFub0uRoYLxHxipH2bmJxmoWRvGPns6ZHnMV0uXgmPAeXFV7J0ShyUKWLVJdXivIlYSWfYg3400avkOcpXZ || ''
);

// Checkout Form Component
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [prices, setPrices] = useState<{
    monthly: { amount: number; currency: string };
    annual: { amount: number; currency: string };
  } | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  // Fetch prices from Stripe on component mount
  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching prices:', data.error);
          // Fallback to static prices if API fails
          setPrices({
            monthly: { amount: 999, currency: 'usd' },
            annual: { amount: 9999, currency: 'usd' },
          });
        } else {
          setPrices(data);
        }
        setPriceLoading(false);
      })
      .catch(err => {
        console.error('Error fetching prices:', err);
        // Fallback to static prices
        setPrices({
          monthly: { amount: 999, currency: 'usd' },
          annual: { amount: 9999, currency: 'usd' },
        });
        setPriceLoading(false);
      });
  }, []);

  // Calculate display prices
  const monthlyPrice = prices?.monthly.amount || 999;
  const annualPrice = prices?.annual.amount || 9999;
  const displayPrice = billingCycle === 'monthly'
    ? (monthlyPrice / 100).toFixed(2)
    : (annualPrice / 100).toFixed(2);

  const monthlyDisplay = (monthlyPrice / 100).toFixed(2);
  const annualDisplay = (annualPrice / 100).toFixed(2);
  const savings = billingCycle === 'annual'
    ? `$${(monthlyPrice * 12 - annualPrice) / 100}/year`
    : `Save $${(monthlyPrice * 12 - annualPrice) / 100}/year with annual`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
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

      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: '#ffffff',
        padding: '12px 16px',
        border: '1px solid #e1e5e9',
        borderRadius: '6px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
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
            {priceLoading ? (
              <div className="price-loading">
                <div className="price-amount">
                  <span className="currency">$</span>
                  <span className="amount">...</span>
                  <span className="period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <p className="price-note">Loading prices...</p>
              </div>
            ) : (
              <div className="price-amount">
                <span className="currency">$</span>
                <span className="amount">{displayPrice}</span>
                <span className="period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
            )}
            {!priceLoading && <p className="price-note">{savings}</p>}
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
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
              <label>Card details</label>
              <div className="card-element-wrapper">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" defaultChecked required />
              <label htmlFor="terms">
                I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large checkout-btn"
              disabled={!stripe || loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Processing... ⏳' : `Subscribe for $${priceLoading ? '...' : displayPrice}/${billingCycle === 'monthly' ? 'month' : 'year'}`}
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
              <span className="price">
                {priceLoading ? '...' : `$${displayPrice}`}
              </span>
            </div>

            {billingCycle === 'annual' && !priceLoading && (
              <div className="summary-item discount">
                <span>Annual Discount</span>
                <span className="price">
                  -${((monthlyPrice * 12 - annualPrice) / 100).toFixed(2)}
                </span>
              </div>
            )}

            <div className="summary-divider" />

            <div className="summary-item total">
              <span>Total</span>
              <span className="price">
                {priceLoading ? '...' : `$${displayPrice}`}
              </span>
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

// Main Checkout Page Component
export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

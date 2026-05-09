# 🚀 VASG-VG AI Suite - Stripe Setup Guide

## Prerequisites
1. A Stripe account (sign up at https://dashboard.stripe.com)
2. Your app deployed or running locally

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard > Developers > API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_live_` or `pk_test_`)
3. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)

## Step 2: Create Products and Prices

### Create the Monthly Subscription Product

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Click "Create product"
3. Fill in the details:
   - **Name**: VASG-VG Pro (Monthly)
   - **Description**: Unlimited content generation for creators
4. Under "Pricing", add a price:
   - **Price**: $29.99
   - **Billing period**: Monthly
   - **Currency**: USD
5. Click "Save product"
6. Copy the **Price ID** (starts with `price_`) - this is your `STRIPE_PRO_MONTHLY_PRICE_ID`

### Create the Annual Subscription Product

1. In the same product, add another price:
   - **Price**: $299.00
   - **Billing period**: Yearly
   - **Currency**: USD
2. Click "Save product"
3. Copy the **Price ID** for the annual price - this is your `STRIPE_PRO_ANNUAL_PRICE_ID`

## Step 3: Configure Webhooks (Production Only)

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Webhook signing secret** - this is your `STRIPE_WEBHOOK_SECRET`

## Step 4: Update Your Environment Variables

Update your `.env.local` file with the real values:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Product/Price IDs
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...

# Stripe Webhook Secret (for production)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Try the free tier limits (2 generations, 2 daily uses)
4. Click "Upgrade to Pro" when limits are reached
5. Complete a test payment using Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`

## Step 6: Go Live

1. Replace test keys with live keys in production
2. Set up webhooks with your production domain
3. Test with real payment methods
4. Monitor payments in Stripe Dashboard

## Troubleshooting

### Common Issues:

1. **"Invalid API Key"**: Make sure you're using the correct environment (test/live)
2. **"Price not found"**: Double-check your Price IDs in Stripe Dashboard
3. **Webhook failures**: Ensure your webhook endpoint is publicly accessible

### Test Mode vs Live Mode:

- **Test mode**: Use `sk_test_` and `pk_test_` keys
- **Live mode**: Use `sk_live_` and `pk_live_` keys

### Support:

- [Stripe Documentation](https://stripe.com/docs)
- [Next.js + Stripe Guide](https://stripe.com/docs/payments/nextjs)

---

🎉 Your VASG-VG AI Suite is now ready for payments!
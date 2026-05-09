import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    // Get the price IDs from environment variables
    const monthlyPriceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    const annualPriceId = process.env.STRIPE_PRO_ANNUAL_PRICE_ID;

    if (!monthlyPriceId || !annualPriceId) {
      return NextResponse.json(
        { error: 'Price IDs not configured' },
        { status: 500 }
      );
    }

    // Fetch prices from Stripe
    const [monthlyPrice, annualPrice] = await Promise.all([
      stripe.prices.retrieve(monthlyPriceId),
      stripe.prices.retrieve(annualPriceId),
    ]);

    return NextResponse.json({
      monthly: {
        id: monthlyPrice.id,
        amount: monthlyPrice.unit_amount,
        currency: monthlyPrice.currency,
      },
      annual: {
        id: annualPrice.id,
        amount: annualPrice.unit_amount,
        currency: annualPrice.currency,
      },
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
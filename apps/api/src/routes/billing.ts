/**
 * Stripe Billing Routes
 * Checkout, webhook, portal
 */

import { Hono } from 'hono';
import Stripe from 'stripe';
import { authMiddleware } from '../middleware/auth';
import { prisma } from '../services/db/prisma';

const billing = new Hono();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  // @ts-expect-error - Stripe types might not match the specific version string
  return new Stripe(key, { apiVersion: '2024-12-18.acacia' });
}

const PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || '';

// ============================================
// POST /billing/checkout — Create checkout session
// ============================================

billing.post('/checkout', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return c.json({ error: 'User not found' }, 404);

    const stripe = getStripe();

    // Get or create Stripe customer
    let customerId = (user as unknown as { stripeCustomerId?: string }).stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?upgrade=cancel`,
      metadata: { userId },
    });

    return c.json({ url: session.url });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Stripe Checkout]', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// POST /billing/webhook — Stripe webhook handler
// ============================================

billing.post('/webhook', async (c) => {
  try {
    const stripe = getStripe();
    const body = await c.req.text();
    const sig = c.req.header('stripe-signature') || '';
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[Stripe Webhook] Signature verification failed:', error.message);
      return c.json({ error: 'Invalid signature' }, 400);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'PREMIUM',
              stripeSubscriptionId: session.subscription as string,
            },
          });
          console.log(`[Stripe] User ${userId} upgraded to PREMIUM`);
        }
        break;
      }

      case 'invoice.paid': {
        // Subscription renewed — keep Premium
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: 'PREMIUM' },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription cancelled — downgrade
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'FREE',
              stripeSubscriptionId: null,
            },
          });
          console.log(`[Stripe] User ${user.id} downgraded to FREE`);
        }
        break;
      }
    }

    return c.json({ received: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Stripe Webhook]', error);
    return c.json({ error: 'Webhook error' }, 500);
  }
});

// ============================================
// GET /billing/portal — Redirect to Stripe portal
// ============================================

billing.get('/portal', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const customerId = (user as unknown as { stripeCustomerId?: string })?.stripeCustomerId;

    if (!customerId) {
      return c.json({ error: 'No billing account. Please subscribe first.' }, 400);
    }

    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    return c.json({ url: portal.url });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Stripe Portal]', error);
    return c.json({ error: error.message }, 500);
  }
});

export { billing as billingRoutes };

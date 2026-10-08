/** @jest-environment node */

import { NextRequest } from 'next/server';

import { POST } from '@/app/api/stripe/webhook/route';
import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';
import { stripeServer } from '@/lib/stripe';

jest.mock('@/env.mjs', () => ({
  env: { STRIPE_WEBHOOK_SECRET_KEY: 'whsec_webhook_test_only' },
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: { user: { update: jest.fn() } },
}));

jest.mock('@/lib/stripe', () => ({
  stripeServer: { webhooks: { constructEvent: jest.fn() } },
}));

const constructEvent = jest.mocked(stripeServer.webhooks.constructEvent);
const updateUser = jest.mocked(prisma.user.update);

const subscription = { id: 'sub_webhook_test', customer: 'cus_webhook_test' };
const event = {
  type: 'customer.subscription.created' as const,
  data: { object: subscription },
};
const rawBody = JSON.stringify(event, null, 2);
const signature = 'synthetic-stripe-signature';

const createRequest = () =>
  new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    headers: { 'stripe-signature': signature },
    body: rawBody,
  });

describe('Stripe webhook POST', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns HTTP 400 without updating a user when event construction fails', async () => {
    constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const response = await POST(createRequest());

    expect(constructEvent).toHaveBeenCalledTimes(1);
    expect(constructEvent).toHaveBeenCalledWith(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY
    );
    expect(response?.status).toBe(400);
    await expect(response?.json()).resolves.toEqual({
      error: { message: 'Webhook Error - Error: Invalid signature' },
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('activates the matching user and acknowledges a subscription-created event', async () => {
    // Only the fields consumed by the handler are needed from Stripe's payload.
    constructEvent.mockReturnValue(
      event as ReturnType<typeof stripeServer.webhooks.constructEvent>
    );
    updateUser.mockResolvedValue({
      id: 'user_webhook_test',
      name: null,
      email: null,
      emailVerified: null,
      image: null,
      stripeCustomerId: subscription.customer,
      isActive: true,
    });

    const response = await POST(createRequest());

    expect(constructEvent).toHaveBeenCalledTimes(1);
    expect(constructEvent).toHaveBeenCalledWith(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY
    );
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({
      where: { stripeCustomerId: subscription.customer },
      data: { isActive: true },
    });
    expect(response?.status).toBe(200);
    await expect(response?.json()).resolves.toEqual({ received: true });
  });
});

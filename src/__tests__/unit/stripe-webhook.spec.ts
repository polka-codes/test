/** @jest-environment node */

import { NextRequest } from 'next/server';
import type Stripe from 'stripe';

import { POST } from '@/app/api/stripe/webhook/route';
import prisma from '@/lib/prisma';
import { stripeServer } from '@/lib/stripe';

jest.mock('@/env.mjs', () => ({
  env: { STRIPE_WEBHOOK_SECRET_KEY: 'whsec_test_fixture' },
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
const body = '{"id":"evt_test"}';
const signature = 'test-signature';

const request = (withSignature = true) =>
  new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    body,
    headers: withSignature ? { 'stripe-signature': signature } : {},
  });

const subscriptionEvent = {
  type: 'customer.subscription.created',
  data: { object: { customer: 'cus_test' } },
} as Stripe.CustomerSubscriptionCreatedEvent;

describe('Stripe webhook POST', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    constructEvent.mockReturnValue(subscriptionEvent);
  });

  it.each([true, false])(
    'returns 400 when event construction fails (signature present: %s)',
    async (withSignature) => {
      constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const response = await POST(request(withSignature));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: { message: 'Webhook Error - Error: Invalid signature' },
      });
      expect(constructEvent).toHaveBeenCalledWith(
        body,
        withSignature ? signature : null,
        'whsec_test_fixture'
      );
      expect(updateUser).not.toHaveBeenCalled();
    }
  );

  it('activates the matching customer and acknowledges the subscription', async () => {
    const response = await POST(request());

    expect(constructEvent).toHaveBeenCalledTimes(1);
    expect(constructEvent).toHaveBeenCalledWith(
      body,
      signature,
      'whsec_test_fixture'
    );
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({
      where: { stripeCustomerId: 'cus_test' },
      data: { isActive: true },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
  });

  it('acknowledges unrelated events without updating a user', async () => {
    constructEvent.mockReturnValue({
      ...subscriptionEvent,
      type: 'customer.subscription.updated',
    });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('returns a generic 500 Response when the database update rejects', async () => {
    updateUser.mockRejectedValue(new Error('Private database details'));

    const response = await POST(request());

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    expect(response.headers.has('Allow')).toBe(false);
    expect(await response.json()).toEqual({
      error: { message: 'Internal Server Error' },
    });
  });

  it('returns a generic 500 Response when reading the request body fails', async () => {
    const req = request();
    jest.spyOn(req, 'text').mockRejectedValue(new Error('Private body details'));

    const response = await POST(req);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    expect(response.headers.has('Allow')).toBe(false);
    expect(await response.json()).toEqual({
      error: { message: 'Internal Server Error' },
    });
    expect(constructEvent).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });
});

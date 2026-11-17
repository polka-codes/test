/** @jest-environment node */

import { NextRequest } from 'next/server';

import { POST } from '@/app/api/stripe/webhook/route';
import prisma from '@/lib/prisma';
import { stripeServer } from '@/lib/stripe';

jest.mock('@/env.mjs', () => ({
  env: { STRIPE_WEBHOOK_SECRET_KEY: 'test-webhook-secret' },
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

const request = () =>
  new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    body: 'synthetic-body',
    headers: { 'stripe-signature': 'test-signature' },
  });

describe('Stripe webhook POST', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    constructEvent.mockReturnValue({
      type: 'customer.subscription.created',
      data: { object: { customer: 'cus_test' } },
    } as ReturnType<typeof stripeServer.webhooks.constructEvent>);
  });

  it('returns a generic JSON 500 response when reading the body fails', async () => {
    const req = request();
    jest
      .spyOn(req, 'text')
      .mockRejectedValue(new Error('private body details'));

    const response = await POST(req);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.has('Allow')).toBe(false);
    expect(await response.json()).toEqual({
      error: { message: 'Internal Server Error' },
    });
    expect(constructEvent).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('returns a generic JSON 500 response when Prisma rejects', async () => {
    updateUser.mockRejectedValue(new Error('private database details'));

    const response = await POST(request());

    expect(updateUser).toHaveBeenCalledWith({
      where: { stripeCustomerId: 'cus_test' },
      data: { isActive: true },
    });
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.has('Allow')).toBe(false);
    expect(await response.json()).toEqual({
      error: { message: 'Internal Server Error' },
    });
  });

  it('preserves event-construction failures as 400 responses', async () => {
    constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { message: 'Webhook Error - Error: Invalid signature' },
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('activates the subscriber and acknowledges successful processing', async () => {
    const response = await POST(request());

    expect(constructEvent).toHaveBeenCalledWith(
      'synthetic-body',
      'test-signature',
      'test-webhook-secret'
    );
    expect(updateUser).toHaveBeenCalledWith({
      where: { stripeCustomerId: 'cus_test' },
      data: { isActive: true },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
  });

  it('acknowledges unhandled events without updating a user', async () => {
    constructEvent.mockReturnValue({
      type: 'customer.created',
      data: { object: {} },
    } as ReturnType<typeof stripeServer.webhooks.constructEvent>);

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect(updateUser).not.toHaveBeenCalled();
  });
});

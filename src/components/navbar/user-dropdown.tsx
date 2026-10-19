'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { z } from 'zod';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { env } from '@/env.mjs';
import * as m from '@/paraglide/messages';

const checkoutResponseSchema = z.object({
  session: z.object({ id: z.string().min(1) }),
});

export const UserDropdown = ({ session: { user } }: { session: Session }) => {
  const [isPending, setIsPending] = useState(false);

  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCreateCheckoutSession = async () => {
    setIsPending(true);

    setCheckoutError(null);

    try {
      const response = await fetch('/api/stripe/checkout-session');
      if (!response.ok) throw new Error('Checkout request failed');
      const { session } = checkoutResponseSchema.parse(await response.json());
      const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) throw new Error('Stripe is unavailable');
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) throw new Error('Checkout redirect failed');
    } catch {
      setCheckoutError(m.checkout_error());
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          className="overflow-hidden rounded-full"
          src={`${user?.image}`}
          alt={`${user?.name}`}
          width={32}
          height={32}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{m.my_account()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center justify-center p-2">
          <Image
            className="overflow-hidden rounded-full"
            src={`${user?.image}`}
            alt={`${user?.name}`}
            width={100}
            height={100}
          />
          <h2 className="py-2 text-lg font-bold">{user?.name}</h2>
          <Button
            onClick={handleCreateCheckoutSession}
            disabled={user?.isActive || isPending}
            aria-busy={isPending}
            className="w-64"
          >
            {user?.isActive ? (
              m.you_are_a_pro()
            ) : (
              <>
                {isPending && (
                  <Icons.loader className="mr-2 size-4 animate-spin" />
                )}
                {m.upgrade_to_pro_cta()}
              </>
            )}
          </Button>
          {checkoutError && (
            <p
              role="alert"
              className="mt-2 max-w-64 text-sm text-red-600 dark:text-red-400"
            >
              {checkoutError}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <Icons.logOut className="mr-2 size-4" /> <span>{m.log_out()}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

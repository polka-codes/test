import type { ImgHTMLAttributes, PropsWithChildren } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { Session } from 'next-auth';

import { UserDropdown } from '@/components/navbar/user-dropdown';

const mockLoadStripe = jest.fn();
const mockRedirect = jest.fn();
const mockFetch = jest.fn();
const originalFetch = global.fetch;

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: () => mockLoadStripe(),
}));
jest.mock('@/env.mjs', () => ({
  env: { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_fixture' },
}));
jest.mock('next-auth/react', () => ({ signOut: jest.fn() }));
jest.mock('@/components/icons', () => ({
  Icons: {
    loader: () => <svg data-testid="checkout-spinner" />,
    logOut: () => <svg />,
  },
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <svg role="img" aria-label={props.alt} />
  ),
}));
jest.mock('@/components/ui/dropdown-menu', () => {
  const Container = ({ children }: PropsWithChildren) => <div>{children}</div>;
  return Object.fromEntries(
    [
      'DropdownMenu',
      'DropdownMenuTrigger',
      'DropdownMenuContent',
      'DropdownMenuItem',
      'DropdownMenuLabel',
      'DropdownMenuSeparator',
    ].map((name) => [name, Container])
  );
});

const session: Session = {
  expires: '2099-01-01',
  user: {
    id: 'qa-user',
    stripeCustomerId: 'cus_fixture',
    name: 'QA User',
    image: '/avatar.png',
    isActive: false,
  },
};
const validResponse = () => ({
  ok: true,
  json: async () => ({ session: { id: 'cs_test_fixture' } }),
});

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = mockFetch;
  mockFetch.mockResolvedValue(validResponse());
  mockRedirect.mockResolvedValue({});
  mockLoadStripe.mockResolvedValue({ redirectToCheckout: mockRedirect });
});
afterAll(() => {
  global.fetch = originalFetch;
});

describe('checkout recovery', () => {
  it.each([
    [
      'network rejection',
      () => mockFetch.mockRejectedValueOnce(new Error('offline')),
    ],
    ['HTTP failure', () => mockFetch.mockResolvedValueOnce({ ok: false })],
    [
      'missing session',
      () =>
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) }),
    ],
    [
      'empty session ID',
      () =>
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ session: { id: '' } }),
        }),
    ],
    [
      'invalid JSON',
      () =>
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('invalid JSON');
          },
        }),
    ],
    ['Stripe unavailable', () => mockLoadStripe.mockResolvedValueOnce(null)],
    [
      'Stripe load rejection',
      () => mockLoadStripe.mockRejectedValueOnce(new Error('offline')),
    ],
    [
      'redirect rejection',
      () => mockRedirect.mockRejectedValueOnce(new Error('redirect failed')),
    ],
    [
      'redirect error result',
      () =>
        mockRedirect.mockResolvedValueOnce({ error: { message: 'failed' } }),
    ],
  ])('allows a successful retry after %s', async (_name, fail) => {
    fail();
    render(<UserDropdown session={session} />);
    const button = screen.getByRole('button', { name: 'Upgrade to pro' });
    fireEvent.click(button);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to start checkout. Please try again.'
    );
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(screen.queryByTestId('checkout-spinner')).not.toBeInTheDocument();

    const redirectsBeforeRetry = mockRedirect.mock.calls.length;
    fireEvent.click(button);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(mockRedirect).toHaveBeenCalledTimes(redirectsBeforeRetry + 1)
    );
    await waitFor(() => expect(button).toBeEnabled());
    expect(mockRedirect).toHaveBeenLastCalledWith({
      sessionId: 'cs_test_fixture',
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('prevents a second submission while checkout is pending', async () => {
    let resolveFetch!: (response: ReturnType<typeof validResponse>) => void;
    mockFetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );
    render(<UserDropdown session={session} />);
    const button = screen.getByRole('button', { name: 'Upgrade to pro' });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/stripe/checkout-session');
    expect(screen.getByTestId('checkout-spinner')).toBeInTheDocument();
    await act(async () => resolveFetch(validResponse()));
    expect(mockRedirect).toHaveBeenCalledWith({ sessionId: 'cs_test_fixture' });
    expect(button).toBeEnabled();
  });

  it('keeps active subscribers from starting checkout', () => {
    render(
      <UserDropdown
        session={{ ...session, user: { ...session.user, isActive: true } }}
      />
    );
    const button = screen.getByRole('button', { name: 'You are pro!' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

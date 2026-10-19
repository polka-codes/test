import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { helloAction } from '@/actions/hello-action';
import { HeroForm } from '@/components/form';

const mockToast = jest.fn();
jest.mock('@/actions/hello-action', () => ({ helloAction: jest.fn() }));
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));
const action = jest.mocked(helloAction);

beforeEach(() => {
  jest.clearAllMocks();
  action.mockResolvedValue({ message: 'Hello Ada' });
});

function expectDescriptionTargets(input: HTMLElement) {
  const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];
  expect(ids.length).toBeGreaterThan(0);
  for (const id of ids) expect(document.getElementById(id)).not.toBeNull();
}

describe('name form', () => {
  it.each(['', 'a', 'ab'])(
    'explains invalid name %p and recovers after correction',
    async (name) => {
      render(<HeroForm />);
      const input = screen.getByRole('textbox', { name: 'Name' });
      expectDescriptionTargets(input);
      fireEvent.change(input, { target: { value: name } });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      const message = await screen.findByText('Enter at least 3 characters.');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(
        message.id
      );
      expectDescriptionTargets(input);
      expect(action).not.toHaveBeenCalled();
      fireEvent.change(input, { target: { value: 'Ada' } });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({ description: 'Hello Ada' })
      );
      expect(action).toHaveBeenCalledTimes(1);
      expect(action).toHaveBeenCalledWith('Ada');
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expectDescriptionTargets(input);
      expect(
        screen.queryByText('Enter at least 3 characters.')
      ).not.toBeInTheDocument();
    }
  );
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { helloAction } from '@/actions/hello-action';
import { HeroForm } from '@/components/form';
import { useToast } from '@/components/ui/use-toast';

jest.mock('@/actions/hello-action', () => ({ helloAction: jest.fn() }));
jest.mock('@/components/ui/use-toast', () => ({ useToast: jest.fn() }));

const action = jest.mocked(helloAction);
const toast = jest.fn();

describe('Form', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useToast).mockReturnValue({
      toast,
      toasts: [],
      dismiss: jest.fn(),
    });
  });

  it('renders the Components', () => {
    render(<HeroForm />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('shows the greeting after a valid submission', async () => {
    action.mockResolvedValue({ message: 'Hello Ada, from server!' });
    render(<HeroForm />);

    fireEvent.change(screen.getByPlaceholderText('Type your name ...'), {
      target: { value: 'Ada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        description: 'Hello Ada, from server!',
      });
    });
    expect(action).toHaveBeenCalledWith('Ada');
  });

  it('displays server validation errors without a success toast', async () => {
    action.mockResolvedValue({
      error: 'Name must be a string with at least 3 characters.',
    });
    render(<HeroForm />);

    fireEvent.change(screen.getByPlaceholderText('Type your name ...'), {
      target: { value: 'Ada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Name must be a string with at least 3 characters.')
    ).toBeInTheDocument();
    expect(toast).not.toHaveBeenCalled();
  });

  it('rejects short names before calling the action', async () => {
    render(<HeroForm />);

    fireEvent.change(screen.getByPlaceholderText('Type your name ...'), {
      target: { value: 'Al' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your name ...')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
    expect(action).not.toHaveBeenCalled();
    expect(toast).not.toHaveBeenCalled();
  });
});

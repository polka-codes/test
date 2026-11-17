import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { helloAction } from '@/actions/hello-action';
import { HeroForm } from '@/components/form';
import { useToast } from '@/components/ui/use-toast';
import { invalidNameMessage } from '@/lib/hello-schema';

jest.mock('@/actions/hello-action', () => ({ helloAction: jest.fn() }));
jest.mock('@/components/ui/use-toast', () => ({ useToast: jest.fn() }));

const mockToast = jest.fn();
const mockHelloAction = jest.mocked(helloAction);

describe('Form', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useToast).mockReturnValue({
      toast: mockToast,
      toasts: [],
      dismiss: jest.fn(),
    });
  });

  it('renders the Components', () => {
    render(<HeroForm />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('shows a success toast for a valid greeting', async () => {
    mockHelloAction.mockResolvedValue({ message: 'Hello Ada, from server!' });
    render(<HeroForm />);

    fireEvent.change(screen.getByPlaceholderText('Type your name ...'), {
      target: { value: 'Ada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: 'Hello Ada, from server!',
      });
    });
    expect(mockHelloAction).toHaveBeenCalledWith('Ada');
  });

  it('handles a server validation result without a success toast', async () => {
    mockHelloAction.mockResolvedValue({ error: invalidNameMessage });
    render(<HeroForm />);

    // Pass client validation so this exercises the server-result branch.
    fireEvent.change(screen.getByPlaceholderText('Type your name ...'), {
      target: { value: 'Ada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      invalidNameMessage
    );
    expect(mockHelloAction).toHaveBeenCalledWith('Ada');
    expect(mockToast).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Type your name ...')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('rejects short input on the client without calling the action', async () => {
    render(<HeroForm />);

    fireEvent.change(screen.getByPlaceholderText('Type your name ...'), {
      target: { value: 'Ab' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      invalidNameMessage
    );
    expect(mockHelloAction).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });
});

'use server';

import { invalidNameMessage, nameSchema } from '@/lib/hello-schema';

// Invalid network input returns an error result, never a successful greeting.
export const helloAction = async (
  name: unknown
): Promise<{ message: string } | { error: string }> => {
  const result = nameSchema.safeParse(name);

  if (!result.success) {
    return { error: invalidNameMessage };
  }

  return { message: `Hello ${result.data}, from server!` };
};

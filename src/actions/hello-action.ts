'use server';

import { helloSchema } from '@/lib/hello-schema';

export const helloAction = async (name: unknown) => {
  const result = helloSchema.safeParse({ name });

  if (!result.success) {
    return { error: 'Name must be a string with at least 3 characters.' };
  }

  return { message: `Hello ${result.data.name}, from server!` };
};

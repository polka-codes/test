'use server';

import { z } from 'zod';

const nameSchema = z.string().min(3);

export const helloAction = async (name: unknown) => {
  const validatedName = nameSchema.parse(name);

  return { message: `Hello ${validatedName}, from server!` };
};

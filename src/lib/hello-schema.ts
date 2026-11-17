import { z } from 'zod';

export const invalidNameMessage = 'Name must contain at least 3 characters.';

export const nameSchema = z
  .string({
    required_error: invalidNameMessage,
    invalid_type_error: invalidNameMessage,
  })
  .min(3, invalidNameMessage);

export const helloFormSchema = z.object({ name: nameSchema });

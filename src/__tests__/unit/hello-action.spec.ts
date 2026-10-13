import { ZodError } from 'zod';

import { helloAction } from '@/actions/hello-action';

describe('helloAction', () => {
  it.each(['Ada', 'Alice', '  Ada  ', '   '])(
    'returns the unchanged greeting for %j',
    async (name) => {
      await expect(helloAction(name)).resolves.toEqual({
        message: `Hello ${name}, from server!`,
      });
    }
  );

  it.each(['', 'A', 'Al'])(
    'rejects strings below the three-character minimum: %j',
    async (name) => {
      await expect(helloAction(name)).rejects.toBeInstanceOf(ZodError);
    }
  );

  it.each([
    { label: 'undefined', value: undefined },
    { label: 'null', value: null },
    { label: 'number', value: 123 },
    { label: 'boolean', value: true },
    { label: 'object', value: { name: 'Ada' } },
    { label: 'array', value: ['Ada'] },
  ])('rejects a non-string $label without coercion', async ({ value }) => {
    await expect(helloAction(value)).rejects.toBeInstanceOf(ZodError);
  });
});

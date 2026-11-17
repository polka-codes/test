import { helloAction } from '@/actions/hello-action';
import { invalidNameMessage } from '@/lib/hello-schema';

describe('helloAction', () => {
  it.each(['Ada', 'Alice', '  Ada  '])(
    'preserves the greeting for %j',
    async (name) => {
      await expect(helloAction(name)).resolves.toEqual({
        message: `Hello ${name}, from server!`,
      });
    }
  );

  it.each([
    { name: '' },
    { name: 'A' },
    { name: 'Ab' },
    { name: null },
    { name: undefined },
    { name: 123 },
    { name: true },
    { name: {} },
    { name: ['Ada'] },
  ])('returns an error without a greeting for $name', async ({ name }) => {
    await expect(helloAction(name)).resolves.toEqual({
      error: invalidNameMessage,
    });
  });
});

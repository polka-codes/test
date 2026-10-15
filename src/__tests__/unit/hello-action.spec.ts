import { helloAction } from '@/actions/hello-action';

describe('helloAction', () => {
  it.each(['Ada', 'Alice', ' Ada '])(
    'preserves the greeting for %j',
    async (name) => {
      await expect(helloAction(name)).resolves.toEqual({
        message: `Hello ${name}, from server!`,
      });
    }
  );

  it.each(['', 'A', 'Al', null, undefined, 123, true, {}, ['Ada']])(
    'rejects invalid direct input %j without a greeting',
    async (name) => {
      await expect(helloAction(name)).resolves.toEqual({
        error: 'Name must be a string with at least 3 characters.',
      });
    }
  );
});

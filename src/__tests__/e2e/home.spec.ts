import { expect, test } from '@playwright/test';

test.use({ locale: 'en-US' });

test('shows the homepage title, headline, demo form, and primary links', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Next.js Starter/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Next.js starter template',
      exact: true,
    })
  ).toBeVisible();
  await expect(page.getByPlaceholder('Type your name ...')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Submit', exact: true })
  ).toBeVisible();

  const getStarted = page.getByRole('link', { name: 'Get Started', exact: true });
  await expect(getStarted).toBeVisible();
  await expect(getStarted).toHaveAttribute(
    'href',
    'https://github.com/Skolaczk/next-starter/blob/main/README.md#getting-started'
  );

  const github = page.getByRole('link', { name: 'Github', exact: true });
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute(
    'href',
    'https://github.com/Skolaczk/next-starter'
  );
});

import { expect, test } from '@playwright/test';

import messages from '../../messages/en.json';

test.use({ locale: 'en-US' });

test('shows the homepage headline, demo form, and primary links', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Next.js Starter/);
  await expect(
    page.getByRole('heading', {
      name: messages.nextjs_starter_template_headline,
      level: 1,
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByPlaceholder(messages.input_placeholder, { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: messages.submit_form, exact: true })
  ).toBeVisible();

  const getStarted = page.getByRole('link', {
    name: messages.get_started,
    exact: true,
  });
  await expect(getStarted).toBeVisible();
  await expect(getStarted).toHaveAttribute(
    'href',
    'https://github.com/Skolaczk/next-starter/blob/main/README.md#getting-started'
  );

  const github = page.getByRole('link', { name: messages.github, exact: true });
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute(
    'href',
    'https://github.com/Skolaczk/next-starter'
  );
});

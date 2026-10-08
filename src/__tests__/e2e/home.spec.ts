import { expect, test } from '@playwright/test';

import messages from '@/messages/en.json';

test.use({ locale: 'en-US' });

test('shows the homepage title, headline, demo form, and primary links', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Next.js Starter/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: messages.nextjs_starter_template_headline,
      exact: true,
    })
  ).toBeVisible();

  const nameInput = page.getByPlaceholder(messages.input_placeholder, {
    exact: true,
  });
  await expect(nameInput).toBeVisible();
  await expect(nameInput).toBeEditable();

  const submitButton = page.getByRole('button', {
    name: messages.submit_form,
    exact: true,
  });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await expect(submitButton).toHaveAttribute('type', 'submit');

  const gettingStartedLink = page.getByRole('link', {
    name: messages.get_started,
    exact: true,
  });
  await expect(gettingStartedLink).toBeVisible();
  await expect(gettingStartedLink).toHaveAttribute(
    'href',
    'https://github.com/Skolaczk/next-starter/blob/main/README.md#getting-started'
  );

  const githubLink = page.getByRole('link', {
    name: messages.github,
    exact: true,
  });
  await expect(githubLink).toBeVisible();
  await expect(githubLink).toHaveAttribute(
    'href',
    'https://github.com/Skolaczk/next-starter'
  );
});

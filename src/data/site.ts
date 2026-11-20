export const site = {
  name: 'Satsplain',
  company: '9nth Dimension',
  cardStatement: '9NTH DIMENSION',
  url: 'https://satsplain.com',
  tagline: 'Crypto, explained calmly.',
  description:
    'Satsplain explains crypto in plain English for beginners, with a source on every factual claim.',
  email: 'hello@satsplain.com',
  repo: 'https://github.com/rogenie/satsplain-site',
  author: 'Satsplain Research Desk',
  policiesUpdated: '2026-11-20',
  locale: 'en-US',
  defaultOg: '/og/default.png',
} as const;

export const defaultAuthor = 'Satsplain Research Desk';

export const companyLine = `${site.name}, a ${site.company} company`;
export const publisherLine = `${site.name} is published by ${site.company}`;
export const cardStatementNote = `When the kit goes on sale, charges will appear on your card statement as ${site.cardStatement}.`;

/**
 * Amazon product URL for the Safety Kit.
 * Leave this empty until the listing exists. An https URL sets status to
 * "amazon" and switches the page and the article callout to "View on Amazon".
 */
const safetyKitAmazonUrl: string = '';

export const safetyKit: {
  amazonUrl: string;
  status: 'waitlist' | 'amazon';
} = {
  amazonUrl: safetyKitAmazonUrl,
  status: safetyKitAmazonUrl.startsWith('https://') ? 'amazon' : 'waitlist',
};

export const safetyKitDisclosure =
  'Satsplain makes and will sell this kit, so we have a financial interest. Our articles stay educational and never require buying anything. A paper backup is fine.';

function httpsUrl(value: string | undefined) {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:') return '';
    return trimmed;
  } catch {
    return '';
  }
}

export const waitlist = {
  formAction: httpsUrl(import.meta.env.PUBLIC_WAITLIST_FORM_ACTION),
  emailField: 'email',
  honeypotField: 'leave_blank',
};

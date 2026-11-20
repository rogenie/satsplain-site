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
export const cardStatementNote = `Charges appear as ${site.cardStatement} (${site.name} is a ${site.company} company).`;

/**
 * Amazon product URL for the Safety Kit.
 * Leave this empty until the listing exists. An https URL sets status to
 * "amazon" and wins over the pre-order link.
 */
const safetyKitAmazonUrl: string = '';

/** Stripe Payment Link for Safety Kit pre-orders. An https Amazon URL wins over this. */
const safetyKitPreorderUrl = 'https://buy.stripe.com/4gM3cvdAT5wheRIa589R600';

const safetyKitPrice = 39.99;

function safetyKitStatus(amazonUrl: string, preorderUrl: string): 'amazon' | 'preorder' | 'waitlist' {
  if (amazonUrl.startsWith('https://')) return 'amazon';
  if (preorderUrl.startsWith('https://')) return 'preorder';
  return 'waitlist';
}

export const safetyKit: {
  amazonUrl: string;
  preorderUrl: string;
  price: number;
  currency: 'USD';
  status: 'amazon' | 'preorder' | 'waitlist';
} = {
  amazonUrl: safetyKitAmazonUrl,
  preorderUrl: safetyKitPreorderUrl,
  price: safetyKitPrice,
  currency: 'USD',
  status: safetyKitStatus(safetyKitAmazonUrl, safetyKitPreorderUrl),
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

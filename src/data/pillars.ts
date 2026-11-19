export const pillars = [
  {
    id: 'crypto-basics',
    title: 'Crypto Basics',
    summary: 'What bitcoin is, what a satoshi is, and which words actually matter.',
    description: 'Plain-English explanations of bitcoin, blockchains, and the words beginners meet first.',
  },
  {
    id: 'buying-and-apps',
    title: 'Buying & Apps',
    summary: 'How to check a company and read the fee before you tap buy.',
    description: 'A beginner checklist for crypto apps: registration, fees, custody, and when to pause.',
  },
  {
    id: 'wallets-and-security',
    title: 'Wallets & Security',
    summary: 'Who holds the secret key, and what happens if that secret is lost.',
    description: 'Hot wallets, cold wallets, and the tradeoff when a company holds your crypto keys.',
  },
  {
    id: 'scams-and-safety',
    title: 'Scams & Safety',
    summary: 'The patterns in FBI and regulator warnings, before any money moves.',
    description: 'How common crypto scams work, the warning signs in official alerts, and where to report.',
  },
  {
    id: 'taxes-and-rules',
    title: 'Taxes & Rules',
    summary: 'What the IRS calls a digital asset, and which records a purchase creates.',
    description: 'What the IRS says about digital assets, which records to keep, and why this is not tax advice.',
  },
  {
    id: 'trending-explained',
    title: 'Trending Explained',
    summary: 'Headlines, rewritten in plain English, only after a primary source exists.',
    description: 'Plain-English explainers of crypto news, published only when a primary source can be cited.',
  },
] as const;

export type PillarId = (typeof pillars)[number]['id'];

export function pillarById(id: string) {
  const pillar = pillars.find((item) => item.id === id);
  if (!pillar) throw new Error(`Unknown pillar: ${id}`);
  return pillar;
}

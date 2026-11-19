export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  sourceTitle: string;
  sourceUrl: string;
  related?: { label: string; href: string }[];
};

export const glossary: GlossaryTerm[] = [
  {
    id: 'address',
    term: 'Address',
    definition:
      'A bitcoin address is a string your wallet creates so someone can pay you. Bitcoin.org says you can share an address the way you share an email address, with one difference: a bitcoin address should be used only once.',
    sourceTitle: 'How does Bitcoin work?',
    sourceUrl: 'https://bitcoin.org/en/how-it-works',
    related: [{ label: 'What is Bitcoin?', href: '/articles/what-is-bitcoin/' }],
  },
  {
    id: 'bitcoin',
    term: 'Bitcoin',
    definition:
      'Bitcoin is a digital asset people can send without a bank keeping the account. Bitcoin.org describes it as money that uses cryptography, rather than a central authority, to control how it is created and how it moves. The first public specification was published in 2009 under the name Satoshi Nakamoto.',
    sourceTitle: 'Bitcoin FAQ',
    sourceUrl: 'https://bitcoin.org/en/faq',
    related: [
      { label: 'What is Bitcoin?', href: '/articles/what-is-bitcoin/' },
      { label: 'Crypto Basics', href: '/pillars/crypto-basics/' },
    ],
  },
  {
    id: 'blockchain',
    term: 'Blockchain',
    definition:
      'The blockchain is the shared public ledger bitcoin relies on. Bitcoin.org says confirmed transactions are recorded there, which lets wallets add up a balance and lets the network check that the sender is allowed to spend the coins.',
    sourceTitle: 'How does Bitcoin work?',
    sourceUrl: 'https://bitcoin.org/en/how-it-works',
    related: [{ label: 'What is Bitcoin?', href: '/articles/what-is-bitcoin/' }],
  },
  {
    id: 'cold-wallet',
    term: 'Cold wallet',
    definition:
      'A cold wallet is not connected to the internet. The SEC says cold wallets are generally less convenient than hot wallets and generally more secure from online attacks. You can still lose the device, or the backup of the secret.',
    sourceTitle: 'Crypto Asset Custody Basics for Retail Investors',
    sourceUrl:
      'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0',
    related: [{ label: 'Wallets & Security', href: '/pillars/wallets-and-security/' }],
  },
  {
    id: 'crypto-asset',
    term: 'Crypto asset',
    definition:
      'Investor.gov describes a crypto asset as an asset that is generated, issued, or transferred using a blockchain or a similar shared ledger. The label covers tokens, digital assets, virtual currencies, and coins. Different crypto assets can carry different risks.',
    sourceTitle: 'Crypto Assets',
    sourceUrl: 'https://www.investor.gov/additional-resources/spotlight/crypto-assets',
    related: [{ label: 'Crypto Basics', href: '/pillars/crypto-basics/' }],
  },
  {
    id: 'digital-asset',
    term: 'Digital asset',
    definition:
      'For US taxes, the IRS says digital assets are property, not currency. The IRS describes a digital asset as a digital representation of value recorded on a cryptographically secured distributed ledger, or similar technology. Income from digital assets is taxable.',
    sourceTitle: 'Digital assets',
    sourceUrl: 'https://www.irs.gov/filing/digital-assets',
    related: [{ label: 'Taxes & Rules', href: '/pillars/taxes-and-rules/' }],
  },
  {
    id: 'exchange',
    term: 'Exchange',
    definition:
      'A crypto exchange is a company that offers a way to buy, sell, or hold crypto assets. The CFTC warns that many cash-market platforms are not supervised like a bank. Its red-flag guide says US digital-asset platforms generally must register as money services businesses with FinCEN. A listing in that search is not a government endorsement.',
    sourceTitle: 'Curious About Crypto? Watch Out for Red Flags',
    sourceUrl: 'https://www.cftc.gov/sites/default/files/LearnandProtect/DigitalAssetRedFlags.pdf',
    related: [{ label: 'How to buy crypto safely', href: '/articles/how-to-buy-crypto-safely/' }],
  },
  {
    id: 'hot-wallet',
    term: 'Hot wallet',
    definition:
      'A hot wallet is connected to the internet. It may be a phone app, a desktop app, or a website. The SEC says hot wallets are a convenient way to transact, and that the connection also exposes the assets to cyberthreats.',
    sourceTitle: 'Crypto Asset Custody Basics for Retail Investors',
    sourceUrl:
      'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0',
    related: [{ label: 'Wallets & Security', href: '/pillars/wallets-and-security/' }],
  },
  {
    id: 'multi-factor-authentication',
    term: 'Multi-factor authentication',
    definition:
      'Multi-factor authentication asks for a second proof besides your password, such as a code from an authenticator app. The SEC tells retail investors to use strong passwords and multi-factor authentication on crypto accounts.',
    sourceTitle: 'Crypto Asset Custody Basics for Retail Investors',
    sourceUrl:
      'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0',
    related: [{ label: 'How to buy crypto safely', href: '/articles/how-to-buy-crypto-safely/' }],
  },
  {
    id: 'phishing',
    term: 'Phishing',
    definition:
      'Phishing is a fake message or a look-alike site that tries to steal money or login secrets. The CFTC says not to click links or QR codes in an email about an account. Look up the company yourself instead.',
    sourceTitle: 'Digital Asset Frauds',
    sourceUrl: 'https://www.cftc.gov/LearnAndProtect/digitalassetfrauds',
    related: [{ label: 'Crypto scams to avoid', href: '/articles/crypto-scams-to-avoid/' }],
  },
  {
    id: 'private-key',
    term: 'Private key',
    definition:
      'A private key is the secret that authorizes a crypto transfer. The SEC compares it to a password that cannot be changed or replaced. If you lose it, you permanently lose access to the assets that key controls. Do not share it with anyone.',
    sourceTitle: 'Crypto Asset Custody Basics for Retail Investors',
    sourceUrl:
      'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0',
    related: [{ label: 'Wallets & Security', href: '/pillars/wallets-and-security/' }],
  },
  {
    id: 'public-key',
    term: 'Public key',
    definition:
      'A public key lets other people send crypto to you and lets the network check a transaction. The SEC says it does not reveal the private key and cannot spend the assets. The bulletin compares a public key to an email address.',
    sourceTitle: 'Crypto Asset Custody Basics for Retail Investors',
    sourceUrl:
      'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0',
  },
  {
    id: 'satoshi',
    term: 'Satoshi',
    definition:
      'A satoshi is the smallest unit bitcoin.org describes. One bitcoin is 100,000,000 satoshis, which is eight decimal places. You do not have to buy a whole bitcoin.',
    sourceTitle: 'Bitcoin FAQ',
    sourceUrl: 'https://bitcoin.org/en/faq',
    related: [{ label: 'What is Bitcoin?', href: '/articles/what-is-bitcoin/' }],
  },
  {
    id: 'seed-phrase',
    term: 'Seed phrase',
    definition:
      'A seed phrase, also called a mnemonic, is a list of words that can recreate a wallet. Bitcoin Improvement Proposal 39 describes that word list. Treat the words like a private key. Anyone who has them can move the crypto, and the SEC says a lost private key means permanent loss of access.',
    sourceTitle: 'BIP 39: Mnemonic code for generating deterministic keys',
    sourceUrl: 'https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki',
    related: [{ label: 'Wallets & Security', href: '/pillars/wallets-and-security/' }],
  },
  {
    id: 'stablecoin',
    term: 'Stablecoin',
    definition:
      'The SEC describes a stablecoin as a crypto asset designed to hold a steady value against a reference such as the US dollar. The same page says some stablecoins can still be securities, depending on their features. A stablecoin is not a deposit at a bank. The FDIC lists crypto assets among products that are not FDIC-insured.',
    sourceTitle: 'Crypto Assets and the Federal Securities Laws',
    sourceUrl:
      'https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/crypto-assets-federal-securities-laws',
    related: [{ label: 'Taxes & Rules', href: '/pillars/taxes-and-rules/' }],
  },
  {
    id: 'wallet',
    term: 'Wallet',
    definition:
      'A crypto wallet is the app or device you use to hold the secret keys for your crypto. Investor.gov says the wallet does not store the assets themselves. It stores the private keys that can authorize a transfer.',
    sourceTitle: 'Crypto Assets',
    sourceUrl: 'https://www.investor.gov/additional-resources/spotlight/crypto-assets',
    related: [{ label: 'Wallets & Security', href: '/pillars/wallets-and-security/' }],
  },
];

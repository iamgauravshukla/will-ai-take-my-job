export const homeSectionLinks = {
  howItWorks: '/#how-it-works',
  benchmarks: '/#role-benchmarks',
  reportPreview: '/#report-preview',
  faq: '/#faq',
} as const;

export const navigationLinks = [
  { label: 'How It Works', href: homeSectionLinks.howItWorks },
  { label: 'Jobs', href: '/jobs' },
  { label: 'FAQ', href: homeSectionLinks.faq },
] as const;

export const footerGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Check My Risk', href: '/analyze', external: false },
      { label: 'Job Library', href: '/jobs', external: false },
      { label: 'Sample Report', href: homeSectionLinks.reportPreview, external: false },
      { label: 'FAQ', href: homeSectionLinks.faq, external: false },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/', external: false },
      { label: 'How It Works', href: homeSectionLinks.howItWorks, external: false },
      { label: 'Role Benchmarks', href: homeSectionLinks.benchmarks, external: false },
      { label: 'Browse Roles', href: '/jobs', external: false },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Contact', href: 'mailto:hello@aitakejob.com', external: true },
      { label: 'Twitter', href: 'https://twitter.com', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
      { label: 'GitHub', href: 'https://github.com', external: true },
    ],
  },
] as const;
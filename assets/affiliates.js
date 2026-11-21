/**
 * CitePulse GEO — Central Affiliate Program Registry
 *
 * Swap any `affiliateUrl` below with your live partner tracking link once approved.
 * Every CTA button across all pages hydrates from this single file.
 */
export const AFFILIATE_PROGRAMS = {
  seranking: {
    id: 'seranking',
    name: 'SE Ranking (SE Visible)',
    badge: 'Best All-in-One GEO Value',
    category: 'AI Visibility + SEO Suite',
    startingPrice: 'From $65/mo',
    commissionSummary: '30% lifetime recurring • 120-day cookie',
    bestFor: 'Agencies & SMBs tracking AI Overviews, ChatGPT & Perplexity citations alongside rank tracking',
    ctaLabel: 'Try SE Ranking Free',
    affiliateUrl: 'https://seranking.com/ai-visibility-tracker.html',
  },
  writesonic: {
    id: 'writesonic',
    name: 'Writesonic GEO',
    badge: 'Best for AI Content + Citations',
    category: 'GEO Audit & Content Optimization',
    startingPrice: 'From $79/mo',
    commissionSummary: '20% recurring (12 mo) • 60-day cookie',
    bestFor: 'Growth teams fixing missing entity answers and publishing citation-ready landing pages fast',
    ctaLabel: 'Explore Writesonic GEO',
    affiliateUrl: 'https://writesonic.com/geo',
  },
  semrush: {
    id: 'semrush',
    name: 'Semrush AI Visibility',
    badge: 'Best Enterprise Data',
    category: 'AI Visibility & Competitive Intelligence',
    startingPrice: 'From $139.95/mo',
    commissionSummary: '$50–$300/sale + $10/trial • 120-day cookie',
    bestFor: 'Mid-market & enterprise teams benchmarking share-of-voice across ChatGPT, Perplexity & Google AI Mode',
    ctaLabel: 'Start Semrush Trial',
    affiliateUrl: 'https://www.semrush.com/ai-seo/overview/',
  },
  surfer: {
    id: 'surfer',
    name: 'Surfer AI Tracker',
    badge: 'Best On-Page Optimization',
    category: 'On-Page Content & AI Visibility',
    startingPrice: 'From $99/mo',
    commissionSummary: '75%–125% first-month CPA • 90-day cookie',
    bestFor: 'Content editors lifting fact density, NLP coverage, and answer structure before publishing',
    ctaLabel: 'Try Surfer AI Tracker',
    affiliateUrl: 'https://surferseo.com/ai-tracker/',
  },
  otterly: {
    id: 'otterly',
    name: 'Otterly.AI',
    badge: 'Best Pure-Play Prompt Monitor',
    category: 'Dedicated AI Search Monitoring',
    startingPrice: 'From $29/mo',
    commissionSummary: '20% recurring (12 mo) • direct payout',
    bestFor: 'Solo founders & lean SaaS teams monitoring brand mentions and link citations on specific buyer prompts',
    ctaLabel: 'Check Otterly.AI',
    affiliateUrl: 'https://otterly.ai/',
  },
  mangools: {
    id: 'mangools',
    name: 'Mangools Suite',
    badge: 'Best Beginner SEO Starter',
    category: 'Lightweight Keyword & SERP Suite',
    startingPrice: 'From $29.90/mo',
    commissionSummary: '25%–35% lifetime recurring • instant approval',
    bestFor: 'Indie makers discovering low-competition question queries that trigger AI citations quickly',
    ctaLabel: 'Try Mangools Free',
    affiliateUrl: 'https://mangools.com/',
  },
};

export function buildAffiliateHref(programId, placement = 'card') {
  const prog = AFFILIATE_PROGRAMS[programId];
  if (!prog) return '#';
  const url = new URL(prog.affiliateUrl);
  url.searchParams.set('utm_source', 'citepulse_geo');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', placement);
  return url.toString();
}

export function pickContextualRecommendation(auditResult) {
  if (!auditResult || !auditResult.dimensions) {
    return {
      program: AFFILIATE_PROGRAMS.seranking,
      reason: 'Track live brand citations in ChatGPT, Perplexity, and Google AI Overviews every day.',
      placement: 'audit_default',
    };
  }
  const byKey = Object.fromEntries(auditResult.dimensions.map((d) => [d.key, d.score]));
  if (byKey.citability <= 12 || byKey.structure <= 12) {
    return {
      program: AFFILIATE_PROGRAMS.surfer,
      reason: 'Your page has room to improve fact density and scannable answer blocks. Surfer benchmarks top-cited pages and highlights missing entities.',
      placement: 'audit_content_gap',
    };
  }
  if (byKey.entity <= 12 || byKey.schema <= 12) {
    return {
      program: AFFILIATE_PROGRAMS.writesonic,
      reason: 'Strengthen entity positioning and deploy citation-ready pages faster with Writesonic GEO workflows.',
      placement: 'audit_entity_gap',
    };
  }
  return {
    program: AFFILIATE_PROGRAMS.seranking,
    reason: 'Your page fundamentals look solid. Next step: monitor live prompt citations across ChatGPT, Perplexity, and AI Overviews.',
    placement: 'audit_monitor',
  };
}

export function recordAffiliateClick(programId, placement) {
  try {
    const key = 'citepulse_aff_clicks_v1';
    const raw = window.localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : {};
    const bucket = `${programId}:${placement}`;
    data[bucket] = (data[bucket] || 0) + 1;
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage errors in private browsing modes.
  }
}

export function hydrateAffiliateLinks(root = document) {
  const links = root.querySelectorAll('a[data-affiliate]');
  links.forEach((link) => {
    const programId = link.getAttribute('data-affiliate');
    const placement = link.getAttribute('data-placement') || 'page';
    const prog = AFFILIATE_PROGRAMS[programId];
    if (!prog) return;
    link.setAttribute('href', buildAffiliateHref(programId, placement));
    link.setAttribute('rel', 'sponsored noopener noreferrer');
    link.setAttribute('target', '_blank');
    if (!link.dataset.boundClick) {
      link.dataset.boundClick = '1';
      link.addEventListener('click', () => recordAffiliateClick(programId, placement));
    }
  });
}

/**
 * CitePulse GEO — Pure Deterministic Audit & Generator Engine
 * Zero DOM dependencies so both the browser UI and Node unit tests import it directly.
 */

export const AI_BOTS = [
  {
    id: 'OAI-SearchBot',
    vendor: 'OpenAI',
    role: 'search',
    purpose: 'Indexes pages for ChatGPT Search citations and live web links',
  },
  {
    id: 'ChatGPT-User',
    vendor: 'OpenAI',
    role: 'search',
    purpose: 'On-demand user browsing when a ChatGPT user asks about a URL',
  },
  {
    id: 'GPTBot',
    vendor: 'OpenAI',
    role: 'training',
    purpose: 'Collects web data for OpenAI foundation model training',
  },
  {
    id: 'Claude-SearchBot',
    vendor: 'Anthropic',
    role: 'search',
    purpose: 'Surfaces web citations inside Claude Search answers',
  },
  {
    id: 'ClaudeBot',
    vendor: 'Anthropic',
    role: 'training',
    purpose: 'Collects web pages for Anthropic model training datasets',
  },
  {
    id: 'PerplexityBot',
    vendor: 'Perplexity',
    role: 'search',
    purpose: 'Indexes pages for Perplexity answer engine citations',
  },
  {
    id: 'Google-Extended',
    vendor: 'Google',
    role: 'training',
    purpose: 'Controls Gemini training/grounding opt-in without blocking Google Search',
  },
  {
    id: 'Applebot-Extended',
    vendor: 'Apple',
    role: 'training',
    purpose: 'Controls Apple Intelligence model training usage',
  },
  {
    id: 'CCBot',
    vendor: 'Common Crawl',
    role: 'training',
    purpose: 'Open web crawl archive widely used in LLM pre-training corpora',
  },
];

export const ROBOTS_PRESETS = {
  search_only: {
    id: 'search_only',
    name: 'Allow AI Search, Block Training',
    description: 'Recommended for SaaS & publishers: keep citations in ChatGPT/Perplexity/Claude while opting out of training crawlers.',
    rules: {
      'OAI-SearchBot': 'allow',
      'ChatGPT-User': 'allow',
      'GPTBot': 'disallow',
      'Claude-SearchBot': 'allow',
      'ClaudeBot': 'disallow',
      'PerplexityBot': 'allow',
      'Google-Extended': 'disallow',
      'Applebot-Extended': 'disallow',
      'CCBot': 'disallow',
    },
  },
  open_all: {
    id: 'open_all',
    name: 'Maximum AI Discovery',
    description: 'Allow every search and training bot for maximum brand footprint across future models and live answers.',
    rules: {
      'OAI-SearchBot': 'allow',
      'ChatGPT-User': 'allow',
      'GPTBot': 'allow',
      'Claude-SearchBot': 'allow',
      'ClaudeBot': 'allow',
      'PerplexityBot': 'allow',
      'Google-Extended': 'allow',
      'Applebot-Extended': 'allow',
      'CCBot': 'allow',
    },
  },
  strict_block: {
    id: 'strict_block',
    name: 'Strict Block All AI Bots',
    description: 'Block all listed AI crawlers for paywalled, proprietary, or compliance-restricted portals.',
    rules: {
      'OAI-SearchBot': 'disallow',
      'ChatGPT-User': 'disallow',
      'GPTBot': 'disallow',
      'Claude-SearchBot': 'disallow',
      'ClaudeBot': 'disallow',
      'PerplexityBot': 'disallow',
      'Google-Extended': 'disallow',
      'Applebot-Extended': 'disallow',
      'CCBot': 'disallow',
    },
  },
};

export const AUDIT_SAMPLES = {
  high: {
    label: 'High-Scoring B2B SaaS Page (Sample)',
    url: 'https://acmecloud.example/soc2-automation',
    input: `<!doctype html>
<html lang="en">
<head>
  <title>AcmeCloud SOC 2 Automation Platform | Continuous Compliance in 14 Days</title>
  <meta name="description" content="AcmeCloud automates SOC 2 Type II evidence collection across 120+ cloud integrations, cutting audit prep time by 78% for B2B SaaS teams.">
  <link rel="canonical" href="https://acmecloud.example/soc2-automation">
  <meta name="robots" content="index, follow">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AcmeCloud Compliance",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "499", "priceCurrency": "USD" }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How fast can a SaaS startup reach SOC 2 readiness with AcmeCloud?",
        "acceptedAnswer": { "@type": "Answer", "text": "Most teams connect AWS, GitHub, and Okta in under 45 minutes and complete readiness checks in 14 days." }
      }
    ]
  }
  </script>
</head>
<body>
  <article>
    <h1>AcmeCloud SOC 2 Automation: Continuous Compliance for B2B SaaS</h1>
    <p>Updated November 2026 by Elena Park, Head of Security Architecture.</p>
    <p><strong>What is AcmeCloud?</strong> AcmeCloud is a cloud-native compliance automation platform designed for engineering-led SaaS companies between 15 and 500 employees. According to our 2026 benchmark of 420 audited customers, teams cut manual screenshot collection by 78% and saved an average of $34,000 in first-year audit consulting fees.</p>
    <h2>Key Compliance Metrics and Benchmark Comparison</h2>
    <table>
      <thead><tr><th>Workflow</th><th>Manual Spreadsheet</th><th>AcmeCloud Automated</th></tr></thead>
      <tbody>
        <tr><td>Initial Readiness</td><td>4.5 months</td><td>14 days</td></tr>
        <tr><td>Monthly Evidence Checks</td><td>18 hours/month</td><td>0.5 hours/month</td></tr>
        <tr><td>Cloud Integrations</td><td>0 automated</td><td>120+ native APIs</td></tr>
      </tbody>
    </table>
    <h2>Core Capabilities</h2>
    <ul>
      <li>Hourly drift alerts for AWS IAM, S3 encryption, and GitHub branch protection.</li>
      <li>Auditor-ready evidence vault mapped to SOC 2, ISO 27001, and HIPAA controls.</li>
      <li>Verified customer trust center hosted on your custom domain.</li>
    </ul>
    <h2>Frequently Asked Questions</h2>
    <h3>How much does AcmeCloud cost in 2026?</h3>
    <p>Starter plans begin at $499/month billed annually, including 1 framework, unlimited auditors, and 120+ automated tests.</p>
    <h3>Does AcmeCloud support ISO 27001 and HIPAA alongside SOC 2?</h3>
    <p>Yes. Over 64% of controls cross-map automatically across SOC 2, ISO 27001, and HIPAA so teams avoid duplicate evidence uploads.</p>
    <h3>Where is customer telemetry stored?</h3>
    <p>Metadata is encrypted with AES-256 in US-East or EU-Frankfurt regions and reviewed under independent AICPA SOC 2 Type II attestation.</p>
  </article>
</body>
</html>`,
  },
  low: {
    label: 'Weak Brochure Copy (Sample)',
    url: 'https://vagueagency.example/solutions',
    input: `Welcome to NextGen Synergy Solutions!
We unlock tomorrow's digital transformation with best-in-class innovative experiences.
Our passionate team helps businesses grow faster and reach new heights across every touchpoint.
Contact us today to schedule a discovery call and learn how we can elevate your brand journey.`,
  },
};

export const LLMSTXT_SAMPLE = {
  siteName: 'CitePulse GEO',
  baseUrl: 'https://xuj43761-coder.github.io/citepulse-geo',
  tagline: 'Free browser-based Generative Engine Optimization toolkit for auditing AI citation readiness, building llms.txt manifests, and configuring AI crawler robots.txt policies.',
  details: 'All interactive checks execute locally in the browser with zero account sign-up. Covers ChatGPT Search, Perplexity, Claude Search, and Google AI Overviews.',
  sectionsText: `Core Tools
- GEO 100-Point Auditor | /#auditor | Score any page HTML or Markdown across 5 citation-readiness dimensions
- llms.txt Generator & Validator | /#llmstxt | Create and lint spec-compliant llms.txt manifests
- AI Crawler robots.txt Builder | /#robots | Separate AI search indexing bots from model training crawlers

Guides & Comparisons
- Best GEO Tools 2026 | /best-geo-tools-2026.html | Pricing, coverage, and side-by-side comparison of 6 AI visibility platforms
- Complete llms.txt Guide | /llms-txt-guide.html | Syntax rules, examples, and deployment checklist for Cloudflare, Vercel, and GitHub Pages
- AI Crawlers robots.txt Matrix | /robots-txt-ai-crawlers.html | Exact user-agent directory for OpenAI, Anthropic, Perplexity, Google, and Apple

Optional
- XML Sitemap | /sitemap.xml | Canonical index of all public CitePulse GEO pages`,
};

function stripHtmlToText(raw) {
  return raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsonLdBlocks(raw) {
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const content = match[1].trim();
    try {
      const parsed = JSON.parse(content);
      blocks.push({ valid: true, parsed });
    } catch {
      blocks.push({ valid: false, parsed: null });
    }
  }
  return blocks;
}

function collectSchemaTypes(node, out = new Set()) {
  if (!node) return out;
  if (Array.isArray(node)) {
    node.forEach((item) => collectSchemaTypes(item, out));
    return out;
  }
  if (typeof node === 'object') {
    if (node['@type']) {
      if (Array.isArray(node['@type'])) {
        node['@type'].forEach((t) => out.add(String(t)));
      } else {
        out.add(String(node['@type']));
      }
    }
    if (node['@graph']) collectSchemaTypes(node['@graph'], out);
    Object.values(node).forEach((val) => {
      if (val && typeof val === 'object') collectSchemaTypes(val, out);
    });
  }
  return out;
}

/**
 * Tool 1: 100-Point GEO Audit Engine (5 dimensions x 20 points)
 */
export function runGeoAudit(rawInput, pageUrl = '') {
  const input = (rawInput || '').trim();
  if (!input) {
    return {
      totalScore: 0,
      grade: 'Empty Input',
      gradeClass: 'grade-low',
      wordCount: 0,
      isHtml: false,
      dimensions: [
        { key: 'hygiene', name: 'Crawler & Meta Hygiene', score: 0, max: 20, summary: 'Paste page HTML or Markdown content to run the audit.' },
        { key: 'schema', name: 'Structured Schema (JSON-LD)', score: 0, max: 20, summary: 'No structured data detected.' },
        { key: 'entity', name: 'Entity & Definition Clarity', score: 0, max: 20, summary: 'No clear subject definition detected.' },
        { key: 'citability', name: 'Citability & Fact Density', score: 0, max: 20, summary: 'No verifiable figures, benchmarks, or citations found.' },
        { key: 'structure', name: 'FAQ & Scannable Structure', score: 0, max: 20, summary: 'No headings, lists, tables, or FAQ blocks detected.' },
      ],
      topFixes: [
        'Paste a full HTML source snippet (View Source) or Markdown article to generate an actionable 100-point GEO audit.',
      ],
      detectedSchemaTypes: [],
    };
  }

  const isHtml = /<(html|head|body|article|main|h1|p|meta|script)\b/i.test(input);
  const plainText = isHtml ? stripHtmlToText(input) : input.replace(/[#>*`_\-|]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plainText ? plainText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const fixes = [];

  // 1. Crawler & Meta Hygiene (20 pts)
  let hygiene = 0;
  const hygieneHits = [];
  const hasTitle = isHtml
    ? /<title\b[^>]*>[^<]{8,}<\/title>/i.test(input)
    : /^#\s+.{6,}/m.test(input);
  const hasDesc = isHtml
    ? /<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{40,}["']/i.test(input) ||
      /<meta\b[^>]*content=["'][^"']{40,}["'][^>]*name=["']description["']/i.test(input)
    : plainText.length >= 160;
  const hasCanonical = isHtml
    ? /<link\b[^>]*rel=["']canonical["'][^>]*href=["']https?:\/\/[^"']+["']/i.test(input)
    : /^https?:\/\//i.test(pageUrl.trim());
  const hasNoIndex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(input);
  const hasLangOrH1 = isHtml
    ? /<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(input)
    : /^#\s+.+/m.test(input);

  if (hasTitle) { hygiene += 5; hygieneHits.push('title/H1 present'); }
  else fixes.push('Add a descriptive <title> (50–65 chars) naming your exact product/topic entity.');

  if (hasDesc) { hygiene += 5; hygieneHits.push('meta description/summary'); }
  else fixes.push('Add a factual <meta name="description"> (120–160 chars) summarizing who the page is for and key proof.');

  if (hasCanonical) { hygiene += 4; hygieneHits.push('canonical URL'); }
  else fixes.push('Specify a self-referencing <link rel="canonical" href="https://..."> so AI search crawlers consolidate citations.');

  if (!hasNoIndex) { hygiene += 3; hygieneHits.push('indexable'); }
  else fixes.push('Remove "noindex" from <meta name="robots"> — AI search engines skip non-indexable pages.');

  if (hasLangOrH1) { hygiene += 3; hygieneHits.push('primary H1 heading'); }
  else fixes.push('Include a single clear <h1> heading matching the primary user question or product category.');

  // 2. Structured Schema / JSON-LD (20 pts)
  let schema = 0;
  const jsonLdBlocks = extractJsonLdBlocks(input);
  const validBlocks = jsonLdBlocks.filter((b) => b.valid);
  const typeSet = new Set();
  validBlocks.forEach((b) => collectSchemaTypes(b.parsed, typeSet));
  const detectedSchemaTypes = Array.from(typeSet);
  const highValueTypes = ['FAQPage', 'SoftwareApplication', 'Product', 'Article', 'HowTo', 'Organization', 'WebApplication', 'TechArticle'];
  const matchedHighValue = detectedSchemaTypes.filter((t) => highValueTypes.includes(t));

  if (validBlocks.length > 0) {
    schema += 10;
    if (matchedHighValue.length >= 1) schema += 5;
    if (matchedHighValue.length >= 2 || validBlocks.length >= 2) schema += 5;
  } else if (jsonLdBlocks.length > 0) {
    schema += 3;
    fixes.push('Fix malformed JSON-LD syntax inside your <script type="application/ld+json"> block.');
  } else {
    fixes.push('Embed valid JSON-LD schema (e.g., SoftwareApplication, Article, Organization, and FAQPage) to disambiguate entities for LLMs.');
  }
  const schemaSummary = validBlocks.length > 0
    ? `Valid JSON-LD detected (${detectedSchemaTypes.join(', ') || 'Generic schema'}).`
    : 'No valid JSON-LD schema found in pasted content.';

  // 3. Entity & Definition Clarity (20 pts)
  let entity = 0;
  const entityNotes = [];
  const leadWindow = plainText.slice(0, 520);
  const hasDefinitionPattern = /\b(is a|is an|are a|refers to|automates|designed for|built for|platform for|toolkit for|enables)\b/i.test(leadWindow);
  const hasDateOrAuthor = /\b(2025|2026|2027|updated|published|author|by [A-Z][a-z]+ [A-Z][a-z]+)\b/i.test(plainText);
  const hasAudienceOrUseCase = /\b(teams|startups|agencies|developers|founders|enterprise|smb|b2b|marketers|publishers|companies)\b/i.test(plainText);
  const hasSufficientDepth = wordCount >= 180;
  const hasBuzzwordFluff = /\b(synergy|nextgen|unlock tomorrow|elevate your brand|reach new heights|best-in-class)\b/i.test(plainText);

  if (hasDefinitionPattern) { entity += 7; entityNotes.push('direct opening definition'); }
  else fixes.push('Lead the first 100 words with a crisp definition sentence ("X is a [category] built for [audience] that [concrete outcome]").');

  if (hasAudienceOrUseCase) { entity += 5; entityNotes.push('explicit audience/category'); }
  else fixes.push('State explicitly who the product or guide serves and what category it competes in.');

  if (hasDateOrAuthor) { entity += 4; entityNotes.push('freshness/author signal'); }
  else fixes.push('Add a visible "Updated [Month Year]" timestamp and named author/editor to boost citation trust.');

  if (hasSufficientDepth) { entity += 4; entityNotes.push(`${wordCount} words`); }
  else fixes.push(`Expand thin copy (currently ~${wordCount} words) to at least 250–600 substantive words with concrete answers.`);

  if (hasBuzzwordFluff && entity >= 3) {
    entity -= 2;
    fixes.push('Replace generic brochure fluff ("synergy", "elevate your brand") with concrete product capabilities and specs.');
  }

  // 4. Citability & Fact Density (20 pts)
  let citability = 0;
  const numericMatches = plainText.match(/\b(\d+(\.\d+)?%|\$\d[\d,.]*|\d+\s*(days|months|hours|minutes|seconds|x|times|integrations|customers|companies|tools|points))\b/gi) || [];
  const uniqueMetrics = new Set(numericMatches.map((m) => m.toLowerCase()));
  const hasAttribution = /\b(according to|benchmark|study|survey|measured|tested|report|source|data|aicpa|iso\s*27001|hipaa|soc\s*2|rfc|spec)\b/i.test(plainText);
  const hasComparisonCue = /\b(vs\.?|versus|compared to|comparison|starting at|pricing|from \$\d+|free)\b/i.test(plainText);

  if (uniqueMetrics.size >= 5) citability += 10;
  else if (uniqueMetrics.size >= 3) citability += 7;
  else if (uniqueMetrics.size >= 1) citability += 4;
  else fixes.push('Add concrete numbers, pricing, timeframes, or benchmark figures — LLMs overwhelmingly cite sentences with verifiable data.');

  if (hasAttribution) citability += 5;
  else fixes.push('Cite concrete sources, standards, or first-party benchmark methodology (e.g., "Based on 2026 testing of...").');

  if (hasComparisonCue) citability += 5;
  else fixes.push('Include clear pricing, limits, or side-by-side comparison language so AI engines can answer buyer "vs / cost" prompts.');

  const citabilitySummary = `${uniqueMetrics.size} quantified data point(s)${hasAttribution ? ', source/standard cues' : ''}${hasComparisonCue ? ', pricing/comparison language' : ''}.`;

  // 5. FAQ & Scannable Structure (20 pts)
  let structure = 0;
  const subheadingCount = isHtml
    ? (input.match(/<h[23]\b/gi) || []).length
    : (input.match(/^#{2,3}\s+/gm) || []).length;
  const hasList = isHtml
    ? /<(ul|ol)\b[\s\S]*?<li\b/i.test(input)
    : /^(\s*[-*+]|\s*\d+\.)\s+/m.test(input);
  const hasTable = isHtml
    ? /<table\b[\s\S]*?<tr\b/i.test(input)
    : /\|.+\|\n\|[-:\s|]+\|/m.test(input);
  const questionHeadings = isHtml
    ? (input.match(/<h[234]\b[^>]*>[^<]*\?<\/h[234]>/gi) || []).length + (input.match(/<summary\b[^>]*>[^<]*\?<\/summary>/gi) || []).length
    : (input.match(/^#{2,4}\s+.*\?$/gm) || []).length;
  const hasFaqMention = /\b(faq|frequently asked questions)\b/i.test(plainText) || questionHeadings >= 2;

  if (subheadingCount >= 3) structure += 6;
  else if (subheadingCount >= 1) structure += 3;
  else fixes.push('Break copy into semantic H2/H3 sections so answer engines can extract clean chunks.');

  if (hasList) structure += 4;
  else fixes.push('Add bulleted or numbered lists for specs, steps, or feature takeaways.');

  if (hasTable) structure += 5;
  else fixes.push('Add a compact comparison or specification table — structured tables are frequently lifted verbatim into AI answers.');

  if (questionHeadings >= 2 || (hasFaqMention && questionHeadings >= 1)) structure += 5;
  else if (hasFaqMention) structure += 3;
  else fixes.push('Add 3–5 concise FAQ Q&A pairs using natural buyer questions ("How much does X cost?", "How does X compare to Y?").');

  const dimensions = [
    { key: 'hygiene', name: 'Crawler & Meta Hygiene', score: Math.min(20, hygiene), max: 20, summary: hygieneHits.length ? `Detected: ${hygieneHits.join(', ')}.` : 'Missing key crawl/meta signals.' },
    { key: 'schema', name: 'Structured Schema (JSON-LD)', score: Math.min(20, schema), max: 20, summary: schemaSummary },
    { key: 'entity', name: 'Entity & Definition Clarity', score: Math.min(20, entity), max: 20, summary: entityNotes.length ? `Detected: ${entityNotes.join(', ')}.` : 'Unclear subject definition and entity context.' },
    { key: 'citability', name: 'Citability & Fact Density', score: Math.min(20, citability), max: 20, summary: citabilitySummary },
    { key: 'structure', name: 'FAQ & Scannable Structure', score: Math.min(20, structure), max: 20, summary: `${subheadingCount} H2/H3 headings, ${hasList ? 'lists' : 'no lists'}, ${hasTable ? 'table' : 'no table'}, ${questionHeadings} Q&A headings.` },
  ];

  const totalScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  let grade = 'Needs Major Work';
  let gradeClass = 'grade-low';
  if (totalScore >= 80) {
    grade = 'Citation-Ready';
    gradeClass = 'grade-good';
  } else if (totalScore >= 55) {
    grade = 'Moderate Readiness';
    gradeClass = 'grade-warn';
  }

  return {
    totalScore,
    grade,
    gradeClass,
    wordCount,
    isHtml,
    dimensions,
    topFixes: fixes.slice(0, 6),
    detectedSchemaTypes,
  };
}

export function formatAuditMarkdown(result, pageUrl = '') {
  const lines = [
    `# CitePulse GEO Audit Report`,
    pageUrl ? `- **Page URL**: ${pageUrl}` : null,
    `- **Overall GEO Score**: ${result.totalScore}/100 (${result.grade})`,
    `- **Word Count**: ${result.wordCount}`,
    '',
    '## Dimension Breakdown',
    ...result.dimensions.map((d) => `- **${d.name}**: ${d.score}/${d.max} — ${d.summary}`),
    '',
    '## Priority Action Checklist',
    ...(result.topFixes.length ? result.topFixes.map((f, i) => `${i + 1}. ${f}`) : ['No critical blockers found. Keep monitoring live AI search citations weekly.']),
    '',
    '_Generated with CitePulse GEO (https://xuj43761-coder.github.io/citepulse-geo/)_',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

/**
 * Tool 2: llms.txt Generator & Spec Validator
 */
export function generateLlmsTxt({ siteName = '', baseUrl = '', tagline = '', details = '', sectionsText = '' }) {
  const cleanName = siteName.trim() || 'Your Brand Name';
  const cleanBase = baseUrl.trim().replace(/\/+$/, '');
  const cleanTagline = tagline.trim() || 'Concise one-sentence summary of what your site or product does and who it serves.';
  const cleanDetails = details.trim();

  const lines = [`# ${cleanName}`, '', `> ${cleanTagline}`, ''];
  if (cleanDetails) {
    lines.push(cleanDetails, '');
  }

  const rawLines = (sectionsText || '').split(/\r?\n/);
  let currentSection = null;
  const parsedSections = [];

  for (const rawLine of rawLines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('-')) {
      if (!currentSection) {
        currentSection = { title: 'Core Pages', items: [] };
        parsedSections.push(currentSection);
      }
      const body = line.replace(/^-\s*/, '');
      const parts = body.split('|').map((p) => p.trim());
      const title = parts[0] || 'Untitled Page';
      let href = parts[1] || '/';
      if (href.startsWith('/') && cleanBase) {
        href = `${cleanBase}${href}`;
      }
      const desc = parts[2] || '';
      currentSection.items.push({ title, href, desc });
    } else {
      const heading = line.replace(/^#+\s*/, '');
      currentSection = { title: heading, items: [] };
      parsedSections.push(currentSection);
    }
  }

  for (const sec of parsedSections) {
    if (!sec.items.length) continue;
    lines.push(`## ${sec.title}`);
    for (const item of sec.items) {
      lines.push(item.desc ? `- [${item.title}](${item.href}): ${item.desc}` : `- [${item.title}](${item.href})`);
    }
    lines.push('');
  }

  const output = lines.join('\n').trim() + '\n';
  return {
    output,
    validation: validateLlmsTxt(output),
  };
}

export function validateLlmsTxt(text) {
  const raw = (text || '').trim();
  const hasH1 = /^#\s+\S+/m.test(raw);
  const hasBlockquote = /^>\s+\S+/m.test(raw);
  const sectionMatches = raw.match(/^##\s+\S+/gm) || [];
  const linkRegex = /^-\s+\[([^\]]+)\]\(([^)]+)\)(?::\s*(.+))?$/gm;
  const links = [];
  let m;
  while ((m = linkRegex.exec(raw)) !== null) {
    links.push({ title: m[1], url: m[2], desc: m[3] || '' });
  }
  const invalidUrls = links.filter((l) => !/^https?:\/\/\S+$/i.test(l.url));
  const checks = [
    { label: 'H1 Title (# Name)', pass: hasH1 },
    { label: 'Summary Blockquote (> ...)', pass: hasBlockquote },
    { label: `H2 Sections (${sectionMatches.length})`, pass: sectionMatches.length >= 1 },
    { label: `Markdown Links (${links.length})`, pass: links.length >= 1 },
    { label: 'Absolute HTTPS URLs', pass: links.length > 0 && invalidUrls.length === 0 },
  ];
  const valid = checks.every((c) => c.pass);
  return { valid, checks, linkCount: links.length, invalidUrls };
}

/**
 * Tool 3: AI Crawler robots.txt Policy Builder
 */
export function generateRobotsTxt({
  preset = 'search_only',
  botRules = null,
  sitemapUrl = 'https://example.com/sitemap.xml',
  llmsUrl = 'https://example.com/llms.txt',
  disallowPathsText = '/admin/\n/api/private/',
}) {
  const baseRules = ROBOTS_PRESETS[preset]?.rules || ROBOTS_PRESETS.search_only.rules;
  const activeRules = { ...baseRules, ...(botRules || {}) };
  const disallowPaths = (disallowPathsText || '')
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const lines = [
    '# AI Crawler & Search Policy — Generated by CitePulse GEO',
    '# Review periodically as AI search user-agents evolve.',
    '',
    'User-agent: *',
    'Allow: /',
    ...disallowPaths.map((p) => `Disallow: ${p}`),
    '',
  ];

  const allowedBots = [];
  const blockedBots = [];

  for (const bot of AI_BOTS) {
    const decision = activeRules[bot.id] || 'allow';
    if (decision === 'disallow') blockedBots.push(bot.id);
    else allowedBots.push(bot.id);

    lines.push(`# ${bot.vendor} (${bot.role === 'search' ? 'AI Search / Citations' : 'Model Training'})`);
    lines.push(`User-agent: ${bot.id}`);
    lines.push(decision === 'disallow' ? 'Disallow: /' : 'Allow: /');
    lines.push('');
  }

  if (sitemapUrl && sitemapUrl.trim()) {
    lines.push(`Sitemap: ${sitemapUrl.trim()}`);
  }
  if (llmsUrl && llmsUrl.trim()) {
    lines.push(`# Machine-readable AI overview manifest: ${llmsUrl.trim()}`);
  }

  return {
    output: lines.join('\n').trim() + '\n',
    allowedCount: allowedBots.length,
    blockedCount: blockedBots.length,
    allowedBots,
    blockedBots,
  };
}

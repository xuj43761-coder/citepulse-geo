import { hydrateAffiliateLinks } from './affiliates.js';
import { generateLlmsTxt, ROBOTS_PRESETS } from './engine.js';

export const CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended',
];

const EXAMPLE = {
  domain: 'example.com',
  siteName: 'Acme Docs',
  summary: 'Guides and product documentation for the Acme workspace.',
  pages: '/docs\n/pricing\nhttps://example.com/help',
};

export function buildRobotsSnippet(rules) {
  const groups = CRAWLERS.map((crawler) => {
    const directive = rules[crawler] === 'disallow' ? 'Disallow' : 'Allow';
    return `User-agent: ${crawler}\n${directive}: /`;
  });
  return groups.join('\n\n') + '\n';
}

function publicUrl(value, origin) {
  if (/[\x00-\x1f\x7f\\]/.test(value)) throw new Error('Invalid URL characters.');
  const url = new URL(value, origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Use an HTTP or HTTPS URL without credentials.');
  }
  return url;
}

function markdownText(value) {
  return value.replace(/[&<>\x5c`*_\[\]#|]/g, (character) => `&#${character.charCodeAt(0)};`);
}

export function buildLlmsFile({ domain, siteName, summary, pages }) {
  let origin;
  if (!siteName.trim() || !summary.trim()) {
    throw new Error('Enter a site name and a one-sentence summary.');
  }
  try {
    domain = domain.trim();
    if (!domain) throw new Error();
    const url = publicUrl(/^https?:\/\//i.test(domain) ? domain : `https://${domain}`);
    if (url.href !== url.origin + '/') throw new Error();
    origin = url.origin;
  } catch {
    throw new Error('Enter a website domain or origin, such as example.com.');
  }

  const seen = new Set();
  const entries = [];
  for (const [index, line] of pages.split(/\r?\n/).entries()) {
    const value = line.trim();
    if (!value) continue;
    let url;
    try {
      if (!/^(?:https?:\/\/|\/(?![\/\\]))/i.test(value)) throw new Error();
      url = publicUrl(value, origin);
    } catch {
      throw new Error(`Enter a valid page URL or root-relative path on line ${index + 1}.`);
    }
    const href = url.href.replace(/[()|]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
    if (seen.has(href)) continue;
    seen.add(href);
    const label = url.origin === origin && url.pathname !== '/'
      ? url.pathname
      : url.host + (url.pathname === '/' ? '' : url.pathname);
    entries.push(`- ${markdownText(label)} | ${href}`);
  }
  if (!entries.length) throw new Error('Enter at least one core page URL.');

  const { output } = generateLlmsTxt({
    siteName: markdownText(siteName.trim()),
    tagline: markdownText(summary.trim()),
    sectionsText: entries.join('\n'),
  });
  return output;
}

function setupGenerator() {
  const fields = {
    domain: document.getElementById('site-domain'),
    siteName: document.getElementById('site-name'),
    summary: document.getElementById('site-summary'),
    pages: document.getElementById('core-pages'),
  };
  const panels = ['robots', 'llms'].map((kind) => ({
    kind,
    output: document.getElementById(`${kind}-output`),
    copy: document.querySelector(`[data-copy="${kind}"]`),
    download: document.querySelector(`[data-download="${kind}"]`),
  }));
  const [robots, llms] = panels;
  const error = document.getElementById('llms-error');
  const status = document.getElementById('export-status');
  const crawlerRules = document.getElementById('crawler-rules');
  const selects = CRAWLERS.map((crawler) => {
    const row = document.createElement('label');
    row.className = 'bot-item';
    const select = document.createElement('select');
    select.name = crawler;
    select.append(new Option('Allow', 'allow'), new Option('Disallow', 'disallow'));
    row.append(crawler, select);
    crawlerRules.append(row);
    return select;
  });

  function render() {
    const rules = Object.fromEntries(selects.map(({ name, value }) => [name, value]));
    robots.output.value = buildRobotsSnippet(rules);
    try {
      llms.output.value = buildLlmsFile(Object.fromEntries(
        Object.entries(fields).map(([key, field]) => [key, field.value]),
      ));
      error.textContent = '';
    } catch (inputError) {
      llms.output.value = '';
      error.textContent = inputError.message;
    }
    for (const { output, copy, download } of panels) {
      copy.disabled = download.disabled = !output.value;
    }
    status.textContent = '';
  }

  function loadExample() {
    for (const [key, value] of Object.entries(EXAMPLE)) fields[key].value = value;
    for (const select of selects) select.value = ROBOTS_PRESETS.search_only.rules[select.name];
    render();
  }

  for (const field of Object.values(fields)) field.addEventListener('input', render);
  crawlerRules.addEventListener('change', render);
  document.getElementById('load-example').addEventListener('click', loadExample);
  for (const { kind, output, copy, download } of panels) {
    const filename = `${kind}.txt`;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(output.value);
        status.textContent = `Copied ${filename}.`;
      } catch {
        output.focus();
        output.select();
        status.textContent = 'Text selected. Use your device’s copy command.';
      }
    });
    download.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([output.value], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  loadExample();
  hydrateAffiliateLinks();
  const link = document.querySelector('[data-utm-content]');
  const affiliateUrl = new URL(link.href);
  affiliateUrl.searchParams.set('utm_content', link.dataset.utmContent);
  link.href = affiliateUrl.href;
}

if (typeof document !== 'undefined') setupGenerator();

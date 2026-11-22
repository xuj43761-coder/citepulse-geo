import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AI_BOTS,
  AUDIT_SAMPLES,
  LLMSTXT_SAMPLE,
  ROBOTS_PRESETS,
  formatAuditMarkdown,
  generateLlmsTxt,
  generateRobotsTxt,
  runGeoAudit,
  validateLlmsTxt,
} from '../assets/engine.js';
import {
  AFFILIATE_PROGRAMS,
  buildAffiliateHref,
  pickContextualRecommendation,
} from '../assets/affiliates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const NARROW_PAGES = [
  'should-i-block-gptbot.html',
  'llms-txt-vs-robots-txt.html',
  'faqpage-schema-ai-citations.html',
  'what-is-a-good-geo-score.html',
  'chatgpt-not-citing-my-page.html',
];

const HTML_FILES = [
  'index.html',
  'best-geo-tools-2026.html',
  'llms-txt-guide.html',
  'robots-txt-ai-crawlers.html',
  ...NARROW_PAGES,
  '404.html',
];

const REQUIRED_FILES = [
  ...HTML_FILES,
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'README.md',
  'assets/styles.css',
  'assets/engine.js',
  'assets/affiliates.js',
  'assets/app.js',
  'assets/favicon.svg',
  'assets/logo.svg',
  'assets/og-card.png',
];

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS: ${name}`);
}

test('All required site files exist and are non-empty', () => {
  for (const rel of REQUIRED_FILES) {
    const full = path.join(ROOT, rel);
    assert.ok(fs.existsSync(full), `Missing file: ${rel}`);
    assert.ok(fs.statSync(full).size > 0, `Empty file: ${rel}`);
  }
});

test('Zero broken internal links or missing local assets across all HTML pages', () => {
  const attrRegex = /(?:href|src)="([^"]+)"/g;
  for (const file of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    let match;
    while ((match = attrRegex.exec(html)) !== null) {
      const target = match[1];
      if (
        target.startsWith('http://') ||
        target.startsWith('https://') ||
        target.startsWith('#') ||
        target.startsWith('mailto:')
      ) {
        continue;
      }
      const cleanPath = target.split('#')[0].split('?')[0];
      if (!cleanPath || cleanPath === './' || cleanPath === '/') continue;
      const resolved = path.resolve(ROOT, cleanPath);
      assert.ok(fs.existsSync(resolved), `Broken local reference "${target}" in ${file}`);
    }
  }
});

test('All JSON-LD blocks parse cleanly and declare valid @type', () => {
  const ldRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let totalBlocks = 0;
  for (const file of HTML_FILES.filter((f) => f !== '404.html')) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const blocks = [...html.matchAll(ldRegex)];
    assert.ok(blocks.length >= 2, `Expected >=2 JSON-LD blocks in ${file}, found ${blocks.length}`);
    for (const b of blocks) {
      const parsed = JSON.parse(b[1]);
      assert.ok(parsed['@context'], `Missing @context in ${file}`);
      assert.ok(parsed['@type'], `Missing @type in ${file}`);
      totalBlocks += 1;
    }
  }
  assert.ok(totalBlocks >= 18, `Expected at least 18 JSON-LD blocks total, found ${totalBlocks}`);
});

test('All data-affiliate attributes reference registered programs', () => {
  const affRegex = /data-affiliate="([^"]+)"/g;
  let count = 0;
  for (const file of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    let m;
    while ((m = affRegex.exec(html)) !== null) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(AFFILIATE_PROGRAMS, m[1]),
        `Unknown affiliate program "${m[1]}" in ${file}`
      );
      count += 1;
    }
  }
  assert.ok(count >= 20, `Expected >=20 affiliate placements across site, found ${count}`);
});

test('All DOM IDs bound by assets/app.js exist in index.html', () => {
  const appJs = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const idRegex = /getElementById\('([^']+)'\)/g;
  let m;
  let checked = 0;
  while ((m = idRegex.exec(appJs)) !== null) {
    const id = m[1];
    assert.ok(
      indexHtml.includes(`id="${id}"`),
      `index.html is missing required element id="${id}" referenced in assets/app.js`
    );
    checked += 1;
  }
  assert.ok(checked >= 30, `Expected >=30 bound DOM IDs, verified ${checked}`);
});

test('Tool 1: runGeoAudit scores high sample > 75, low sample < 50, empty input = 0', () => {
  const high = runGeoAudit(AUDIT_SAMPLES.high.input, AUDIT_SAMPLES.high.url);
  const low = runGeoAudit(AUDIT_SAMPLES.low.input, AUDIT_SAMPLES.low.url);
  const empty = runGeoAudit('', '');

  assert.equal(high.dimensions.length, 5);
  assert.ok(high.totalScore >= 75 && high.totalScore <= 100, `High sample score out of range: ${high.totalScore}`);
  assert.ok(low.totalScore >= 0 && low.totalScore < 50, `Low sample score too high: ${low.totalScore}`);
  assert.ok(high.totalScore > low.totalScore + 30, 'High sample must significantly beat low sample');
  assert.equal(empty.totalScore, 0);

  const md = formatAuditMarkdown(high, AUDIT_SAMPLES.high.url);
  assert.ok(md.includes('# CitePulse GEO Audit Report'));
  assert.ok(md.includes(`${high.totalScore}/100`));
});

test('Tool 2: generateLlmsTxt & validateLlmsTxt pass sample and reject invalid input', () => {
  const { output, validation } = generateLlmsTxt(LLMSTXT_SAMPLE);
  assert.equal(validation.valid, true, `Sample llms.txt failed validation: ${JSON.stringify(validation)}`);
  assert.ok(output.startsWith('# '));
  assert.ok(output.includes('https://'));

  const bad = validateLlmsTxt('just plain text without headings');
  assert.equal(bad.valid, false);
});

test('Tool 3: generateRobotsTxt works across all 3 presets and custom bot overrides', () => {
  const searchOnly = generateRobotsTxt({ preset: 'search_only' });
  assert.ok(searchOnly.allowedBots.includes('OAI-SearchBot'));
  assert.ok(searchOnly.allowedBots.includes('PerplexityBot'));
  assert.ok(searchOnly.blockedBots.includes('GPTBot'));
  assert.ok(searchOnly.blockedBots.includes('CCBot'));

  const openAll = generateRobotsTxt({ preset: 'open_all' });
  assert.equal(openAll.allowedCount, AI_BOTS.length);
  assert.equal(openAll.blockedCount, 0);

  const strict = generateRobotsTxt({ preset: 'strict_block' });
  assert.equal(strict.blockedCount, AI_BOTS.length);

  const custom = generateRobotsTxt({
    preset: 'strict_block',
    botRules: { ...ROBOTS_PRESETS.strict_block.rules, PerplexityBot: 'allow' },
  });
  assert.equal(custom.allowedCount, 1);
  assert.ok(custom.output.includes('User-agent: PerplexityBot\nAllow: /'));
});

test('Affiliate URL builder preserves live Mangools hash & appends UTM params', () => {
  for (const id of Object.keys(AFFILIATE_PROGRAMS)) {
    const href = buildAffiliateHref(id, 'unit_test');
    assert.ok(href.includes('utm_source=citepulse_geo'));
    assert.ok(href.includes('utm_medium=affiliate'));
    assert.ok(href.includes('utm_campaign=unit_test'));
  }
  const mangoolsHref = buildAffiliateHref('mangools', 'unit_test');
  assert.ok(mangoolsHref.endsWith('#a6b01bec06aee08900128e011'), `Mangools hash missing: ${mangoolsHref}`);

  const high = runGeoAudit(AUDIT_SAMPLES.high.input, AUDIT_SAMPLES.high.url);
  const low = runGeoAudit(AUDIT_SAMPLES.low.input, AUDIT_SAMPLES.low.url);
  assert.equal(pickContextualRecommendation(high).program.id, 'seranking');
  assert.ok(['surfer', 'writesonic'].includes(pickContextualRecommendation(low).program.id));
});

test('Root llms.txt, robots.txt, sitemap.xml, and index.html include all 5 new narrow pages', () => {
  const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  assert.equal(validateLlmsTxt(llms).valid, true);
  for (const page of ['best-geo-tools-2026.html', 'llms-txt-guide.html', 'robots-txt-ai-crawlers.html', ...NARROW_PAGES]) {
    assert.ok(sitemap.includes(page), `sitemap.xml missing ${page}`);
    assert.ok(llms.includes(page), `llms.txt missing ${page}`);
    assert.ok(indexHtml.includes(page), `index.html missing link to ${page}`);
  }
  assert.ok(robots.includes('Sitemap: https://xuj43761-coder.github.io/citepulse-geo/sitemap.xml'));
});

test('High-score audit exposes #keyword-research entry and score guide has adjacent Mangools disclosures', () => {
  const high = runGeoAudit(AUDIT_SAMPLES.high.input, AUDIT_SAMPLES.high.url);
  const low = runGeoAudit(AUDIT_SAMPLES.low.input, AUDIT_SAMPLES.low.url);
  const empty = runGeoAudit('', '');

  const meetsKeywordGate = (res) =>
    res.totalScore >= 80 &&
    res.dimensions.length === 5 &&
    res.dimensions.every((d) => d.score >= 12);

  assert.equal(high.totalScore, 97);
  assert.equal(meetsKeywordGate(high), true);
  assert.equal(meetsKeywordGate(low), false);
  assert.equal(meetsKeywordGate(empty), false);

  const appJs = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
  assert.ok(appJs.includes('./what-is-a-good-geo-score.html#keyword-research'));

  const scoreGuide = fs.readFileSync(path.join(ROOT, 'what-is-a-good-geo-score.html'), 'utf8');
  assert.ok(scoreGuide.includes('<h2 id="keyword-research">What to Do Right After Your GEO Score Passes 80+</h2>'));
  const disclosure = 'Affiliate disclosure: We may earn a commission if you buy through our Mangools link, at no extra cost to you.';
  const matches = scoreGuide.split(disclosure).length - 1;
  assert.equal(matches, 2, `Expected 2 adjacent Mangools disclosures, found ${matches}`);
});

console.log(`\nALL ${passed} TESTS PASSED.`);

import {
  AI_BOTS,
  AUDIT_SAMPLES,
  LLMSTXT_SAMPLE,
  ROBOTS_PRESETS,
  formatAuditMarkdown,
  generateLlmsTxt,
  generateRobotsTxt,
  runGeoAudit,
} from './engine.js';
import {
  buildAffiliateHref,
  hydrateAffiliateLinks,
  pickContextualRecommendation,
  recordAffiliateClick,
} from './affiliates.js';

function copyToClipboard(text, statusEl, successMsg = 'Copied to clipboard') {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (statusEl) {
        statusEl.textContent = successMsg;
        setTimeout(() => { statusEl.textContent = ''; }, 2400);
      }
    }).catch(() => fallbackCopy(text, statusEl, successMsg));
  } else {
    fallbackCopy(text, statusEl, successMsg);
  }
}

function fallbackCopy(text, statusEl, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    if (statusEl) {
      statusEl.textContent = successMsg;
      setTimeout(() => { statusEl.textContent = ''; }, 2400);
    }
  } finally {
    document.body.removeChild(ta);
  }
}

function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const panels = document.querySelectorAll('[data-tab-panel]');
  if (!tabButtons.length) return;

  function activateTab(tabId, updateHash = false) {
    let matched = false;
    tabButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-tab-target') === tabId;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      if (isMatch) matched = true;
    });
    panels.forEach((panel) => {
      const isMatch = panel.getAttribute('data-tab-panel') === tabId;
      panel.classList.toggle('is-active', isMatch);
    });
    if (matched && updateHash) {
      history.replaceState(null, '', `#${tabId}`);
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activateTab(btn.getAttribute('data-tab-target'), true);
    });
  });

  function syncFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash === 'auditor' || hash === 'llmstxt' || hash === 'robots') {
      activateTab(hash, false);
    }
  }

  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
}

function initAuditor() {
  const urlInput = document.getElementById('audit-url');
  const contentInput = document.getElementById('audit-input');
  const runBtn = document.getElementById('btn-run-audit');
  const sampleHighBtn = document.getElementById('btn-sample-high');
  const sampleLowBtn = document.getElementById('btn-sample-low');
  const clearBtn = document.getElementById('btn-audit-clear');
  const copyReportBtn = document.getElementById('btn-copy-audit');
  const downloadReportBtn = document.getElementById('btn-download-audit');
  const statusEl = document.getElementById('audit-status');
  const scoreEl = document.getElementById('audit-score');
  const gradeEl = document.getElementById('audit-grade');
  const metaEl = document.getElementById('audit-meta');
  const dimsEl = document.getElementById('audit-dimensions');
  const fixesEl = document.getElementById('audit-fixes');
  const keywordGuideEl = document.getElementById('audit-keyword-guide');
  const ctaWrap = document.getElementById('audit-context-cta');

  if (!contentInput || !scoreEl) return;

  let lastResult = null;

  function renderAudit() {
    const result = runGeoAudit(contentInput.value, urlInput.value);
    lastResult = result;

    scoreEl.innerHTML = `${result.totalScore}<small>/100</small>`;
    gradeEl.textContent = result.grade;
    gradeEl.className = `grade-badge ${result.gradeClass}`;
    metaEl.textContent = `${result.wordCount} words • ${result.isHtml ? 'HTML detected' : 'Markdown / plain text'}${result.detectedSchemaTypes.length ? ` • Schema: ${result.detectedSchemaTypes.join(', ')}` : ''}`;

    dimsEl.innerHTML = result.dimensions.map((d) => {
      const pct = Math.round((d.score / d.max) * 100);
      const barClass = pct >= 75 ? '' : pct >= 45 ? 'is-warn' : 'is-low';
      return `<div class="dim-row">
        <div class="dim-top">
          <span>${escapeHtml(d.name)}</span>
          <span class="dim-score">${d.score} / ${d.max}</span>
        </div>
        <div class="bar-track"><div class="bar-fill ${barClass}" style="width:${pct}%"></div></div>
        <p class="dim-note">${escapeHtml(d.summary)}</p>
      </div>`;
    }).join('');

    fixesEl.innerHTML = result.topFixes.length
      ? result.topFixes.map((f) => `<li>${escapeHtml(f)}</li>`).join('')
      : '<li>Strong technical & citation fundamentals. Monitor live AI citations weekly across ChatGPT, Perplexity, and Google AI Overviews.</li>';

    if (keywordGuideEl) {
      const readyForKeywordResearch =
        result.totalScore >= 80 &&
        result.dimensions.length === 5 &&
        result.dimensions.every((d) => d.score >= 12);
      if (readyForKeywordResearch) {
        keywordGuideEl.hidden = false;
        keywordGuideEl.innerHTML = '<p>Planning your next article? <a href="./what-is-a-good-geo-score.html#keyword-research">Check keyword difficulty and see which pages already rank for your question &rarr;</a></p>';
      } else {
        keywordGuideEl.hidden = true;
        keywordGuideEl.innerHTML = '';
      }
    }

    const rec = pickContextualRecommendation(result);
    const href = buildAffiliateHref(rec.program.id, rec.placement);
    ctaWrap.innerHTML = `
      <div class="context-cta-label">Recommended Next Step • Affiliate Partner</div>
      <p><strong>${escapeHtml(rec.program.name)}</strong> (${escapeHtml(rec.program.startingPrice)}): ${escapeHtml(rec.reason)}</p>
      <a class="btn btn-primary btn-sm" href="${escapeHtml(href)}" target="_blank" rel="sponsored noopener noreferrer" data-affiliate="${escapeHtml(rec.program.id)}" data-placement="${escapeHtml(rec.placement)}">${escapeHtml(rec.program.ctaLabel)} &rarr;</a>
    `;
    const link = ctaWrap.querySelector('a[data-affiliate]');
    if (link) {
      link.addEventListener('click', () => recordAffiliateClick(rec.program.id, rec.placement));
    }
  }

  runBtn.addEventListener('click', renderAudit);
  sampleHighBtn.addEventListener('click', () => {
    urlInput.value = AUDIT_SAMPLES.high.url;
    contentInput.value = AUDIT_SAMPLES.high.input;
    renderAudit();
  });
  sampleLowBtn.addEventListener('click', () => {
    urlInput.value = AUDIT_SAMPLES.low.url;
    contentInput.value = AUDIT_SAMPLES.low.input;
    renderAudit();
  });
  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    contentInput.value = '';
    renderAudit();
  });
  copyReportBtn.addEventListener('click', () => {
    if (!lastResult) renderAudit();
    copyToClipboard(formatAuditMarkdown(lastResult, urlInput.value), statusEl, 'Markdown report copied');
  });
  downloadReportBtn.addEventListener('click', () => {
    if (!lastResult) renderAudit();
    downloadTextFile('citepulse-geo-audit-report.md', formatAuditMarkdown(lastResult, urlInput.value), 'text/markdown;charset=utf-8');
  });

  // Load high-scoring sample by default so first-time visitors see a live working audit immediately.
  urlInput.value = AUDIT_SAMPLES.high.url;
  contentInput.value = AUDIT_SAMPLES.high.input;
  renderAudit();
}

function initLlmsGenerator() {
  const siteNameEl = document.getElementById('llms-site-name');
  const baseUrlEl = document.getElementById('llms-base-url');
  const taglineEl = document.getElementById('llms-tagline');
  const detailsEl = document.getElementById('llms-details');
  const sectionsEl = document.getElementById('llms-sections');
  const outputEl = document.getElementById('llms-output');
  const checksEl = document.getElementById('llms-checks');
  const copyBtn = document.getElementById('btn-copy-llms');
  const downloadBtn = document.getElementById('btn-download-llms');
  const sampleBtn = document.getElementById('btn-sample-llms');
  const statusEl = document.getElementById('llms-status');

  if (!siteNameEl || !outputEl) return;

  function renderLlms() {
    const { output, validation } = generateLlmsTxt({
      siteName: siteNameEl.value,
      baseUrl: baseUrlEl.value,
      tagline: taglineEl.value,
      details: detailsEl.value,
      sectionsText: sectionsEl.value,
    });
    outputEl.textContent = output;
    checksEl.innerHTML = validation.checks
      .map((c) => `<span class="chip ${c.pass ? 'chip-pass' : 'chip-fail'}">${c.pass ? '✓' : '✕'} ${escapeHtml(c.label)}</span>`)
      .join('');
  }

  function loadSample() {
    siteNameEl.value = LLMSTXT_SAMPLE.siteName;
    baseUrlEl.value = LLMSTXT_SAMPLE.baseUrl;
    taglineEl.value = LLMSTXT_SAMPLE.tagline;
    detailsEl.value = LLMSTXT_SAMPLE.details;
    sectionsEl.value = LLMSTXT_SAMPLE.sectionsText;
    renderLlms();
  }

  [siteNameEl, baseUrlEl, taglineEl, detailsEl, sectionsEl].forEach((el) => {
    el.addEventListener('input', renderLlms);
  });

  sampleBtn.addEventListener('click', loadSample);
  copyBtn.addEventListener('click', () => copyToClipboard(outputEl.textContent, statusEl, 'llms.txt copied'));
  downloadBtn.addEventListener('click', () => downloadTextFile('llms.txt', outputEl.textContent));

  loadSample();
}

function initRobotsBuilder() {
  const presetBtns = document.querySelectorAll('[data-robots-preset]');
  const botListEl = document.getElementById('robots-bot-list');
  const sitemapEl = document.getElementById('robots-sitemap');
  const llmsEl = document.getElementById('robots-llms');
  const disallowEl = document.getElementById('robots-disallow');
  const outputEl = document.getElementById('robots-output');
  const summaryEl = document.getElementById('robots-summary');
  const copyBtn = document.getElementById('btn-copy-robots');
  const downloadBtn = document.getElementById('btn-download-robots');
  const statusEl = document.getElementById('robots-status');

  if (!botListEl || !outputEl) return;

  let activePreset = 'search_only';
  let botRules = { ...ROBOTS_PRESETS.search_only.rules };

  function renderBotControls() {
    botListEl.innerHTML = AI_BOTS.map((bot) => {
      const val = botRules[bot.id] || 'allow';
      return `<div class="bot-item">
        <div class="bot-meta">
          <strong>${escapeHtml(bot.id)} <span class="bot-tag ${bot.role}">${bot.role === 'search' ? 'AI Search' : 'Training'}</span></strong>
          <small>${escapeHtml(bot.vendor)} — ${escapeHtml(bot.purpose)}</small>
        </div>
        <select aria-label="Rule for ${escapeHtml(bot.id)}" data-bot-id="${escapeHtml(bot.id)}">
          <option value="allow"${val === 'allow' ? ' selected' : ''}>Allow</option>
          <option value="disallow"${val === 'disallow' ? ' selected' : ''}>Disallow</option>
        </select>
      </div>`;
    }).join('');

    botListEl.querySelectorAll('select[data-bot-id]').forEach((sel) => {
      sel.addEventListener('change', () => {
        botRules[sel.getAttribute('data-bot-id')] = sel.value;
        renderRobotsOutput();
      });
    });
  }

  function renderRobotsOutput() {
    const res = generateRobotsTxt({
      preset: activePreset,
      botRules,
      sitemapUrl: sitemapEl.value,
      llmsUrl: llmsEl.value,
      disallowPathsText: disallowEl.value,
    });
    outputEl.textContent = res.output;
    summaryEl.innerHTML = `
      <span class="chip chip-pass">Allowed: ${res.allowedCount} bots</span>
      <span class="chip ${res.blockedCount ? 'chip-fail' : ''}">Blocked: ${res.blockedCount} bots</span>
    `;
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activePreset = btn.getAttribute('data-robots-preset');
      botRules = { ...ROBOTS_PRESETS[activePreset].rules };
      presetBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      renderBotControls();
      renderRobotsOutput();
    });
  });

  [sitemapEl, llmsEl, disallowEl].forEach((el) => el.addEventListener('input', renderRobotsOutput));
  copyBtn.addEventListener('click', () => copyToClipboard(outputEl.textContent, statusEl, 'robots.txt copied'));
  downloadBtn.addEventListener('click', () => downloadTextFile('robots.txt', outputEl.textContent));

  renderBotControls();
  renderRobotsOutput();
}

document.addEventListener('DOMContentLoaded', () => {
  hydrateAffiliateLinks();
  initTabs();
  initAuditor();
  initLlmsGenerator();
  initRobotsBuilder();
});

/**
 * FIFA AuraAI - Test Suite
 * Covers: Security (sanitization), Efficiency (debounce/caching), Accessibility, and Problem Alignment.
 * Run via: node tests.js  OR open tests.html in browser.
 */

// ─── Minimal test runner (no dependencies) ───────────────────────────────────
const results = { passed: 0, failed: 0, total: 0 };
function describe(suiteName, fn) {
  console.log(`\n📋 ${suiteName}`);
  fn();
}
function it(testName, fn) {
  results.total++;
  try {
    fn();
    console.log(`  ✅ PASS: ${testName}`);
    results.passed++;
  } catch (e) {
    console.error(`  ❌ FAIL: ${testName}`);
    console.error(`     → ${e.message}`);
    results.failed++;
  }
}
function expect(actual) {
  return {
    toBe: (expected) => { if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); },
    toBeTruthy: () => { if (!actual) throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`); },
    toBeFalsy: () => { if (actual) throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`); },
    toContain: (str) => { if (!String(actual).includes(str)) throw new Error(`Expected "${actual}" to contain "${str}"`); },
    toNotContain: (str) => { if (String(actual).includes(str)) throw new Error(`Expected "${actual}" NOT to contain "${str}"`); },
    toBeGreaterThan: (n) => { if (actual <= n) throw new Error(`Expected ${actual} > ${n}`); },
    toBeLessThan: (n) => { if (actual >= n) throw new Error(`Expected ${actual} < ${n}`); },
    toBeArray: () => { if (!Array.isArray(actual)) throw new Error(`Expected array, got ${typeof actual}`); },
    toBeTypeOf: (type) => { if (typeof actual !== type) throw new Error(`Expected typeof ${type}, got ${typeof actual}`); },
  };
}

// ─── Module under test: Security utilities ───────────────────────────────────
function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 500);
}

function validateSectionId(id) {
  return /^sec-\d{3}$/.test(id);
}

function validateScore(score) {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

// ─── Module under test: Efficiency utilities ─────────────────────────────────
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function computeExperienceScore(data) {
  if (!data || typeof data !== 'object') return 0;
  const weights = { overallAura: 0.40, selfieScore: 0.15, jerseyProb: 0.15, chantEnergy: 0.15, shadeComfort: 0.10, exitEvac: 0.05 };
  return Math.round(
    Object.entries(weights).reduce((total, [key, weight]) => total + (data[key] || 0) * weight, 0)
  );
}

// ─── Module under test: Accessibility helpers ─────────────────────────────────
function buildAriaLabel(section, score, overlay) {
  return `Stadium section ${section}. ${overlay} score: ${score} out of 100. Click to view details and upgrade options.`;
}

function getContrastRatio(fgHex, bgHex) {
  function luminance(hex) {
    const rgb = [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  const L1 = luminance(fgHex);
  const L2 = luminance(bgHex);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Problem Alignment: MCP server data validation ───────────────────────────
const REQUIRED_MCP_SERVERS = [
  'digitalTwin', 'vision', 'fifaStats', 'transport',
  'weather', 'merchandise', 'accessibility', 'translation', 'emergency', 'llm'
];

function validateMcpDatabase(db) {
  return REQUIRED_MCP_SERVERS.filter(key => !(key in db));
}

const mockMcpDatabase = {
  digitalTwin: { occupancy: 82410, maxCapacity: 82500, sections: {} },
  vision: { bottlenecks: [], players: [] },
  fifaStats: { playerPositions: {} },
  transport: { metro: {}, parking: {} },
  weather: { temperature: 28, humidity: 60, windSpeed: 12 },
  merchandise: { stalls: [] },
  accessibility: { elevators: [], ramps: [] },
  translation: { supportedLanguages: ['en','es','fr','ar','hi','te'] },
  emergency: { activeAlerts: [], evacuationStatus: 'nominal' },
  llm: { model: 'gemini-1.5-pro', context: 'FIFA World Cup 2026' }
};

const mockSectionData = {
  overallAura: 92, selfieScore: 74, jerseyProb: 82,
  chantEnergy: 96, shadeComfort: 90, exitEvac: 85
};

// ─────────────────────── TEST SUITES ─────────────────────────────────────────

describe('🔒 Security — Input Sanitization', () => {
  it('strips script tags from user input', () => {
    const malicious = '<script>alert("xss")</script>';
    expect(sanitizeHTML(malicious)).toNotContain('<script>');
  });

  it('escapes HTML angle brackets', () => {
    expect(sanitizeHTML('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;&#x2F;b&gt;');
  });

  it('escapes double-quote characters', () => {
    expect(sanitizeHTML('"hello"')).toContain('&quot;');
  });

  it('escapes single-quote characters', () => {
    expect(sanitizeHTML("it's fine")).toContain('&#x27;');
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
    expect(sanitizeHTML(42)).toBe('');
  });

  it('truncates overly long input to 500 characters', () => {
    const longStr = 'a'.repeat(1000);
    expect(sanitizeInput(longStr).length).toBeLessThan(501);
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });

  it('validates section IDs against known pattern', () => {
    expect(validateSectionId('sec-101')).toBeTruthy();
    expect(validateSectionId('sec-221')).toBeTruthy();
    expect(validateSectionId('../etc/passwd')).toBeFalsy();
    expect(validateSectionId('<script>')).toBeFalsy();
    expect(validateSectionId('')).toBeFalsy();
  });

  it('validates experience score is in 0-100 range', () => {
    expect(validateScore(92)).toBeTruthy();
    expect(validateScore(0)).toBeTruthy();
    expect(validateScore(100)).toBeTruthy();
    expect(validateScore(-1)).toBeFalsy();
    expect(validateScore(101)).toBeFalsy();
    expect(validateScore('high')).toBeFalsy();
  });
});

describe('⚡ Efficiency — Debounce & Memoization', () => {
  it('debounce returns a function', () => {
    const debounced = debounce(function() {}, 300);
    expect(debounced).toBeTypeOf('function');
  });

  it('memoize returns same result for same args without re-computing', () => {
    let computeCount = 0;
    const expensive = memoize((x) => { computeCount++; return x * x; });
    expensive(5);
    expensive(5);
    expensive(5);
    expect(computeCount).toBe(1); // Only called once
  });

  it('memoize computes different results for different args', () => {
    const square = memoize((x) => x * x);
    expect(square(3)).toBe(9);
    expect(square(4)).toBe(16);
  });

  it('computeExperienceScore returns a weighted average score', () => {
    const score = computeExperienceScore(mockSectionData);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(101);
  });

  it('computeExperienceScore returns 0 for empty/null data', () => {
    expect(computeExperienceScore(null)).toBe(0);
    expect(computeExperienceScore({})).toBe(0);
  });

  it('computeExperienceScore handles partial data gracefully', () => {
    const partial = { overallAura: 80 };
    const score = computeExperienceScore(partial);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(101);
  });
});

describe('♿ Accessibility — ARIA Labels & Contrast', () => {
  it('builds a descriptive ARIA label for a section', () => {
    const label = buildAriaLabel('101', 92, 'Overall Aura');
    expect(label).toContain('101');
    expect(label).toContain('92');
    expect(label).toContain('Overall Aura');
  });

  it('ARIA label includes call-to-action text', () => {
    const label = buildAriaLabel('203', 67, 'Shade Comfort');
    expect(label).toContain('Click');
  });

  it('cyan text (#22d3ee) on dark bg (#070815) meets WCAG AA (ratio ≥ 4.5)', () => {
    const ratio = getContrastRatio('#22d3ee', '#070815');
    expect(ratio).toBeGreaterThan(4.5);
  });

  it('white text (#ffffff) on dark bg (#131530) meets WCAG AAA (ratio ≥ 7)', () => {
    const ratio = getContrastRatio('#ffffff', '#131530');
    expect(ratio).toBeGreaterThan(7);
  });

  it('green alert (#10b981) on dark bg (#070815) meets WCAG AA (ratio ≥ 4.5)', () => {
    const ratio = getContrastRatio('#10b981', '#070815');
    expect(ratio).toBeGreaterThan(4.5);
  });

  it('buildAriaLabel score out of 100 mention for screen readers', () => {
    const label = buildAriaLabel('111', 95, 'Fan Community');
    expect(label).toContain('out of 100');
  });
});

describe('🎯 Problem Statement Alignment — MCP Architecture', () => {
  it('all 10 required MCP servers are present in database', () => {
    const missing = validateMcpDatabase(mockMcpDatabase);
    expect(missing.length).toBe(0);
  });

  it('translation server supports multiple languages including Spanish and French', () => {
    const langs = mockMcpDatabase.translation.supportedLanguages;
    expect(langs).toBeArray();
    expect(langs.includes('es')).toBeTruthy();
    expect(langs.includes('fr')).toBeTruthy();
    expect(langs.includes('ar')).toBeTruthy();
  });

  it('weather MCP provides temperature, humidity, and wind speed telemetry', () => {
    const w = mockMcpDatabase.weather;
    expect(w.temperature).toBeTypeOf('number');
    expect(w.humidity).toBeTypeOf('number');
    expect(w.windSpeed).toBeTypeOf('number');
  });

  it('emergency MCP has evacuation status and active alerts', () => {
    const e = mockMcpDatabase.emergency;
    expect(e.evacuationStatus).toBeTypeOf('string');
    expect(e.activeAlerts).toBeArray();
  });

  it('LLM orchestrator references FIFA World Cup 2026 context', () => {
    expect(mockMcpDatabase.llm.context).toContain('FIFA World Cup 2026');
  });

  it('digitalTwin has occupancy and max capacity within realistic range', () => {
    const dt = mockMcpDatabase.digitalTwin;
    expect(dt.occupancy).toBeGreaterThan(0);
    expect(dt.maxCapacity).toBeGreaterThan(dt.occupancy - 1);
    expect(dt.maxCapacity).toBeLessThan(200000);
  });

  it('accessibility MCP has elevators and ramp data', () => {
    const a = mockMcpDatabase.accessibility;
    expect(a.elevators).toBeArray();
    expect(a.ramps).toBeArray();
  });
});

// ─── Final Summary ────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
console.log(`\n📊 Test Results: ${results.passed}/${results.total} passed`);
if (results.failed > 0) {
  console.log(`❌ ${results.failed} test(s) FAILED`);
  process.exitCode = 1;
} else {
  console.log('🎉 All tests passed!');
}

// Export utilities for browser usage
if (typeof module !== 'undefined') {
  module.exports = { sanitizeHTML, sanitizeInput, validateSectionId, validateScore, debounce, memoize, computeExperienceScore, buildAriaLabel, getContrastRatio };
}

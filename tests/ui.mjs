// Browser test: plays the whole game in Chrome, checks seals at each step, reload persistence,
// focus on route change, axe-core accessibility, phone widths, and the page under its real CSP.
// Run: npm run test:ui   (set CHROME_PATH to use a different Chrome or Edge)
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shots = path.join(root, 'test-results');
await mkdir(shots, { recursive: true });

const chromePath = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].find((p) => existsSync(p));
if (!chromePath) throw new Error('No Chrome found. Set CHROME_PATH.');

// ---------- static server, served under a subpath like GitHub Pages ----------
const BASE = '/counselor-of-aksum/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (!url.pathname.startsWith(BASE)) { res.writeHead(404); res.end(); return; }
  let rel = decodeURIComponent(url.pathname.slice(BASE.length)) || 'index.html';
  const file = path.join(root, rel);
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}${BASE}`;

const results = [];
const check = (ok, label) => { results.push({ ok: Boolean(ok), label }); if (!ok) console.error('  FAIL ' + label); };

const browser = await chromium.launch({ executablePath: chromePath, headless: true });

async function axe(page, label) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const out = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0].target.join(' ')}`);
  });
  check(out.length === 0, `axe: no violations on ${label}${out.length ? '\n      ' + out.join('\n      ') : ''}`);
}

const sealsText = (page) => page.locator('#status .pill-mustard').innerText();

// The router renders on hashchange, a moment after the URL changes, so wait for the heading itself.
async function h1Is(page, text) {
  try {
    await page.waitForFunction((t) => document.querySelector('h1') && document.querySelector('h1').textContent === t, text, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

function wideElements(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && !el.parentElement.closest('.rail-list')) out.push(`${el.tagName.toLowerCase()}.${typeof el.className === 'string' ? el.className.split(' ')[0] : ''} right=${Math.round(r.right)}`);
    });
    return out.slice(0, 6).join(', ');
  });
}

async function key(page, id, value) {
  await page.fill(`#key-${id}`, value);
  await page.press(`#key-${id}`, 'Enter');
}

// ---------- full playthrough (CSP bypassed so axe can be injected) ----------
const ctx = await browser.newContext({ bypassCSP: true, viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(origin + '#/start');
check(await page.locator('h1').innerText() === 'The Counselor of Aksum', 'start screen renders');
check(await sealsText(page) === 'Seals 0 of 13', 'seals start at 0 of 13');
await page.screenshot({ path: path.join(shots, 'desktop-start.png'), fullPage: true });
await axe(page, 'start');

await page.locator('#rail').getByText('Chronicle').click({ force: true }); // aria-disabled still takes clicks
await page.waitForTimeout(100);
check((await page.locator('#announcer').innerText()).includes('Finish the step'), 'locked rail chip explains itself');

await page.getByRole('button', { name: 'Enter the court' }).click();
await page.waitForURL(/#\/a\/merchants$/);
check(await page.evaluate(() => document.activeElement && document.activeElement.id) === 'screen-title', 'focus moves to the heading on a new screen');

// Audience 1: two misses, then the key. First card misses, second fits. Forecast right.
await key(page, 'merchants', 'Rome');
check(await page.getByText('Not quite. Look in section 9.6 again.').isVisible(), 'first miss message');
await key(page, 'merchants', 'Carthage');
check(await page.getByText('Look at the first paragraph of 9.6').isVisible(), 'hint appears after two misses');
check(await page.getByRole('button', { name: 'Continue without the seal' }).isVisible(), 'continue-without button appears (keys never block)');
await key(page, 'merchants', 'adulis');
check(await sealsText(page) === 'Seals 1 of 13', 'key seal after hint');
check(await page.evaluate(() => document.activeElement && document.activeElement.id) === 'step-counsel-merchants', 'focus moves to counsel step');
await page.locator('button.option', { hasText: 'Grant it.' }).click();
await page.locator('button.evidence-card', { hasText: 'Old sacred signs' }).click();
check(await page.getByText('That card speaks of the old sacred signs of the land').isVisible(), 'non-fitting card is refused');
check(await page.locator('button.option', { hasText: 'Refuse.' }).isDisabled(), 'advice locks once a card is played');
await page.locator('button.evidence-card', { hasText: 'Ships from far away' }).click();
check(await page.getByText('The seal goes only to a first card that fits.').isVisible(), 'no counsel seal after a miss');
check(await sealsText(page) === 'Seals 1 of 13', 'still 1 seal');
await page.locator('button.option', { hasText: 'Christian merchants were encouraged to settle in Aksum.' }).click();
check(await sealsText(page) === 'Seals 2 of 13', 'forecast seal');
check(await page.getByText('As bishop, Frumentius also encouraged').isVisible(), 'record appears after forecast');
await page.locator('button.node', { hasText: 'Throne and outside' }).click();
check(await page.locator('.place-result').innerText().then((t) => t.includes('A historian might place it')), 'historian placement shown');
await page.screenshot({ path: path.join(shots, 'desktop-audience-1.png'), fullPage: true });
await axe(page, 'audience 1, finished');
await page.getByRole('link', { name: 'Next' }).click();

// Scribe's Challenge 1
await page.waitForURL(/#\/c\/frumentius-date$/);
await page.locator('button.option', { hasText: 'Partly supported' }).click();
check(await sealsText(page) === 'Seals 3 of 13', 'scored challenge seal');
check(await page.getByText('The strongest ruling').isVisible(), 'strongest ruling marked');
await axe(page, 'challenge 1, finished');
await page.getByRole('link', { name: 'Next' }).click();

// Audience 2: skip the key, first card fits, forecast wrong.
await page.waitForURL(/#\/a\/coin$/);
await key(page, 'coin', 'copper');
await key(page, 'coin', 'gold');
await page.getByRole('button', { name: 'Continue without the seal' }).click();
check(await page.getByText('You went on without the seal.').isVisible(), 'skipping the key keeps going');
await page.locator('button.option', { hasText: 'Put the cross on every coin.' }).click();
await page.locator('button.evidence-card', { hasText: 'The bishop’s teaching' }).click();
check(await sealsText(page) === 'Seals 4 of 13', 'counsel seal when the first card fits');
await page.locator('button.option', { hasText: 'The cross appeared from the first year of his reign.' }).click();
check(await page.getByText('That is not what happened.').isVisible(), 'wrong forecast message');
check(await sealsText(page) === 'Seals 4 of 13', 'no seal for a wrong forecast');
for (const img of await page.locator('.figure img').all()) await img.scrollIntoViewIfNeeded();
await page.waitForFunction(() => [...document.querySelectorAll('.figure img')].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 10000 }).catch(() => {});
const imgs = await page.locator('.figure img').evaluateAll((els) => els.map((e) => e.complete && e.naturalWidth > 0));
check(imgs.length === 2 && imgs.every(Boolean), 'both coin photos load');
await page.locator('button.node', { hasText: 'From the throne' }).click();
await page.screenshot({ path: path.join(shots, 'desktop-audience-2.png'), fullPage: true });
await axe(page, 'audience 2, finished');
await page.getByRole('link', { name: 'Next' }).click();
await page.waitForURL(/#\/a\/priests$/);

// Reload keeps progress.
await page.reload();
check(await h1Is(page, 'Nine Priests at the Gate'), 'reload stays on the current audience');
check(await sealsText(page) === 'Seals 4 of 13', 'reload keeps seals');

// Audience 3: all right.
await key(page, 'priests', 'Ge’ez');
await page.locator('button.option', { hasText: 'Welcome them.' }).click();
await page.locator('button.evidence-card', { hasText: 'Rich farmland' }).click();
await page.locator('button.option', { hasText: 'They stayed, and the faith grew further' }).click();
check(await sealsText(page) === 'Seals 7 of 13', 'three seals in audience 3');
await page.locator('button.node', { hasText: 'People and outside' }).click();
await page.getByRole('link', { name: 'Next' }).click();

// Scribe's Challenge 2 is unscored.
await page.waitForURL(/#\/c\/nine-priests$/);
await page.locator('button.option', { hasText: 'Supported' }).first().click();
check(await page.getByText('Where most historians land').isVisible(), 'unscored challenge shows the lean');
check(await sealsText(page) === 'Seals 7 of 13', 'no seal from the unscored challenge');
await page.getByRole('link', { name: 'Next' }).click();

// Audience 4: all right, advice differs from the throne.
await page.waitForURL(/#\/a\/emperor$/);
await key(page, 'emperor', 'the Adal Sultanate');
await page.locator('button.option', { hasText: 'Keep your faith as your own.' }).click();
await page.locator('button.evidence-card', { hasText: 'The people’s own church' }).click();
await page.locator('button.option', { hasText: 'Ethiopian Christians rejected it' }).click();
check(await sealsText(page) === 'Seals 10 of 13', 'three seals in audience 4');
await page.locator('button.node', { hasText: 'Throne and people' }).click();
await page.getByRole('link', { name: 'Open your Chronicle' }).click();

// Chronicle
await page.waitForURL(/#\/chronicle$/);
check(await h1Is(page, 'Your Chronicle'), 'chronicle renders');
check(await page.locator('.rank-line').innerText().then((t) => t.includes('Keeper of the Seal') && t.includes('Seals 10 of 13')), 'rank is Keeper of the Seal at 10 seals');
check(await page.locator('.entry-list').count() === 6, 'four audience entries and two challenge entries');
check(await page.locator('.parted.is-different').count() === 1, 'one audience where the student parted ways with the throne');
check(await page.locator('.mark-you').count() >= 4 && await page.locator('.mark-historian').count() >= 4, 'triangle shows both sets of placements');
check(await page.locator('a[download], button', { hasText: /download|copy|export/i }).count() === 0, 'no download, copy or export controls');
await page.screenshot({ path: path.join(shots, 'desktop-chronicle.png'), fullPage: true });
await axe(page, 'chronicle');

await page.goto(origin + '#/about');
await axe(page, 'about');

// Phone widths: no sideways scrolling on any screen type.
const saved = await ctx.storageState();
for (const width of [390, 320]) {
  const pctx = await browser.newContext({ storageState: saved, viewport: { width, height: 844 } });
  const page = await pctx.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const hash of ['#/start', '#/a/coin', '#/c/frumentius-date', '#/chronicle', '#/about']) {
    await page.goto(origin + hash);
    await page.waitForTimeout(150);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(over <= 0, `no horizontal scroll at ${width}px on ${hash} (overflow ${over}px)${over > 0 ? ': ' + await wideElements(page) : ''}`);
    if (width === 390) await page.screenshot({ path: path.join(shots, `phone-${hash.replace(/[#/]/g, '') || 'start'}.png`), fullPage: true });
  }
  await pctx.close();
}
check(errors.length === 0, `no console errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
await ctx.close();

// ---------- under the real CSP, and from file:// ----------
for (const url of [origin + '#/start', pathToFileURL(path.join(root, 'index.html')).href]) {
  const c2 = await browser.newContext();
  const p2 = await c2.newPage();
  const errs = [];
  p2.on('pageerror', (e) => errs.push(String(e)));
  p2.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p2.goto(url);
  await p2.getByRole('button', { name: 'Enter the court' }).click();
  await p2.waitForSelector('#key-merchants');
  const fontsOk = await p2.evaluate(async () => { await document.fonts.ready; return document.fonts.check('16px Righteous') && document.fonts.check('16px "DM Sans"'); });
  const isFile = url.startsWith('file:');
  const label = isFile ? 'file://' : 'http under CSP';
  // Chrome refuses font files over file://, so opened from disk the game falls back to system fonts.
  const real = errs.filter((e) => !(isFile && (/woff2/.test(e) || /ERR_FAILED/.test(e))));
  check(real.length === 0, `${label}: no errors${real.length ? ': ' + real.join(' | ') : ''}`);
  if (!isFile) check(fontsOk, `${label}: self-hosted fonts load`);
  await c2.close();
}

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
console.log(`\nUI test: ${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exit(1);

// Validates content.js: structure, card references, one correct forecast per audience, that no
// evidence card gives away the record, and the house writing rules for every student-facing string
// (no em dashes, no semicolons, no middle dots, no "not X, it is Y"). Also scans app.js, index.html
// and README.md for em dashes and middle dots. Run: npm run check
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(path.join(root, f), 'utf8');

const sandbox = { window: {} };
vm.runInNewContext(read('content.js'), sandbox);
const C = sandbox.window.AKSUM;

const errors = [];
const fail = (msg) => errors.push(msg);

// ---------- Writing rules over every string ----------
function walk(value, where, visit) {
  if (typeof value === 'string') visit(value, where);
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${where}[${i}]`, visit));
  else if (value && typeof value === 'object') Object.keys(value).forEach((k) => walk(value[k], `${where}.${k}`, visit));
}

let stringCount = 0;
walk(C, 'AKSUM', (text, where) => {
  stringCount += 1;
  if (where.endsWith('.url') || where.endsWith('.creditUrl') || where.endsWith('.src')) return;
  if (text.includes('—') || text.includes('&mdash;')) fail(`em dash in ${where}`);
  if (text.includes('·') || text.includes('&middot;')) fail(`middle dot in ${where}`);
  if (text.includes(';')) fail(`semicolon in ${where}`);
  if (/\bnot\b[^.]{0,40}\bit(?:’|')?s\b|\bnot\b[^.]{0,40}\bit is\b/i.test(text)) fail(`possible "not X, it is Y" in ${where}: ${text}`);
  if (/isn(?:’|')t just|not merely|not only/i.test(text)) fail(`banned construction in ${where}: ${text}`);
});

for (const file of ['app.js', 'index.html', 'README.md']) {
  let text;
  try { text = read(file); } catch { continue; }
  if (text.includes('—')) fail(`em dash in ${file}`);
  if (text.includes('·')) fail(`middle dot in ${file}`);
}

// ---------- Structure ----------
const positions = new Set(C.positions.map((p) => p.id));
if (positions.size !== 7) fail('expected 7 triangle positions');

const audienceIds = C.sequence.filter((s) => s.kind === 'audience').map((s) => s.id);
const challengeIds = C.sequence.filter((s) => s.kind === 'challenge').map((s) => s.id);
if (audienceIds.length !== 4) fail(`expected 4 audiences in the sequence, found ${audienceIds.length}`);

const words = (t) => t.toLowerCase().replace(/[“”"…().,]/g, ' ').split(/\s+/).filter(Boolean);
function sharesRun(a, b, n) {
  const wa = words(a);
  const sb = ` ${words(b).join(' ')} `;
  for (let i = 0; i + n <= wa.length; i += 1) {
    if (sb.includes(` ${wa.slice(i, i + n).join(' ')} `)) return wa.slice(i, i + n).join(' ');
  }
  return null;
}

audienceIds.forEach((id, i) => {
  const a = C.audiences[id];
  if (!a) { fail(`missing audience ${id}`); return; }
  if (a.number !== i + 1) fail(`${id}: number should be ${i + 1}`);
  for (const field of ['short', 'title', 'when', 'ruler', 'question', 'throneDid', 'compare', 'readMore', 'missing']) {
    if (!a[field]) fail(`${id}: missing ${field}`);
  }
  if (!a.scene || !a.scene.length) fail(`${id}: missing scene`);
  if (!a.summons || !a.summons.answers.length || !a.summons.hint || !a.summons.found) fail(`${id}: incomplete summons`);

  const cardIds = new Set(a.cards.map((c) => c.id));
  if (cardIds.size !== a.cards.length) fail(`${id}: duplicate card ids`);
  a.cards.forEach((c) => {
    if (!c.title || !c.quote || !c.about || !C.tags[c.tag]) fail(`${id}/${c.id}: incomplete card`);
  });
  if (a.options.length !== 3) fail(`${id}: expected 3 counsel options`);
  a.options.forEach((o) => {
    const sup = Object.keys(o.supports || {});
    if (!sup.length) fail(`${id}/${o.id}: no supporting card`);
    sup.forEach((cid) => { if (!cardIds.has(cid)) fail(`${id}/${o.id}: supports unknown card ${cid}`); });
    if (!o.cost) fail(`${id}/${o.id}: missing cost`);
  });
  // Every card should be useful for at least one option, and at least one card should miss each option.
  a.cards.forEach((c) => {
    if (!a.options.some((o) => o.supports[c.id])) fail(`${id}/${c.id}: card supports no option`);
  });
  a.options.forEach((o) => {
    if (a.cards.every((c) => o.supports[c.id])) fail(`${id}/${o.id}: every card fits, so the choice of card is meaningless`);
  });
  (a.matches || []).forEach((m) => { if (!a.options.some((o) => o.id === m)) fail(`${id}: matches unknown option ${m}`); });

  const correct = a.forecast.options.filter((o) => o.correct);
  if (correct.length !== 1) fail(`${id}: forecast needs exactly one correct option`);
  if (!positions.has(a.placement.historian)) fail(`${id}: unknown historian placement ${a.placement.historian}`);
  if (!a.record.length || a.record[0].tag !== 'chapter') fail(`${id}: record should open with a chapter quote`);
  a.record.forEach((r, j) => { if (!C.tags[r.tag] || !r.text || !r.ref) fail(`${id}: record[${j}] incomplete`); });

  // No card may quote the chapter sentence the record reveals (6 or more words in a row).
  a.record.filter((r) => r.tag === 'chapter').forEach((r) => {
    a.cards.forEach((c) => {
      const run = sharesRun(c.quote, r.text, 6);
      if (run) fail(`${id}/${c.id}: card gives away the record ("${run}")`);
    });
  });
  // The scene must not hand over the summons answer.
  a.summons.answers.forEach((ans) => {
    const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '');
    if (norm(a.scene.join(' ')).split(' ').includes(norm(ans))) fail(`${id}: scene gives away the summons answer "${ans}"`);
  });
  (a.images || []).forEach((img) => {
    try { readFileSync(path.join(root, img.src)); } catch { fail(`${id}: missing image ${img.src}`); }
    if (!img.alt || !img.credit || !img.creditUrl) fail(`${id}: image ${img.src} needs alt text and credit`);
  });
});

challengeIds.forEach((id) => {
  const c = C.challenges[id];
  if (!c) { fail(`missing challenge ${id}`); return; }
  for (const k of ['supported', 'partly', 'not']) if (!c.rulings[k]) fail(`${id}: missing ruling ${k}`);
  if (!['supported', 'partly', 'not'].includes(c.answer)) fail(`${id}: bad answer`);
  c.evidence.forEach((e, j) => { if (!C.tags[e.tag] || !e.text || !e.ref) fail(`${id}: evidence[${j}] incomplete`); });
});

const maxSeals = audienceIds.length * 3 + challengeIds.filter((id) => C.challenges[id].scored).length;
if (C.ranks[C.ranks.length - 1].min > maxSeals) fail('top rank is unreachable');

if (errors.length) {
  console.error(`content check FAILED (${errors.length}):`);
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log(`content check passed: ${audienceIds.length} audiences, ${challengeIds.length} challenges, ${stringCount} strings, ${maxSeals} seals possible`);

/*
  The Counselor of Aksum: game engine. Reads window.AKSUM (content.js), renders one screen per
  hash route, and keeps progress in localStorage on this browser only. Nothing is exported or sent.

  Routes: #/start, #/a/<audience>, #/c/<challenge>, #/chronicle, #/about
*/
(function () {
  'use strict';

  const C = window.AKSUM;
  const UI = C.ui;
  const STORE_KEY = 'counselor-of-aksum:v1';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SEQ = C.sequence;
  const AUDIENCE_IDS = SEQ.filter((s) => s.kind === 'audience').map((s) => s.id);
  const MAX_SEALS = AUDIENCE_IDS.length * 3 +
    Object.values(C.challenges).filter((c) => c.scored).length;

  // ---------- State ----------

  let saveOk = true;
  let state = load();
  const draft = {};        // unsent key answers, by audience id
  const flash = {};        // one-off messages, by audience id
  let pendingFocus = null; // element id to focus after the next render
  let lastRoute = null;

  function fresh() {
    return { v: 1, version: C.version, started: false, furthest: 0, aud: {}, chal: {} };
  }

  function load() {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return fresh();
      const data = JSON.parse(raw);
      if (!data || data.v !== 1 || data.version !== C.version) return fresh();
      return Object.assign(fresh(), data);
    } catch (e) {
      return fresh();
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
      saveOk = true;
    } catch (e) {
      saveOk = false;
    }
  }

  function aud(id) {
    if (!state.aud[id]) {
      state.aud[id] = { tries: 0, solved: false, skipped: false, option: null, played: [], forecast: null, place: null };
    }
    return state.aud[id];
  }

  function chal(id) {
    if (!state.chal[id]) state.chal[id] = { ruling: null };
    return state.chal[id];
  }

  // ---------- Derived progress ----------

  const keyDone = (id) => aud(id).solved || aud(id).skipped;

  function fittingCard(id) {
    const a = C.audiences[id];
    const s = aud(id);
    const opt = a.options.find((o) => o.id === s.option);
    if (!opt) return null;
    return s.played.find((cardId) => opt.supports[cardId]) || null;
  }

  const counselDone = (id) => fittingCard(id) !== null;

  function firstCardFits(id) {
    const s = aud(id);
    const opt = C.audiences[id].options.find((o) => o.id === s.option);
    return Boolean(opt && s.played.length && opt.supports[s.played[0]]);
  }

  const forecastDone = (id) => aud(id).forecast !== null;

  function forecastRight(id) {
    const pick = C.audiences[id].forecast.options.find((o) => o.id === aud(id).forecast);
    return Boolean(pick && pick.correct);
  }

  const audienceDone = (id) => aud(id).place !== null;
  const challengeDone = (id) => chal(id).ruling !== null;

  function seqDone(i) {
    const item = SEQ[i];
    return item.kind === 'audience' ? audienceDone(item.id) : challengeDone(item.id);
  }

  function seals() {
    let n = 0;
    AUDIENCE_IDS.forEach((id) => {
      if (aud(id).solved) n += 1;
      if (counselDone(id) && firstCardFits(id)) n += 1;
      if (forecastRight(id)) n += 1;
    });
    Object.keys(C.challenges).forEach((id) => {
      const c = C.challenges[id];
      if (c.scored && chal(id).ruling === c.answer) n += 1;
    });
    return n;
  }

  function rankFor(n) {
    return C.ranks.filter((r) => n >= r.min).pop();
  }

  function markReached(i) {
    state.furthest = Math.max(state.furthest, Math.min(i, SEQ.length - 1));
  }

  // ---------- Small helpers ----------

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
  }

  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach((k) => {
        const v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      });
    }
    kids.flat(Infinity).forEach((kid) => {
      if (kid === null || kid === undefined || kid === false) return;
      el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    });
    return el;
  }

  function svg(tag, attrs, ...kids) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
    kids.forEach((kid) => kid && el.append(kid));
    return el;
  }

  function normalize(text) {
    return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function routeFor(item) {
    return item.kind === 'audience' ? '#/a/' + item.id : '#/c/' + item.id;
  }

  function go(hash) {
    if (location.hash === hash) render(true);
    else location.hash = hash;
  }

  function announce(text) {
    const el = document.getElementById('announcer');
    el.textContent = '';
    window.setTimeout(() => { el.textContent = text; }, 30);
  }

  let toastTimer = null;
  function toastSeal() {
    const el = document.getElementById('toast');
    el.textContent = UI.sealToast;
    el.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove('is-on'), REDUCED ? 2500 : 1800);
  }

  // Wrap a state change: save, compare seal count, re-render, then move focus.
  function act(fn, focusId) {
    const before = seals();
    fn();
    if (!state.started) state.started = true;
    save();
    if (seals() > before) toastSeal();
    pendingFocus = focusId || null;
    render(false);
  }

  function tagChip(tag) {
    const t = C.tags[tag];
    return h('span', { class: 'tag tag-' + tag, title: t.note }, t.label);
  }

  function evidenceItem(item) {
    return h('li', { class: 'evidence' },
      tagChip(item.tag),
      h('p', { class: 'evidence-text' }, item.text),
      item.ref ? h('p', { class: 'evidence-ref' }, item.ref) : null);
  }

  function stepHeading(id, number, title) {
    return h('h2', { id: id, tabindex: '-1', class: 'step-heading' },
      h('span', { class: 'step-badge', 'aria-hidden': 'true' }, String(number)),
      h('span', { class: 'visually-hidden' }, UI.stepWord + ' ' + number + ': '),
      title);
  }

  // ---------- Coin diagrams ----------

  function coinSVG(emblem, metal, label) {
    const face = metal === 'copper' ? '#c9875a' : '#e2b33c';
    const shade = metal === 'copper' ? '#9c5f39' : '#b98a1e';
    const root = svg('svg', { viewBox: '0 0 120 120', class: 'coin-svg', role: 'img', 'aria-label': label });
    root.append(
      svg('circle', { cx: 60, cy: 60, r: 56, fill: face, stroke: '#2d1b00', 'stroke-width': 3 }),
      svg('circle', { cx: 60, cy: 60, r: 47, fill: 'none', stroke: '#2d1b00', 'stroke-width': 2, 'stroke-dasharray': '1 5', 'stroke-linecap': 'round' }),
      svg('path', { d: 'M34 98 Q60 70 86 98 Z', fill: shade, stroke: '#2d1b00', 'stroke-width': 2 }),
      svg('circle', { cx: 60, cy: 66, r: 11, fill: shade, stroke: '#2d1b00', 'stroke-width': 2 }),
      svg('path', { d: 'M49 57 L52 50 L56 55 L60 47 L64 55 L68 50 L71 57 Z', fill: shade, stroke: '#2d1b00', 'stroke-width': 1.5 })
    );
    if (emblem === 'cross') {
      root.append(
        svg('rect', { x: 56.5, y: 13, width: 7, height: 21, fill: '#2d1b00' }),
        svg('rect', { x: 49.5, y: 20, width: 21, height: 7, fill: '#2d1b00' }));
    } else {
      root.append(
        svg('path', { d: 'M48 24 A12 12 0 0 0 72 24 A12 8 0 0 1 48 24 Z', fill: '#2d1b00' }),
        svg('circle', { cx: 60, cy: 22, r: 5, fill: '#2d1b00' }));
    }
    return root;
  }

  function coinPreview(emblem) {
    if (emblem === 'split') {
      return h('span', { class: 'coin-preview coin-preview-split' },
        h('span', { class: 'coin-cell' }, coinSVG('cross', 'gold', UI.coinGoldCross), h('span', { class: 'coin-cap' }, UI.coinGold)),
        h('span', { class: 'coin-cell' }, coinSVG('disc', 'copper', UI.coinCopperDisc), h('span', { class: 'coin-cap' }, UI.coinCopper)));
    }
    const label = emblem === 'cross' ? UI.coinCross : UI.coinDisc;
    return h('span', { class: 'coin-preview' }, coinSVG(emblem, 'gold', label));
  }

  // ---------- Triangle ----------

  // marks: { positionId: [{ who: 'you'|'historian', n: number|null }] }
  function triangle(opts) {
    const wrap = h('div', { class: 'tri' + (opts.interactive ? ' tri-interactive' : ''), role: opts.interactive ? 'group' : null, 'aria-label': opts.label || null });
    const plane = h('div', { class: 'tri-plane' });
    const art = svg('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'none', class: 'tri-art', 'aria-hidden': 'true', focusable: 'false' },
      svg('polygon', { points: '50,9 9,91 91,91', fill: '#fff3e0', stroke: '#2d1b00', 'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke', 'stroke-linejoin': 'round' }));
    plane.append(art);

    C.positions.forEach((p) => {
      const side = p.x < 20 ? ' node-left' : p.x > 80 ? ' node-right' : '';
      const marks = (opts.marks && opts.marks[p.id]) || [];
      const isYours = marks.some((m) => m.who === 'you');
      const isHist = marks.some((m) => m.who === 'historian');
      const cls = 'node' + side + (p.y < 20 ? ' node-top' : '') + (isYours ? ' is-yours' : '') + (isHist ? ' is-historian' : '');
      const badges = marks.filter((m) => m.n !== null && m.n !== undefined).map((m) =>
        h('span', { class: 'mark mark-' + m.who, title: (m.who === 'you' ? C.chronicle.triangleYou : C.chronicle.triangleHistorian) + ' ' + m.n }, String(m.n)));
      const dotKids = [h('span', { class: 'node-dot', 'aria-hidden': 'true' })];
      const label = h('span', { class: 'node-label' }, p.label);
      let node;
      if (opts.interactive && !opts.locked) {
        node = h('button', { type: 'button', class: cls, 'aria-pressed': String(isYours), onclick: () => opts.onPick(p.id) }, dotKids, label);
      } else {
        const extra = [];
        if (isYours && !badges.length) extra.push(h('span', { class: 'visually-hidden' }, ' (' + UI.placeYou + ')'));
        if (isHist && !badges.length) extra.push(h('span', { class: 'visually-hidden' }, ' (' + UI.placeHistorian + ')'));
        node = h('div', { class: cls }, dotKids, label, extra, badges.length ? h('span', { class: 'marks' }, badges) : null);
      }
      node.style.left = p.x + '%';
      node.style.top = p.y + '%';
      plane.append(node);
    });
    wrap.append(plane);
    return wrap;
  }

  const posLabel = (id) => (C.positions.find((p) => p.id === id) || {}).label || id;

  // ---------- Header, rail ----------

  function renderStatus(route) {
    const box = document.getElementById('status');
    box.replaceChildren();
    box.append(h('p', { class: 'pill pill-mustard' }, fill(UI.sealsPill, { n: seals(), max: MAX_SEALS })));
    if (route.kind === 'audience') {
      box.append(h('p', { class: 'pill' }, fill(UI.audienceOf, { n: C.audiences[route.id].number, max: AUDIENCE_IDS.length })));
    }
    if (!saveOk) box.append(h('p', { class: 'pill pill-warn', role: 'alert' }, UI.saveFailed));
  }

  function renderRail(route) {
    const rail = document.getElementById('rail');
    rail.setAttribute('aria-label', UI.railLabel);
    const list = h('ol', { class: 'rail-list' });
    const item = (label, hash, opts) => {
      const current = route.hash === hash;
      const cls = 'rail-chip' + (current ? ' is-current' : '') + (opts.done ? ' is-done' : '') + (opts.locked ? ' is-locked' : '');
      const doneMark = opts.done ? [h('span', { class: 'rail-done', 'aria-hidden': 'true' }, '✓'), h('span', { class: 'visually-hidden' }, ' (' + UI.doneWord + ')')] : null;
      const el = opts.locked
        ? h('button', { type: 'button', class: cls, onclick: () => announce(UI.locked), 'aria-disabled': 'true' }, label)
        : h('a', { class: cls, href: hash, 'aria-current': current ? 'step' : null }, label, doneMark);
      list.append(h('li', null, el));
    };
    item(UI.railStart, '#/start', {});
    SEQ.forEach((s, i) => {
      const label = s.kind === 'audience' ? C.audiences[s.id].number + ' ' + C.audiences[s.id].short : UI.railChallenge;
      item(label, routeFor(s), { done: seqDone(i), locked: !state.started || i > state.furthest });
    });
    item(UI.railChronicle, '#/chronicle', { locked: !state.started, done: SEQ.every((s, i) => seqDone(i)) });
    item(UI.railAbout, '#/about', {});
    rail.replaceChildren(list);
  }

  // ---------- Screens ----------

  function renderStart() {
    const S = C.start;
    const hasProgress = state.started;
    const resumeIndex = Math.min(state.furthest, SEQ.length - 1);
    const allDone = SEQ.every((s, i) => seqDone(i));

    const begin = () => {
      act(() => { state.started = true; }, null);
      go(allDone ? '#/chronicle' : routeFor(SEQ[resumeIndex]));
    };
    const restart = () => {
      if (!window.confirm(UI.restartConfirm)) return;
      state = fresh();
      state.started = true;
      Object.keys(draft).forEach((k) => delete draft[k]);
      save();
      go(routeFor(SEQ[0]));
    };

    return h('article', { class: 'screen screen-start' },
      h('section', { class: 'band band-cream hero' },
        h('div', { class: 'hero-inner' },
          h('p', { class: 'sticker', 'aria-hidden': 'true' }, S.sticker),
          h('h1', { id: 'screen-title', tabindex: '-1' }, C.title),
          h('p', { class: 'lede' }, S.lede),
          h('div', { class: 'card role-card' }, tagChip('game'), S.role.map((p) => h('p', null, p))),
          h('div', { class: 'actions' },
            h('button', { type: 'button', class: 'btn btn-primary', onclick: begin }, hasProgress ? S.resume : S.begin),
            hasProgress ? h('button', { type: 'button', class: 'btn btn-quiet', onclick: restart }, S.restart) : null))),
      h('section', { class: 'band band-orange' },
        h('div', { class: 'card read-first' },
          h('h2', null, UI.readFirstTitle),
          h('p', null, S.readFirst),
          h('p', null, h('a', { href: C.chapter.url, target: '_blank', rel: 'noopener' }, S.readLink)),
          h('p', { class: 'small' }, C.chapter.label))),
      h('section', { class: 'band band-mustard' },
        h('h2', null, UI.howTitle),
        h('ol', { class: 'how-list' }, S.steps.map((st, i) =>
          h('li', { class: 'card how-card' },
            h('span', { class: 'step-badge', 'aria-hidden': 'true' }, String(i + 1)),
            h('h3', null, st.title),
            h('p', null, st.text))))),
      h('section', { class: 'band band-green' },
        h('div', { class: 'two-col' },
          h('div', { class: 'card' },
            h('h2', null, UI.sealsTitle),
            S.seals.map((p) => h('p', null, p))),
          h('div', { class: 'card' },
            h('h2', null, UI.cornersTitle),
            h('ul', { class: 'plain-list' }, S.corners.map((c) => h('li', null, h('strong', null, c.title + '. '), c.text)))))),
      h('section', { class: 'band band-cream' },
        h('div', { class: 'card' },
          h('h2', null, UI.tagsTitle),
          h('ul', { class: 'tag-key' }, Object.keys(C.tags).map((k) => h('li', null, tagChip(k), ' ', C.tags[k].note)))),
        h('p', { class: 'small center' }, S.privacy))
    );
  }

  function renderAudience(id) {
    const a = C.audiences[id];
    const s = aud(id);
    const idx = SEQ.findIndex((x) => x.kind === 'audience' && x.id === id);
    const out = h('article', { class: 'screen screen-audience' });

    out.append(h('section', { class: 'band band-cream audience-head' },
      h('p', { class: 'eyebrow' }, fill(UI.audienceOf, { n: a.number, max: AUDIENCE_IDS.length })),
      h('h1', { id: 'screen-title', tabindex: '-1' }, a.title),
      h('p', { class: 'meta' }, h('span', { class: 'sticker sticker-date' }, a.when), ' ', h('span', { class: 'meta-ruler' }, a.ruler)),
      h('div', { class: 'card scene' }, tagChip('game'), a.scene.map((p) => h('p', null, p)))));

    // Step 1: the summons
    const sum = h('section', { class: 'band band-orange step' }, stepHeading('step-summons-' + id, 1, UI.stepSummons),
      h('blockquote', { class: 'voice' }, a.summons.ask));
    if (!keyDone(id)) {
      const inputId = 'key-' + id;
      const form = h('form', { class: 'key-form', onsubmit: (e) => {
        e.preventDefault();
        const value = document.getElementById(inputId).value;
        draft[id] = value;
        if (!normalize(value)) { flash[id] = UI.keyEmpty; pendingFocus = inputId; render(false); return; }
        act(() => {
          s.tries += 1;
          if (a.summons.answers.some((ans) => normalize(value).includes(normalize(ans)))) s.solved = true;
          flash[id] = null;
        }, null);
        if (s.solved) { pendingFocus = 'step-counsel-' + id; focusNow(); } else { pendingFocus = inputId; focusNow(); }
      } },
        h('label', { for: inputId }, UI.keyLabel),
        h('div', { class: 'key-row' },
          h('input', { id: inputId, type: 'text', autocomplete: 'off', spellcheck: 'false', value: draft[id] || '', 'aria-describedby': 'key-msg-' + id }),
          h('button', { type: 'submit', class: 'btn btn-primary' }, UI.keyCheck)));
      sum.append(form);
      const msg = h('div', { id: 'key-msg-' + id, class: 'key-msg', 'aria-live': 'polite' });
      if (flash[id]) msg.append(h('p', null, flash[id]));
      else if (s.tries === 1) msg.append(h('p', null, UI.keyMissFirst));
      else if (s.tries >= 2) {
        msg.append(h('p', null, UI.keyMissHint), h('p', { class: 'hint' }, a.summons.hint),
          h('button', { type: 'button', class: 'btn btn-quiet', onclick: () => act(() => { s.skipped = true; }, 'step-counsel-' + id) }, UI.keyContinue));
      }
      sum.append(msg);
    } else if (s.solved) {
      sum.append(h('div', { class: 'result result-good' }, h('p', { class: 'result-title' }, UI.keySeal), h('p', { class: 'voice-reply' }, a.summons.found)));
    } else {
      sum.append(h('div', { class: 'result' }, h('p', null, UI.keySkipped), h('p', { class: 'hint' }, a.summons.hint)));
    }
    out.append(sum);
    if (!keyDone(id)) return out;

    // Step 2: counsel
    const coun = h('section', { class: 'band band-mustard step' }, stepHeading('step-counsel-' + id, 2, UI.stepCounsel),
      h('blockquote', { class: 'voice' }, a.question),
      h('p', { class: 'instruction' }, UI.counselPrompt));
    const optionsLocked = s.played.length > 0;
    coun.append(h('div', { class: 'options', role: 'group', 'aria-label': UI.stepCounsel }, a.options.map((o) =>
      h('button', {
        type: 'button', class: 'option' + (s.option === o.id ? ' is-picked' : '') + (o.emblem ? ' option-coin' : ''),
        'aria-pressed': String(s.option === o.id), disabled: optionsLocked && s.option !== o.id,
        onclick: () => { if (!optionsLocked) act(() => { s.option = o.id; }, 'cards-' + id); }
      },
        o.emblem ? coinPreview(o.emblem) : null,
        h('span', { class: 'option-label' }, o.label),
        h('span', { class: 'option-cost' }, h('span', { class: 'cost-label' }, UI.costLabel + ': '), o.cost)))));
    if (a.options.some((o) => o.emblem)) coun.append(h('p', { class: 'small' }, UI.diagram));

    if (s.option) {
      const opt = a.options.find((o) => o.id === s.option);
      const done = counselDone(id);
      coun.append(h('h3', { id: 'cards-' + id, tabindex: '-1', class: 'cards-heading' }, UI.cardsPrompt));
      if (!optionsLocked) coun.append(h('p', { class: 'small' }, UI.cardsChange));
      coun.append(h('ul', { class: 'hand' }, a.cards.map((card) => {
        const played = s.played.includes(card.id);
        return h('li', null, h('button', {
          type: 'button', class: 'evidence-card' + (played ? (opt.supports[card.id] ? ' is-fit' : ' is-miss') : ''),
          disabled: played || done,
          onclick: () => act(() => { s.played.push(card.id); }, 'card-msg-' + id)
        },
          h('span', { class: 'card-title' }, card.title),
          h('span', { class: 'card-quote' }, card.quote),
          h('span', { class: 'card-foot' }, tagChip(card.tag))));
      })));
      const log = h('div', { id: 'card-msg-' + id, tabindex: '-1', class: 'card-log', 'aria-live': 'polite' });
      s.played.forEach((cardId) => {
        const card = a.cards.find((c) => c.id === cardId);
        if (opt.supports[cardId]) {
          log.append(h('div', { class: 'result result-good' },
            h('p', { class: 'result-title' }, '✓ ' + card.title + '. ' + UI.cardFit),
            h('p', null, opt.supports[cardId]), tagChip('game')));
        } else {
          log.append(h('div', { class: 'result result-miss' }, h('p', null, '✗ ' + card.title + '. ' + fill(UI.cardMiss, { about: card.about }))));
        }
      });
      if (done) log.append(h('p', { class: 'seal-note' }, firstCardFits(id) ? UI.counselSeal : UI.counselNoSeal));
      coun.append(log);
    }
    out.append(coun);
    if (!counselDone(id)) return out;

    // Step 3: forecast
    const fc = h('section', { class: 'band band-green step' }, stepHeading('step-forecast-' + id, 3, UI.stepForecast),
      h('p', { class: 'instruction' }, a.forecast.ask));
    fc.append(h('div', { class: 'options options-compact', role: 'group', 'aria-label': UI.stepForecast }, a.forecast.options.map((o) =>
      h('button', {
        type: 'button', class: 'option' + (s.forecast === o.id ? ' is-picked' : '') + (forecastDone(id) && o.correct ? ' is-true' : ''),
        'aria-pressed': String(s.forecast === o.id), disabled: forecastDone(id) && s.forecast !== o.id,
        onclick: () => { if (!forecastDone(id)) act(() => { s.forecast = o.id; }, 'step-record-' + id); }
      }, h('span', { class: 'option-label' }, o.label)))));
    if (forecastDone(id)) {
      fc.append(h('div', { class: 'result ' + (forecastRight(id) ? 'result-good' : 'result-miss') },
        h('p', { class: 'result-title' }, forecastRight(id) ? UI.forecastRight : UI.forecastWrong)));
    }
    out.append(fc);
    if (!forecastDone(id)) return out;

    // Step 4: the record
    const rec = h('section', { class: 'band band-cream step' }, stepHeading('step-record-' + id, 4, UI.stepRecord));
    rec.append(h('ul', { class: 'evidence-list' }, a.record.map(evidenceItem)));
    if (a.images) {
      rec.append(h('div', { class: 'figures' }, a.images.map((img) =>
        h('figure', { class: 'card figure' },
          h('img', { src: img.src, alt: img.alt, width: '650', height: '650', loading: 'lazy' }),
          h('figcaption', null, h('span', null, img.caption), h('span', { class: 'credit' }, h('a', { href: img.creditUrl, target: '_blank', rel: 'noopener' }, img.credit)))))));
    }
    rec.append(h('div', { class: 'card compare' }, h('p', null, a.compare)));
    rec.append(h('div', { class: 'two-col' },
      h('div', { class: 'card small-card' }, h('h3', null, UI.readMore), h('p', null, a.readMore),
        h('p', null, h('a', { href: C.chapter.url, target: '_blank', rel: 'noopener' }, C.start.readLink))),
      h('div', { class: 'card small-card' }, h('h3', null, UI.missing), h('p', null, a.missing))));
    out.append(rec);

    // Step 5: place it
    const pl = h('section', { class: 'band band-orange step' }, stepHeading('step-place-' + id, 5, UI.stepPlace),
      h('p', { class: 'instruction' }, UI.placePrompt));
    const marks = {};
    if (s.place) (marks[s.place] = marks[s.place] || []).push({ who: 'you' });
    if (s.place) (marks[a.placement.historian] = marks[a.placement.historian] || []).push({ who: 'historian' });
    pl.append(triangle({
      interactive: true, locked: Boolean(s.place), marks: marks, label: UI.placePrompt,
      onPick: (pid) => act(() => { s.place = pid; markReached(idx + 1); }, 'place-result-' + id)
    }));
    if (s.place) {
      pl.append(h('div', { id: 'place-result-' + id, tabindex: '-1', class: 'card place-result' },
        h('p', null, h('span', { class: 'key-you' }, UI.placeYou + ': '), h('strong', null, posLabel(s.place))),
        h('p', null, h('span', { class: 'key-historian' }, UI.placeHistorian + ': '), h('strong', null, posLabel(a.placement.historian))),
        h('p', null, a.placement.why), tagChip('inference')));
      const next = SEQ[idx + 1];
      pl.append(h('div', { class: 'actions' },
        h('a', { class: 'btn btn-primary', href: next ? routeFor(next) : '#/chronicle' }, next ? UI.next : UI.toChronicle)));
    }
    out.append(pl);
    return out;
  }

  function renderChallenge(id) {
    const c = C.challenges[id];
    const s = chal(id);
    const idx = SEQ.findIndex((x) => x.kind === 'challenge' && x.id === id);
    const keys = [['supported', UI.rulingSupported], ['partly', UI.rulingPartly], ['not', UI.rulingNot]];
    const out = h('article', { class: 'screen screen-challenge' });

    out.append(h('section', { class: 'band band-mustard audience-head' },
      h('p', { class: 'eyebrow' }, UI.challengeEyebrow),
      h('h1', { id: 'screen-title', tabindex: '-1' }, c.title),
      h('p', { class: 'lede' }, c.intro),
      h('div', { class: 'card claim' }, h('h2', { class: 'small-heading' }, UI.claimLabel), tagChip('chapter'), h('p', { class: 'claim-text' }, c.claim))));

    out.append(h('section', { class: 'band band-cream' },
      h('h2', null, UI.evidenceLabel),
      h('ul', { class: 'evidence-list' }, c.evidence.map(evidenceItem)),
      h('div', { class: 'card compare' }, h('p', null, c.prompt))));

    const rule = h('section', { class: 'band band-green step' }, h('h2', { id: 'ruling-' + id, tabindex: '-1' }, UI.rulingPrompt));
    rule.append(h('div', { class: 'options options-row', role: 'group', 'aria-label': UI.rulingPrompt }, keys.map(([k, label]) =>
      h('button', {
        type: 'button', class: 'option option-ruling' + (s.ruling === k ? ' is-picked' : ''), 'aria-pressed': String(s.ruling === k),
        disabled: Boolean(s.ruling) && s.ruling !== k,
        onclick: () => { if (!s.ruling) act(() => { s.ruling = k; markReached(idx + 1); }, 'arguments-' + id); }
      }, h('span', { class: 'option-label' }, label)))));

    if (s.ruling) {
      const args = h('div', { id: 'arguments-' + id, tabindex: '-1', class: 'arguments' },
        h('p', { class: 'instruction' }, c.scored ? UI.rulingScored : UI.rulingOpen));
      if (c.scored && s.ruling === c.answer) args.append(h('p', { class: 'seal-note' }, UI.rulingSeal));
      keys.forEach(([k, label]) => {
        const badges = [];
        if (s.ruling === k) badges.push(h('span', { class: 'badge badge-you' }, UI.rulingYours));
        if (c.answer === k) badges.push(h('span', { class: 'badge badge-answer' }, c.scored ? UI.rulingStrongest : UI.rulingLean));
        args.append(h('div', { class: 'card argument' + (c.answer === k ? ' is-answer' : '') },
          h('h3', null, label, ' ', badges), h('p', null, c.rulings[k])));
      });
      args.append(h('p', { class: 'afterword' }, c.afterword));
      const next = SEQ[idx + 1];
      args.append(h('div', { class: 'actions' }, h('a', { class: 'btn btn-primary', href: next ? routeFor(next) : '#/chronicle' }, next ? UI.next : UI.toChronicle)));
      rule.append(args);
    }
    out.append(rule);
    return out;
  }

  function renderChronicle() {
    const K = C.chronicle;
    const n = seals();
    const rank = rankFor(n);
    const done = AUDIENCE_IDS.filter(audienceDone);
    const out = h('article', { class: 'screen screen-chronicle' });

    out.append(h('section', { class: 'band band-cream audience-head' },
      h('h1', { id: 'screen-title', tabindex: '-1' }, K.title),
      h('p', { class: 'lede' }, K.intro),
      done.length < AUDIENCE_IDS.length ? h('p', { class: 'card notice' }, K.incomplete) : null,
      h('div', { class: 'card rank-card' },
        h('p', { class: 'sticker sticker-rank', 'aria-hidden': 'true' }, rank.title),
        h('p', { class: 'rank-line' }, h('strong', null, rank.title), ' ', fill(UI.sealsPill, { n: n, max: MAX_SEALS })),
        h('p', null, rank.text))));

    const marks = {};
    done.forEach((id) => {
      const a = C.audiences[id];
      (marks[aud(id).place] = marks[aud(id).place] || []).push({ who: 'you', n: a.number });
      (marks[a.placement.historian] = marks[a.placement.historian] || []).push({ who: 'historian', n: a.number });
    });
    out.append(h('section', { class: 'band band-orange' },
      h('h2', null, K.triangleTitle),
      h('p', { class: 'tri-legend' }, h('span', { class: 'mark mark-you' }, '1'), ' ', K.triangleYou, '  ', h('span', { class: 'mark mark-historian' }, '1'), ' ', K.triangleHistorian),
      triangle({ interactive: false, marks: marks, label: K.triangleTitle })));

    const entries = h('section', { class: 'band band-mustard' }, h('h2', null, UI.entriesTitle));
    AUDIENCE_IDS.forEach((id) => {
      const a = C.audiences[id];
      const s = aud(id);
      if (!audienceDone(id)) return;
      const opt = a.options.find((o) => o.id === s.option);
      const first = a.cards.find((c) => c.id === s.played[0]);
      const pick = a.forecast.options.find((o) => o.id === s.forecast);
      entries.append(h('div', { class: 'card entry' },
        h('h3', null, h('span', { class: 'sticker sticker-date' }, a.when), ' ', a.number + '. ' + a.title),
        h('dl', { class: 'entry-list' },
          h('dt', null, K.entryAdvised), h('dd', null, opt.label),
          h('dt', null, K.entryCard), h('dd', null, first.title + ', ' + (firstCardFits(id) ? K.entryCardFit : K.entryCardMiss)),
          h('dt', null, K.entryForecast), h('dd', null, pick.label + ' (' + (forecastRight(id) ? K.entryForecastRight : K.entryForecastWrong) + ')'),
          h('dt', null, K.entryThrone), h('dd', null, a.throneDid),
          h('dt', null, UI.placeYou), h('dd', null, posLabel(s.place)),
          h('dt', null, UI.placeHistorian), h('dd', null, posLabel(a.placement.historian)))));
    });
    out.append(entries);

    const parted = h('section', { class: 'band band-green' }, h('h2', null, K.partedTitle));
    const differ = done.filter((id) => !C.audiences[id].matches.includes(aud(id).option));
    if (done.length) {
      if (!differ.length && done.length === AUDIENCE_IDS.length) parted.append(h('p', { class: 'card' }, K.partedNone));
      parted.append(h('ul', { class: 'parted-list' }, done.map((id) => {
        const a = C.audiences[id];
        const same = a.matches.includes(aud(id).option);
        return h('li', { class: 'card parted' + (same ? '' : ' is-different') },
          h('h3', null, a.number + '. ' + a.title),
          h('p', null, h('strong', null, same ? K.partedSame : K.partedDifferent)),
          h('p', null, K.entryAdvised + ': ' + a.options.find((o) => o.id === aud(id).option).label),
          h('p', null, K.entryThrone + ': ' + a.throneDid));
      })));
    }
    out.append(parted);

    const ch = h('section', { class: 'band band-cream' }, h('h2', null, K.challengesTitle));
    Object.keys(C.challenges).forEach((cid) => {
      const c = C.challenges[cid];
      const r = chal(cid).ruling;
      if (!r) return;
      const label = { supported: UI.rulingSupported, partly: UI.rulingPartly, not: UI.rulingNot };
      ch.append(h('div', { class: 'card entry' }, h('h3', null, c.title),
        h('dl', { class: 'entry-list' },
          h('dt', null, UI.rulingYours), h('dd', null, label[r]),
          h('dt', null, c.scored ? UI.rulingStrongest : UI.rulingLean), h('dd', null, label[c.answer]))));
    });
    out.append(ch);

    out.append(h('section', { class: 'band band-orange' },
      h('div', { class: 'card questions' }, h('h2', null, K.questionsTitle),
        h('ol', null, K.questions.map((q) => h('li', null, q)))),
      h('div', { class: 'actions center' }, h('button', { type: 'button', class: 'btn btn-quiet', onclick: () => {
        if (!window.confirm(UI.restartConfirm)) return;
        state = fresh();
        save();
        go('#/start');
      } }, C.start.restart))));
    return out;
  }

  function renderAbout() {
    const A = C.about;
    const list = (items) => h('ul', { class: 'plain-list sources' }, items.map((it) =>
      h('li', null, it.text, it.url ? [' ', h('a', { href: it.url, target: '_blank', rel: 'noopener' }, UI.linkText)] : null)));
    return h('article', { class: 'screen screen-about' },
      h('section', { class: 'band band-cream audience-head' },
        h('h1', { id: 'screen-title', tabindex: '-1' }, A.title),
        A.paragraphs.map((p) => h('p', null, p))),
      h('section', { class: 'band band-mustard' },
        h('div', { class: 'card' }, h('h2', null, UI.tagsTitle),
          h('ul', { class: 'tag-key' }, Object.keys(C.tags).map((k) => h('li', null, tagChip(k), ' ', C.tags[k].note))))),
      h('section', { class: 'band band-green' },
        h('div', { class: 'card' }, h('h2', null, A.sourcesTitle), list(A.sources)),
        h('div', { class: 'card' }, h('h2', null, A.creditsTitle), list(A.credits))));
  }

  // ---------- Router ----------

  function parseRoute() {
    const hash = location.hash || '#/start';
    let m = hash.match(/^#\/a\/([\w-]+)$/);
    if (m && C.audiences[m[1]]) return { kind: 'audience', id: m[1], hash: hash };
    m = hash.match(/^#\/c\/([\w-]+)$/);
    if (m && C.challenges[m[1]]) return { kind: 'challenge', id: m[1], hash: hash };
    if (hash === '#/chronicle') return { kind: 'chronicle', hash: hash };
    if (hash === '#/about') return { kind: 'about', hash: hash };
    return { kind: 'start', hash: '#/start' };
  }

  function guard(route) {
    if (route.kind === 'audience' || route.kind === 'challenge') {
      const i = SEQ.findIndex((x) => x.kind === route.kind && x.id === route.id);
      if (!state.started || i > state.furthest) {
        const target = state.started ? routeFor(SEQ[state.furthest]) : '#/start';
        announce(UI.locked);
        history.replaceState(null, '', target);
        return parseRoute();
      }
    }
    if (route.kind === 'chronicle' && !state.started) {
      history.replaceState(null, '', '#/start');
      return parseRoute();
    }
    return route;
  }

  function focusNow() {
    if (!pendingFocus) return;
    const el = document.getElementById(pendingFocus);
    pendingFocus = null;
    if (el) el.focus({ preventScroll: false });
  }

  function render(routeChanged) {
    const route = guard(parseRoute());
    const changed = routeChanged || route.hash !== lastRoute;
    lastRoute = route.hash;
    renderStatus(route);
    renderRail(route);
    let screen;
    if (route.kind === 'audience') screen = renderAudience(route.id);
    else if (route.kind === 'challenge') screen = renderChallenge(route.id);
    else if (route.kind === 'chronicle') screen = renderChronicle();
    else if (route.kind === 'about') screen = renderAbout();
    else screen = renderStart();
    document.getElementById('main').replaceChildren(screen);
    document.title = (route.kind === 'audience' ? C.audiences[route.id].title + ' | ' : '') + C.title;
    if (changed) {
      window.scrollTo(0, 0);
      pendingFocus = 'screen-title';
    }
    focusNow();
  }

  window.addEventListener('hashchange', () => render(true));
  render(true);
})();

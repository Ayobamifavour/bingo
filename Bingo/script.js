const $ = id => document.getElementById(id);
const board = $("board"), msg = $("msg"), counter = $("counter"), timerEl = $("timer");
const playerEl = $("player"), nameEl = $("player-name"), wildBtn = $("wildcard"), skipBtn = $("skip"), bar = $("bar");
const TIME_LIMIT = 10, HALF = 30, BASE = Date.UTC(2023, 8, 10); // card #1158 = 11 Nov 2026

/* ---------- games ---------- */
const GAMES = {
  football: {
    id: "football", name: "Football Bingo", tag: "Ball Knowledge meets Bingo", key: "crystalbingo-football-stats",
    players: FB.players, cats: FB.cats, tech: FB.tech, make: n => genCard(FB.cats, FB.players, n)
  },
  worldcup: {
    id: "worldcup", name: "World Cup", tag: "Legends of the biggest stage", key: "crystalbingo-stats",
    players, cats, tech: WC_TECH, make: n => cards[(n - 1) % cards.length]
  }
};

let G = GAMES.football, C = G.cats, PL = G.players;
let ids, queue, cur, dabbed, flash, wildUsed, missNext, timeLeft, interval, used, perfect, last, countdownTimer;
let cardNum = 1, started = false, useTimer = false, locked = true, modeLabel = "Daily challenge", isRoom = false;

/* ---------- helpers ---------- */
const todayNum = () => {
  const d = new Date();
  return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - BASE) / 864e5);
};
const rng = seed => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const shuffle = (arr, r = Math.random) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const open = p => ids.filter(id => !dabbed[id] && C[id].test(p));
const filledCount = () => Object.keys(dabbed).length;
const kind = c => (c.html || c.badge ? "club" : c.flag ? "country" : c.cluster ? "region" : "honor");
const labelFor = n => (n === todayNum() ? "Daily challenge" : n === todayNum() - 1 ? "Yesterday" : "Archive");
const roomCode = n => G.id[0].toUpperCase() + n.toString(36).toUpperCase();

const loadStats = () => { try { return JSON.parse(localStorage.getItem(G.key)) || {}; } catch { return {}; } };
const saveStats = s => { try { localStorage.setItem(G.key, JSON.stringify(s)); } catch {} };

/* ---------- card + queue building ---------- */
function matched(list, cardIds, cs) {
  const owner = {};
  const tryAssign = (id, seen) => list.some((p, i) => {
    if (!cs[id].test(p) || seen.has(i)) return false;
    seen.add(i);
    if (owner[i] === undefined || tryAssign(owner[i], seen)) { owner[i] = id; return true; }
    return false;
  });
  return cardIds.every(id => tryAssign(id, new Set()));
}

function genCard(cs, pl, n) {
  const groups = {};
  Object.entries(cs).forEach(([id, c]) => {
    if (pl.filter(c.test).length >= 2) (groups[c.g] = groups[c.g] || []).push(id);
  });
  const quota = { club: 4, country: 4, honor: 3, misc: 5 };
  let pick = [];
  for (let k = 0; k < 80; k++) {
    const r = rng(n * 7919 + k);
    pick = Object.entries(quota).flatMap(([g, q]) => shuffle([...groups[g]], r).slice(0, q));
    if (matched(pl, pick, cs)) break;
  }
  return shuffle(pick, rng(n * 13 + 5));
}

function buildQueue(r) {
  const matches = p => ids.some(id => C[id].test(p));
  const chosen = new Set();
  shuffle([...ids], r).forEach(id => {
    const pool = shuffle(PL.filter(p => C[id].test(p)), r);
    chosen.add(pool.find(p => !chosen.has(p)) || pool[0]);
  });
  const extra = shuffle(PL.filter(p => matches(p) && !chosen.has(p)), r);
  const decoys = shuffle(PL.filter(p => !matches(p)), r);
  const n = Math.max(Math.min(HALF, decoys.length), chosen.size);
  return shuffle([...[...chosen, ...extra].slice(0, n), ...decoys.slice(0, n)], r);
}

function perfectCount(list) {
  for (let len = ids.length; len <= list.length; len++) {
    if (matched(list.slice(0, len), ids, C)) return len;
  }
  return list.length;
}

/* ---------- screens ---------- */
function show(id) {
  ["home", "friends", "game"].forEach(s => $(s).hidden = s !== id);
}

function selectGame(id) {
  G = GAMES[id]; C = G.cats; PL = G.players;
  document.querySelectorAll(".gtab").forEach(b => b.classList.toggle("on", b.dataset.game === id));
  $("home-title").textContent = G.name;
  $("home-tag").textContent = G.tag;
}

function play(n, label) {
  modeLabel = label;
  isRoom = label === "With friends";
  show("game");
  openCard(n);
}

function go(n) {
  isRoom = false;
  modeLabel = labelFor(n);
  openCard(n);
}

function toHome() {
  stopTimer();
  closeModals();
  show("home");
}

function joinRoom(code) {
  code = code.trim().toUpperCase();
  const g = { F: "football", W: "worldcup" }[code[0]];
  const n = parseInt(code.slice(1), 36);
  if (!g || !n) { $("friend-msg").textContent = "That code doesn't look right. Check it and try again."; return; }
  selectGame(g);
  play(n, "With friends");
}

/* ---------- game flow ---------- */
function openCard(n) {
  stopTimer();
  closeModals();
  cardNum = n;
  ids = G.make(n);
  dabbed = {}; flash = {};
  wildUsed = missNext = false;
  started = false; locked = true;
  used = 0;
  queue = buildQueue(rng(n * 31 + 7));
  perfect = perfectCount(queue);
  msg.textContent = "";
  timerEl.textContent = "";
  timerEl.classList.remove("low");
  nameEl.textContent = "Choose Timer or No Timer to start";
  playerEl.hidden = false;
  playerEl.classList.add("idle");
  skipBtn.hidden = wildBtn.hidden = true;
  wildBtn.disabled = false;
  $("startbar").hidden = false;
  $("game-title").textContent = `${G.name} · ${modeLabel}${isRoom ? " · code " + roomCode(n) : ""}`;
  $("card-no").textContent = "#" + n;
  $("tech-body").innerHTML = G.tech.map(([t, d]) => `<p><b>${t}:</b> ${d}</p>`).join("");
  $("n-first").disabled = $("n-prev").disabled = n <= 1;
  $("n-last").disabled = $("n-next").disabled = n >= todayNum();
  render();
}

function begin(timed) {
  useTimer = timed;
  started = true;
  locked = false;
  $("startbar").hidden = true;
  playerEl.classList.remove("idle");
  skipBtn.hidden = wildBtn.hidden = false;
  next();
}

function pull() {
  const p = queue.shift();
  if (p) used++;
  return p || null;
}

function next() {
  if (filledCount() === ids.length) return finish(true);
  let p = pull();
  if (p && missNext) {
    msg.textContent = `Missed turn: ${p.name} was skipped.`;
    missNext = false;
    p = pull();
  }
  if (!p) return finish(false);
  cur = p;
  nameEl.textContent = p.name;
  playerEl.classList.remove("pop");
  void playerEl.offsetWidth;
  playerEl.classList.add("pop");
  render();
  resetTimer();
}

function icon(c) {
  const flag = f => `<img src="https://flagcdn.com/w80/${f}.png" alt="">`;
  if (c.html) return `<span class="icon multi">${c.html}</span>`;
  if (c.flag) return flag(c.flag);
  if (c.cluster) return `<span class="icon cluster">${c.cluster.map(flag).join("")}</span>`;
  if (c.badge) return `<span class="icon badge" style="background:${c.badge[1]};color:${c.badge[2]}">${c.badge[0]}</span>`;
  return `<span class="icon">${c.emoji}</span>`;
}

function render() {
  counter.textContent = `${filledCount()}/${ids.length} filled · players used ${used}`;
  bar.style.width = `${(filledCount() / ids.length) * 100}%`;
  board.innerHTML = "";
  ids.forEach(id => {
    const c = C[id];
    const el = document.createElement("button");
    el.className = `tile ${kind(c)} ${flash[id] || (dabbed[id] ? "done" : "")}`;
    el.innerHTML = `${icon(c)}<span>${c.label}</span>`;
    el.onclick = () => pick(id);
    board.appendChild(el);
  });
}

function pick(id) {
  if (locked || !started || dabbed[id]) return;
  const ok = C[id].test(cur);
  stopTimer();
  locked = true;
  flash = { [id]: ok ? "correct" : "wrong" };
  render();
  setTimeout(() => {
    flash = {};
    locked = false;
    if (ok) { dabbed[id] = true; msg.textContent = "Correct!"; }
    else { missNext = true; msg.textContent = "Wrong. You miss the next player."; }
    next();
  }, 700);
}

function useWildcard() {
  if (locked || !started || wildUsed) return;
  const hits = open(cur);
  if (!hits.length) { msg.textContent = "Nothing fits this player."; return; }
  stopTimer();
  wildUsed = locked = true;
  wildBtn.disabled = true;
  flash = Object.fromEntries(hits.map(id => [id, "correct"]));
  render();
  setTimeout(() => {
    hits.forEach(id => dabbed[id] = true);
    flash = {};
    locked = false;
    msg.textContent = `Wildcard: ${hits.length} placed.`;
    next();
  }, 700);
}

function skip() {
  if (locked || !started) return;
  msg.textContent = "";
  next();
}

function finish(won) {
  stopTimer();
  locked = true;
  timerEl.textContent = "";
  playerEl.hidden = skipBtn.hidden = wildBtn.hidden = true;
  render();
  const eff = won ? Math.min(100, Math.round((perfect / used) * 100)) : 0;
  const s = loadStats();
  s.tries = (s.tries || 0) + 1;
  if (won) {
    s.wins = (s.wins || 0) + 1;
    s.streak = (s.streak || 0) + 1;
    s.bestStreak = Math.max(s.bestStreak || 0, s.streak);
    s.bestBingo = Math.min(s.bestBingo || Infinity, used);
    s.effSum = (s.effSum || 0) + eff;
  } else s.streak = 0;
  saveStats(s);
  last = { won, eff, used, from: used - perfect };
  if (won) celebrate(() => showResult()); else setTimeout(showResult, 700);
}

function celebrate(done) {
  $("flash").hidden = false;
  confetti();
  setTimeout(() => { $("flash").hidden = true; done(); }, 4000);
}

/* ---------- results, stats, modals ---------- */
const box = (n, l, cls = "") => `<div><b class="${cls}">${n}</b><span>${l}</span></div>`;

function statBoxes() {
  const s = loadStats(), tries = s.tries || 0, wins = s.wins || 0;
  return box(tries, "Total Tries") + box(s.streak || 0, "Streak") + box(s.bestStreak || 0, "Best Streak") +
    box(tries ? Math.round((wins / tries) * 100) + "%" : "0%", "Success Rate") +
    box(wins ? s.bestBingo : "-", "Best BINGO") + box(wins ? Math.round(s.effSum / wins) + "%" : "-", "Avg Efficiency");
}

function showResult() {
  $("r-title").textContent = last.won ? "Bingo!" : "Out of players";
  $("r-main").className = "stats big";
  $("r-main").innerHTML = box(last.used, "Players Used") +
    box(last.won ? last.eff + "%" : "-", "Efficiency Score") + box(last.won ? "+" + last.from : "-", "From Perfect");
  $("r-stats").innerHTML = statBoxes();
  $("sb-next").textContent = cardNum < todayNum() ? "Play next card" : "Play again";
  openModal("result");
}

function openModal(id) {
  closeModals();
  if (id === "stats") $("s-stats").innerHTML = statBoxes();
  $(id).hidden = false;
  tick();
  countdownTimer = setInterval(tick, 1000);
}

function closeModals() {
  clearInterval(countdownTimer);
  ["result", "stats", "howto"].forEach(id => $(id).hidden = true);
}

function tick() {
  const now = new Date(), end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const sec = Math.floor((end - now) / 1000);
  const f = n => String(n).padStart(2, "0");
  document.querySelectorAll(".countdown").forEach(el =>
    el.textContent = `${f(Math.floor(sec / 3600))}:${f(Math.floor(sec / 60) % 60)}:${f(sec % 60)}`);
}

function share() {
  const link = location.href.split("?")[0].split("#")[0] + "?room=" + roomCode(cardNum);
  const text = `Crystalbingo ${G.name} #${cardNum}: ${last.won ? `Bingo in ${last.used} players, ${last.eff}% efficiency` : "Out of players"}` +
    (isRoom ? `\nPlay the same card: ${link} (code ${roomCode(cardNum)})` : "");
  if (navigator.share) return navigator.share({ text }).catch(() => {});
  navigator.clipboard?.writeText(text).then(() => {
    $("share").textContent = "Copied!";
    setTimeout(() => $("share").textContent = "Share", 1500);
  });
}

function confetti() {
  const colors = ["#b8f545", "#22d67a", "#19d3e0", "#2d9cff", "#2d5bff"];
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.className = "confetti";
    s.style.cssText = `left:${Math.random() * 100}vw;background:${colors[i % 5]};z-index:40;animation-delay:${Math.random() * .8}s;animation-duration:${1.6 + Math.random() * 1.6}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 4000);
  }
}

/* ---------- timer ---------- */
function stopTimer() { clearInterval(interval); }

function resetTimer() {
  stopTimer();
  timerEl.textContent = "";
  timerEl.classList.remove("low");
  if (!useTimer) return;
  timeLeft = TIME_LIMIT;
  showTime();
  interval = setInterval(() => {
    timeLeft--;
    showTime();
    if (timeLeft <= 0) {
      msg.textContent = `Time's up for ${cur.name}.`;
      next();
    }
  }, 1000);
}

function showTime() {
  timerEl.textContent = `${timeLeft}s`;
  timerEl.classList.toggle("low", timeLeft <= 3);
}

/* ---------- wiring ---------- */
document.querySelectorAll(".gtab").forEach(b => b.onclick = () => selectGame(b.dataset.game));
$("m-daily").onclick = () => play(todayNum(), "Daily challenge");
$("m-yesterday").onclick = () => play(Math.max(1, todayNum() - 1), "Yesterday");
$("m-friends").onclick = () => { $("friend-msg").textContent = ""; show("friends"); };
$("f-back").onclick = () => show("home");
$("f-create").onclick = () => play(1 + Math.floor(Math.random() * todayNum()), "With friends");
$("f-join").onclick = () => joinRoom($("f-code").value);
$("back").onclick = toHome;
$("logo").onclick = toHome;
$("how-link").onclick = () => openModal("howto");
$("btn-help").onclick = () => openModal("howto");
$("btn-stats").onclick = () => openModal("stats");
$("t-timer").onclick = () => begin(true);
$("t-free").onclick = () => begin(false);
$("skip").onclick = skip;
wildBtn.onclick = useWildcard;
$("n-first").onclick = () => go(1);
$("n-prev").onclick = () => go(Math.max(1, cardNum - 1));
$("n-next").onclick = () => go(Math.min(todayNum(), cardNum + 1));
$("n-last").onclick = () => go(todayNum());
$("share").onclick = share;
$("sb-next").onclick = () => go(cardNum < todayNum() ? cardNum + 1 : cardNum);
document.querySelectorAll("[data-close]").forEach(b => b.onclick = closeModals);

const room = new URLSearchParams(location.search).get("room");
if (room) joinRoom(room);
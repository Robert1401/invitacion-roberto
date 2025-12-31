// =============== CONFIG ===============
const CHANGE_EVERY_MS = 20000; // ✅ 20s para leer (cambia a 30000 si quieres 30s)
const RSVP_ENDPOINT = "https://rsvp-worker.robertoa1401.workers.dev"; // tu worker
const RSVP_KEY = "rsvp_aram21_done_v2"; // cambia si quieres reset global

// =============== i18n ===============
const i18n = {
  es: {
    lang: "es",
    title: "Invitación | Aram 21",
    years: "AÑOS",
    subtitle: "Te invito a celebrar mi cumpleaños",
    dayLabel: "DÍA",
    timeLabel: "HORA",
    placeLabel: "LUGAR",
    placeMain: "Atotonilco de Tula, Hidalgo",
    placeSub: "Con abuelita Andrea",
    footer: "<strong>Dress code:</strong> cómodo / casual ✨",
    message: `Una fecha marcada, una noche para celebrar,<br/>
              y personas especiales que no pueden faltar.<br/>
              Te invito a compartir conmigo una celebración<br/>
              llena de luz, risas y buenos momentos.`,
    dateValue: "10 ENE 2026",
    timeValue: "5:00 PM",

    openRsvpBtn: "Confirmar asistencia",
    confirmedSmall: "✅ Ya confirmaste. ¡Gracias!",

    rsvpTitle: "¿Confirmas tu asistencia?",
    rsvpSub: "Escribe tu nombre y confirma.",
    rsvpNameLabel: "Tu nombre",
    rsvpYes: "Confirmar ✅",
    rsvpNo: "No puedo 😢",
    rsvpHint: "Si te equivocaste, borra el historial/localStorage del navegador.",
    rsvpThanksYes: "¡Listo! Quedó confirmada tu asistencia ✨",
    rsvpThanksNo: "Listo. Gracias por avisar 🙏",
    rsvpNeedName: "Escribe tu nombre, porfa 🙂",
    rsvpSending: "Enviando…",
    rsvpError: "No se pudo enviar. Revisa el endpoint o intenta de nuevo."
  },
  en: {
    lang: "en",
    title: "Invitation | Aram 21",
    years: "YEARS",
    subtitle: "You're invited to celebrate my birthday",
    dayLabel: "DATE",
    timeLabel: "TIME",
    placeLabel: "PLACE",
    placeMain: "Atotonilco de Tula, Hidalgo",
    placeSub: "With grandma Andrea",
    footer: "<strong>Dress code:</strong> comfy / casual ✨",
    message: `A special date, a night to celebrate,<br/>
              with people who truly matter.<br/>
              Come join me for a celebration<br/>
              full of lights, laughs and good vibes.`,
    dateValue: "JAN 10, 2026",
    timeValue: "5:00 PM",

    openRsvpBtn: "Confirm attendance",
    confirmedSmall: "✅ You already confirmed. Thank you!",

    rsvpTitle: "Can you make it?",
    rsvpSub: "Type your name and confirm.",
    rsvpNameLabel: "Your name",
    rsvpYes: "Confirm ✅",
    rsvpNo: "Can't make it 😢",
    rsvpHint: "If you made a mistake, clear your browser localStorage.",
    rsvpThanksYes: "Done! Your attendance is confirmed ✨",
    rsvpThanksNo: "Got it. Thanks for letting me know 🙏",
    rsvpNeedName: "Please type your name 🙂",
    rsvpSending: "Sending…",
    rsvpError: "Couldn’t send. Check your endpoint or try again."
  },
  zh: {
    lang: "zh",
    title: "邀请函 | Aram 21",
    years: "岁",
    subtitle: "邀请你来参加我的生日聚会",
    dayLabel: "日期",
    timeLabel: "时间",
    placeLabel: "地点",
    placeMain: "Atotonilco de Tula, Hidalgo",
    placeSub: "和外婆 Andrea 一起",
    footer: "<strong>着装：</strong>舒适 / 休闲 ✨",
    message: `一个特别的日子，一场庆祝的夜晚，<br/>
              重要的人当然不能缺席。<br/>
              诚邀你一起来参加我的生日聚会，<br/>
              充满灯光、欢笑与美好回忆。`,
    dateValue: "2026年1月10日",
    timeValue: "下午 5:00",

    openRsvpBtn: "确认出席",
    confirmedSmall: "✅ 你已确认，谢谢！",

    rsvpTitle: "你能来吗？",
    rsvpSub: "请输入名字并确认。",
    rsvpNameLabel: "你的名字",
    rsvpYes: "确认 ✅",
    rsvpNo: "不能来 😢",
    rsvpHint: "如果填错了，请清除浏览器 localStorage。",
    rsvpThanksYes: "完成！已确认出席 ✨",
    rsvpThanksNo: "收到，谢谢告知 🙏",
    rsvpNeedName: "请先输入名字 🙂",
    rsvpSending: "正在发送…",
    rsvpError: "发送失败，请检查接口或重试。"
  }
};

const order = ["es", "en", "zh"];

// =============== helpers ===============
function $(id){ return document.getElementById(id); }

function params(){
  return new URLSearchParams(location.search);
}

function isModalOpen(){
  return $("rsvpModal")?.classList.contains("show");
}

function currentLang(){
  return (document.body.dataset.lang || localStorage.getItem("lang") || "es");
}

// ✅ modo test: si abres con ?test=1, NO bloquea el botón aunque ya haya confirmado
function isTestMode(){
  return params().get("test") === "1";
}

// =============== i18n ===============
function setLang(code){
  const t = i18n[code] || i18n.es;
  document.documentElement.lang = t.lang;
  document.title = t.title;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  const dateEl = $("dateValue");
  const timeEl = $("timeValue");
  const placeMainEl = $("placeMain");

  if (dateEl) dateEl.textContent = t.dateValue;
  if (timeEl) timeEl.textContent = t.timeValue;
  if (placeMainEl) placeMainEl.textContent = t.placeMain;

  document.body.dataset.lang = code;
  localStorage.setItem("lang", code);

  renderConfirmedState();
}

function bootLanguage(){
  const p = params();
  const forced = p.get("lang"); // es/en/zh
  const saved = localStorage.getItem("lang");

  let idx = order.indexOf(saved || "es");
  if (idx < 0) idx = 0;

  // ✅ si el usuario fuerza lang, se queda fijo (no rota)
  if (forced && i18n[forced]) {
    setLang(forced);
    return;
  }

  setLang(order[idx]);

  setInterval(() => {
    // ✅ no rotar si modal abierto (para que lean y confirmen)
    if (isModalOpen()) return;

    idx = (idx + 1) % order.length;
    setLang(order[idx]);
  }, CHANGE_EVERY_MS);
}

// =============== RSVP ===============
function openModal(){
  const modal = $("rsvpModal");
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  setTimeout(() => $("rsvpName")?.focus(), 150);
}

function closeModal(){
  const modal = $("rsvpModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function alreadyDone(){
  // ✅ en test mode, lo tratamos como NO confirmado para poder probar varias veces
  if (isTestMode()) return false;
  return !!localStorage.getItem(RSVP_KEY);
}

function renderConfirmedState(){
  const lang = currentLang();
  const t = i18n[lang] || i18n.es;

  const btn = $("openRsvpBtn");
  const note = $("rsvpSmallNote");

  if (!btn || !note) return;

  if (alreadyDone()){
    btn.disabled = true;
    btn.style.opacity = "0.75";
    btn.style.cursor = "not-allowed";
    note.textContent = t.confirmedSmall;
  } else {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
    note.textContent = isTestMode()
      ? "🧪 Modo prueba activo (?test=1): puedes confirmar varias veces."
      : "";
  }
}

async function sendRSVP(payload){
  if (!RSVP_ENDPOINT || RSVP_ENDPOINT.includes("XXXXXXXX")){
    return { ok: true, skipped: true };
  }

  const res = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });

  // ✅ intenta leer respuesta por si quieres debug
  let json = null;
  try { json = await res.json(); } catch {}

  return { ok: res.ok, status: res.status, json };
}

function markDone(data){
  // ✅ en test mode NO guardamos bloqueo
  if (isTestMode()) return;

  localStorage.setItem(RSVP_KEY, JSON.stringify({
    ...data,
    at: new Date().toISOString()
  }));
}

async function handleRSVP(attending){
  const lang = currentLang();
  const t = i18n[lang] || i18n.es;

  const name = ($("rsvpName")?.value || "").trim();
  const status = $("rsvpStatus");

  if (!name){
    if (status) status.textContent = t.rsvpNeedName;
    return;
  }

  if (status) status.textContent = t.rsvpSending;

  const payload = {
    name,
    attending,
    event: "Aram 21",
    date: "2026-01-10",
    time: "5:00 PM",
    place: "Atotonilco de Tula, Hidalgo",
    lang
  };

  try{
    const result = await sendRSVP(payload);

    if (!result.ok){
      if (status) status.textContent = `${t.rsvpError} (HTTP ${result.status})`;
      return;
    }

    markDone({ name, attending, lang, sent: true });
    if (status) status.textContent = attending ? t.rsvpThanksYes : t.rsvpThanksNo;

    renderConfirmedState();
    setTimeout(() => closeModal(), 900);
  } catch(e){
    if (status) status.textContent = t.rsvpError;
  }
}

function bootRSVP(){
  $("openRsvpBtn")?.addEventListener("click", () => {
    if (alreadyDone()) return;
    openModal();
  });

  $("btnYes")?.addEventListener("click", () => handleRSVP(true));
  $("btnNo")?.addEventListener("click", () => handleRSVP(false));

  $("rsvpModal")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "rsvpModal") closeModal();
  });

  renderConfirmedState();
}

// INIT
bootLanguage();
bootRSVP();

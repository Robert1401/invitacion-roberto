// =============== CONFIG ===============
const CHANGE_EVERY_MS = 7000; // 7s
const RSVP_ENDPOINT = "https://formspree.io/f/XXXXXXXX"; // <-- cambia esto (Formspree o Apps Script)
const RSVP_KEY = "rsvp_aram21_done_v1";

// =============== i18n ===============
const i18n = {
  es: {
    lang: "es",
    title: "Invitación | Aram 21",
    pill: "INVITACIÓN ESPECIAL",
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
    giftTitle: "REGALO",
    giftText: "Si gustas, puedes traer un sobre 💛",

    rsvpTitle: "¿Confirmas tu asistencia?",
    rsvpSub: "Escribe tu nombre y confirma. Solo se pide una vez.",
    rsvpNameLabel: "Tu nombre",
    rsvpYes: "Confirmar ✅",
    rsvpNo: "No puedo 😢",
    rsvpHint: "Tip: si te equivocaste, borra el historial/localStorage del navegador.",
    rsvpThanksYes: "¡Listo! Quedó confirmada tu asistencia ✨",
    rsvpThanksNo: "Listo. Gracias por avisar 🙏",
    rsvpNeedName: "Escribe tu nombre, porfa 🙂",
    rsvpSending: "Enviando confirmación…",
    rsvpError: "No se pudo enviar. Intenta de nuevo o revisa tu endpoint."
  },

  en: {
    lang: "en",
    title: "Invitation | Aram 21",
    pill: "SPECIAL INVITATION",
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
    giftTitle: "GIFT",
    giftText: "If you'd like, an envelope gift is welcome 💛",

    rsvpTitle: "Can you make it?",
    rsvpSub: "Type your name and confirm. You’ll only see this once.",
    rsvpNameLabel: "Your name",
    rsvpYes: "Confirm ✅",
    rsvpNo: "Can't make it 😢",
    rsvpHint: "Tip: if you made a mistake, clear your browser localStorage.",
    rsvpThanksYes: "Done! Your attendance is confirmed ✨",
    rsvpThanksNo: "Got it. Thanks for letting me know 🙏",
    rsvpNeedName: "Please type your name 🙂",
    rsvpSending: "Sending RSVP…",
    rsvpError: "Couldn’t send. Try again or check your endpoint."
  },

  zh: {
    lang: "zh",
    title: "邀请函 | Aram 21",
    pill: "特别邀请",
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
    giftTitle: "礼物",
    giftText: "如愿意，可带信封礼金 💛",

    rsvpTitle: "你能来吗？",
    rsvpSub: "请输入名字并确认（只会出现一次）。",
    rsvpNameLabel: "你的名字",
    rsvpYes: "确认 ✅",
    rsvpNo: "不能来 😢",
    rsvpHint: "提示：如果填错了，请清除浏览器 localStorage。",
    rsvpThanksYes: "完成！已确认出席 ✨",
    rsvpThanksNo: "收到，谢谢告知 🙏",
    rsvpNeedName: "请先输入名字 🙂",
    rsvpSending: "正在发送…",
    rsvpError: "发送失败，请重试或检查接口。"
  }
};

const order = ["es", "en", "zh"];

// =============== LANGUAGE ROTATION ===============
function setLang(code){
  const t = i18n[code] || i18n.es;

  document.documentElement.lang = t.lang;
  document.title = t.title;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  const dateEl = document.getElementById("dateValue");
  const timeEl = document.getElementById("timeValue");
  const placeMainEl = document.getElementById("placeMain");

  if (dateEl) dateEl.textContent = t.dateValue;
  if (timeEl) timeEl.textContent = t.timeValue;
  if (placeMainEl) placeMainEl.textContent = t.placeMain;

  document.body.dataset.lang = code;
  localStorage.setItem("lang", code);
}

function bootLanguage(){
  const params = new URLSearchParams(location.search);
  const forced = params.get("lang"); // ?lang=es|en|zh
  const saved = localStorage.getItem("lang");

  let idx = order.indexOf(saved || "es");
  if (idx < 0) idx = 0;

  if (forced && i18n[forced]) {
    setLang(forced);
    return;
  }

  setLang(order[idx]);
  setInterval(() => {
    idx = (idx + 1) % order.length;
    setLang(order[idx]);
  }, CHANGE_EVERY_MS);
}

// =============== RSVP (ONE TIME) ===============
function $(id){ return document.getElementById(id); }

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

function currentLang(){
  return (document.body.dataset.lang || localStorage.getItem("lang") || "es");
}

async function sendRSVP(payload){
  // Si no configuras endpoint, no revienta: solo simula.
  if (!RSVP_ENDPOINT || RSVP_ENDPOINT.includes("XXXXXXXX")) {
    return { ok: true, skipped: true };
  }

  const res = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });

  return { ok: res.ok };
}

function markDone(data){
  localStorage.setItem(RSVP_KEY, JSON.stringify({
    ...data,
    at: new Date().toISOString()
  }));
}

function alreadyDone(){
  return !!localStorage.getItem(RSVP_KEY);
}

async function handleRSVP(attending){
  const lang = currentLang();
  const t = i18n[lang] || i18n.es;

  const name = ($("rsvpName")?.value || "").trim();
  const status = $("rsvpStatus");

  if (!name) {
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

    markDone({ name, attending, lang, sent: !!result.ok });

    if (status) status.textContent = attending ? t.rsvpThanksYes : t.rsvpThanksNo;

    // Cierra solo
    setTimeout(() => closeModal(), 900);
  }catch(e){
    if (status) status.textContent = t.rsvpError;
  }
}

function bootRSVP(){
  if (alreadyDone()) return; // ✅ solo una vez
  openModal();

  $("btnYes")?.addEventListener("click", () => handleRSVP(true));
  $("btnNo")?.addEventListener("click", () => handleRSVP(false));

  // Cerrar clic fuera (opcional)
  $("rsvpModal")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "rsvpModal") closeModal();
  });
}

// =============== INIT ===============
bootLanguage();
bootRSVP();

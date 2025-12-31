// =============== CONFIG ===============
const RSVP_ENDPOINT = "https://rsvp-worker.robertoa1401.workers.dev";
const RSVP_KEY = "rsvp_aram21_done_v2";

// =============== TEXTOS (solo ES) ===============
const t = {
  lang: "es",
  title: "Invitación | Aram 21",
  confirmedSmall: "✅ Ya confirmaste. ¡Gracias!",

  rsvpNeedName: "Escribe tu nombre, porfa 🙂",
  rsvpSending: "Enviando…",
  rsvpThanksYes: "¡Listo! Quedó confirmada tu asistencia ✨",
  rsvpThanksNo: "Listo. Gracias por avisar 🙏",
  rsvpError: "No se pudo enviar. Revisa el endpoint o intenta de nuevo."
};

// =============== helpers ===============
function $(id){ return document.getElementById(id); }

function setSpanish(){
  document.documentElement.lang = t.lang;
  document.title = t.title;
  document.body.dataset.lang = "es";
  localStorage.setItem("lang", "es");
}

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
  return !!localStorage.getItem(RSVP_KEY);
}

function renderConfirmedState(){
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
    note.textContent = "";
  }
}

async function sendRSVP(payload){
  const res = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });

  let json = null;
  try { json = await res.json(); } catch {}
  return { ok: res.ok, status: res.status, json };
}

function markDone(data){
  localStorage.setItem(RSVP_KEY, JSON.stringify({
    ...data,
    at: new Date().toISOString()
  }));
}

async function handleRSVP(attending){
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
    lang: "es"
  };

  try{
    const result = await sendRSVP(payload);

    if (!result.ok){
      if (status) status.textContent = `${t.rsvpError} (HTTP ${result.status})`;
      return;
    }

    markDone({ name, attending, lang: "es", sent: true });
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
setSpanish();
bootRSVP();

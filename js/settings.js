// ============================================================
// APP INIT
// ============================================================
function applySettings() {
  const n = DATA.settings.siteName || 'Jaloliddin Math';
  const loginTitle = DATA.settings.loginTitle || n;
  const ver = DATA.settings.appVersion || 'v1.4';
  document.title = n;
  const el1 = document.getElementById('admin-site-name');
  const el2 = document.getElementById('parent-site-name');
  const el3 = document.getElementById('guest-site-name');
  const lt  = document.getElementById('login-title');
  const lv  = document.getElementById('login-version');
  if (el1) el1.textContent = n;
  if (el2) el2.textContent = n;
  if (el3) el3.textContent = n;
  if (lt) lt.textContent = loginTitle;
  if (lv)  lv.textContent  = 'Baholash tizimi ' + ver;
  const si = document.getElementById('set-name');
  if (si) si.value = n;
  const ss = document.getElementById('set-schedule');
  if (ss) ss.value = DATA.settings.schedule || '';
  const sn = document.getElementById('set-nextdt');
  if (sn) sn.value = DATA.settings.nextClassDt || '';
  renderGroupScheduleSettings();
  const slt = document.getElementById('set-login-title');
  if (slt) slt.value = DATA.settings.loginTitle || '';
  const sv = document.getElementById('set-version');
  if (sv) sv.value = DATA.settings.appVersion || '';
  // Scoring limits
  const uvMax   = DATA.settings.uvMax   || 50;
  const mtMax   = DATA.settings.mtMax   || 25;
  const faolMax = DATA.settings.faolMax || 25;
  const suv = document.getElementById('set-uv-max');
  if (suv) suv.value = uvMax;
  const smt = document.getElementById('set-mt-max');
  if (smt) smt.value = mtMax;
  const sfaol = document.getElementById('set-faol-max');
  if (sfaol) sfaol.value = faolMax;
  const duvEl = document.getElementById('set-uv-desc');
  if (duvEl) duvEl.textContent = `Hozir: ${uvMax} ball`;
  const dmtEl = document.getElementById('set-mt-desc');
  if (dmtEl) dmtEl.textContent = `Hozir: ${mtMax} ball`;
  const dfaolEl = document.getElementById('set-faol-desc');
  if (dfaolEl) dfaolEl.textContent = `Hozir: ${faolMax} ball · Jami: ${uvMax+mtMax+faolMax}`;
  // Fon rasmi
  const bgUrl = DATA.settings.bgUrl || '';
  if (bgUrl) {
    document.body.style.backgroundImage = `url(${bgUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
  } else {
    document.body.style.backgroundImage = '';
  }
  const sbg = document.getElementById('set-bg-url');
  if (sbg) sbg.value = bgUrl;
  // Update pwa-app-name
  const pan = document.getElementById('pwa-app-name');
  if (pan) pan.textContent = n;
  if (typeof applyLabels === 'function') applyLabels();
}

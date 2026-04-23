// ============================================================
// APP INIT
// ============================================================
function applySettings() {
  var s = DATA.settings || {};
  var n          = s.siteName   || 'Jaloliddin Math';
  var loginTitle = s.loginTitle || n;
  var ver        = s.appVersion || 'v1.4';

  // Sarlavhalar
  document.title = n;
  ['admin-site-name','parent-site-name','guest-site-name','guest-site-name2'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.textContent = n;
  });
  var lt = document.getElementById('login-title');   if (lt)  lt.textContent  = loginTitle;
  var lv = document.getElementById('login-version'); if (lv)  lv.textContent  = 'Baholash tizimi ' + ver;
  var si = document.getElementById('set-name');      if (si)  si.value        = n;
  var ss = document.getElementById('set-schedule');  if (ss)  ss.value        = s.schedule || '';
  var sn = document.getElementById('set-nextdt');    if (sn)  sn.value        = s.nextClassDt || '';
  renderGroupScheduleSettings();
  var slt = document.getElementById('set-login-title'); if (slt) slt.value = s.loginTitle || '';
  var sv  = document.getElementById('set-version');     if (sv)  sv.value  = s.appVersion || '';
  var pan = document.getElementById('pwa-app-name');    if (pan) pan.textContent = n;

  // Ball chegaralari
  var uvMax = s.uvMax || 50, mtMax = s.mtMax || 25, faolMax = s.faolMax || 25;
  var suv = document.getElementById('set-uv-max');   if (suv) suv.value = uvMax;
  var smt = document.getElementById('set-mt-max');   if (smt) smt.value = mtMax;
  var sfa = document.getElementById('set-faol-max'); if (sfa) sfa.value = faolMax;
  var du  = document.getElementById('set-uv-desc');  if (du)  du.textContent  = 'Hozir: ' + uvMax + ' ball';
  var dm  = document.getElementById('set-mt-desc');  if (dm)  dm.textContent  = 'Hozir: ' + mtMax + ' ball';
  var df  = document.getElementById('set-faol-desc');if (df)  df.textContent  = 'Hozir: ' + faolMax + ' ball \xb7 Jami: ' + (uvMax+mtMax+faolMax);

  // ── LOGO ─────────────────────────────────────────────────
  var logoUrl = s.logoUrl || '';
  var logoIds = ['login-icon','admin-logo-icon','parent-logo-icon','guest-logo-icon'];
  logoIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (logoUrl) {
      el.style.backgroundImage    = 'url(' + logoUrl + ')';
      el.style.backgroundSize     = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.backgroundRepeat   = 'no-repeat';
      el.style.fontSize           = '0';
      el.style.color              = 'transparent';
    } else {
      el.style.backgroundImage    = '';
      el.style.backgroundSize     = '';
      el.style.backgroundPosition = '';
      el.style.backgroundRepeat   = '';
      el.style.fontSize           = '';
      el.style.color              = '';
    }
  });
  var slgo = document.getElementById('set-logo-url');
  if (slgo) slgo.value = logoUrl;

  // ── FON + ANIMATSIYA ─────────────────────────────────────
  var bgUrl  = s.bgUrl  || '';
  var bgAnim = (s.bgAnim !== false);
  var canvas = document.getElementById('bg-canvas');
  var screens = ['login','guest-app','admin-app','parent-app'];

  if (bgUrl) {
    // Fon rasmi bor -> body ga qo'yamiz
    document.body.style.backgroundImage      = 'url(' + bgUrl + ')';
    document.body.style.backgroundSize       = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition   = 'center';
    document.body.style.backgroundRepeat     = 'no-repeat';
    document.body.style.backgroundColor      = '#0F172A';
    // Ekranlarni shaffof qilamiz — body fonini ko'rsatadi
    screens.forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.background = 'transparent';
      el.style.backgroundColor = 'transparent';
    });
  } else {
    // Fon rasmi yo'q
    document.body.style.backgroundImage   = '';
    document.body.style.backgroundSize    = '';
    document.body.style.backgroundAttachment = '';
    document.body.style.backgroundPosition   = '';
    document.body.style.backgroundRepeat  = '';
    document.body.style.backgroundColor   = '';
    document.body.style.background        = '';
    screens.forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.background = '';
      el.style.backgroundColor = '';
    });
    // Animatsiya o'chiq + fon yo'q -> qoramtir
    if (!bgAnim) document.body.style.background = '#0F172A';
  }

  // Canvas ko'rsatish/yashirish
  if (canvas) canvas.style.display = bgAnim ? 'block' : 'none';

  var animChk = document.getElementById('set-bg-anim');
  if (animChk) animChk.checked = bgAnim;
  var sbg = document.getElementById('set-bg-url');
  if (sbg) sbg.value = bgUrl;

  if (typeof applyLabels === 'function') applyLabels();
}

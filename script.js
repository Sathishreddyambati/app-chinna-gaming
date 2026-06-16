"// =============================================================
// Chinna Gaming - Shared UI utilities
// =============================================================

// ----- Toast notifications -----
export function toast(msg, type = \"info\", ms = 2600) {
  let box = document.querySelector(\".toast-box\");
  if (!box) {
    box = document.createElement(\"div\");
    box.className = \"toast-box\";
    document.body.appendChild(box);
  }
  const el = document.createElement(\"div\");
  el.className = `toast ${type}`;
  el.textContent = msg;
  el.setAttribute(\"data-testid\", \"toast-message\");
  box.appendChild(el);
  setTimeout(() => {
    el.style.opacity = \"0\";
    el.style.transform = \"translateY(-12px)\";
    el.style.transition = \"all .3s ease\";
    setTimeout(() => el.remove(), 300);
  }, ms);
}

// ----- Ripple effect for buttons -----
export function attachRipples(root = document) {
  root.querySelectorAll(\".btn, .icon-btn, .amt-btn, .chip\").forEach((b) => {
    if (b.dataset.ripple) return;
    b.dataset.ripple = \"1\";
    b.classList.add(\"ripple\");
    b.addEventListener(\"click\", (e) => {
      const rect = b.getBoundingClientRect();
      b.style.setProperty(\"--x\", e.clientX - rect.left + \"px\");
      b.style.setProperty(\"--y\", e.clientY - rect.top + \"px\");
      b.classList.remove(\"go\");
      void b.offsetWidth;
      b.classList.add(\"go\");
    });
  });
}

// ----- Format helpers -----
export function fmtCoins(n) {
  n = Number(n) || 0;
  return n.toLocaleString(\"en-IN\");
}
export function fmtDate(ts) {
  if (!ts) return \"\";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(\"en-IN\", {
    day: \"2-digit\", month: \"short\", hour: \"2-digit\", minute: \"2-digit\"
  });
}

// ----- Bottom navigation builder -----
export function bottomNav(active = \"home\") {
  const items = [
    { id: \"home\",    label: \"Home\",    icon: \"fa-house\",        href: \"home.html\" },
    { id: \"games\",   label: \"Games\",   icon: \"fa-dice\",         href: \"games.html\" },
    { id: \"wallet\",  label: \"Wallet\",  icon: \"fa-wallet\",       href: \"wallet.html\" },
    { id: \"vip\",     label: \"VIP\",     icon: \"fa-crown\",        href: \"vip.html\" },
    { id: \"profile\", label: \"Profile\", icon: \"fa-user\",         href: \"profile.html\" }
  ];
  const html = `
    <nav class=\"bottom-nav\" data-testid=\"bottom-nav\">
    ${items.map(i => `
      <a class=\"nav-item ${i.id === active ? \"active\" : \"\"}\" href=\"${i.href}\" data-testid=\"nav-${i.id}\">
        <i class=\"fa-solid ${i.icon}\"></i><span>${i.label}</span>
      </a>`).join(\"\")}
    </nav>`;
  document.body.insertAdjacentHTML(\"beforeend\", html);
}

// ----- Promotional banner slider -----
export function startBanner(selector = \".banner\") {
  const banner = document.querySelector(selector);
  if (!banner) return;
  const slides = banner.querySelectorAll(\".banner-slide\");
  const dots = banner.querySelectorAll(\".banner-dots span\");
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove(\"active\");
    dots[idx]?.classList.remove(\"active\");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add(\"active\");
    dots[idx]?.classList.add(\"active\");
  }, 3500);
}

// ----- Page transition fade -----
export function pageEnter() {
  document.body.style.opacity = \"0\";
  requestAnimationFrame(() => {
    document.body.style.transition = \"opacity .35s ease\";
    document.body.style.opacity = \"1\";
  });
}

// Auto init for every page
window.addEventListener(\"DOMContentLoaded\", () => {
  attachRipples();
  pageEnter();
});
"

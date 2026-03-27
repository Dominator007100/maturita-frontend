function svgI(name) {
  var icons = {
    shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    fileCheck: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>',
    globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
    users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>',
    server: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"></rect><rect x="2" y="14" width="20" height="8" rx="2"></rect></svg>',
    lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    alertCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>'
  };
  return icons[name] || '';
}

document.addEventListener('DOMContentLoaded', function() {
  fixTemplateIcons();
  renderNukibDuties();
  renderIsoAccordion();
  renderNis2Items();
  renderNis2Sectors();
});

function fixTemplateIcons() {
  var html = document.getElementById('tab-nukib').innerHTML;
  html = html.replace(/\$\{svgI\('(\w+)'\)\}/g, function(match, name) {
    return svgI(name);
  });
  document.getElementById('tab-nukib').innerHTML = html;

  html = document.getElementById('tab-iso27001').innerHTML;
  html = html.replace(/\$\{svgI\('(\w+)'\)\}/g, function(match, name) {
    return svgI(name);
  });
  document.getElementById('tab-iso27001').innerHTML = html;
}

function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById('tab-' + tabId).classList.add('active');
  btn.classList.add('active');
}

function renderNukibDuties() {
  var duties = [
    "Detekce kybernetických bezpečnostních událostí",
    "Hlášení kybernetických bezpečnostních incidentů",
    "Zavedení bezpečnostních opatření",
    "Provádění auditů kybernetické bezpečnosti",
    "Informování NUKIB o kontaktních údajích"
  ];
  var container = document.getElementById('nukib-duties');
  if (!container) return;
  duties.forEach(function(duty) {
    var div = document.createElement('div');
    div.className = 'flex items-start gap-2';
    div.innerHTML = svgI('check') + '<span class="text-sm">' + duty + '</span>';
    container.appendChild(div);
  });
}

function renderIsoAccordion() {
  var sections = [
    { title: "Přehled ISO/IEC 27001", content: "ISO/IEC 27001 je mezinárodní norma pro systém řízení bezpečnosti informací (ISMS). Specifikuje požadavky na zavedení, udržování a neustálé zlepšování systému řízení bezpečnosti informací v kontextu organizace." },
    { title: "Struktura normy", content: "Norma se skládá z hlavního těla (klauzule 4–10) a přílohy A, která obsahuje seznam 93 kontrolních opatření ve 4 tématech: Organizační (37), Lidské zdroje (8), Fyzické (14), Technologické (34)." },
    { title: "Klíčové principy", content: "Hlavní principy zahrnují: řízení rizik, přístup založený na procesu, cyklus PDCA (Plan-Do-Check-Act), zapojení vedení, neustálé zlepšování a rozhodování na základě důkazů." },
    { title: "Proces certifikace", content: "Certifikace probíhá ve dvou stupních. Stupeň 1 zahrnuje audit dokumentace a připravenosti. Stupeň 2 je podrobný audit implementace a efektivnosti ISMS. Certifikace je platná 3 roky s dozorkovými audity." },
    { title: "Výhody certifikace", content: "Certifikace přináší systematický přístup k ochraně informací, soulad s legislativou (včetně GDPR), zvýšení důvěry zákazníků a partnerů, konkurenční výhodu a snížení rizik bezpečnostních incidentů." }
  ];

  var container = document.getElementById('iso-accordion');
  if (!container) return;

  sections.forEach(function(s, i) {
    var item = document.createElement('div');
    item.className = 'accordion-item';
    item.innerHTML = '<button class="accordion-trigger" onclick="toggleAccordion(this)">' +
      '<span>' + s.title + '</span>' + svgI('chevronDown') + '</button>' +
      '<div class="accordion-content"><p>' + s.content + '</p></div>';
    container.appendChild(item);
  });
}

function toggleAccordion(btn) {
  btn.classList.toggle('open');
  var content = btn.nextElementSibling;
  content.classList.toggle('open');
}

function renderNis2Items() {
  var items = [
    { title: "Rozšířená působnost", desc: "NIS2 zahrnuje více sektorů než původní NIS směrnice – zdravotnictví, energetiku, dopravu, digitální infrastrukturu a další." },
    { title: "Přísnější požadavky", desc: "Organizace musí implementovat řízení rizik, incident response, bezpečnost dodavatelského řetězce a šifrování." },
    { title: "Povinné hlášení", desc: "Organizace musí hlásit významné incidenty do 24 hodin od jejich zjištění a podat úplnou zprávu do 72 hodin." },
    { title: "Vysoké pokuty", desc: "Pokuty mohou dosáhnout až 10 milionů EUR nebo 2 % celkového obratu pro základní entity." }
  ];

  var container = document.getElementById('nis2-items');
  if (!container) return;

  items.forEach(function(item) {
    var card = document.createElement('div');
    card.innerHTML = '<div class="card" style="height:100%;"><div class="card-content" style="padding:20px;">' +
      '<div class="flex items-start gap-3">' +
      '<span style="color:var(--chart-4);flex-shrink:0;margin-top:2px;">' + svgI('alertCircle') + '</span>' +
      '<div><h3 class="font-semibold text-sm mb-1">' + item.title + '</h3>' +
      '<p class="text-sm text-muted leading-relaxed">' + item.desc + '</p></div></div></div></div>';
    container.appendChild(card);
  });
}

function renderNis2Sectors() {
  var sectors = ["Energetika", "Doprava", "Bankovnictví", "Zdravotnictví", "Vodní hospodářství", "Digitální infrastruktura", "Veřejná správa", "Vesmírný průmysl", "Poštovní služby", "Odpadové hospodářství", "Potravinářský průmysl", "Chemický průmysl"];

  var container = document.getElementById('nis2-sectors');
  if (!container) return;

  sectors.forEach(function(sector) {
    var span = document.createElement('span');
    span.className = 'badge badge-secondary text-xs';
    span.textContent = sector;
    container.appendChild(span);
  });
}

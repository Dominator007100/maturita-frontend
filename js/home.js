document.addEventListener('DOMContentLoaded', function() {
  initParticles('particle-canvas');
  initTypingEffect();
  initStats();
  initFeatures();
});

function initTypingEffect() {
  var texts = [
    "digitální budoucnost",
    "firemní data",
    "kybernetickou bezpečnost",
    "IT infrastrukturu"
  ];

  var el = document.getElementById('typing-text');
  if (!el) return;

  var textIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var speed = 70;

  function type() {
    var current = texts[textIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 300);
        return;
      }

      setTimeout(type, 35);
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 2500);
        return;
      }

      setTimeout(type, speed);
    }
  }

  type();
}

function initStats() {
  var stats = [
    { value: 2300, suffix: "+", label: "Kybernetických útoků denně v ČR" },
    { value: 73, suffix: "%", label: "Firem bez bezpečnostní strategie" },
    { value: 156, suffix: "M", label: "Škody z kyberkriminality (CZK)" },
    { value: 12, suffix: "", label: "Kritických zranitelností za měsíc" }
  ];

  var grid = document.getElementById('stats-grid');
  if (!grid) return;

  stats.forEach(function(stat, i) {
    var card = document.createElement('div');
    card.className = 'card fade-up';
    card.style.animationDelay = (i * 0.1) + 's';

    card.innerHTML =
      '<div class="card-content text-center" style="padding:24px 16px;">' +
        '<div class="text-3xl font-bold text-primary mb-1">' +
          '<span class="counter" data-target="' + stat.value + '" data-suffix="' + stat.suffix + '">0' + stat.suffix + '</span>' +
        '</div>' +
        '<p class="text-xs text-muted">' + stat.label + '</p>' +
      '</div>';

    grid.appendChild(card);
  });

  initCounters();
}

function initCounters() {
  var counters = document.querySelectorAll('.counter');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(counter) {
    observer.observe(counter);
  });
}

function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-target'));
  var suffix = el.getAttribute('data-suffix') || '';
  var duration = 2000;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;

    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.floor(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(step);
}

function initFeatures() {
  var features = [
    {
      icon: 'clipboard',
      title: "Bezpečnostní test",
      desc: "Otestujte své znalosti kybernetické bezpečnosti pomocí našeho interaktivního testu."
    },
    {
      icon: 'barChart',
      title: "Analýza výsledků",
      desc: "Získejte podrobnou analýzu s interaktivními grafy a doporučeními pro zlepšení."
    },
    {
      icon: 'newspaper',
      title: "Kyber zprávy",
      desc: "Sledujte nejnovější zprávy a trendy v oblasti kybernetické bezpečnosti."
    },
    {
      icon: 'book',
      title: "Standardy a normy",
      desc: "Informace o NÚKIB, ISO/IEC 27001 a dalších bezpečnostních standardech."
    }
  ];

  var grid = document.getElementById('features-grid');
  if (!grid) return;

  features.forEach(function(f, i) {
    var card = document.createElement('div');
    card.className = 'card fade-up hover-card';
    card.style.animationDelay = (i * 0.1) + 's';
    card.style.cursor = 'default';

    card.innerHTML =
      '<div class="card-content" style="padding:24px 20px;">' +
        '<div style="width:40px;height:40px;border-radius:6px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:var(--primary);">' +
          svgIcon(f.icon) +
        '</div>' +
        '<h3 class="font-semibold mb-2">' + f.title + '</h3>' +
        '<p class="text-sm text-muted">' + f.desc + '</p>' +
      '</div>';

    grid.appendChild(card);
  });
}

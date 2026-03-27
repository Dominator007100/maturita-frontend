var riskInfo = {
  "Nízké": {
    description: "Máte vynikající znalosti kybernetické bezpečnosti. Vaše povědomí o hrozbách, ochraně dat a bezpečnostních standardech je na velmi vysoké úrovni.",
    recommendations: [
      "Sledujte nejnovější trendy a hrozby v oblasti kybernetické bezpečnosti",
      "Sdílejte své znalosti s kolegy a okolím",
      "Zvažte získání profesní certifikace (např. CompTIA Security+, CISSP)"
    ]
  },
  "Střední": {
    description: "Máte solidní základy kybernetické bezpečnosti, ale některé oblasti je vhodné dále rozvíjet.",
    recommendations: [
      "Zaměřte se na oblasti, ve kterých jste získali nižší skóre",
      "Procvičujte rozpoznávání phishingu a sociálního inženýrství",
      "Prohlubte znalosti o šifrování a zabezpečení sítí",
      "Seznamte se s bezpečnostními standardy (ISO 27001, NIS2)"
    ]
  },
  "Zvýšené": {
    description: "Vaše znalosti kybernetické bezpečnosti mají výrazné mezery. Doporučujeme začít se systematickým vzděláváním v základních oblastech.",
    recommendations: [
      "Naučte se základy síťové bezpečnosti (firewall, VPN, HTTPS)",
      "Osvojte si principy silných hesel a vícefaktorové autentizace",
      "Seznamte se s nejčastějšími typy kybernetických útoků",
      "Zjistěte, jak správně zálohovat data",
      "Prostudujte si základy ochrany osobních údajů"
    ]
  },
  "Kritické": {
    description: "Vaše znalosti kybernetické bezpečnosti jsou na kritické úrovni. Je důležité začít se vzdělávat co nejdříve.",
    recommendations: [
      "Začněte od základů – co je firewall, antivirus a VPN",
      "Naučte se vytvářet a spravovat silná hesla",
      "Pochopte, co je phishing a jak ho rozpoznat",
      "Zjistěte, proč je důležité pravidelně aktualizovat software",
      "Seznamte se se základní terminologií kybernetické bezpečnosti",
      "Zvažte absolvování úvodního kurzu kybernetické bezpečnosti"
    ]
  }
};


document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (!id) {
    showError();
    return;
  }

fetch('https://fantastic-spirit-production-880f.up.railway.app/api/quiz/submissions/' + id)
    .then(function(res) {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(function(data) { renderResults(data); })
    .catch(function() { showError(); });
});

function showError() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
}

function renderResults(sub) {
  document.getElementById('loading-state').style.display = 'none';
  var container = document.getElementById('results-content');
  container.style.display = 'block';

  var riskColor = getRiskColor(sub.riskLevel);
  var risk = riskInfo[sub.riskLevel] || riskInfo["Střední"];
  var answers = sub.answers;

  var catMap = {};
  Object.keys(answers).forEach(function(qId) {
    var idx = parseInt(qId.replace('q', '')) - 1;
    var cat = quizQuestions[idx] ? quizQuestions[idx].category : 'Ostatní';
    if (!catMap[cat]) catMap[cat] = { total: 0, max: 0 };
    catMap[cat].total += answers[qId];
    catMap[cat].max += 3;
  });

  var categories = Object.keys(catMap);
  var catScores = categories.map(function(cat) {
    return { category: cat, score: catMap[cat].total, maxScore: catMap[cat].max, percent: Math.round((catMap[cat].total / catMap[cat].max) * 100) };
  });

  var html = '';

  html += '<div class="flex items-center gap-3 mb-8">' +
    '<span class="icon icon-lg" style="color:var(--primary);">' + svgIcon('barChart') + '</span>' +
    '<div><h1 class="text-2xl font-bold" data-testid="text-results-title">Vaše výsledky</h1>' +
    '<p class="text-sm text-muted">Hodnocení pro ' + escapeHtml(sub.respondentName) +
    (sub.companyName ? ' - ' + escapeHtml(sub.companyName) : '') + '</p></div></div>';

  html += '<div class="card mb-6" style="border-color:' + riskColor + '40;"><div class="card-content" style="padding:24px;">' +
    '<div class="flex items-center gap-6" style="flex-wrap:wrap;">' +
    '<div class="flex items-center gap-4 flex-1">' +
    '<div class="score-circle" style="background:' + riskColor + '15;">' +
    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="' + riskColor + '" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>' +
    '<div><div class="flex items-center gap-3 mb-1"><span class="text-3xl font-bold" data-testid="text-score">' + sub.percentScore + '%</span>' +
    '<span class="badge text-sm" style="background:' + riskColor + '15;color:' + riskColor + ';border:1px solid ' + riskColor + '40;" data-testid="badge-risk-level">Riziko: ' + sub.riskLevel + '</span></div>' +
    '<p class="text-sm text-muted">' + sub.totalScore + ' z ' + sub.maxScore + ' bodů</p></div></div>' +
    '<div style="width:192px;"><div class="progress-bar" style="height:12px;"><div class="progress-fill animate-progress" style="width:' + sub.percentScore + '%;background:' + riskColor + ';"></div></div></div>' +
    '</div></div></div>';

  html += '<div class="card mb-6"><div class="card-header"><div class="card-title flex items-center gap-2">' + svgIcon('shield') + ' Hodnocení</div></div>' +
    '<div class="card-content"><p class="text-sm text-muted mb-4">' + risk.description + '</p>' +
    '<div class="space-y-2"><p class="text-sm font-medium">Doporučení:</p><ul class="space-y-2">';
  risk.recommendations.forEach(function(rec) {
    html += '<li class="flex items-start gap-2 text-sm text-muted">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' + rec + '</li>';
  });
  html += '</ul></div></div></div>';

  html += '<div class="grid grid-2 mb-6">' +
    '<div class="card"><div class="card-header"><div class="card-title text-sm font-medium">Skóre dle kategorie</div></div>' +
    '<div class="card-content"><canvas id="radar-chart" style="max-height:256px;"></canvas></div></div>' +
    '<div class="card"><div class="card-header"><div class="card-title text-sm font-medium">Procentuální skóre</div></div>' +
    '<div class="card-content"><canvas id="bar-chart" style="max-height:256px;"></canvas></div></div></div>';

  html += '<div class="card mb-6"><div class="card-header"><div class="card-title text-sm font-medium">Detail dle kategorií</div></div>' +
    '<div class="card-content"><div class="space-y-3">';
  catScores.forEach(function(cs) {
    var color = cs.percent >= 80 ? 'var(--success)' : cs.percent >= 60 ? 'var(--warning)' : 'var(--destructive)';
    html += '<div><div class="flex items-center justify-between mb-1"><span class="text-sm font-medium">' + cs.category + '</span>' +
      '<span class="text-sm font-bold" style="color:' + color + ';">' + cs.percent + '%</span></div>' +
      '<div class="progress-bar"><div class="progress-fill animate-progress" style="width:' + cs.percent + '%;background:' + color + ';"></div></div></div>';
  });
  html += '</div></div></div>';

  html += renderQuestionReview(answers);
  html += renderSimulationReview(answers);

  html += '<div class="flex justify-center gap-3 mt-8 mb-8">' +
    '<a href="/test.html" class="btn btn-primary">Vyplnit znovu</a>' +
    '<a href="/" class="btn btn-outline">Na hlavní stránku</a></div>';

  container.innerHTML = html;

  renderCharts(catScores);
}

function renderCharts(catScores) {
  var isDark = document.documentElement.classList.contains('dark');
  var textColor = isDark ? '#9ca3af' : '#6b7280';
  var gridColor = isDark ? '#2e3238' : '#e2e4e8';

  var radarCtx = document.getElementById('radar-chart');
  if (radarCtx) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: catScores.map(function(c) { return c.category; }),
        datasets: [{
          label: 'Vaše skóre',
          data: catScores.map(function(c) { return c.score; }),
          backgroundColor: 'rgba(59,130,246,0.2)',
          borderColor: 'rgba(59,130,246,1)',
          pointBackgroundColor: 'rgba(59,130,246,1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            beginAtZero: true,
            ticks: { font: { size: 10 }, color: textColor },
            pointLabels: { font: { size: 10 }, color: textColor },
            grid: { color: gridColor }
          }
        }
      }
    });
  }

  var barCtx = document.getElementById('bar-chart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: catScores.map(function(c) { return c.category; }),
        datasets: [{
          label: 'Skóre %',
          data: catScores.map(function(c) { return c.percent; }),
          backgroundColor: catScores.map(function(c) {
            return c.percent >= 80 ? 'hsl(142,76%,36%)' : c.percent >= 60 ? 'hsl(45,93%,47%)' : c.percent >= 40 ? 'hsl(30,85%,48%)' : 'hsl(0,84%,48%)';
          }),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
          x: { ticks: { font: { size: 10 }, color: textColor, maxRotation: 45 }, grid: { display: false } }
        }
      }
    });
  }
}

function renderQuestionReview(answers) {
  var choiceQs = quizQuestions.filter(function(q) { return q.type === 'choice'; });
  var wrongCount = choiceQs.filter(function(q) { return answers[q.id] !== 3; }).length;

  var html = '<div class="card mb-6"><div class="card-header" style="padding-bottom:8px;">' +
    '<div class="flex items-center justify-between">' +
    '<div class="card-title flex items-center gap-2">' + svgIcon('book') + ' Přehled otázek a vysvětlení</div>' +
    '<button onclick="toggleAllQuestions()" class="text-xs text-primary" style="background:none;border:none;cursor:pointer;" data-testid="button-toggle-all-questions" id="toggle-all-btn">' +
    svgIcon('chevronDown') + ' Rozbalit vše</button></div>';

  if (wrongCount > 0) {
    html += '<p class="text-xs text-muted mt-1">' + wrongCount + ' z ' + choiceQs.length + ' otázek špatně</p>';
  } else {
    html += '<p class="text-xs text-success mt-1">Všechny otázky správně!</p>';
  }

  html += '</div><div class="card-content space-y-2">';

  choiceQs.forEach(function(q, index) {
    var userAnswer = answers[q.id];
    var isCorrect = userAnswer === 3;
    var userOption = q.options.find(function(o) { return o.value === userAnswer; });
    var correctOption = q.options.find(function(o) { return o.value === 3; });

    html += '<div class="question-review-item" data-testid="question-review-' + q.id + '">' +
      '<button class="question-review-header" onclick="toggleQuestion(\'' + q.id + '\')" data-testid="button-toggle-' + q.id + '">' +
      '<div class="flex items-center gap-2 flex-1" style="min-width:0;">' +
      (isCorrect ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" style="flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--destructive)" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>') +
      '<span class="text-sm font-medium truncate">' + (index + 1) + '. ' + q.question + '</span></div>' +
      '<span class="badge badge-outline text-xs" style="font-size:10px;flex-shrink:0;">' + q.category + '</span>' +
      '<span class="icon" style="flex-shrink:0;color:var(--muted);" id="chevron-' + q.id + '">' + svgIcon('chevronDown') + '</span>' +
      '</button>' +
      '<div class="question-review-detail" id="detail-' + q.id + '"><div class="space-y-2">' +
      '<div class="flex items-start gap-2 text-sm"><span class="text-muted" style="flex-shrink:0;">Vaše odpověď:</span>' +
      '<span class="badge ' + (isCorrect ? 'badge-primary' : 'badge-destructive') + ' text-xs">' + (userOption ? userOption.label : 'Nezodpovězeno') + '</span></div>';

    if (!isCorrect) {
      html += '<div class="flex items-start gap-2 text-sm"><span class="text-muted" style="flex-shrink:0;">Správná odpověď:</span>' +
        '<span class="badge badge-success text-xs">' + (correctOption ? correctOption.label : '') + '</span></div>';
    }

    if (q.explanation) {
      html += '<div class="explanation-box"><p class="text-xs font-medium text-primary mb-1 flex items-center gap-1">' + svgIcon('info') + ' Vysvětlení</p>' +
        '<p class="text-xs text-muted leading-relaxed" data-testid="explanation-' + q.id + '">' + q.explanation + '</p></div>';
    }

    html += '</div></div></div>';
  });

  html += '</div></div>';
  return html;
}

function renderSimulationReview(answers) {
  var simQs = quizQuestions.filter(function(q) { return q.type === 'phishing_email' || q.type === 'phishing_url'; });
  if (simQs.length === 0) return '';

  var html = '<div class="card mb-6"><div class="card-header" style="padding-bottom:8px;">' +
    '<div class="card-title flex items-center gap-2">' + svgIcon('warning') + ' Vyhodnocení simulačních úkolů</div></div>' +
    '<div class="card-content space-y-5">';

  simQs.forEach(function(q) {
    var userAnswer = answers[q.id];
    var isCorrect = userAnswer === 3;

    if (q.type === 'phishing_email' && q.phishingEmail) {
      var email = q.phishingEmail;
      var userChoice = q.options.find(function(o) { return o.value === userAnswer; });
      html += '<div class="space-y-3" data-testid="sim-review-' + q.id + '">' +
        '<div class="flex items-center gap-2 flex-wrap">' + svgIcon('mail') +
        '<span class="text-sm font-medium">E-mail od: </span>' +
        '<span class="font-mono text-xs" style="background:var(--bg);padding:2px 8px;border-radius:4px;">' + escapeHtml(email.from) + '</span>' +
        '<span class="badge ml-auto ' + (isCorrect ? 'badge-success' : 'badge-destructive') + ' text-xs">' + (isCorrect ? 'Správně' : 'Špatně') + '</span></div>' +
        '<div class="card" style="background:var(--bg);"><div class="card-content p-3 text-sm">' +
        '<div class="text-muted mb-1"><span class="font-medium" style="color:var(--fg);">Předmět: </span>' + escapeHtml(email.subject) + '</div>' +
        '<div class="flex items-center gap-2 mt-2 text-xs"><span class="text-muted">Vaše odpověď:</span>' +
        '<span class="badge ' + (isCorrect ? 'badge-primary' : 'badge-destructive') + ' text-xs">' + (userChoice ? userChoice.label : 'Nezodpovězeno') + '</span></div>' +
        '<div class="flex items-center gap-2 mt-1 text-xs"><span class="text-muted">Správná odpověď:</span>' +
        '<span class="font-medium">' + (email.isPhishing ? 'Phishing' : 'Legitimní') + '</span></div></div></div>' +
        '<button onclick="toggleSimClues(\'' + q.id + '\')" class="text-xs text-primary" style="background:none;border:none;cursor:pointer;" data-testid="button-clues-' + q.id + '">' +
        '<span class="flex items-center gap-1">' + svgIcon('eye') + ' Zobrazit vysvětlení</span></button>' +
        '<ul id="sim-clues-' + q.id + '" class="space-y-1" style="display:none;padding-left:4px;">';
      email.clues.forEach(function(clue) {
        html += '<li class="flex items-start gap-2 text-xs text-muted"><span class="text-primary" style="margin-top:2px;">&#8226;</span>' + clue + '</li>';
      });
      html += '</ul></div>';
    }

    if (q.type === 'phishing_url' && q.phishingUrls) {
      var urls = q.phishingUrls;
      var userChoice2 = q.options.find(function(o) { return o.value === userAnswer; });
      html += '<div class="space-y-3" data-testid="sim-review-' + q.id + '">' +
        '<div class="flex items-center gap-2">' + svgIcon('link') +
        '<span class="text-sm font-medium">Rozpoznání podvodné URL</span>' +
        '<span class="badge ml-auto ' + (isCorrect ? 'badge-success' : 'badge-destructive') + ' text-xs">' + (isCorrect ? 'Správně' : 'Špatně') + '</span></div>' +
        '<div class="card" style="background:var(--bg);"><div class="card-content p-3 space-y-2">';
      urls.forEach(function(urlItem) {
        html += '<div class="flex items-center gap-2 text-xs">' +
          '<span class="badge ' + (urlItem.isPhishing ? 'badge-destructive' : 'badge-success') + ' text-xs" style="flex-shrink:0;">' + (urlItem.isPhishing ? 'Podvodná' : 'Bezpečná') + '</span>' +
          '<span class="font-mono break-all">' + escapeHtml(urlItem.url) + '</span></div>';
      });
      html += '<div class="flex items-center gap-2 mt-2 text-xs border-t" style="padding-top:8px;"><span class="text-muted">Vaše odpověď:</span>' +
        '<span class="badge ' + (isCorrect ? 'badge-primary' : 'badge-destructive') + ' text-xs font-mono">' + (userChoice2 ? userChoice2.label : 'Nezodpovězeno') + '</span></div>' +
        '</div></div>' +
        '<button onclick="toggleSimClues(\'' + q.id + '\')" class="text-xs text-primary" style="background:none;border:none;cursor:pointer;" data-testid="button-clues-' + q.id + '">' +
        '<span class="flex items-center gap-1">' + svgIcon('eye') + ' Zobrazit vysvětlení</span></button>' +
        '<ul id="sim-clues-' + q.id + '" class="space-y-2" style="display:none;padding-left:4px;">';
      urls.forEach(function(urlItem) {
        html += '<li class="text-xs text-muted"><span class="font-mono" style="display:block;margin-bottom:2px;">' + escapeHtml(urlItem.url) + '</span>' +
          '<span style="color:' + (urlItem.isPhishing ? 'var(--destructive)' : 'var(--success)') + ';">' + urlItem.explanation + '</span></li>';
      });
      html += '</ul></div>';
    }
  });

  html += '</div></div>';
  return html;
}

var allExpanded = false;

function toggleAllQuestions() {
  allExpanded = !allExpanded;
  var btn = document.getElementById('toggle-all-btn');
  btn.innerHTML = (allExpanded ? svgIcon('chevronUp') + ' Sbalit vše' : svgIcon('chevronDown') + ' Rozbalit vše');

  var choiceQs = quizQuestions.filter(function(q) { return q.type === 'choice'; });
  choiceQs.forEach(function(q) {
    var detail = document.getElementById('detail-' + q.id);
    if (detail) {
      if (allExpanded) detail.classList.add('open');
      else detail.classList.remove('open');
    }
  });
}

function toggleQuestion(qId) {
  var detail = document.getElementById('detail-' + qId);
  if (detail) detail.classList.toggle('open');
}

function toggleSimClues(qId) {
  var el = document.getElementById('sim-clues-' + qId);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

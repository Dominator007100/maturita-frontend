var currentStep = 0;
var totalSteps = quizQuestions.length;
var answers = {};

document.addEventListener('DOMContentLoaded', function() {
  renderStep();
});

function renderStep() {
  var progress = ((currentStep + 1) / totalSteps) * 100;
  document.getElementById('step-label').textContent = 'Krok ' + (currentStep + 1) + ' z ' + totalSteps;
  document.getElementById('step-percent').textContent = Math.round(progress) + '%';
  document.getElementById('progress-fill').style.width = progress + '%';

  document.getElementById('btn-prev').disabled = currentStep === 0;

  var content = document.getElementById('quiz-content');
  var badges = document.getElementById('category-badges');

  var q = quizQuestions[currentStep];
  renderCategoryBadges(q.category);
  badges.style.display = 'flex';

  if (q.type === 'phishing_email') {
    content.innerHTML = renderPhishingEmail(q);
  } else if (q.type === 'phishing_url') {
    content.innerHTML = renderPhishingUrl(q);
  } else {
    content.innerHTML = renderChoiceQuestion(q);
  }

  bindOptionEvents(q);
  updateNextButton();
}

function renderChoiceQuestion(q) {
  var html = '<div class="card"><div class="card-header">' +
    '<div class="flex items-center gap-2 mb-1">' +
    '<span class="badge badge-outline text-xs">' + q.category + '</span>' +
    '<span class="text-xs text-muted">Otázka ' + (currentStep + 1) + '/' + quizQuestions.length + '</span></div>' +
    '<div class="card-title text-lg" style="line-height:1.5;">' + q.question + '</div></div>' +
    '<div class="card-content"><div class="radio-group">';

  q.options.forEach(function(opt) {
    var selected = answers[q.id] === opt.value;
    html += '<label class="radio-option' + (selected ? ' selected' : '') + '">' +
      '<input type="radio" name="answer" value="' + opt.value + '"' + (selected ? ' checked' : '') + '>' +
      '<div class="flex-1"><div class="flex items-center gap-2"><span class="text-sm">' + opt.label + '</span>' +
      (selected ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' : '') +
      '</div></div></label>';
  });

  html += '</div></div></div>';
  return html;
}

function renderPhishingEmail(q) {
  var email = q.phishingEmail;
  var answered = answers[q.id] !== undefined;
  var isCorrect = answered && answers[q.id] === 3;

  var html = '<div class="card"><div class="card-header">' +
    '<div class="flex items-center gap-2 mb-1">' +
    '<span class="badge badge-warning text-xs">Simulační úkol</span>' +
    '<span class="text-xs text-muted">Otázka ' + (currentStep + 1) + '/' + quizQuestions.length + '</span></div>' +
    '<div class="card-title text-lg">' + q.question + '</div></div>' +
    '<div class="card-content space-y-4">' +
    '<div class="email-preview space-y-3">' +
    '<div class="flex items-center gap-2 text-sm"><span class="text-muted">Od:</span><span class="font-mono text-xs">' + escapeHtml(email.from) + '</span></div>' +
    '<div class="text-sm"><span class="text-muted">Předmět: </span><span class="font-medium">' + escapeHtml(email.subject) + '</span></div>' +
    '<div class="border-t" style="padding-top:12px;"><pre style="white-space:pre-wrap;">' + escapeHtml(email.body) + '</pre></div></div>' +
    '<div class="radio-group">';

  q.options.forEach(function(opt) {
    var selected = answers[q.id] === opt.value;
    html += '<label class="radio-option' + (selected ? ' selected' : '') + '">' +
      '<input type="radio" name="answer" value="' + opt.value + '"' + (selected ? ' checked' : '') + '>' +
      '<div class="flex-1"><span class="text-sm">' + opt.label + '</span></div></label>';
  });

  html += '</div>';

  if (answered) {
    html += '<div class="result-feedback ' + (isCorrect ? 'correct' : 'incorrect') + '">' +
      '<div class="flex items-center gap-2 mb-2 font-medium">' +
      (isCorrect ? 'Správně!' : 'Špatně') +
      '</div>' +
      '<p class="text-muted mb-2">' + (email.isPhishing ? 'Tento e‑mail je phishingový.' : 'Tento e‑mail je legitimní.') + '</p>' +
      '</div>';
  }

  html += '</div></div>';
  return html;
}

function renderPhishingUrl(q) {
  var urls = q.phishingUrls;
  var answered = answers[q.id] !== undefined;
  var isCorrect = answered && answers[q.id] === 3;

  var html = '<div class="card"><div class="card-header">' +
    '<div class="flex items-center gap-2 mb-1">' +
    '<span class="badge badge-warning text-xs">Praktický úkol</span>' +
    '<span class="text-xs text-muted">Otázka ' + (currentStep + 1) + '/' + quizQuestions.length + '</span></div>' +
    '<div class="card-title text-lg">' + q.question + '</div></div>' +
    '<div class="card-content space-y-4"><div class="radio-group">';

  q.options.forEach(function(opt, index) {
    var selected = answers[q.id] === opt.value;
    var urlItem = urls[index];
    html += '<label class="radio-option' + (selected ? ' selected' : '') + '">' +
      '<input type="radio" name="answer" value="' + opt.value + '"' + (selected ? ' checked' : '') + '>' +
      '<div class="flex-1"><span class="font-mono text-sm break-all">' + (urlItem ? escapeHtml(urlItem.url) : opt.label) + '</span>';
    if (answered && urlItem) {
      html += '<div class="mt-1"><span class="badge ' + (urlItem.isPhishing ? 'badge-destructive' : 'badge-success') + ' text-xs">' + (urlItem.isPhishing ? 'Podvodná' : 'Bezpečná') + '</span></div>';
    }
    html += '</div></label>';
  });

  html += '</div>';

  if (answered) {
    html += '<div class="result-feedback ' + (isCorrect ? 'correct' : 'incorrect') + '">' +
      '<div class="flex items-center gap-2 mb-2 font-medium">' +
      (isCorrect ? 'Správně!' : 'Špatně') +
      '</div>' +
      '</div>';
  }

  html += '</div></div>';
  return html;
}

function bindOptionEvents(q) {
  var radios = document.querySelectorAll('input[name="answer"]');
  radios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      answers[q.id] = parseInt(this.value);
      renderStep();
    });
  });
}

function renderCategoryBadges(activeCategory) {
  var categories = [];
  quizQuestions.forEach(function(q) {
    if (!categories.includes(q.category)) categories.push(q.category);
  });
  var container = document.getElementById('category-badges');
  container.innerHTML = '';
  categories.forEach(function(cat) {
    var span = document.createElement('span');
    span.className = 'badge ' + (cat === activeCategory ? 'badge-primary' : 'badge-secondary') + ' text-xs';
    span.textContent = cat;
    container.appendChild(span);
  });
}

function canProceed() {
  return answers[quizQuestions[currentStep].id] !== undefined;
}

function updateNextButton() {
  var btn = document.getElementById('btn-next');
  btn.disabled = !canProceed();
  btn.innerHTML = currentStep === totalSteps - 1 ? 'Odeslat' : 'Další';
}

function nextStep() {
  if (!canProceed()) return;
  if (currentStep < totalSteps - 1) {
    currentStep++;
    renderStep();
  } else {
    submitQuiz();
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
}

function submitQuiz() {
  var btn = document.getElementById('btn-next');
  btn.disabled = true;
  btn.innerHTML = 'Odesílám...';

  var choiceQs = quizQuestions.filter(q => q.type === 'choice');
  var simQs = quizQuestions.filter(q => q.type !== 'choice');
  var choiceScore = choiceQs.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
  var simScore = simQs.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
  var totalScore = choiceScore + simScore;
  var maxScore = (choiceQs.length * 3) + (simQs.length * 3);
  var percentScore = Math.round((totalScore / maxScore) * 100);
  var riskLevel = getRiskLevel(percentScore);

  var payload = {
    answers,
    totalScore,
    maxScore,
    percentScore,
    riskLevel,
    respondentName: "Uživatel",
    respondentEmail: "neznamy@user.cz"
  };

  const token = localStorage.getItem("token");

fetch('https://fantastic-spirit-production-880f.up.railway.app/api/quiz/submit', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    window.location.href = '/vysledky.html?id=' + data.id;
  })
  .catch(err => {
    console.error(err);
    btn.disabled = false;
    updateNextButton();
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}

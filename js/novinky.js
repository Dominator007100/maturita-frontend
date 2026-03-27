var allArticles = [];
var articlesById = {};
var categoryColors = {
  "Hrozby": "var(--destructive)",
  "Legislativa": "var(--chart-3)",
  "Technologie": "var(--primary)",
  "Incidenty": "var(--chart-4)",
  "Vzdělávání": "var(--success)"
};

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://fantastic-spirit-production-880f.up.railway.app/api/news')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      allArticles = data;
      data.forEach(function(a) { articlesById[a.id] = a; });
      populateCategories();
      renderArticles();
    });

  document.getElementById('search-input').addEventListener('input', renderArticles);
  document.getElementById('category-filter').addEventListener('change', renderArticles);
});

function populateCategories() {
  var cats = [];
  allArticles.forEach(function(a) {
    if (cats.indexOf(a.category) === -1) cats.push(a.category);
  });
  var select = document.getElementById('category-filter');
  cats.forEach(function(cat) {
    var opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function getFilteredArticles() {
  var search = document.getElementById('search-input').value.toLowerCase();
  var category = document.getElementById('category-filter').value;

  return allArticles.filter(function(a) {
    var matchSearch =
      !search ||
      a.title.toLowerCase().includes(search) ||
      a.summary.toLowerCase().includes(search);

    var matchCategory = category === 'all' || a.category === category;

    return matchSearch && matchCategory;
  });
}

function renderArticles() {
  var filtered = getFilteredArticles();
  var featured = filtered.find(function(a) { return a.featured; });
  var regular = filtered.filter(function(a) { return !a.featured || a !== featured; });

  var featuredEl = document.getElementById('featured-article');

  if (featured) {
    var featuredDiv = document.createElement('div');
    featuredDiv.className = 'card hover-card mb-6';
    featuredDiv.style.cursor = 'pointer';
    featuredDiv.setAttribute('data-testid', 'card-news-featured-' + featured.id);
    featuredDiv.addEventListener('click', function() { openModalById(featured.id); });

    featuredDiv.innerHTML =
      '<div class="card-content p-6"><div class="flex gap-6" style="flex-wrap:wrap;">' +
      (featured.imageUrl
        ? '<img src="' + featured.imageUrl + '" alt="" style="width:256px;height:160px;object-fit:cover;border-radius:6px;">'
        : '') +
      '<div class="flex-1">' +
      '<div class="flex flex-wrap items-center gap-2 mb-2">' +
      '<span class="badge badge-primary">Doporučené</span>' +
      '<span class="badge badge-outline">' + escapeHtml(featured.category) + '</span>' +
      '</div>' +
      '<h2 class="text-xl font-bold mb-2">' + escapeHtml(featured.title) + '</h2>' +
      '<p class="text-sm text-muted mb-3">' + escapeHtml(featured.summary) + '</p>' +
      '<div class="flex items-center gap-3 text-xs text-muted">' +
      '<span>' + escapeHtml(featured.source) + '</span>' +
      '</div></div></div></div>';

    featuredEl.innerHTML = '';
    featuredEl.appendChild(featuredDiv);
  } else {
    featuredEl.innerHTML = '';
  }

  var grid = document.getElementById('articles-grid');
  var noResults = document.getElementById('no-results');

  if (regular.length === 0 && !featured) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  grid.innerHTML = '';

  regular.forEach(function(article) {
    var catColor = categoryColors[article.category] || 'var(--muted)';
    var card = document.createElement('div');

    var inner = document.createElement('div');
    inner.className = 'card hover-card';
    inner.style.cssText = 'cursor:pointer;height:100%;display:flex;flex-direction:column;';
    inner.setAttribute('data-testid', 'card-news-' + article.id);
    inner.addEventListener('click', function() { openModalById(article.id); });

    inner.innerHTML =
      '<div class="card-content" style="padding-top:20px;flex:1;display:flex;flex-direction:column;">' +
      (article.imageUrl
        ? '<img src="' + article.imageUrl + '" alt="" style="width:100%;height:128px;object-fit:cover;border-radius:6px;margin-bottom:12px;">'
        : '') +
      '<span class="badge badge-outline text-xs mb-2" style="width:fit-content;color:' + catColor + ';">' +
      escapeHtml(article.category) +
      '</span>' +
      '<h3 class="font-semibold text-sm mb-2 line-clamp-2">' + escapeHtml(article.title) + '</h3>' +
      '<p class="text-xs text-muted line-clamp-3 flex-1">' + escapeHtml(article.summary) + '</p>' +
      '<div class="flex items-center justify-between mt-3 text-xs text-muted">' +
      '<span>' + escapeHtml(article.source) + '</span>' +
      '</div></div>';

    card.appendChild(inner);
    grid.appendChild(card);
  });
}

function openModalById(id) {
  var article = articlesById[id];
  if (!article) return;
  openModal(article);
}

function openModal(article) {
  var content = document.getElementById('modal-content');

  var html =
    '<div class="flex flex-wrap items-center gap-2 mb-2">' +
    '<span class="badge badge-outline">' + escapeHtml(article.category) + '</span>' +
    '</div>' +
    '<h2 class="text-xl font-bold mb-1" style="line-height:1.4;">' + escapeHtml(article.title) + '</h2>' +
    '<p class="text-sm text-muted mb-4">Zdroj: ' + escapeHtml(article.source) + '</p>';

  if (article.imageUrl) {
    html +=
      '<img src="' + article.imageUrl + '" alt="" style="width:100%;height:192px;object-fit:cover;border-radius:6px;margin-bottom:16px;">';
  }

  var paragraphs = article.content.split('\n');
  paragraphs.forEach(function(p) {
    if (p.trim()) {
      html += '<p class="text-sm text-muted mb-3" style="line-height:1.7;">' + escapeHtml(p) + '</p>';
    }
  });

  if (article.sourceUrl) {
    html +=
      '<div class="border-t" style="padding-top:12px;margin-top:16px;">' +
      '<a href="' + article.sourceUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" data-testid="button-read-original">' +
      svgIcon('externalLink') + ' Číst původní článek na ' + escapeHtml(article.source) +
      '</a></div>';
  }

  content.innerHTML = html;
  document.getElementById('article-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('article-modal').classList.remove('open');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('cs-CZ');
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
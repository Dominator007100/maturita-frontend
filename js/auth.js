function updateAuthButton() {
  var token = localStorage.getItem('token');
  var container = document.getElementById('auth-btn-container');
  if (!container) return;
  if (token) {
    container.innerHTML = '<button class="btn btn-outline" style="width:100%;margin-bottom:8px;" onclick="logout()">Odhlasit se</button>';
  } else {
    container.innerHTML = '<a href="/register.html" class="btn btn-primary" style="width:100%;margin-bottom:8px;display:block;text-align:center;">Prihlasit se</a>';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}
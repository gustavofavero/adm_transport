
function carregarPagina(pagina) {
  fetch(`pages/${pagina}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('conteudo').innerHTML = html;
      const script = document.createElement('script');
      script.src = `scripts/${pagina}.js`;
      script.defer = true;
      document.body.appendChild(script);
    });
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

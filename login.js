const usuarios = [
  { usuario: "admin", senha: "1234" },
  { usuario: "operador", senha: "senha" },
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  const valido = usuarios.find((u) => u.usuario === user && u.senha === pass);
  if (valido) {
    localStorage.setItem("usuarioLogado", user);
    window.location.href = "index.html";
  } else {
    document.getElementById("mensagemErro").textContent =
      "Usuário ou senha inválidos";
  }
});

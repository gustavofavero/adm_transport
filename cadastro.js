document.addEventListener("DOMContentLoaded", () => {
  const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
  const motoristas = JSON.parse(localStorage.getItem("motoristas") || "[]");
  const placas = JSON.parse(localStorage.getItem("placasDetalhadas") || "[]");

  const listaClientes = document.getElementById("listaClientes");
  const listaMotoristas = document.getElementById("listaMotoristas");
  const listaPlacas = document.getElementById("listaPlacas");

  function salvar(key, dados) {
    localStorage.setItem(key, JSON.stringify(dados));
  }

  function atualizarListas() {
    listaClientes.innerHTML = "";
    clientes.forEach((c, i) => {
      listaClientes.innerHTML += `<li>${c.toUpperCase()} <button onclick="excluir('clientes', ${i})">Excluir</button></li>`;
    });

    listaMotoristas.innerHTML = "";
    motoristas.forEach((m, i) => {
      listaMotoristas.innerHTML += `<li>${m.toUpperCase()} <button onclick="excluir('motoristas', ${i})">Excluir</button></li>`;
    });

    listaPlacas.innerHTML = "";
    placas.forEach((p, i) => {
      listaPlacas.innerHTML += `<li>${p.placa.toUpperCase()} | ${p.tipo} | ${
        p.status
      } <button onclick="excluir('placasDetalhadas', ${i})">Excluir</button></li>`;
    });
  }

  document.getElementById("formCliente").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document
      .getElementById("clienteNome")
      .value.trim()
      .toUpperCase();
    if (nome) {
      clientes.push(nome);
      salvar("clientes", clientes);
      atualizarListas();
      e.target.reset();
    }
  });

  document.getElementById("formMotorista").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document
      .getElementById("motoristaNome")
      .value.trim()
      .toUpperCase();
    if (nome) {
      motoristas.push(nome);
      salvar("motoristas", motoristas);
      atualizarListas();
      e.target.reset();
    }
  });

  document.getElementById("formPlaca").addEventListener("submit", (e) => {
    e.preventDefault();
    const placa = document
      .getElementById("placaVeiculo")
      .value.trim()
      .toUpperCase();
    const tipo = document.getElementById("tipoPlaca").value;
    const status = document.getElementById("statusPlaca").value;

    if (placa && tipo && status) {
      placas.push({ placa, tipo, status });
      salvar("placasDetalhadas", placas);
      atualizarListas();
      e.target.reset();
    }
  });

  window.excluir = (tipo, index) => {
    if (confirm("Deseja excluir este item?")) {
      let arr = JSON.parse(localStorage.getItem(tipo));
      arr.splice(index, 1);
      salvar(tipo, arr);
      location.reload();
    }
  };

  atualizarListas();
});

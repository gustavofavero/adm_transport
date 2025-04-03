document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("manutForm");
  const lista = document.getElementById("listaManutencao");

  let manutencoes = JSON.parse(localStorage.getItem("manutencoes")) || [];
  let editandoIndex = -1;

  function salvarManutencoes() {
    localStorage.setItem("manutencoes", JSON.stringify(manutencoes));
    listarManutencoes();
    form.reset();
    editandoIndex = -1;
  }

  function listarManutencoes() {
    lista.innerHTML = "";
    manutencoes.forEach((m, index) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${m.data}</strong> | ${m.tipo.toUpperCase()} ${m.placa} | ${
        m.tipoManutencao
      } | R$ ${parseFloat(m.valor).toFixed(2)} |
        KM Atual: ${m.kmAtual} | Próx: ${m.proximaRevisao || "-"} |
        Oficina: ${m.oficina || "-"} | Status: ${m.status || "-"}
        <br>
        <button onclick="editarManutencao(${index})">Editar</button>
        <button onclick="excluirManutencao(${index})">Excluir</button>
      `;
      lista.appendChild(item);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const m = {
      data: form.data.value,
      placa: form.placa.value.toUpperCase(),
      tipo: form.tipo.value.toUpperCase(),
      tipoManutencao: form.tipoManutencao.value.toUpperCase(),
      descricao: form.descricao.value,
      valor: parseFloat(form.valor.value),
      kmAtual: parseInt(form.kmAtual.value),
      proximaRevisao: form.proximaRevisao.value,
      oficina: form.oficina.value,
      status: form.status.value,
    };

    if (editandoIndex === -1) {
      manutencoes.push(m);
    } else {
      manutencoes[editandoIndex] = m;
    }

    salvarManutencoes();
  });

  window.editarManutencao = (index) => {
    const m = manutencoes[index];
    form.data.value = m.data;
    form.placa.value = m.placa;
    form.tipo.value = m.tipo;
    form.tipoManutencao.value = m.tipoManutencao;
    form.descricao.value = m.descricao;
    form.valor.value = m.valor;
    form.kmAtual.value = m.kmAtual;
    form.proximaRevisao.value = m.proximaRevisao;
    form.oficina.value = m.oficina;
    form.status.value = m.status;
    editandoIndex = index;
  };

  window.excluirManutencao = (index) => {
    if (confirm("Deseja realmente excluir esta manutenção?")) {
      manutencoes.splice(index, 1);
      salvarManutencoes();
    }
  };

  function preencherDropdownPlacas() {
    const select = document.getElementById("placa");
    const placas = JSON.parse(localStorage.getItem("placas") || "[]");
    placas.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      select.appendChild(opt);
    });
  }

  preencherDropdownPlacas();
  listarManutencoes();
});

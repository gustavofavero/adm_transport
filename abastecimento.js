document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("abastecimentoForm");
  const lista = document.getElementById("listaAbastecimento");

  let abastecimentos = JSON.parse(localStorage.getItem("abastecimentos")) || [];
  let editandoIndex = -1;

  function salvarAbastecimentos() {
    localStorage.setItem("abastecimentos", JSON.stringify(abastecimentos));
    listarAbastecimentos();
    form.reset();
    editandoIndex = -1;
  }

  function calcularMediaKmPorLitro() {
    let ultCheio = null;
    let resultados = [];

    for (let i = 0; i < abastecimentos.length; i++) {
      const atual = abastecimentos[i];
      if (atual.tanqueCheio.toUpperCase() === "SIM") {
        if (ultCheio) {
          const kmRodado = atual.km - ultCheio.km;
          const litrosConsumidos = abastecimentos
            .slice(ultCheio.index + 1, i + 1)
            .reduce((soma, a) => soma + parseFloat(a.litros), 0);

          const media =
            litrosConsumidos > 0
              ? (kmRodado / litrosConsumidos).toFixed(2)
              : "0.00";
          resultados.push({
            placa: atual.placa,
            media,
            de: ultCheio.km,
            ate: atual.km,
          });
        }
        ultCheio = { ...atual, index: i };
      }
    }

    return resultados;
  }

  function listarAbastecimentos() {
    lista.innerHTML = "";
    abastecimentos.forEach((a, index) => {
      const item = document.createElement("li");
      item.innerHTML = `
          ${a.data} | ${a.placa} | ${a.km} KM | ${a.litros} L - R$ ${parseFloat(
        a.valor
      ).toFixed(2)} |
          Tanque Cheio: ${a.tanqueCheio.toUpperCase()} | Fornecedor: ${
        a.fornecedor
      }
          <br>
          <button onclick="editarAbastecimento(${index})">Editar</button>
          <button onclick="excluirAbastecimento(${index})">Excluir</button>
        `;
      lista.appendChild(item);
    });

    const medias = calcularMediaKmPorLitro();
    medias.forEach((m) => {
      const item = document.createElement("li");
      item.style.color = "green";
      item.innerHTML = `<strong>${m.placa}</strong> → Média: ${m.media} KM/L (de ${m.de} a ${m.ate})`;
      lista.appendChild(item);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const a = {
      data: form.data.value,
      placa: form.placa.value.toUpperCase(),
      km: parseInt(form.km.value),
      tanqueCheio: form.tanqueCheio.value,
      fornecedor: form.fornecedor.value,
      litros: parseFloat(form.litros.value),
      valor: parseFloat(form.valor.value),
    };

    if (editandoIndex === -1) {
      abastecimentos.push(a);
    } else {
      abastecimentos[editandoIndex] = a;
    }

    salvarAbastecimentos();
  });

  window.editarAbastecimento = (index) => {
    const a = abastecimentos[index];
    form.data.value = a.data;
    form.placa.value = a.placa;
    form.km.value = a.km;
    form.tanqueCheio.value = a.tanqueCheio;
    form.fornecedor.value = a.fornecedor;
    form.litros.value = a.litros;
    form.valor.value = a.valor;
    editandoIndex = index;
  };

  window.excluirAbastecimento = (index) => {
    if (confirm("Deseja excluir este abastecimento?")) {
      abastecimentos.splice(index, 1);
      salvarAbastecimentos();
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
  listarAbastecimentos();
});

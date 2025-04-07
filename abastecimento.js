document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAbastecimento");
  const tabela = document.querySelector("#tabelaAbastecimentos tbody");
  const filtros = document.getElementById("filtros");
  const placaSelect = form.placa;
  const fornecedorSelect = form.fornecedor;
  const btnAddFornecedor = document.getElementById("btnAddFornecedor");
  const novoFornecedor = document.getElementById("novoFornecedor");

  const placas = JSON.parse(localStorage.getItem("placas") || "[]").filter(
    (p) => p.tipo === "CAVALO" && p.status === "ATIVO"
  );
  const fornecedores = JSON.parse(localStorage.getItem("fornecedores") || "[]");
  let abastecimentos = JSON.parse(
    localStorage.getItem("abastecimentos") || "[]"
  );

  // Preenche dropdowns
  placas.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.placa;
    opt.textContent = p.placa;
    placaSelect.appendChild(opt);
  });

  function carregarFornecedores() {
    fornecedorSelect.innerHTML = `<option value="">Selecione...</option>`;
    fornecedores.forEach((f) => {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = f;
      fornecedorSelect.appendChild(opt);
    });
    const opt = document.createElement("option");
    opt.value = "ADICIONAR";
    opt.textContent = "➕ Adicionar...";
    fornecedorSelect.appendChild(opt);
  }

  carregarFornecedores();

  fornecedorSelect.addEventListener("change", () => {
    if (fornecedorSelect.value === "ADICIONAR") {
      novoFornecedor.style.display = "inline";
      novoFornecedor.focus();
    } else {
      novoFornecedor.style.display = "none";
    }
  });

  btnAddFornecedor.addEventListener("click", () => {
    const novo = novoFornecedor.value.trim();
    if (novo && !fornecedores.includes(novo)) {
      fornecedores.push(novo);
      localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
      carregarFornecedores();
      fornecedorSelect.value = novo;
      novoFornecedor.value = "";
      novoFornecedor.style.display = "none";
    }
  });

  // Calcula KM/L
  function calcularMedia(placa, atualKm) {
    const anteriores = abastecimentos
      .filter((a) => a.placa === placa && a.tanque === "Sim")
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    if (anteriores.length > 0) {
      const anterior = anteriores[0];
      const distancia = atualKm - anterior.km;
      const litros = parseFloat(form.litros.value || 0);
      return litros > 0 ? (distancia / litros).toFixed(2) : "";
    }
    return "";
  }

  // Validação de KM
  function validarKm(placa, kmAtual) {
    const ultimos = abastecimentos
      .filter((a) => a.placa === placa)
      .sort((a, b) => new Date(b.data) - new Date(a.data));
    if (ultimos.length > 0) {
      const ultimoKM = parseInt(ultimos[0].km);
      return kmAtual >= ultimoKM;
    }
    return true;
  }

  // Formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    dados.km = parseInt(dados.km);
    dados.litros = parseFloat(dados.litros);
    dados.valor = parseFloat(dados.valor);
    dados.kml =
      dados.tanque === "Sim" ? calcularMedia(dados.placa, dados.km) : "";

    if (!validarKm(dados.placa, dados.km)) {
      alert(
        "KM Atual deve ser maior ou igual ao último abastecimento desta placa."
      );
      return;
    }

    abastecimentos.push(dados);
    localStorage.setItem("abastecimentos", JSON.stringify(abastecimentos));
    form.reset();
    atualizarTabela();
  });

  // Filtros estilo Excel
  function gerarFiltros() {
    filtros.innerHTML = "";
    const colunas = [
      "data",
      "placa",
      "km",
      "tanque",
      "fornecedor",
      "litros",
      "valor",
      "kml",
      "notaFiscal",
    ];
    colunas.forEach((col, idx) => {
      const th = document.createElement("th");
      const select = document.createElement("select");
      select.classList.add("filtro-select");
      select.dataset.coluna = idx;
      select.innerHTML = `<option value="">Todos</option>`;
      const valoresUnicos = [...new Set(abastecimentos.map((d) => d[col]))];
      valoresUnicos.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
      });
      select.addEventListener("change", aplicarFiltros);
      th.appendChild(select);
      filtros.appendChild(th);
    });
  }

  function aplicarFiltros() {
    const selects = filtros.querySelectorAll("select");
    const filtrosAtivos = Array.from(selects).map((s) => s.value);
    const linhas = tabela.querySelectorAll("tr");

    linhas.forEach((tr) => {
      let mostrar = true;
      tr.querySelectorAll("td").forEach((td, i) => {
        if (filtrosAtivos[i] && td.textContent !== filtrosAtivos[i]) {
          mostrar = false;
        }
      });
      tr.style.display = mostrar ? "" : "none";
    });
  }

  function atualizarTabela() {
    tabela.innerHTML = "";
    abastecimentos.forEach((d) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.data}</td>
        <td>${d.placa}</td>
        <td>${d.km}</td>
        <td>${d.tanque}</td>
        <td>${d.fornecedor}</td>
        <td>${d.litros}</td>
        <td>R$ ${d.valor.toFixed(2)}</td>
        <td>${d.kml || "-"}</td>
        <td>${d.notaFiscal}</td>
      `;
      tabela.appendChild(tr);
    });
    gerarFiltros();
  }

  atualizarTabela();
});

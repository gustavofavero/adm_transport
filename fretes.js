document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("freteForm");
  const tbody = document.getElementById("listaFretes");
  const tabela = document.getElementById("tabelaFretes");

  let fretes = JSON.parse(localStorage.getItem("fretes")) || [];
  let editandoIndex = -1;

  const ufOrigem = document.getElementById("ufOrigem");
  const cidadeOrigem = document.getElementById("cidadeOrigem");
  const ufDestino = document.getElementById("ufDestino");
  const cidadeDestino = document.getElementById("cidadeDestino");

  function preencherUFs() {
    Object.keys(ufsCidades).forEach((uf) => {
      [ufOrigem, ufDestino].forEach((select) => {
        const opt = document.createElement("option");
        opt.value = uf;
        opt.textContent = uf;
        select.appendChild(opt);
      });
    });
  }

  function atualizarCidades(uf, selectCidade) {
    selectCidade.innerHTML = "<option value=''>Cidade</option>";
    if (ufsCidades[uf]) {
      ufsCidades[uf].forEach((cidade) => {
        const opt = document.createElement("option");
        opt.value = cidade;
        opt.textContent = cidade;
        selectCidade.appendChild(opt);
      });
    }
  }

  ufOrigem.addEventListener("change", () =>
    atualizarCidades(ufOrigem.value, cidadeOrigem)
  );
  ufDestino.addEventListener("change", () =>
    atualizarCidades(ufDestino.value, cidadeDestino)
  );

  function salvarFretes() {
    localStorage.setItem("fretes", JSON.stringify(fretes));
    listarFretes();
    form.reset();
    editandoIndex = -1;
  }

  function listarFretes() {
    tbody.innerHTML = "";
    fretes.forEach((f, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${f.data}</td>
        <td>${f.cliente}</td>
        <td>${f.cte}</td>
        <td>${f.freteTotal}</td>
        <td>${f.ufOrigem}/${f.cidadeOrigem}</td>
        <td>${f.ufDestino}/${f.cidadeDestino}</td>
        <td>${f.motorista}</td>
        <td>${f.placaCavalo}</td>
        <td>
          <button onclick="editarFrete(${i})">Editar</button>
          <button onclick="excluirFrete(${i})">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    aplicarFiltrosExcel();
  }

  function aplicarFiltrosExcel() {
    const selects = tabela.querySelectorAll("thead select[data-col]");
    selects.forEach((select) => {
      const colIndex = parseInt(select.getAttribute("data-col"));
      const valoresUnicos = [
        ...new Set(
          fretes.map((f) => {
            const campos = [
              f.data,
              f.cliente,
              f.cte,
              f.freteTotal,
              `${f.ufOrigem}/${f.cidadeOrigem}`,
              `${f.ufDestino}/${f.cidadeDestino}`,
              f.motorista,
              f.placaCavalo,
            ];
            return campos[colIndex];
          })
        ),
      ];

      select.innerHTML = `<option value="">Todos</option>`;
      valoresUnicos.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
      });

      select.addEventListener("change", () => {
        const filtros = Array.from(selects).map((s) => s.value);
        const linhas = tbody.querySelectorAll("tr");
        linhas.forEach((tr) => {
          const colunas = Array.from(tr.children);
          const visivel = filtros.every(
            (filtro, i) => !filtro || colunas[i].textContent === filtro
          );
          tr.style.display = visivel ? "" : "none";
        });
      });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cteVal = form.cte.value.trim().toUpperCase();
    if (cteVal !== "NC" && !/^\d+$/.test(cteVal)) {
      alert("CTe deve ser número ou 'NC'");
      return;
    }

    const frete = {
      data: form.data.value,
      cliente: form.cliente.value,
      cte: cteVal,
      peso: parseFloat(form.peso.value),
      freteLiquido: form.freteLiquido.value,
      freteTotal: form.freteTotal.value,
      pedagio: form.pedagio.value || "0.00",
      icms: form.icms.value || "0.00",
      ufOrigem: form.ufOrigem.value,
      cidadeOrigem: form.cidadeOrigem.value,
      ufDestino: form.ufDestino.value,
      cidadeDestino: form.cidadeDestino.value,
      motorista: form.motorista.value,
      placaCavalo: form.placaCavalo.value,
    };

    if (editandoIndex === -1) {
      fretes.push(frete);
    } else {
      fretes[editandoIndex] = frete;
    }

    salvarFretes();
  });

  window.editarFrete = (i) => {
    const f = fretes[i];
    form.data.value = f.data;
    form.cliente.value = f.cliente;
    form.cte.value = f.cte;
    form.peso.value = f.peso;
    form.freteLiquido.value = f.freteLiquido;
    form.freteTotal.value = f.freteTotal;
    form.pedagio.value = f.pedagio;
    form.icms.value = f.icms;
    form.ufOrigem.value = f.ufOrigem;
    atualizarCidades(f.ufOrigem, cidadeOrigem);
    form.cidadeOrigem.value = f.cidadeOrigem;
    form.ufDestino.value = f.ufDestino;
    atualizarCidades(f.ufDestino, cidadeDestino);
    form.cidadeDestino.value = f.cidadeDestino;
    form.motorista.value = f.motorista;
    form.placaCavalo.value = f.placaCavalo;
    editandoIndex = i;
  };

  window.excluirFrete = (i) => {
    if (confirm("Excluir este frete?")) {
      fretes.splice(i, 1);
      salvarFretes();
    }
  };

  function preencherDropdown(id, storage) {
    const select = document.getElementById(id);
    const dados = JSON.parse(localStorage.getItem(storage) || "[]");
    if (storage === "placasDetalhadas") {
      dados
        .filter((p) => p.tipo === "CAVALO" && p.status === "ATIVO")
        .forEach((p) => {
          const opt = document.createElement("option");
          opt.value = p.placa;
          opt.textContent = p.placa;
          select.appendChild(opt);
        });
    } else {
      dados.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        select.appendChild(opt);
      });
    }
  }

  preencherUFs();
  preencherDropdown("cliente", "clientes");
  preencherDropdown("motorista", "motoristas");
  preencherDropdown("placaCavalo", "placasDetalhadas");
  listarFretes();
});

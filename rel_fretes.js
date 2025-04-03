document.addEventListener("DOMContentLoaded", () => {
  const filtroData = document.getElementById("filtroData");
  const tabela = document.querySelector("#tabelaClientes tbody");

  const fretes = JSON.parse(localStorage.getItem("fretes") || "[]");

  function agruparPorCliente(dataFiltrada) {
    const mapa = {};
    dataFiltrada.forEach((f) => {
      if (!mapa[f.cliente]) {
        mapa[f.cliente] = { qtd: 0, total: 0 };
      }
      mapa[f.cliente].qtd += 1;
      mapa[f.cliente].total += parseFloat(f.freteTotal);
    });
    return mapa;
  }

  function gerarTabelaClientes(agrupado) {
    tabela.innerHTML = "";
    Object.keys(agrupado).forEach((cliente) => {
      const tr = document.createElement("tr");
      const { qtd, total } = agrupado[cliente];
      tr.innerHTML = `
          <td>${cliente}</td>
          <td>${qtd}</td>
          <td>R$ ${total.toFixed(2)}</td>
        `;
      tabela.appendChild(tr);
    });
  }

  function gerarGraficoClientes(agrupado) {
    const ctx = document.getElementById("graficoClientes").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(agrupado),
        datasets: [
          {
            label: "Valor Total por Cliente",
            data: Object.values(agrupado).map((v) => v.total),
            backgroundColor: [
              "#3498db",
              "#e74c3c",
              "#2ecc71",
              "#f39c12",
              "#9b59b6",
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Fretes por Cliente",
          },
        },
      },
    });
  }

  function gerarGraficoCavalos(dataFiltrada) {
    const mapa = {};
    dataFiltrada.forEach((f) => {
      const placa = f.placaCavalo;
      if (!mapa[placa]) mapa[placa] = 0;
      mapa[placa] += parseFloat(f.freteTotal);
    });

    const ctx = document.getElementById("graficoCavalos").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(mapa),
        datasets: [
          {
            label: "Total Transportado por Cavalo",
            data: Object.values(mapa),
            backgroundColor: "#34495e",
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: {
          title: {
            display: true,
            text: "Ranking de Cavalos",
          },
        },
      },
    });
  }

  function filtrarPorData(mes) {
    if (!mes) return fretes;
    const [ano, mesNum] = mes.split("-");
    return fretes.filter((f) => f.data.startsWith(`${ano}-${mesNum}`));
  }

  function atualizar() {
    const filtrados = filtrarPorData(filtroData.value);
    const agrupado = agruparPorCliente(filtrados);
    gerarTabelaClientes(agrupado);
    gerarGraficoClientes(agrupado);
    gerarGraficoCavalos(filtrados);
  }

  filtroData.addEventListener("change", atualizar);
  atualizar();
});

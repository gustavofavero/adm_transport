document.addEventListener("DOMContentLoaded", () => {
  const fretes = JSON.parse(localStorage.getItem("fretes") || "[]");
  const manutencoes = JSON.parse(localStorage.getItem("manutencoes") || "[]");

  // Gráfico de fretes por cliente
  const fretesPorCliente = {};
  fretes.forEach((f) => {
    if (!fretesPorCliente[f.cliente]) fretesPorCliente[f.cliente] = 0;
    fretesPorCliente[f.cliente] +=
      parseFloat(f.freteLiquido) + parseFloat(f.pedagio) + parseFloat(f.icms);
  });

  const ctx1 = document.getElementById("graficoFretes").getContext("2d");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: Object.keys(fretesPorCliente),
      datasets: [
        {
          label: "Total R$ por Cliente",
          data: Object.values(fretesPorCliente),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Fretes por Cliente" },
      },
    },
  });

  // Gráfico de manutenções por tipo de veículo
  const manutencaoPorTipo = {};
  manutencoes.forEach((m) => {
    const tipo = m.tipo.toUpperCase();
    if (!manutencaoPorTipo[tipo]) manutencaoPorTipo[tipo] = 0;
    manutencaoPorTipo[tipo] += parseFloat(m.valor);
  });

  const ctx2 = document.getElementById("graficoManutencao").getContext("2d");
  new Chart(ctx2, {
    type: "pie",
    data: {
      labels: Object.keys(manutencaoPorTipo),
      datasets: [
        {
          label: "Manutenção R$ por Tipo",
          data: Object.values(manutencaoPorTipo),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Custos de Manutenção por Tipo" },
      },
    },
  });
});

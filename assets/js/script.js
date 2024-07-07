const btnCalcular = document.querySelector("#calcular");

const obtenerInfo = async (selectValue) => {
  const data = await fetch(`https://mindicador.cl/api/${selectValue}`);
  const response = await data.json();
  return response;
};

const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses empiezan desde 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const crearGrafico = async (series) => {
  const limitedSeries = series.slice(-10);

  const data = limitedSeries.map((serie) => serie.valor);
  let fechas = limitedSeries
    .map((serie) => formatearFecha(serie.fecha))
    .reverse();

  const ctx = document.getElementById("myChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: "Historial Últimos 10 días",
          data: data,
          borderWidth: 2,
          borderColor: "#ff6384",
        },
      ],
    },
  });
};

btnCalcular.addEventListener("click", async () => {
  let grafico = Chart.getChart("myChart");
  if (grafico !== undefined) {
    grafico.destroy();
  }
  const inputValue = document.querySelector("#monto").value;
  const selectValue = document.querySelector("#moneda").value;
  const respuesta = await obtenerInfo(selectValue);
  let cambio = respuesta.serie[0].valor * inputValue;
  crearGrafico(respuesta.serie);
  document.querySelector("#resultado").innerHTML = `Resultado: $ ${cambio}`;
});

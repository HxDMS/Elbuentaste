document.addEventListener("DOMContentLoaded", () => {
  const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
  const productores = JSON.parse(localStorage.getItem("productores")) || [];
  const select = document.getElementById("modoReporte");
  const resultado = document.getElementById("resultadoReporte");
  const fechaInicioInput = document.getElementById("fechaInicio");
  const fechaFinInput = document.getElementById("fechaFin");

  // Limitar fechas para que no sean futuras
  const hoyStr = new Date().toISOString().split("T")[0];
  fechaInicioInput.max = hoyStr;
  fechaFinInput.max = hoyStr;

  // Inicializar fechas: fecha fin = hoy, fecha inicio = hace 1 mes aprox
  fechaFinInput.value = hoyStr;
  const mesAnterior = new Date();
  mesAnterior.setMonth(mesAnterior.getMonth() - 1);
  fechaInicioInput.value = mesAnterior.toISOString().split("T")[0];

  // Formatear fecha a dd Mmm yyyy
  function formatearFecha(fecha) {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(fecha).toLocaleDateString("es-PE", options);
  }

  function getNombreProductor(id) {
    const p = productores.find(p => p.id === id);
    return p ? p.nombre : "Desconocido";
  }

  function filtrarPorFecha(rangoVentas) {
    const inicio = fechaInicioInput.value || "0000-01-01";
    const fin = fechaFinInput.value || hoyStr;
    if (inicio > fin) return [];
    return rangoVentas.filter(v => v.fecha >= inicio && v.fecha <= fin);
  }

  function agruparPorProductor(ventasFiltradas) {
    const resumen = {};
    ventasFiltradas.forEach(v => {
      const nombre = getNombreProductor(v.productorId);
      resumen[nombre] = (resumen[nombre] || 0) + v.cantidad * v.precio;
    });

    let html = "";
    for (const [nombre, total] of Object.entries(resumen)) {
      html += `<tr><td>${nombre}</td><td>S/ ${total.toFixed(2)}</td></tr>`;
    }
    return html || `<tr><td colspan="2" class="text-center">No hay ventas para este rango.</td></tr>`;
  }

  function agruparPorFecha(ventasFiltradas) {
    const resumen = {};
    ventasFiltradas.forEach(v => {
      resumen[v.fecha] = (resumen[v.fecha] || 0) + v.cantidad * v.precio;
    });

    let html = "";
    for (const [fecha, total] of Object.entries(resumen)) {
      html += `<tr><td>${formatearFecha(fecha)}</td><td>S/ ${total.toFixed(2)}</td></tr>`;
    }
    return html || `<tr><td colspan="2" class="text-center">No hay ventas para este rango.</td></tr>`;
  }

  function actualizarReporte() {
    const ventasFiltradas = filtrarPorFecha(ventas);

    let tablaHtml = `<table class="table table-striped table-hover">
      <thead><tr><th>${select.value === "productor" ? "Productor" : "Fecha"}</th><th>Total Ventas (S/)</th></tr></thead>
      <tbody>`;

    tablaHtml += select.value === "productor" ? agruparPorProductor(ventasFiltradas) : agruparPorFecha(ventasFiltradas);

    tablaHtml += "</tbody></table>";

    resultado.innerHTML = tablaHtml;
  }

  // Validar que fecha inicio no sea mayor a fecha fin al cambiar
  function validarFechas() {
    if (fechaInicioInput.value > fechaFinInput.value) {
      alert("La fecha de inicio no puede ser mayor a la fecha final.");
      return false;
    }
    return true;
  }

  select.addEventListener("change", () => {
    if (validarFechas()) actualizarReporte();
  });
  fechaInicioInput.addEventListener("change", () => {
    if (validarFechas()) actualizarReporte();
    else fechaInicioInput.value = fechaFinInput.value;
  });
  fechaFinInput.addEventListener("change", () => {
    if (validarFechas()) actualizarReporte();
    else fechaFinInput.value = fechaInicioInput.value;
  });

  actualizarReporte();
});
document.addEventListener("DOMContentLoaded", () => {
  const ventasKey = "ventas";
  const productoresKey = "productores";
  const selectProductor = document.getElementById("selectProductor");
  const fechaFiltro = document.getElementById("fechaFiltro");
  const ordenVentas = document.getElementById("ordenVentas");
  const buscador = document.getElementById("buscadorVentas");
  const tbody = document.querySelector("#tablaVentas tbody");

  function cargarProductores() {
    const productores = JSON.parse(localStorage.getItem(productoresKey)) || [];
    productores.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nombre;
      selectProductor.appendChild(option);
    });
  }

  function recargarTabla() {
    cargarTabla(
      selectProductor.value,
      fechaFiltro.value,
      buscador.value,
      ordenVentas.value
    );
  }

  function cargarTabla(productorId = "", fecha = "", filtro = "", orden = "nombre-asc") {
    tbody.innerHTML = "";

    if (!productorId) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center fw-bold">Seleccione un productor para mostrar las ventas.</td></tr>`;
      return;
    }

    let ventas = JSON.parse(localStorage.getItem(ventasKey)) || [];
    ventas = ventas.filter(v => v.productorId === productorId);

    if (fecha) {
      ventas = ventas.filter(v => v.fecha === fecha);
    }

    if (filtro.trim() !== "") {
      ventas = ventas.filter(v => v.producto.toLowerCase().includes(filtro.toLowerCase()));
    }

    if (ventas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay ventas registradas con esos filtros.</td></tr>`;
      return;
    }

    // Ordenar
    if (orden === "nombre-asc") {
      ventas.sort((a, b) => a.producto.localeCompare(b.producto));
    } else if (orden === "nombre-desc") {
      ventas.sort((a, b) => b.producto.localeCompare(a.producto));
    } else if (orden === "precio-desc") {
      ventas.sort((a, b) => (b.precio * b.cantidad) - (a.precio * a.cantidad));
    } else if (orden === "precio-asc") {
      ventas.sort((a, b) => (a.precio * a.cantidad) - (b.precio * b.cantidad));
    }

    ventas.forEach(v => {
      const total = (v.precio * v.cantidad).toFixed(2);
      tbody.innerHTML += `
        <tr>
          <td>${v.producto}</td>
          <td>${v.cantidad}</td>
          <td>${v.precio.toFixed(2)}</td>
          <td>${total}</td>
          <td>${v.fecha}</td>
          <td>
            <button class="btn btn-sm btn-primary btn-editar" data-id="${v.id}">Editar</button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-id="${v.id}">Eliminar</button>
          </td>
        </tr>
      `;
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        eliminarVenta(id);
      });
    });

    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        editarVenta(id);
      });
    });
  }

  function eliminarVenta(id) {
    if (!confirm("¿Seguro que deseas eliminar esta venta?")) return;
    let ventas = JSON.parse(localStorage.getItem(ventasKey)) || [];
    ventas = ventas.filter(v => v.id !== id);
    localStorage.setItem(ventasKey, JSON.stringify(ventas));
    recargarTabla();
  }

  function editarVenta(id) {
    window.location.href = `editar.html?id=${id}`;
  }

  function inicializarFechaActual() {
    const hoy = new Date().toISOString().split("T")[0];
    fechaFiltro.value = hoy;
    fechaFiltro.max = hoy;  // Prohibir seleccionar fecha futura
  }

  // Listeners
  selectProductor.addEventListener("change", recargarTabla);
  fechaFiltro.addEventListener("change", recargarTabla);
  buscador.addEventListener("input", recargarTabla);
  ordenVentas.addEventListener("change", recargarTabla);

  // Inicialización
  cargarProductores();
  inicializarFechaActual();
  cargarTabla();
});
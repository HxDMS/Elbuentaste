document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ventaForm");
  const selectProductor = document.getElementById("productorVenta");
  const selectProducto = document.getElementById("productoVenta");
  const precio = document.getElementById("precioVenta");
  const cantidad = document.getElementById("cantidadVenta");
  const fecha = document.getElementById("fechaVenta");

  const ventasKey = "ventas";
  const productoresKey = "productores";
  const productosKey = "productos";

  // Limita la fecha máxima al día actual y setea valor inicial con la fecha actual
  const hoy = new Date().toISOString().split("T")[0];
  fecha.setAttribute("max", hoy);
  fecha.value = hoy;

  function cargarProductores() {
    const productores = JSON.parse(localStorage.getItem(productoresKey)) || [];
    productores.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nombre;
      selectProductor.appendChild(option);
    });
  }

  function cargarProductosDelProductor(productorId) {
    const productos = JSON.parse(localStorage.getItem(productosKey)) || [];
    const filtrados = productos.filter(p => p.productorId === productorId);

    selectProducto.innerHTML = `<option value="">Seleccione un producto</option>`;
    selectProducto.disabled = filtrados.length === 0;

    filtrados.forEach(prod => {
      const option = document.createElement("option");
      option.value = prod.nombre;
      option.dataset.precio = prod.precio;
      option.textContent = prod.nombre;
      selectProducto.appendChild(option);
    });

    precio.value = "";
  }

  function esFechaValida(dateString) {
    const hoy = new Date().toISOString().split("T")[0];
    return dateString <= hoy;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity() || !esFechaValida(fecha.value)) {
      form.classList.add("was-validated");
      if (!esFechaValida(fecha.value)) {
        fecha.classList.add("is-invalid");
      }
      return;
    }

    const nuevaVenta = {
      id: Date.now().toString(),
      productorId: selectProductor.value,
      producto: selectProducto.value,
      cantidad: parseFloat(cantidad.value),
      precio: parseFloat(precio.value),
      fecha: fecha.value
    };

    const ventas = JSON.parse(localStorage.getItem(ventasKey)) || [];
    ventas.push(nuevaVenta);
    localStorage.setItem(ventasKey, JSON.stringify(ventas));

    alert("Venta registrada correctamente.");
    form.reset();
    form.classList.remove("was-validated");
    selectProducto.disabled = true;
    precio.value = "";
    // Reiniciar fecha a la fecha actual después de limpiar
    fecha.value = hoy;
  });

  selectProductor.addEventListener("change", () => {
    const productorId = selectProductor.value;
    if (productorId) {
      cargarProductosDelProductor(productorId);
    } else {
      selectProducto.innerHTML = `<option value="">Seleccione un producto</option>`;
      selectProducto.disabled = true;
      precio.value = "";
    }
  });

  selectProducto.addEventListener("change", () => {
    const precioSeleccionado = selectProducto.selectedOptions[0]?.dataset?.precio;
    precio.value = precioSeleccionado || "";
  });

  cargarProductores();
});
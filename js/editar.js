document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  // Cambié Number a string para que coincida con el id guardado en localStorage
  const ventaId = params.get("id"); // string
  
  const ventasKey = "ventas";
  const form = document.getElementById("editarForm");

  const inputs = {
    producto: document.getElementById("producto"),
    cantidad: document.getElementById("cantidad"),
    precio: document.getElementById("precio"),
    fecha: document.getElementById("fecha")
  };

  // Cargar ventas y buscar venta por id (string)
  const ventas = JSON.parse(localStorage.getItem(ventasKey)) || [];
  const venta = ventas.find(v => v.id === ventaId);

  if (!venta) {
    alert("Venta no encontrada.");
    window.location.href = "ventas.html";
    return;
  }

  // Cargar datos en formulario
  document.getElementById("ventaId").value = venta.id;
  inputs.producto.value = venta.producto;
  inputs.cantidad.value = venta.cantidad;
  inputs.precio.value = venta.precio;
  inputs.fecha.value = venta.fecha;

  // Limitar fecha máxima a hoy para evitar fechas futuras
  const hoy = new Date().toISOString().split("T")[0];
  inputs.fecha.max = hoy;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Validar que la fecha no sea futura
    if (inputs.fecha.value > hoy) {
      alert("La fecha no puede ser futura.");
      return;
    }

    // Actualizar venta
    venta.producto = inputs.producto.value.trim();
    venta.cantidad = parseInt(inputs.cantidad.value);
    venta.precio = parseFloat(inputs.precio.value);
    venta.fecha = inputs.fecha.value;

    // Guardar cambios en localStorage
    const index = ventas.findIndex(v => v.id === ventaId);
    if (index !== -1) {
      ventas[index] = venta;
      localStorage.setItem(ventasKey, JSON.stringify(ventas));
      alert("Venta actualizada correctamente.");
      window.location.href = "ventas.html";
    } else {
      alert("Error al actualizar la venta.");
    }
  });
});

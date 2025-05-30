document.addEventListener("DOMContentLoaded", () => {
  const productoresKey = "productores";
  const form = document.getElementById("productorForm");
  const inputs = {
    nombre: document.getElementById("nombreProductor"),
    dni: document.getElementById("dniProductor"),
    telefono: document.getElementById("telefonoProductor"),
    region: document.getElementById("regionProductor"),
    id: document.getElementById("productorId")
  };
  const btnCancelar = document.getElementById("cancelarEdicion");
  const tablaBody = document.querySelector("#tablaProductores tbody");
  const buscador = document.getElementById("buscadorProductor");

  // Validaciones en tiempo real
  inputs.nombre.addEventListener("input", () => {
    inputs.nombre.value = inputs.nombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "");
  });

  inputs.dni.addEventListener("input", () => {
    inputs.dni.value = inputs.dni.value.replace(/\D/g, "").slice(0, 8);
  });

  inputs.telefono.addEventListener("input", () => {
    inputs.telefono.value = inputs.telefono.value.replace(/\D/g, "").slice(0, 9);
  });

  function generarId(productores) {
    if (productores.length === 0) return "000001";
    const ultimoId = Math.max(...productores.map(p => parseInt(p.id)));
    return String(ultimoId + 1).padStart(6, "0");
  }

  function guardarProductor(e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    let productores = JSON.parse(localStorage.getItem(productoresKey)) || [];

    const id = inputs.id.value || generarId(productores);
    const nuevo = {
      id,
      nombre: inputs.nombre.value.trim(),
      dni: inputs.dni.value,
      telefono: inputs.telefono.value,
      region: inputs.region.value
    };

    const index = productores.findIndex(p => p.id === id);
    if (index !== -1) {
      productores[index] = nuevo;
    } else {
      productores.push(nuevo);
    }

    localStorage.setItem(productoresKey, JSON.stringify(productores));
    alert("Productor guardado correctamente.");
    form.reset();
    form.classList.remove("was-validated");
    btnCancelar.classList.add("d-none");
    inputs.id.value = "";
    cargarTabla();
  }

  function cargarTabla(filtro = "") {
    const productores = JSON.parse(localStorage.getItem(productoresKey)) || [];
    const filtrados = productores.filter(p =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtrados.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="6" class="text-center">No hay productores encontrados.</td></tr>`;
      return;
    }

    tablaBody.innerHTML = filtrados.map(prod =>
      `<tr>
        <td>${prod.id}</td>
        <td>${prod.nombre}</td>
        <td>${prod.dni}</td>
        <td>${prod.telefono}</td>
        <td>${prod.region}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editar('${prod.id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminar('${prod.id}')">Eliminar</button>
        </td>
      </tr>`
    ).join("");
  }

  window.editar = (id) => {
    const productores = JSON.parse(localStorage.getItem(productoresKey)) || [];
    const prod = productores.find(p => p.id === id);
    if (!prod) return;
    inputs.id.value = prod.id;
    inputs.nombre.value = prod.nombre;
    inputs.dni.value = prod.dni;
    inputs.telefono.value = prod.telefono;
    inputs.region.value = prod.region;
    btnCancelar.classList.remove("d-none");
  };

  window.eliminar = (id) => {
    if (!confirm("¿Eliminar este productor?")) return;
    let productores = JSON.parse(localStorage.getItem(productoresKey)) || [];
    productores = productores.filter(p => p.id !== id);
    localStorage.setItem(productoresKey, JSON.stringify(productores));

    // Eliminar productos y ventas relacionados
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos = productos.filter(prod => prod.productorId !== id);
    localStorage.setItem("productos", JSON.stringify(productos));

    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    ventas = ventas.filter(v => v.productorId !== id);
    localStorage.setItem("ventas", JSON.stringify(ventas));

    cargarTabla();
  };

  btnCancelar.addEventListener("click", () => {
    form.reset();
    inputs.id.value = "";
    form.classList.remove("was-validated");
    btnCancelar.classList.add("d-none");
  });

  buscador.addEventListener("input", () => cargarTabla(buscador.value));
  form.addEventListener("submit", guardarProductor);

  cargarTabla();
});

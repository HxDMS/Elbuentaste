document.addEventListener("DOMContentLoaded", () => {
    const productosKey = "productos";
    const productoresKey = "productores";
  
    const selectorProductor = document.getElementById("selectorProductor");
    const form = document.getElementById("formProducto");
    const nombreInput = document.getElementById("nombreProducto");
    const precioInput = document.getElementById("precioProducto");
    const productoId = document.getElementById("productoId");
    const tablaBody = document.querySelector("#tablaProductos tbody");
    const buscador = document.getElementById("buscador");
    const contador = document.getElementById("contadorProductos");
    const ordenarPor = document.getElementById("ordenarPor");
  
    let productos = JSON.parse(localStorage.getItem(productosKey)) || [];
  
    function cargarProductores() {
      const productores = JSON.parse(localStorage.getItem(productoresKey)) || [];
      selectorProductor.innerHTML = `<option value="">Seleccione un productor</option>`;
      productores.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nombre;
        selectorProductor.appendChild(option);
      });
    }
  
    function guardarProducto(e) {
      e.preventDefault();
      if (!form.checkValidity() || !selectorProductor.value) {
        form.classList.add("was-validated");
        return;
      }
  
      const id = productoId.value || crypto.randomUUID();
      const nuevo = {
        id,
        productorId: selectorProductor.value,
        nombre: nombreInput.value.trim(),
        precio: parseFloat(precioInput.value).toFixed(2)
      };
  
      const index = productos.findIndex(p => p.id === id);
      if (index !== -1) {
        productos[index] = nuevo;
      } else {
        productos.push(nuevo);
      }
  
      localStorage.setItem(productosKey, JSON.stringify(productos));
      form.reset();
      form.classList.remove("was-validated");
      productoId.value = "";
      mostrarProductos();
    }
  
    function mostrarProductos() {
      const productorId = selectorProductor.value;
      if (!productorId) {
        tablaBody.innerHTML = `<tr><td colspan="3" class="text-center">Seleccione un productor.</td></tr>`;
        contador.textContent = 0;
        return;
      }
  
      let filtrados = productos.filter(p => p.productorId === productorId);
  
      // Filtro por búsqueda
      const filtro = buscador.value.toLowerCase();
      if (filtro) {
        filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(filtro));
      }
  
      // Ordenamiento
      const orden = ordenarPor.value;
      filtrados.sort((a, b) => {
        if (orden === "az") return a.nombre.localeCompare(b.nombre);
        if (orden === "za") return b.nombre.localeCompare(a.nombre);
        if (orden === "mayor") return b.precio - a.precio;
        if (orden === "menor") return a.precio - b.precio;
      });
  
      if (filtrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="3" class="text-center">No hay productos registrados.</td></tr>`;
        contador.textContent = 0;
        return;
      }
  
      tablaBody.innerHTML = filtrados.map(p => `
        <tr>
          <td>${p.nombre}</td>
          <td>S/ ${parseFloat(p.precio).toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editarProducto('${p.id}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${p.id}')">Eliminar</button>
          </td>
        </tr>
      `).join("");
  
      contador.textContent = filtrados.length;
    }
  
    window.editarProducto = (id) => {
      const p = productos.find(prod => prod.id === id);
      if (!p) return;
      productoId.value = p.id;
      nombreInput.value = p.nombre;
      precioInput.value = p.precio;
    };
  
    window.eliminarProducto = (id) => {
      if (!confirm("¿Deseas eliminar este producto?")) return;
      productos = productos.filter(p => p.id !== id);
      localStorage.setItem(productosKey, JSON.stringify(productos));
      mostrarProductos();
    };
  
    selectorProductor.addEventListener("change", mostrarProductos);
    form.addEventListener("submit", guardarProducto);
    buscador.addEventListener("input", mostrarProductos);
    ordenarPor.addEventListener("change", mostrarProductos);
  
    cargarProductores();
  });  
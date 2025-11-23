document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("buscarPaciente");
  const clearSearchBtn = document.getElementById("clearSearch");
  const tabla = document.getElementById("tablaPacientes");
  const tbody = tabla.querySelector("tbody");
  const turnoBox = document.getElementById("turnoBox");
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");
  const btnAsignar = document.getElementById("btnAsignarTurno");
  const modal = document.getElementById("modalConfirmacion");
  const modalCerrar = document.getElementById("cerrarModal");

  // Filtrar pacientes
  searchInput.addEventListener("input", () => {
    const filtro = searchInput.value.toLowerCase();
    let visibleCount = 0;
    
    Array.from(tbody.querySelectorAll("tr")).forEach(row => {
      const nombre = row.cells[1].textContent.toLowerCase(); // Segunda columna es el nombre
      const visible = nombre.includes(filtro);
      row.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });
    
    tabla.style.display = visibleCount > 0 ? "table" : "none";
    turnoBox.style.display = "none";
    // Limpiar selecciones cuando se filtra
    document.querySelectorAll("input[name=pacienteCheck]").forEach(cb => cb.checked = false);
    actualizarEstadoBoton();
  });

  // Botón limpiar búsqueda
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    tabla.style.display = "none";
    turnoBox.style.display = "none";
    document.querySelectorAll("input[name=pacienteCheck]").forEach(cb => cb.checked = false);
    actualizarEstadoBoton();
  });

  // Mostrar panel de turno al seleccionar paciente
  tbody.addEventListener("change", (e) => {
    if (e.target.name === "pacienteCheck") {
      const algunSeleccionado = document.querySelectorAll("input[name=pacienteCheck]:checked").length > 0;
      turnoBox.style.display = algunSeleccionado ? "block" : "none";
      actualizarEstadoBoton();
    }
  });

  // Validación para habilitar/deshabilitar el botón
  function actualizarEstadoBoton() {
    const haySeleccion = document.querySelectorAll("input[name=pacienteCheck]:checked").length > 0;
    const fechaValida = fechaInput.value !== "";
    const horaValida = horaSelect.value !== "";
    btnAsignar.disabled = !(haySeleccion && fechaValida && horaValida);
  }

  fechaInput.addEventListener("input", actualizarEstadoBoton);
  horaSelect.addEventListener("change", actualizarEstadoBoton);

  // Botón asignar turno
  btnAsignar.addEventListener("click", async () => {
    const seleccionados = Array.from(document.querySelectorAll("input[name=pacienteCheck]:checked"))
                                   .map(cb => cb.value);
    const fecha = fechaInput.value;
    const hora = horaSelect.value;
    
    if (seleccionados.length === 0 || !fecha || !hora) return;
    
    const fechaHora = `${fecha} ${hora}`;
    
    try {
      for (const id of seleccionados) {
        await fetch("/asignar-turno", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pacienteId: id, fecha: fechaHora })
        });
      }
      modal.style.display = "flex";
    } catch (error) {
      alert("Error al asignar turno: " + error.message);
    }
  });

  // Cerrar modal
  modalCerrar.addEventListener("click", () => {
    modal.style.display = "none";
    location.reload(); // Recargar para mostrar turnos actualizados
  });

  actualizarEstadoBoton();
});

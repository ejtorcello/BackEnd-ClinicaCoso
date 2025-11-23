document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalEliminarTurno");
  const fechaTurno = document.getElementById("fechaTurno");
  const horaTurno = document.getElementById("horaTurno");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");
  
  let pacienteIdAEliminar = null;
  let turnoIndexAEliminar = null;

  // Agregar event listeners a todos los botones de eliminar
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      pacienteIdAEliminar = e.target.dataset.pacienteId;
      turnoIndexAEliminar = e.target.dataset.turnoIndex;
      const fechaHoraTurno = e.target.dataset.turnoFecha;
      
      // Separar fecha y hora
      const [fecha, hora] = fechaHoraTurno.split(' ');
      fechaTurno.textContent = `Fecha: ${fecha}`;
      horaTurno.textContent = `Hora: ${hora}`;
      
      modal.style.display = "flex";
    }
  });

  // Cancelar eliminación
  btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
    pacienteIdAEliminar = null;
    turnoIndexAEliminar = null;
  });

  // Confirmar eliminación
  btnConfirmarEliminar.addEventListener("click", async () => {
    if (pacienteIdAEliminar && turnoIndexAEliminar !== null) {
      try {
        const response = await fetch(`/pacientes/${pacienteIdAEliminar}/turno/${turnoIndexAEliminar}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          // Recargar la página para mostrar los cambios
          location.reload();
        } else {
          const error = await response.json();
          alert("Error al eliminar el turno: " + error.error);
        }
      } catch (error) {
        alert("Error de conexión: " + error.message);
      }
    }
    
    modal.style.display = "none";
    pacienteIdAEliminar = null;
    turnoIndexAEliminar = null;
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      pacienteIdAEliminar = null;
      turnoIndexAEliminar = null;
    }
  });
});
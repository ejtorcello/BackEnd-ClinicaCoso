import Paciente from "../models/Paciente.js";
import Turno from "../models/Turno.js";

export const obtenerPacientes = async (req, res) => {
  try {
    // get todos los pacientes y sus turnos
    const pacientes = await Paciente.find().lean();
    // para cada paciente, buscar sus turnos
    const pacientesConTurnos = await Promise.all(pacientes.map(async p => {
      const turnos = await Turno.find({ paciente: p._id }).lean();
      // transformar turnos a objetos para compatibilidad con vistas y acciones
      p.turnos = turnos.map(t => ({
        id: t._id.toString(),
        fechaHora: t.fechaHora,
        estado: t.estado
      }));
      p.id = p._id.toString();

      // Calcular edad
      if (p.F_Nac) {
        const hoy = new Date();
        const nacimiento = new Date(p.F_Nac);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--;
        }
        p.edad = edad;
      } else {
        p.edad = 'N/A';
      }

      return p;
    }));
    // Si la ruta es para renderizar vista
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.render("pacientes", { pacientes: pacientesConTurnos, titulo: "Lista de Pacientes" });
    }
    return res.json(pacientesConTurnos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo pacientes" });
  }
};

export const obtenerPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await Paciente.findById(id).lean();
    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });
    const turnos = await Turno.find({ paciente: paciente._id }).lean();
    paciente.turnos = turnos.map(t => ({
      id: t._id.toString(),
      fechaHora: t.fechaHora,
      estado: t.estado
    }));
    paciente.id = paciente._id.toString();
    return res.json(paciente);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo paciente" });
  }
};

export const crearPaciente = async (req, res) => {
  try {
    const { nombre, F_Nac, diagnostico } = req.body;
    const nuevo = new Paciente({ nombre, F_Nac, diagnostico });
    await nuevo.save();

    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/pacientes");
    }

    return res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando paciente" });
  }
};

export const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Paciente.findByIdAndUpdate(id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: "Paciente no encontrado" });
    return res.json(actualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando paciente" });
  }
};

export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si hay turnos pendientes o confirmados
    const turnosPendientes = await Turno.findOne({
      paciente: id,
      estado: { $in: ["pendiente", "confirmado"] }
    });

    if (turnosPendientes) {
      return res.status(400).json({
        error: "No se puede eliminar el paciente porque tiene turnos pendientes o confirmados."
      });
    }

    // delet turnos asociados primero (solo los que no impiden borrar, si hubiera logica mas compleja, pero aqui ya filtramos)
    await Turno.deleteMany({ paciente: id });
    const eliminado = await Paciente.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ error: "Paciente no encontrado" });

    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/pacientes");
    }

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error eliminando paciente" });
  }
};

// vitsa para asignar turno (render)
export const vistaAsignarTurno = async (req, res) => {
  try {
    const pacientes = await Paciente.find().lean();
    // pasar datos para renderizar select/table
    const lista = pacientes.map(p => ({ ...p, id: p._id.toString() }));
    return res.render("asignarTurno", { pacientes: lista });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al cargar la vista de asignar turno");
  }
};

// POST desde form o fetch para asignar turno
export const asignarTurno = async (req, res) => {
  try {
    const { pacienteId, fecha } = req.body;
    // pacienteId puede venir como string o number
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });

    const nuevoTurno = new Turno({
      paciente: paciente._id,
      fechaHora: fecha
    });
    await nuevoTurno.save();

    // si es req desde formulario HTML redirigir
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/pacientes");
    }
    return res.json({ message: "Turno asignado", turno: nuevoTurno });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error asignando turno" });
  }
};

export const eliminarTurno = async (req, res) => {
  try {
    const { id, turnoId } = req.params;
    // Verificar que el turno pertenezca al paciente (opcional pero recomendado)
    const turno = await Turno.findOne({ _id: turnoId, paciente: id });
    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado o no pertenece al paciente" });
    }

    await Turno.findByIdAndDelete(turnoId);
    return res.json({ message: "Turno eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error eliminando turno" });
  }
};

import Paciente from "../models/Paciente.js";
import Turno from "../models/Turno.js";

export const obtenerPacientes = async (req, res) => {
  try {
    // get todos los pacientes y sus turnos
    const pacientes = await Paciente.find().lean();
    // para cada paciente, buscar sus turnos
    const pacientesConTurnos = await Promise.all(pacientes.map(async p => {
      const turnos = await Turno.find({ paciente: p._id }).lean();
      // transformar turnos a strings para compatibilidad con vistas
      p.turnos = turnos.map(t => t.fechaHora);
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
    paciente.turnos = turnos.map(t => t.fechaHora);
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
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando paciente" });
  }
};

export const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, F_Nac, diagnostico } = req.body;
    const actualizado = await Paciente.findByIdAndUpdate(id, { nombre, F_Nac, diagnostico }, { new: true }).lean();
    if (!actualizado) return res.status(404).json({ error: "Paciente no encontrado" });
    actualizado.id = actualizado._id.toString();
    return res.json(actualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando paciente" });
  }
};

export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    // delet turnos asociados primero 
    await Turno.deleteMany({ paciente: id });
    const eliminado = await Paciente.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ error: "Paciente no encontrado" });
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

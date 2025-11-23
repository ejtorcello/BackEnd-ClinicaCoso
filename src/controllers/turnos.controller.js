import Turno from "../models/Turno.js";
import Paciente from "../models/Paciente.js";

export const listarTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find().populate("paciente", "nombre F_Nac diagnostico").lean();
    // si piden html, podemos renderizar 
    if (req.headers.accept && req.headers.accept.includes("text/html")) {

      return res.render("turnos", { turnos });
    }
    return res.json(turnos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error listando turnos" });
  }
};

export const crearTurno = async (req, res) => {
  try {
    const { pacienteId, fechaHora } = req.body;
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });

    const turno = await Turno.create({ paciente: paciente._id, fechaHora });
    return res.status(201).json(turno);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando turno" });
  }
};

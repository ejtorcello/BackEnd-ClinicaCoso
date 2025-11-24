import Turno from "../models/Turno.js";
import Paciente from "../models/Paciente.js";

export const listarTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find().populate("paciente", "nombre F_Nac diagnostico").lean();
    // si piden html, podemos renderizar 
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.render("turnos", { turnos, titulo: "Lista de Turnos" });
    }
    return res.json(turnos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error listando turnos" });
  }
};

import Medico from "../models/Medico.js";

export const vistaCrearTurno = async (req, res) => {
  try {
    const pacientes = await Paciente.find().lean();
    const medicos = await Medico.find().lean();
    res.render("crearTurno", { pacientes, medicos, titulo: "Nuevo Turno" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la vista");
  }
};

export const crearTurno = async (req, res) => {
  try {
    const { pacienteId, medicoId, fechaHora, motivo } = req.body;
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });

    const medico = await Medico.findById(medicoId);
    if (!medico) return res.status(404).json({ error: "Médico no encontrado" });

    const turno = await Turno.create({
      paciente: paciente._id,
      medico: medico._id,
      fechaHora,
      motivo
    });

    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/turnos");
    }
    return res.status(201).json(turno);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando turno" });
  }
};

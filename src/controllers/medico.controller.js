import Medico from "../models/Medico.js";

// listar
export const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await Medico.find().lean();
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.render("medicos", { medicos, titulo: "Lista de Médicos" });
    }
    res.json(medicos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// get por id
export const obtenerMedico = async (req, res) => {
  try {
    const medico = await Medico.findById(req.params.id);
    if (!medico) return res.status(404).json({ mensaje: "Médico no encontrado" });
    res.json(medico);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// crear
export const crearMedico = async (req, res) => {
  try {
    const nuevoMedico = new Medico(req.body);
    await nuevoMedico.save();
    res.status(201).json({ mensaje: "Médico creado", medico: nuevoMedico });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar 
export const actualizarMedico = async (req, res) => {
  try {
    const medico = await Medico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medico) return res.status(404).json({ mensaje: "Médico no encontrado" });
    res.json({ mensaje: "Médico actualizado", medico });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// delete
export const eliminarMedico = async (req, res) => {
  try {
    const medico = await Medico.findByIdAndDelete(req.params.id);
    if (!medico) return res.status(404).json({ mensaje: "Médico no encontrado" });
    res.json({ mensaje: "Médico eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

import Turno from "../models/Turno.js";
import Paciente from "../models/Paciente.js";
import Usuario from "../models/Usuario.js";

export const misPacientes = async (req, res) => {
  try {
    // Buscar usuario logueado para obtener email
    const usuario = await Usuario.findById(req.session.userId);
    if (!usuario) return res.status(404).send("Usuario no encontrado");

    // Buscar medico por email
    const medico = await Medico.findOne({ email: usuario.email });
    if (!medico) return res.status(404).send("Perfil de médico no encontrado para este usuario");

    // Buscar turnos
    const turnos = await Turno.find({ medico: medico._id }).populate("paciente").lean();

    res.render("mis-pacientes", { turnos, titulo: "Mis Pacientes" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar pacientes");
  }
};

export const cancelarTurnoMedico = async (req, res) => {
  try {
    await Turno.findByIdAndDelete(req.params.id);
    res.redirect("/medicos/mis-pacientes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cancelar turno");
  }
};

export const completarTurnoMedico = async (req, res) => {
  try {
    const { diagnostico } = req.body;
    const turno = await Turno.findById(req.params.id);
    if (!turno) return res.status(404).send("Turno no encontrado");

    // Actualizar diagnostico del paciente
    await Paciente.findByIdAndUpdate(turno.paciente, { diagnostico });

    // Eliminar turno (o marcar como realizado si prefieres no borrar)
    await Turno.findByIdAndDelete(req.params.id);

    res.redirect("/medicos/mis-pacientes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al completar turno");
  }
};

import Medico from "../models/Medico.js";

// listar
export const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await Medico.find();
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

import mongoose from "mongoose";

const PacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  F_Nac: { type: Date, required: true },
  telefono: { type: String, trim: true },
  domicilio: { type: String, trim: true },
  diagnostico: { type: String, required: true, trim: true }
}, {
  timestamps: true
});

export default mongoose.model("Paciente", PacienteSchema);

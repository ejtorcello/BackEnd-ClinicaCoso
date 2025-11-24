import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Paciente from "../models/Paciente.js";
import Turno from "../models/Turno.js";
import Medico from "../models/Medico.js";
import Usuario from "../models/Usuario.js";

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB para seeding...");

    const file = await fs.readFile(path.join(process.cwd(), "src/data", "pacientes.json"), "utf-8");
    const pacientesData = JSON.parse(file);

    // Vaciar colecciones
    await Turno.deleteMany({});
    await Paciente.deleteMany({});
    await Medico.deleteMany({});
    await Usuario.deleteMany({});

    // Crear 5 Médicos
    const medicos = [
      { nombre: "Dr. House", especialidad: "Diagnóstico", matricula: "M001", email: "medico@hospital.com" },
      { nombre: "Dra. Lopez", especialidad: "Cirugía General", matricula: "M002", email: "solcitonegro@hospital.com" },
      { nombre: "Dr. Salvia", especialidad: "Neurocirugía", matricula: "M003", email: "s@hospital.com" },
      { nombre: "Dra. Yang", especialidad: "Cardiología", matricula: "M004", email: "@hospital.com" },
      { nombre: "Dr. Panyagua", especialidad: "Pediatría", matricula: "M005", email: "@hospital.com" }
    ];
    await Medico.insertMany(medicos);
    console.log("5 Médicos creados.");

    // Crear Usuarios
    const usuarios = [
      { nombre: "Admin", email: "admin@hospital.com", password: "123", rol: "admin" },
      { nombre: "Recepcionista", email: "recepcion@hospital.com", password: "123", rol: "recepcionista" },
      { nombre: "Medico User", email: "medico@hospital.com", password: "123", rol: "medico" }
    ];
    // Usar create para que corra el hook de encriptación
    for (const u of usuarios) {
      await Usuario.create(u);
    }
    console.log("Usuarios creados.");


    const medicosDb = await Medico.find();

    for (const p of pacientesData) {
      const nuevo = await Paciente.create({
        nombre: p.nombre,
        F_Nac: new Date(p.F_Nac),
        diagnostico: p.diagnostico
      });

      if (p.turnos && p.turnos.length) {
        for (const t of p.turnos) {
          const randomMedico = medicosDb[Math.floor(Math.random() * medicosDb.length)];
          await Turno.create({
            paciente: nuevo._id,
            medico: randomMedico._id,
            fechaHora: t
          });
        }
      }
    }

    console.log("Seed completado: 9 pacientes y sus turnos creados.");

    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }
};

run();

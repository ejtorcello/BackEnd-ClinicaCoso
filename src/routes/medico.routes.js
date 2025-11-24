import { Router } from "express";
import {
  obtenerMedicos,
  obtenerMedico,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
  misPacientes,
  cancelarTurnoMedico,
  completarTurnoMedico
} from "../controllers/medico.controller.js";
import { authMiddleware, rolMiddleware } from "../middlewares/auth.js";

const router = Router();

// Rutas especificas primero
router.get("/mis-pacientes", authMiddleware(), rolMiddleware(["medico"]), misPacientes);
router.post("/turno/:id/cancelar", authMiddleware(), rolMiddleware(["medico"]), cancelarTurnoMedico);
router.post("/turno/:id/completar", authMiddleware(), rolMiddleware(["medico"]), completarTurnoMedico);

// Rutas generales
router.get("/", authMiddleware(), obtenerMedicos);
router.get("/:id", authMiddleware(), obtenerMedico);


router.post("/", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), crearMedico);
router.put("/:id", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), actualizarMedico);
router.delete("/:id", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), eliminarMedico);

export default router;

import { Router } from "express";
import {
  obtenerPacientes,
  obtenerPaciente,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
  vistaAsignarTurno,
  asignarTurno,
  eliminarTurno
} from "../controllers/pacientes.controller.js";
import { authMiddleware, rolMiddleware } from "../middlewares/auth.js";

const router = Router();

// crud pacientes con roles
router.get("/", authMiddleware(), rolMiddleware(["admin", "recepcionista", "medico"]), obtenerPacientes);
router.get("/:id", authMiddleware(), rolMiddleware(["admin", "recepcionista", "medico"]), obtenerPaciente);
router.post("/", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), crearPaciente);
router.put("/:id", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), actualizarPaciente);
router.delete("/:id", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), eliminarPaciente);

// Subruta de asignar turno
router.get("/asignar-turno", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), vistaAsignarTurno);
router.post("/asignar-turno", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), asignarTurno);
router.delete("/:id/turno/:turnoId", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), eliminarTurno);

export default router;

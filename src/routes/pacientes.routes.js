import { Router } from "express";
import {
  obtenerPacientes,
  obtenerPaciente,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
  vistaAsignarTurno,
  asignarTurno
} from "../controllers/pacientes.controller.js";
import { authMiddleware, rolMiddleware } from "../middlewares/auth.js";

const router = Router();

// crud pacientes con roles
router.get("/", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), obtenerPacientes);
router.get("/:id", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), obtenerPaciente);
router.post("/", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), crearPaciente);
router.put("/:id", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), actualizarPaciente);
router.delete("/:id", authMiddleware(), rolMiddleware(["admin"]), eliminarPaciente);

// Subruta de asignar turno
router.get("/asignar-turno", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), vistaAsignarTurno);
router.post("/asignar-turno", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), asignarTurno);

export default router;

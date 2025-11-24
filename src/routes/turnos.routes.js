import { Router } from "express";
import { listarTurnos, crearTurno, vistaCrearTurno } from "../controllers/turnos.controller.js";
import { authMiddleware, rolMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware(), listarTurnos);

router.get("/nuevo", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), vistaCrearTurno);
router.post("/", authMiddleware(), rolMiddleware(["admin", "recepcionista"]), crearTurno);

export default router;

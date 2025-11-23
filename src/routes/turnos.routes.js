import { Router } from "express";
import { listarTurnos, crearTurno } from "../controllers/turnos.controller.js";
import { authMiddleware, rolMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, listarTurnos);

router.post("/", authMiddleware, rolMiddleware(["admin", "recepcionista"]), crearTurno);

export default router;

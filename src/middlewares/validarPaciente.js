export function validarPaciente(req, res, next) {
  const { nombre, F_Nac, diagnostico } = req.body;
  if (!nombre || !F_Nac || !diagnostico) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  next();
}

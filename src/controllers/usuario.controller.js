import Usuario from "../models/Usuario.js";

// crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) return res.status(400).json({ mensaje: "El usuario ya existe" });

    const usuario = new Usuario({ nombre, email, password, rol });
    await usuario.save();

    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/usuarios");
    }
    res.status(201).json({ mensaje: "Usuario creado correctamente", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password").lean();
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.render("usuarios", { usuarios, titulo: "Administrar Usuarios" });
    }
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

//usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-password");
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// upgrade usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, rol } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol },
      { new: true, runValidators: true }
    ).select("-password");

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario actualizado", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// delete usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

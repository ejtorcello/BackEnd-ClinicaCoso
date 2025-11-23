import Usuario from "../models/Usuario.js";

//mostrar login
export const loginView = (req, res) => {
  res.render("login", { titulo: "Iniciar Sesión" });
};

// login con cookie de sesión
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: "Email o contraseña incorrectos" });

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) return res.status(400).json({ mensaje: "Email o contraseña incorrectos" });

    // guardar datos en la session
    req.session.userId = usuario._id;
    req.session.rol = usuario.rol;

    // res.json({ mensaje: "Login exitoso", usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } });
    
    // redirigir al index para pug
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const logoutUsuario = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ mensaje: "ERror al cerrar sesion" });
    res.clearCookie("connect.sid"); // nombre por defecto de la qk de express-session
    res.json({ mensaje: "Logout exitoso" });
  });
};

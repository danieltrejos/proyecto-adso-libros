const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

// Página de login
router.get("/login", (req, res) => {
  res.render("auth/login", {
    email: "",
    messages: {},
  });
});

// Procesar login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("auth/login", {
      email,
      messages: { error: "Email y contraseña son obligatorios" },
    });
  }

  const query = `
    SELECT u.*, r.name as role_name, r.description as role_description
    FROM users u
    INNER JOIN roles r ON u.id_role = r.id_role
    WHERE u.email = ? AND u.password = ? AND u.state = 1 AND r.state = 1
  `;

  dbConn.query(query, [email, password], (err, users) => {
    if (err) {
      return res.render("auth/login", {
        email,
        messages: { error: "Error en el servidor" },
      });
    }

    if (users.length === 0) {
      return res.render("auth/login", {
        email,
        messages: { error: "Credenciales incorrectas" },
      });
    }

    const user = users[0];

    // Guardar información del usuario en la sesión
    req.session.user = {
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      id_role: user.id_role,
      role_name: user.role_name,
      role_description: user.role_description,
    };

    req.flash("success", `Bienvenido ${user.name}`);
    res.redirect("/dashboard");
  });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.flash("error", "Error al cerrar sesión");
      return res.redirect("/dashboard");
    }
    res.redirect("/");
  });
});

module.exports = router;

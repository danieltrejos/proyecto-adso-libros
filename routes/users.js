const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

// Listado con búsqueda y paginación
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  let query = `SELECT * FROM users WHERE (name LIKE ? OR email LIKE ?) AND state = 1 LIMIT ? OFFSET ?`;
  let countQuery = `SELECT COUNT(*) AS total FROM users WHERE (name LIKE ? OR email LIKE ?) AND state = 1`;
  const searchPattern = `%${search}%`;

  dbConn.query(countQuery, [searchPattern, searchPattern], (err, countResult) => {
    if (err)
      return res.render("users/index", {
        data: [],
        currentPage: 1,
        totalPages: 1,
        searchTerm: "",
        messages: { error: err.message },
      });
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    dbConn.query(query, [searchPattern, searchPattern, limit, offset], (err, result) => {
      if (err) {
        res.render("users/index", {
          data: [],
          currentPage: 1,
          totalPages: 1,
          searchTerm: "",
          messages: { error: err.message },
        });
      } else {
        res.render("users/index", {
          data: result,
          currentPage: page,
          totalPages,
          searchTerm: search,
          messages: {},
        });
      }
    });
  });
});

// Página de agregar
router.get("/add", (req, res) => {
  res.render("users/add", {
    name: "",
    email: "",
    password: "",
    role: "",
    messages: {},
  });
});

// Guardar nuevo usuario
router.post("/add", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.render("users/add", {
      name,
      email,
      password,
      role,
      messages: { error: "Todos los campos son obligatorios" },
    });
  }

  const userData = {
    name,
    email,
    password,
    role,
    state: 1,
  };

  dbConn.query("INSERT INTO users SET ?", userData, (err) => {
    if (err) {
      res.render("users/add", {
        ...userData,
        password: "",
        messages: { error: err.message },
      });
    } else {
      req.flash("success", "Usuario agregado exitosamente");
      res.redirect("/users");
    }
  });
});

// Editar
router.get("/edit/:id", (req, res) => {
  dbConn.query(
    "SELECT * FROM users WHERE id_user = ? AND state = 1",
    [req.params.id],
    (err, rows) => {
      if (err || rows.length === 0) {
        req.flash("error", "Usuario no encontrado");
        return res.redirect("/users");
      }
      res.render("users/edit", {
        id: rows[0].id_user,
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role,
        messages: {},
      });
    }
  );
});

// Actualizar
router.post("/update/:id", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !role) {
    return res.render("users/edit", {
      id: req.params.id,
      name,
      email,
      role,
      messages: { error: "Nombre, email y rol son obligatorios" },
    });
  }

  const userData = {
    name,
    email,
    role,
  };

  // Solo actualizar la contraseña si se proporcionó una nueva
  if (password) {
    userData.password = password;
  }

  dbConn.query(
    "UPDATE users SET ? WHERE id_user = ?",
    [userData, req.params.id],
    (err) => {
      if (err) {
        res.render("users/edit", {
          id: req.params.id,
          ...userData,
          messages: { error: err.message },
        });
      } else {
        req.flash("success", "Usuario actualizado correctamente");
        res.redirect("/users");
      }
    }
  );
});

// Eliminar (soft delete)
router.get("/delete/:id", (req, res) => {
  dbConn.query(
    "UPDATE users SET state = 0 WHERE id_user = ?",
    [req.params.id],
    (err) => {
      if (err) req.flash("error", err.message);
      else req.flash("success", "Usuario eliminado exitosamente");
      res.redirect("/users");
    }
  );
});

module.exports = router;

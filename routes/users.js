const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

// Listado con búsqueda y paginación
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  let query = `
    SELECT u.*, r.name as role_name 
    FROM users u 
    INNER JOIN roles r ON u.id_role = r.id_role 
    WHERE (u.name LIKE ? OR u.email LIKE ?) AND u.state = 1 
    LIMIT ? OFFSET ?`;
  
  let countQuery = `
    SELECT COUNT(*) AS total 
    FROM users u 
    INNER JOIN roles r ON u.id_role = r.id_role 
    WHERE (u.name LIKE ? OR u.email LIKE ?) AND u.state = 1`;
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
  // Cargar roles para el selector
  dbConn.query("SELECT * FROM roles WHERE state = 1", (err, roles) => {
    if (err) {
      return res.render("users/add", {
        name: "",
        email: "",
        password: "",
        id_role: "",
        roles: [],
        messages: { error: err.message },
      });
    }

    res.render("users/add", {
      name: "",
      email: "",
      password: "",
      id_role: "",
      roles,
      messages: {},
    });
  });
});

// Guardar nuevo usuario
router.post("/add", (req, res) => {
  const { name, email, password, id_role } = req.body;
  
  if (!name || !email || !password || !id_role) {
    // Recargar roles en caso de error
    return dbConn.query("SELECT * FROM roles WHERE state = 1", (err, roles) => {
      res.render("users/add", {
        name,
        email,
        password: "",
        id_role,
        roles: roles || [],
        messages: { error: "Todos los campos son obligatorios" },
      });
    });
  }

  const userData = {
    name,
    email,
    password,
    id_role,
    state: 1,
  };

  dbConn.query("INSERT INTO users SET ?", userData, (err) => {
    if (err) {
      return dbConn.query("SELECT * FROM roles WHERE state = 1", (err, roles) => {
        res.render("users/add", {
          name,
          email,
          password: "",
          id_role,
          roles: roles || [],
          messages: { error: err.message },
        });
      });
    } else {
      req.flash("success", "Usuario agregado exitosamente");
      res.redirect("/users");
    }
  });
});

// Editar
router.get("/edit/:id", (req, res) => {
  const userQuery = "SELECT * FROM users WHERE id_user = ? AND state = 1";
  const rolesQuery = "SELECT * FROM roles WHERE state = 1";

  dbConn.query(userQuery, [req.params.id], (err, users) => {
    if (err || users.length === 0) {
      req.flash("error", "Usuario no encontrado");
      return res.redirect("/users");
    }

    dbConn.query(rolesQuery, (err, roles) => {
      if (err) {
        req.flash("error", "Error al cargar roles");
        return res.redirect("/users");
      }

      res.render("users/edit", {
        id_user: users[0].id_user,
        name: users[0].name,
        email: users[0].email,
        id_role: users[0].id_role,
        roles,
        messages: {},
      });
    });
  });
});

// Actualizar
router.post("/update/:id", (req, res) => {
  const { name, email, password, id_role } = req.body;
  
  if (!name || !email || !id_role) {
    return dbConn.query("SELECT * FROM roles WHERE state = 1", (err, roles) => {
      res.render("users/edit", {
        id_user: req.params.id,
        name,
        email,
        id_role,
        roles: roles || [],
        messages: { error: "Nombre, email y rol son obligatorios" },
      });
    });
  }

  const userData = {
    name,
    email,
    id_role,
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
        return dbConn.query("SELECT * FROM roles WHERE state = 1", (err, roles) => {
          res.render("users/edit", {
            id_user: req.params.id,
            name,
            email,
            id_role,
            roles: roles || [],
            messages: { error: err.message },
          });
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

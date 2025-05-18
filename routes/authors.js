const express = require("express");
const router = express.Router();
const db = require("../lib/db");

// Listado con búsqueda y paginación
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  let query = `SELECT * FROM authors WHERE name LIKE ? AND state = 1 LIMIT ? OFFSET ?`;
  let countQuery = `SELECT COUNT(*) AS total FROM authors WHERE name LIKE ? AND state = 1`;
  const searchPattern = `%${search}%`;

  db.query(countQuery, [searchPattern], (err, countResult) => {
    if (err)
      return res.render("authors/index", {
        data: [],
        currentPage: 1,
        totalPages: 1,
        searchTerm: "",
        messages: { error: err.message },
      });
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(query, [searchPattern, limit, offset], (err, result) => {
      if (err) {
        res.render("authors/index", {
          data: [],
          currentPage: 1,
          totalPages: 1,
          searchTerm: "",
          messages: { error: err.message },
        });
      } else {
        res.render("authors/index", {
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
  res.render("authors/add", { name: "", messages: {} });
});

// Guardar nuevo autor
router.post("/add", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.render("authors/add", {
      name,
      messages: { error: "El nombre es obligatorio" },
    });
  }

  db.query("INSERT INTO authors (name, state) VALUES (?, 1)", [name], (err) => {
    if (err) {
      res.render("authors/add", { name, messages: { error: err.message } });
    } else {
      req.flash("success", "Autor agregado exitosamente");
      res.redirect("/authors");
    }
  });
});

// Editar
router.get("/edit/:id", (req, res) => {
  db.query(
    "SELECT * FROM authors WHERE id_author = ? AND state = 1",
    [req.params.id],
    (err, rows) => {
      if (err || rows.length === 0) {
        req.flash("error", "Autor no encontrado");
        return res.redirect("/authors");
      }
      res.render("authors/edit", {
        id: rows[0].id_author,
        name: rows[0].name,
        messages: {},
      });
    }
  );
});

// Actualizar
router.post("/update/:id", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.render("authors/edit", {
      id: req.params.id,
      name,
      messages: { error: "El nombre es obligatorio" },
    });
  }

  db.query(
    "UPDATE authors SET name = ? WHERE id_author = ?",
    [name, req.params.id],
    (err) => {
      if (err) {
        res.render("authors/edit", {
          id: req.params.id,
          name,
          messages: { error: err.message },
        });
      } else {
        req.flash("success", "Autor actualizado correctamente");
        res.redirect("/authors");
      }
    }
  );
});

// Eliminar (soft delete)
router.get("/delete/:id", (req, res) => {
  db.query(
    "UPDATE authors SET state = 0 WHERE id_author = ?",
    [req.params.id],
    (err) => {
      if (err) req.flash("error", err.message);
      else req.flash("success", "Autor eliminado exitosamente");
      res.redirect("/authors");
    }
  );
});

module.exports = router;

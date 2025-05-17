const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

// Mostrar libros con búsqueda y paginación
router.get("/", function (req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.search || "";

  let query, countQuery;
  let queryParams = [],
    countQueryParams = [];

  if (searchTerm) {
    query = `SELECT * FROM books WHERE name LIKE ? ORDER BY id_book DESC LIMIT ? OFFSET ?`;
    countQuery = `SELECT COUNT(*) as total FROM books WHERE name LIKE ?`;
    const searchPattern = `%${searchTerm}%`;
    queryParams = [searchPattern, limit, offset];
    countQueryParams = [searchPattern];
  } else {
    query = `SELECT * FROM books ORDER BY id_book DESC LIMIT ? OFFSET ?`;
    countQuery = `SELECT COUNT(*) as total FROM books`;
    queryParams = [limit, offset];
  }

  dbConn.query(countQuery, countQueryParams, function (countErr, countResult) {
    if (countErr) {
      req.flash("error", countErr);
      return res.render("books/index", {
        data: [],
        currentPage: 1,
        totalPages: 1,
        searchTerm,
      });
    }

    const totalBooks = countResult[0].total;
    const totalPages = Math.ceil(totalBooks / limit);

    dbConn.query(query, queryParams, function (err, rows) {
      if (err) {
        req.flash("error", err);
        return res.render("books/index", {
          data: [],
          currentPage: 1,
          totalPages: 1,
          searchTerm,
        });
      }

      res.render("books/index", {
        data: rows,
        currentPage: page,
        totalPages,
        searchTerm,
      });
    });
  });
});

// Renderizar formulario de agregar libro
router.get("/add", function (req, res, next) {
  res.render("books/add", {
    name: "",
    isbn: "",
    year_published: "",
    num_pages: "",
    id_author: "",
    id_category: "",
    id_publisher: "",
  });
});

// Guardar nuevo libro
router.post("/add", function (req, res, next) {
  const {
    name,
    isbn,
    year_published,
    num_pages,
    id_author,
    id_category,
    id_publisher,
  } = req.body;
  const errors =
    !name ||
    !isbn ||
    !year_published ||
    !num_pages ||
    !id_author ||
    !id_category ||
    !id_publisher;

  if (errors) {
    req.flash("error", "Por favor completa todos los campos.");
    return res.render("books/add", req.body);
  }

  const form_data = {
    name,
    isbn,
    year_published,
    num_pages,
    id_author,
    id_category,
    id_publisher,
    state: 1,
  };

  dbConn.query("INSERT INTO books SET ?", form_data, function (err) {
    if (err) {
      req.flash("error", err);
      return res.render("books/add", req.body);
    }
    req.flash("success", "Libro agregado correctamente");
    res.redirect("/books");
  });
});

// Mostrar formulario de edición
router.get("/edit/:id", function (req, res, next) {
  const id = req.params.id;
  dbConn.query(
    "SELECT * FROM books WHERE id_book = ?",
    [id],
    function (err, rows) {
      if (err || rows.length === 0) {
        req.flash("error", "Libro no encontrado");
        return res.redirect("/books");
      }

      res.render("books/edit", rows[0]);
    }
  );
});

// Actualizar libro
router.post("/update/:id", function (req, res, next) {
  const id = req.params.id;
  const {
    name,
    isbn,
    year_published,
    num_pages,
    id_author,
    id_category,
    id_publisher,
  } = req.body;
  const errors =
    !name ||
    !isbn ||
    !year_published ||
    !num_pages ||
    !id_author ||
    !id_category ||
    !id_publisher;

  if (errors) {
    req.flash("error", "Por favor completa todos los campos.");
    return res.render("books/edit", { id_book: id, ...req.body });
  }

  const form_data = {
    name,
    isbn,
    year_published,
    num_pages,
    id_author,
    id_category,
    id_publisher,
  };

  dbConn.query(
    "UPDATE books SET ? WHERE id_book = ?",
    [form_data, id],
    function (err) {
      if (err) {
        req.flash("error", err);
        return res.render("books/edit", { id_book: id, ...req.body });
      }
      req.flash("success", "Libro actualizado correctamente");
      res.redirect("/books");
    }
  );
});

// Eliminar libro
router.get("/delete/:id", function (req, res, next) {
  const id = req.params.id;
  dbConn.query("DELETE FROM books WHERE id_book = ?", [id], function (err) {
    if (err) {
      req.flash("error", err);
    } else {
      req.flash("success", "Libro eliminado correctamente");
    }
    res.redirect("/books");
  });
});

module.exports = router;

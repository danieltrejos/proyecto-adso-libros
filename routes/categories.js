const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

// Listado con búsqueda y paginación
router.get("/", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    let query = `SELECT * FROM categories WHERE name LIKE ? AND state = 1 LIMIT ? OFFSET ?`;
    let countQuery = `SELECT COUNT(*) AS total FROM categories WHERE name LIKE ? AND state = 1`;
    const searchPattern = `%${search}%`;

    dbConn.query(countQuery, [searchPattern], (err, countResult) => {
        if (err)
            return res.render("categories/index", {
                data: [],
                currentPage: 1,
                totalPages: 1,
                searchTerm: "",
                messages: { error: err.message },
            });
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        dbConn.query(query, [searchPattern, limit, offset], (err, result) => {
            if (err) {
                res.render("categories/index", {
                    data: [],
                    currentPage: 1,
                    totalPages: 1,
                    searchTerm: "",
                    messages: { error: err.message },
                });
            } else {
                res.render("categories/index", {
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
    res.render("categories/add", { name: "", messages: {} });
});

// Guardar nueva categoría
router.post("/add", (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.render("categories/add", {
            name,
            messages: { error: "El nombre es obligatorio" },
        });
    }

    dbConn.query("INSERT INTO categories (name, state) VALUES (?, 1)", [name], (err) => {
        if (err) {
            res.render("categories/add", { name, messages: { error: err.message } });
        } else {
            req.flash("success", "Categoría agregada exitosamente");
            res.redirect("/categories");
        }
    });
});

// Editar
router.get("/edit/:id", (req, res) => {
    dbConn.query(
        "SELECT * FROM categories WHERE id_category = ? AND state = 1",
        [req.params.id],
        (err, rows) => {
            if (err || rows.length === 0) {
                req.flash("error", "Categoría no encontrada");
                return res.redirect("/categories");
            }
            res.render("categories/edit", {
                id_category: rows[0].id_category,
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
        return res.render("categories/edit", {
            id_category: req.params.id,
            name,
            messages: { error: "El nombre es obligatorio" },
        });
    }

    dbConn.query(
        "UPDATE categories SET name = ? WHERE id_category = ?",
        [name, req.params.id],
        (err) => {
            if (err) {
                res.render("categories/edit", {
                    id_category: req.params.id,
                    name,
                    messages: { error: err.message },
                });
            } else {
                req.flash("success", "Categoría actualizada correctamente");
                res.redirect("/categories");
            }
        }
    );
});

// Eliminar (soft delete)
router.get("/delete/:id", (req, res) => {
    dbConn.query(
        "UPDATE categories SET state = 0 WHERE id_category = ?",
        [req.params.id],
        (err) => {
            if (err) req.flash("error", err.message);
            else req.flash("success", "Categoría eliminada exitosamente");
            res.redirect("/categories");
        }
    );
});

module.exports = router;
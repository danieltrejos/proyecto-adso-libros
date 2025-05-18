const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

// Listado con búsqueda y paginación
router.get("/", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    let query = `SELECT * FROM publishers WHERE name LIKE ? AND state = 1 LIMIT ? OFFSET ?`;
    let countQuery = `SELECT COUNT(*) AS total FROM publishers WHERE name LIKE ? AND state = 1`;
    const searchPattern = `%${search}%`;

    dbConn.query(countQuery, [searchPattern], (err, countResult) => {
        if (err)
            return res.render("publishers/index", {
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
                res.render("publishers/index", {
                    data: [],
                    currentPage: 1,
                    totalPages: 1,
                    searchTerm: "",
                    messages: { error: err.message },
                });
            } else {
                res.render("publishers/index", {
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
    res.render("publishers/add", { name: "", messages: {} });
});

// Guardar nueva editorial
router.post("/add", (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.render("publishers/add", {
            name,
            messages: { error: "El nombre es obligatorio" },
        });
    }

    dbConn.query("INSERT INTO publishers (name, state) VALUES (?, 1)", [name], (err) => {
        if (err) {
            res.render("publishers/add", { name, messages: { error: err.message } });
        } else {
            req.flash("success", "Editorial agregada exitosamente");
            res.redirect("/publishers");
        }
    });
});

// Editar
router.get("/edit/:id", (req, res) => {
    dbConn.query(
        "SELECT * FROM publishers WHERE id_publisher = ? AND state = 1",
        [req.params.id],
        (err, rows) => {
            if (err || rows.length === 0) {
                req.flash("error", "Editorial no encontrada");
                return res.redirect("/publishers");
            }
            res.render("publishers/edit", {
                id: rows[0].id_publisher,
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
        return res.render("publishers/edit", {
            id: req.params.id,
            name,
            messages: { error: "El nombre es obligatorio" },
        });
    }

    dbConn.query(
        "UPDATE publishers SET name = ? WHERE id_publisher = ?",
        [name, req.params.id],
        (err) => {
            if (err) {
                res.render("publishers/edit", {
                    id: req.params.id,
                    name,
                    messages: { error: err.message },
                });
            } else {
                req.flash("success", "Editorial actualizada correctamente");
                res.redirect("/publishers");
            }
        }
    );
});

// Eliminar (soft delete)
router.get("/delete/:id", (req, res) => {
    dbConn.query(
        "UPDATE publishers SET state = 0 WHERE id_publisher = ?",
        [req.params.id],
        (err) => {
            if (err) req.flash("error", err.message);
            else req.flash("success", "Editorial eliminada exitosamente");
            res.redirect("/publishers");
        }
    );
});

module.exports = router;
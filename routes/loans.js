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
        SELECT l.*, u.name as user_name, u.email as user_email,
               b.name as book_name, a.name as author_name
        FROM loans l
        JOIN users u ON l.id_user = u.id_user
        JOIN books b ON l.id_book = b.id_book
        JOIN authors a ON b.id_author = a.id_author
        WHERE (u.name LIKE ? OR b.name LIKE ?) AND l.state = 1
        ORDER BY l.loan_date DESC
        LIMIT ? OFFSET ?`;

    let countQuery = `
        SELECT COUNT(*) as total
        FROM loans l
        JOIN users u ON l.id_user = u.id_user
        JOIN books b ON l.id_book = b.id_book
        WHERE (u.name LIKE ? OR b.name LIKE ?) AND l.state = 1`;

    const searchPattern = `%${search}%`;

    dbConn.query(countQuery, [searchPattern, searchPattern], (err, countResult) => {
        if (err) {
            return res.render("loans/index", {
                data: [],
                currentPage: 1,
                totalPages: 1,
                searchTerm: "",
                messages: { error: err.message }
            });
        }

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        dbConn.query(query, [searchPattern, searchPattern, limit, offset], (err, result) => {
            if (err) {
                return res.render("loans/index", {
                    data: [],
                    currentPage: 1,
                    totalPages: 1,
                    searchTerm: "",
                    messages: { error: err.message }
                });
            }

            res.render("loans/index", {
                data: result,
                currentPage: page,
                totalPages,
                searchTerm: search,
                messages: {}
            });
        });
    });
});

// Página de agregar préstamo
router.get("/add", (req, res) => {
    const usersQuery = "SELECT id_user, name, email FROM users WHERE state = 1";
    const booksQuery = `
        SELECT b.id_book, b.name, a.name as author_name
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        WHERE b.state = 1`;

    dbConn.query(usersQuery, (err, users) => {
        if (err) {
            return res.render("loans/add", {
                users: [],
                books: [],
                messages: { error: err.message }
            });
        }

        dbConn.query(booksQuery, (err, books) => {
            if (err) {
                return res.render("loans/add", {
                    users,
                    books: [],
                    messages: { error: err.message }
                });
            }

            res.render("loans/add", {
                users,
                books,
                messages: {}
            });
        });
    });
});

// Guardar nuevo préstamo
router.post("/add", (req, res) => {
    const { id_user, id_book, return_due } = req.body;

    if (!id_user || !id_book || !return_due) {
        return reloadAddPage(res, "Todos los campos son requeridos");
    }

    const loanData = {
        id_user,
        id_book,
        loan_date: new Date(),
        return_due,
        returned: 0,
        state: 1
    };

    dbConn.query("INSERT INTO loans SET ?", loanData, (err) => {
        if (err) {
            return reloadAddPage(res, err.message);
        }
        req.flash("success", "Préstamo registrado correctamente");
        res.redirect("/loans");
    });
});

// Página de editar préstamo
router.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const loanQuery = `
        SELECT l.*, u.name as user_name, b.name as book_name 
        FROM loans l
        JOIN users u ON l.id_user = u.id_user
        JOIN books b ON l.id_book = b.id_book
        WHERE l.id_loan = ? AND l.state = 1`;

    dbConn.query(loanQuery, [id], (err, loans) => {
        if (err || loans.length === 0) {
            req.flash("error", "Préstamo no encontrado");
            return res.redirect("/loans");
        }

        const loan = loans[0];
        res.render("loans/edit", {
            loan,
            messages: {}
        });
    });
});

// Actualizar préstamo
router.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const { return_due } = req.body;

    if (!return_due) {
        req.flash("error", "La fecha de devolución es requerida");
        return res.redirect("/loans/edit/" + id);
    }

    const updateData = {
        return_due: new Date(return_due)
    };

    dbConn.query(
        "UPDATE loans SET ? WHERE id_loan = ?",
        [updateData, id],
        (err) => {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/loans/edit/" + id);
            }
            req.flash("success", "Préstamo actualizado correctamente");
            res.redirect("/loans");
        }
    );
});

// Marcar préstamo como devuelto
router.post("/return/:id", (req, res) => {
    const id = req.params.id;

    const updateData = {
        returned: 1,
        returned_at: new Date()
    };

    dbConn.query(
        "UPDATE loans SET ? WHERE id_loan = ? AND returned = 0",
        [updateData, id],
        (err) => {
            if (err) {
                req.flash("error", err.message);
            } else {
                req.flash("success", "Libro devuelto correctamente");
            }
            res.redirect("/loans");
        }
    );
});

// Función auxiliar para recargar la página de agregar con error
function reloadAddPage(res, errorMessage) {
    const usersQuery = "SELECT id_user, name, email FROM users WHERE state = 1";
    const booksQuery = `
        SELECT b.id_book, b.name, a.name as author_name
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        WHERE b.state = 1`;

    dbConn.query(usersQuery, (err, users) => {
        dbConn.query(booksQuery, (err, books) => {
            return res.render("loans/add", {
                users: users || [],
                books: books || [],
                messages: { error: errorMessage }
            });
        });
    });
}

module.exports = router;
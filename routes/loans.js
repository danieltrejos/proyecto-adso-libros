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
                messages: { error: err.message },
            });
        }

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        dbConn.query(query, [searchPattern, searchPattern, limit, offset], (err, result) => {
            if (err) {
                res.render("loans/index", {
                    data: [],
                    currentPage: 1,
                    totalPages: 1,
                    searchTerm: "",
                    messages: { error: err.message },
                });
            } else {
                res.render("loans/index", {
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
    // Cargar usuarios y libros para los selectores
    const usersQuery = "SELECT id_user, name, email FROM users WHERE state = 1";
    const booksQuery = `
        SELECT b.id_book, b.name, a.name as author_name, p.name as publisher_name 
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        JOIN publishers p ON b.id_publisher = p.id_publisher
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

    // Validar campos requeridos
    if (!id_user || !id_book || !return_due) {
        return reloadAddPage(res, "Por favor complete todos los campos");
    }

    // Validar fecha de devolución
    const returnDate = new Date(return_due);
    const today = new Date();
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (returnDate < today) {
        return reloadAddPage(res, "La fecha de devolución no puede ser en el pasado");
    }

    if (returnDate > maxDate) {
        return reloadAddPage(res, "El período máximo de préstamo es de 30 días");
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

// Función auxiliar para recargar la página de agregar con error
function reloadAddPage(res, errorMessage) {
    const usersQuery = "SELECT id_user, name, email FROM users WHERE state = 1";
    const booksQuery = `
        SELECT b.id_book, b.name, a.name as author_name, p.name as publisher_name 
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        JOIN publishers p ON b.id_publisher = p.id_publisher
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

// Editar préstamo
router.get("/edit/:id", (req, res) => {
    const id = req.params.id;

    // Obtener datos del préstamo
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
            ...loan,
            messages: {}
        });
    });
});

// Actualizar préstamo
router.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const { return_due, returned } = req.body;

    if (!return_due) {
        return res.render("loans/edit", {
            id_loan: id,
            ...req.body,
            messages: { error: "La fecha de devolución es obligatoria" }
        });
    }

    const updateData = {
        return_due,
        returned: returned ? 1 : 0,
        returned_at: returned ? new Date() : null
    };

    dbConn.query(
        "UPDATE loans SET ? WHERE id_loan = ?",
        [updateData, id],
        (err) => {
            if (err) {
                return res.render("loans/edit", {
                    id_loan: id,
                    ...req.body,
                    messages: { error: err.message }
                });
            }

            req.flash("success", "Préstamo actualizado correctamente");
            res.redirect("/loans");
        }
    );
});

// Eliminar préstamo (soft delete)
router.get("/delete/:id", (req, res) => {
    dbConn.query(
        "UPDATE loans SET state = 0 WHERE id_loan = ?",
        [req.params.id],
        (err) => {
            if (err) req.flash("error", err.message);
            else req.flash("success", "Préstamo eliminado correctamente");
            res.redirect("/loans");
        }
    );
});

// Continue loan
router.get("/continue/:id", (req, res) => {
    const id = req.params.id;

    // First get the current loan details
    dbConn.query(
        "SELECT * FROM loans WHERE id_loan = ? AND state = 1",
        [id],
        (err, loans) => {
            if (err || loans.length === 0) {
                req.flash("error", "Préstamo no encontrado");
                return res.redirect("/loans");
            }

            const currentLoan = loans[0];

            // Only allow continuing active, non-returned loans
            if (currentLoan.returned) {
                req.flash("error", "No se puede continuar un préstamo ya devuelto");
                return res.redirect("/loans");
            }

            // Start a transaction to ensure data consistency
            dbConn.beginTransaction((err) => {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("/loans");
                }

                // 1. Mark current loan as returned
                const updateCurrentLoan = {
                    returned: 1,
                    returned_at: new Date()
                };

                dbConn.query(
                    "UPDATE loans SET ? WHERE id_loan = ?",
                    [updateCurrentLoan, id],
                    (err) => {
                        if (err) {
                            return dbConn.rollback(() => {
                                req.flash("error", err.message);
                                res.redirect("/loans");
                            });
                        }

                        // 2. Create new loan with same book and user
                        const newLoan = {
                            id_user: currentLoan.id_user,
                            id_book: currentLoan.id_book,
                            loan_date: new Date(),
                            // Set return_due to 15 days from now by default
                            return_due: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                            returned: 0,
                            state: 1
                        };

                        dbConn.query(
                            "INSERT INTO loans SET ?",
                            newLoan,
                            (err) => {
                                if (err) {
                                    return dbConn.rollback(() => {
                                        req.flash("error", err.message);
                                        res.redirect("/loans");
                                    });
                                }

                                // Commit the transaction
                                dbConn.commit((err) => {
                                    if (err) {
                                        return dbConn.rollback(() => {
                                            req.flash("error", err.message);
                                            res.redirect("/loans");
                                        });
                                    }
                                    req.flash("success", "Préstamo continuado correctamente");
                                    res.redirect("/loans");
                                });
                            }
                        );
                    }
                );
            });
        }
    );
});

module.exports = router;
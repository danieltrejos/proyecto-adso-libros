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
        SELECT b.*, a.name as author_name, c.name as category_name, p.name as publisher_name 
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        JOIN categories c ON b.id_category = c.id_category
        JOIN publishers p ON b.id_publisher = p.id_publisher
        WHERE (b.name LIKE ? OR a.name LIKE ?) AND b.state = 1 
        LIMIT ? OFFSET ?`;
    let countQuery = `
        SELECT COUNT(*) AS total 
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        WHERE (b.name LIKE ? OR a.name LIKE ?) AND b.state = 1`;
    const searchPattern = `%${search}%`;

    dbConn.query(countQuery, [searchPattern, searchPattern], (err, countResult) => {
        if (err)
            return res.render("books/index", {
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
                res.render("books/index", {
                    data: [],
                    currentPage: 1,
                    totalPages: 1,
                    searchTerm: "",
                    messages: { error: err.message },
                });
            } else {
                res.render("books/index", {
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
    // Cargar autores, categorías y editoriales para los selectores
    const authorsQuery = "SELECT id_author, name FROM authors WHERE state = 1";
    const categoriesQuery = "SELECT id_category, name FROM categories WHERE state = 1";
    const publishersQuery = "SELECT id_publisher, name FROM publishers WHERE state = 1";

    dbConn.query(authorsQuery, (err, authors) => {
        if (err) {
            return res.render("books/add", {
                name: "", isbn: "", year_published: "", num_pages: "",
                authors: [], categories: [], publishers: [],
                messages: { error: err.message }
            });
        }

        dbConn.query(categoriesQuery, (err, categories) => {
            if (err) {
                return res.render("books/add", {
                    name: "", isbn: "", year_published: "", num_pages: "",
                    authors, categories: [], publishers: [],
                    messages: { error: err.message }
                });
            }

            dbConn.query(publishersQuery, (err, publishers) => {
                if (err) {
                    return res.render("books/add", {
                        name: "", isbn: "", year_published: "", num_pages: "",
                        authors, categories, publishers: [],
                        messages: { error: err.message }
                    });
                }

                res.render("books/add", {
                    name: "", isbn: "", year_published: "", num_pages: "",
                    authors, categories, publishers,
                    messages: {}
                });
            });
        });
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
        // Recargar los selectores en caso de error
        const authorsQuery = "SELECT id_author, name FROM authors WHERE state = 1";
        const categoriesQuery = "SELECT id_category, name FROM categories WHERE state = 1";
        const publishersQuery = "SELECT id_publisher, name FROM publishers WHERE state = 1";

        dbConn.query(authorsQuery, (err, authors) => {
            dbConn.query(categoriesQuery, (err, categories) => {
                dbConn.query(publishersQuery, (err, publishers) => {
                    req.flash("error", "Por favor completa todos los campos.");
                    return res.render("books/add", {
                        ...req.body,
                        authors,
                        categories,
                        publishers,
                        messages: { error: "Por favor completa todos los campos." }
                    });
                });
            });
        });
        return;
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
            // Recargar los selectores en caso de error
            const authorsQuery = "SELECT id_author, name FROM authors WHERE state = 1";
            const categoriesQuery = "SELECT id_category, name FROM categories WHERE state = 1";
            const publishersQuery = "SELECT id_publisher, name FROM publishers WHERE state = 1";

            dbConn.query(authorsQuery, (err, authors) => {
                dbConn.query(categoriesQuery, (err, categories) => {
                    dbConn.query(publishersQuery, (err, publishers) => {
                        return res.render("books/add", {
                            ...req.body,
                            authors,
                            categories,
                            publishers,
                            messages: { error: err.message }
                        });
                    });
                });
            });
            return;
        }
        req.flash("success", "Libro agregado correctamente");
        res.redirect("/books");
    });
});

// Editar
router.get("/edit/:id", (req, res) => {
    const id = req.params.id;

    // Primero obtenemos los datos del libro
    dbConn.query(
        "SELECT * FROM books WHERE id_book = ? AND state = 1",
        [id],
        (err, books) => {
            if (err || books.length === 0) {
                req.flash("error", "Libro no encontrado");
                return res.redirect("/books");
            }

            const book = books[0];

            // Luego cargamos los datos para los selectores
            const authorsQuery = "SELECT id_author, name FROM authors WHERE state = 1";
            const categoriesQuery = "SELECT id_category, name FROM categories WHERE state = 1";
            const publishersQuery = "SELECT id_publisher, name FROM publishers WHERE state = 1";

            dbConn.query(authorsQuery, (err, authors) => {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("/books");
                }

                dbConn.query(categoriesQuery, (err, categories) => {
                    if (err) {
                        req.flash("error", err.message);
                        return res.redirect("/books");
                    }

                    dbConn.query(publishersQuery, (err, publishers) => {
                        if (err) {
                            req.flash("error", err.message);
                            return res.redirect("/books");
                        }

                        res.render("books/edit", {
                            ...book,
                            authors,
                            categories,
                            publishers,
                            messages: {}
                        });
                    });
                });
            });
        }
    );
});

// Actualizar
router.post("/update/:id", (req, res) => {
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
        // Recargar los selectores en caso de error
        const authorsQuery = "SELECT id_author, name FROM authors WHERE state = 1";
        const categoriesQuery = "SELECT id_category, name FROM categories WHERE state = 1";
        const publishersQuery = "SELECT id_publisher, name FROM publishers WHERE state = 1";

        dbConn.query(authorsQuery, (err, authors) => {
            dbConn.query(categoriesQuery, (err, categories) => {
                dbConn.query(publishersQuery, (err, publishers) => {
                    req.flash("error", "Por favor completa todos los campos.");
                    return res.render("books/edit", {
                        id_book: id,
                        ...req.body,
                        authors,
                        categories,
                        publishers,
                        messages: { error: "Por favor completa todos los campos." }
                    });
                });
            });
        });
        return;
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
        (err) => {
            if (err) {
                // Recargar los selectores en caso de error
                const authorsQuery = "SELECT id_author, name FROM authors WHERE state = 1";
                const categoriesQuery = "SELECT id_category, name FROM categories WHERE state = 1";
                const publishersQuery = "SELECT id_publisher, name FROM publishers WHERE state = 1";

                dbConn.query(authorsQuery, (err, authors) => {
                    dbConn.query(categoriesQuery, (err, categories) => {
                        dbConn.query(publishersQuery, (err, publishers) => {
                            return res.render("books/edit", {
                                id_book: id,
                                ...req.body,
                                authors,
                                categories,
                                publishers,
                                messages: { error: err.message }
                            });
                        });
                    });
                });
                return;
            }
            req.flash("success", "Libro actualizado correctamente");
            res.redirect("/books");
        }
    );
});

// Eliminar (soft delete)
router.get("/delete/:id", (req, res) => {
    dbConn.query(
        "UPDATE books SET state = 0 WHERE id_book = ?",
        [req.params.id],
        (err) => {
            if (err) req.flash("error", err.message);
            else req.flash("success", "Libro eliminado exitosamente");
            res.redirect("/books");
        }
    );
});

module.exports = router;

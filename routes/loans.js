const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

// Listado con búsqueda y paginación (solo préstamos activos)
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  let query = `
        SELECT l.*, u.name as user_name, u.email as user_email,
               b.name as book_name, b.stock as book_stock, a.name as author_name
        FROM loans l
        JOIN users u ON l.id_user = u.id_user
        JOIN books b ON l.id_book = b.id_book
        JOIN authors a ON b.id_author = a.id_author
        WHERE (u.name LIKE ? OR b.name LIKE ?) AND l.state = 1 AND l.returned = 0
        ORDER BY l.loan_date DESC
        LIMIT ? OFFSET ?`;

  let countQuery = `
        SELECT COUNT(*) as total
        FROM loans l
        JOIN users u ON l.id_user = u.id_user
        JOIN books b ON l.id_book = b.id_book
        WHERE (u.name LIKE ? OR b.name LIKE ?) AND l.state = 1 AND l.returned = 0`;

  const searchPattern = `%${search}%`;

  dbConn.query(
    countQuery,
    [searchPattern, searchPattern],
    (err, countResult) => {
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

      dbConn.query(
        query,
        [searchPattern, searchPattern, limit, offset],
        (err, result) => {
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
              messages: req.flash(),
            });
          }
        }
      );
    }
  );
});

// Listado de devoluciones con búsqueda y paginación
router.get("/returned", (req, res) => {
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
        WHERE (u.name LIKE ? OR b.name LIKE ?) AND l.state = 1 AND l.returned = 1
        ORDER BY l.returned_at DESC
        LIMIT ? OFFSET ?`;

  let countQuery = `
        SELECT COUNT(*) as total
        FROM loans l
        JOIN users u ON l.id_user = u.id_user
        JOIN books b ON l.id_book = b.id_book
        WHERE (u.name LIKE ? OR b.name LIKE ?) AND l.state = 1 AND l.returned = 1`;

  const searchPattern = `%${search}%`;

  dbConn.query(
    countQuery,
    [searchPattern, searchPattern],
    (err, countResult) => {
      if (err) {
        return res.render("loans/returned", {
          data: [],
          currentPage: 1,
          totalPages: 1,
          searchTerm: "",
          messages: { error: err.message },
        });
      }

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      dbConn.query(
        query,
        [searchPattern, searchPattern, limit, offset],
        (err, result) => {
          if (err) {
            res.render("loans/returned", {
              data: [],
              currentPage: 1,
              totalPages: 1,
              searchTerm: "",
              messages: { error: err.message },
            });
          } else {
            res.render("loans/returned", {
              data: result,
              currentPage: page,
              totalPages,
              searchTerm: search,
              messages: req.flash(),
            });
          }
        }
      );
    }
  );
});

// Página de agregar
router.get("/add", (req, res) => {
  // Cargar usuarios y libros para los selectores
  const usersQuery = "SELECT id_user, name, email FROM users WHERE state = 1";
  const booksQuery = `
        SELECT b.id_book, b.name, b.stock, a.name as author_name, p.name as publisher_name,
               (SELECT COUNT(*) FROM loans l WHERE l.id_book = b.id_book AND l.returned = 0 AND l.state = 1) as units_loaned
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        JOIN publishers p ON b.id_publisher = p.id_publisher
        WHERE b.state = 1`;

  dbConn.query(usersQuery, (err, users) => {
    if (err) {
      return res.render("loans/add", {
        users: [],
        books: [],
        messages: { error: err.message },
      });
    }

    dbConn.query(booksQuery, (err, books) => {
      if (err) {
        return res.render("loans/add", {
          users,
          books: [],
          messages: { error: err.message },
        });
      }

      res.render("loans/add", {
        users,
        books,
        messages: {},
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
    return reloadAddPage(
      res,
      "La fecha de devolución no puede ser en el pasado"
    );
  }

  if (returnDate > maxDate) {
    return reloadAddPage(res, "El período máximo de préstamo es de 30 días");
  }

  // Verificar stock disponible del libro
  dbConn.query(
    "SELECT stock FROM books WHERE id_book = ? AND state = 1",
    [id_book],
    (err, books) => {
      if (err) {
        return reloadAddPage(res, "Error al verificar stock: " + err.message);
      }

      if (books.length === 0) {
        return reloadAddPage(res, "El libro seleccionado no existe");
      }

      const currentStock = books[0].stock;
      if (currentStock <= 0) {
        return reloadAddPage(res, "No hay stock disponible para este libro");
      }

      // Iniciar transacción para garantizar consistencia
      dbConn.beginTransaction((err) => {
        if (err) {
          return reloadAddPage(
            res,
            "Error al iniciar transacción: " + err.message
          );
        }

        // 1. Crear el préstamo
        const loanData = {
          id_user,
          id_book,
          loan_date: new Date(),
          return_due,
          returned: 0,
          state: 1,
        };

        dbConn.query("INSERT INTO loans SET ?", loanData, (err) => {
          if (err) {
            return dbConn.rollback(() => {
              reloadAddPage(res, "Error al crear préstamo: " + err.message);
            });
          }

          // 2. Reducir stock del libro en 1 unidad
          dbConn.query(
            "UPDATE books SET stock = stock - 1 WHERE id_book = ?",
            [id_book],
            (err) => {
              if (err) {
                return dbConn.rollback(() => {
                  reloadAddPage(
                    res,
                    "Error al actualizar stock: " + err.message
                  );
                });
              }

              // Confirmar transacción
              dbConn.commit((err) => {
                if (err) {
                  return dbConn.rollback(() => {
                    reloadAddPage(
                      res,
                      "Error al confirmar transacción: " + err.message
                    );
                  });
                }
                req.flash(
                  "success",
                  "Préstamo registrado correctamente. Stock actualizado."
                );
                res.redirect("/loans");
              });
            }
          );
        });
      });
    }
  );
});

// Función auxiliar para recargar la página de agregar con error
function reloadAddPage(res, errorMessage) {
  const usersQuery = "SELECT id_user, name, email FROM users WHERE state = 1";
  const booksQuery = `
        SELECT b.id_book, b.name, b.stock, a.name as author_name, p.name as publisher_name,
               (SELECT COUNT(*) FROM loans l WHERE l.id_book = b.id_book AND l.returned = 0 AND l.state = 1) as units_loaned
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        JOIN publishers p ON b.id_publisher = p.id_publisher
        WHERE b.state = 1`;

  dbConn.query(usersQuery, (err, users) => {
    dbConn.query(booksQuery, (err, books) => {
      return res.render("loans/add", {
        users: users || [],
        books: books || [],
        messages: { error: errorMessage },
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
        WHERE l.id_loan = ? AND l.state = 1`; // Cargar usuarios y libros para los selectores
  const usersQuery = "SELECT id_user, name, email FROM users WHERE state = 1";
  const booksQuery = `
        SELECT b.id_book, b.name, b.stock, a.name as author_name, p.name as publisher_name,
               COALESCE(loan_stats.units_loaned, 0) as units_loaned
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        JOIN publishers p ON b.id_publisher = p.id_publisher
        LEFT JOIN (
            SELECT id_book, COUNT(*) as units_loaned
            FROM loans 
            WHERE returned = 0 AND state = 1
            GROUP BY id_book
        ) loan_stats ON b.id_book = loan_stats.id_book
        WHERE b.state = 1`;

  dbConn.query(loanQuery, [id], (err, loans) => {
    if (err || loans.length === 0) {
      req.flash("error", "Préstamo no encontrado");
      return res.redirect("/loans");
    }

    const loan = loans[0];

    dbConn.query(usersQuery, (err, users) => {
      if (err) {
        req.flash("error", "Error al cargar usuarios");
        return res.redirect("/loans");
      }

      dbConn.query(booksQuery, (err, books) => {
        if (err) {
          req.flash("error", "Error al cargar libros");
          return res.redirect("/loans");
        }

        res.render("loans/edit", {
          ...loan,
          users,
          books,
          messages: {},
        });
      });
    });
  });
});

// Actualizar préstamo - Solo permite editar la fecha de préstamo
router.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const { loan_date } = req.body;

  // Validate loan_date
  if (!loan_date) {
    req.flash("error", "La fecha de préstamo es requerida");
    return res.redirect(`/loans/edit/${id}`);
  }

  // Get current loan data to verify it exists and for error handling
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

    // Only update the loan_date
    const updateData = {
      loan_date: loan_date,
    };

    dbConn.query(
      "UPDATE loans SET ? WHERE id_loan = ?",
      [updateData, id],
      (err) => {
        if (err) {
          req.flash(
            "error",
            "Error al actualizar la fecha del préstamo: " + err.message
          );
          return res.redirect(`/loans/edit/${id}`);
        }

        req.flash(
          "success",
          `Fecha de préstamo actualizada correctamente para "${loan.user_name}" - "${loan.book_name}"`
        );
        res.redirect("/loans");
      }
    );
  });
}); // Eliminar préstamo (soft delete)
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

  // First get the current loan details including book stock
  dbConn.query(
    `SELECT l.*, b.stock as book_stock, b.name as book_name, u.name as user_name 
         FROM loans l 
         JOIN books b ON l.id_book = b.id_book 
         JOIN users u ON l.id_user = u.id_user 
         WHERE l.id_loan = ? AND l.state = 1`,
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

      // Check if book has stock (should be at least 1 since this book is currently loaned)
      if (currentLoan.book_stock < 1) {
        req.flash(
          "error",
          `No hay stock disponible para el libro "${currentLoan.book_name}"`
        );
        return res.redirect("/loans");
      }

      // Start a transaction to ensure data consistency
      dbConn.beginTransaction((err) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/loans");
        }

        // 1. Mark current loan as returned (this will restore stock via the return route logic)
        const updateCurrentLoan = {
          returned: 1,
          returned_at: new Date(),
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

            // 2. Restore stock (add 1 to current stock)
            dbConn.query(
              "UPDATE books SET stock = stock + 1 WHERE id_book = ?",
              [currentLoan.id_book],
              (err) => {
                if (err) {
                  return dbConn.rollback(() => {
                    req.flash("error", err.message);
                    res.redirect("/loans");
                  });
                }

                // 3. Create new loan with same book and user
                const newLoan = {
                  id_user: currentLoan.id_user,
                  id_book: currentLoan.id_book,
                  loan_date: new Date(),
                  // Set return_due to 15 days from now by default
                  return_due: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                  returned: 0,
                  state: 1,
                };

                dbConn.query("INSERT INTO loans SET ?", newLoan, (err) => {
                  if (err) {
                    return dbConn.rollback(() => {
                      req.flash("error", err.message);
                      res.redirect("/loans");
                    });
                  }

                  // 4. Reduce stock again for the new loan
                  dbConn.query(
                    "UPDATE books SET stock = stock - 1 WHERE id_book = ?",
                    [currentLoan.id_book],
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
                        req.flash(
                          "success",
                          `Préstamo continuado correctamente para "${currentLoan.user_name}" con el libro "${currentLoan.book_name}"`
                        );
                        res.redirect("/loans");
                      });
                    }
                  );
                });
              }
            );
          }
        );
      });
    }
  );
});

// Devolver libro (marcar como devuelto)
router.get("/return/:id", (req, res) => {
  const id = req.params.id;

  // Obtener información del préstamo para restaurar stock
  dbConn.query(
    "SELECT id_book FROM loans WHERE id_loan = ? AND state = 1 AND returned = 0",
    [id],
    (err, loans) => {
      if (err) {
        req.flash(
          "error",
          "Error al obtener información del préstamo: " + err.message
        );
        return res.redirect("/loans");
      }

      if (loans.length === 0) {
        req.flash("error", "El préstamo no existe o ya ha sido devuelto");
        return res.redirect("/loans");
      }

      const bookId = loans[0].id_book;

      // Iniciar transacción para garantizar consistencia
      dbConn.beginTransaction((err) => {
        if (err) {
          req.flash("error", "Error al iniciar transacción: " + err.message);
          return res.redirect("/loans");
        }

        // 1. Marcar préstamo como devuelto
        const returnData = {
          returned: 1,
          returned_at: new Date(),
        };

        dbConn.query(
          "UPDATE loans SET ? WHERE id_loan = ? AND state = 1 AND returned = 0",
          [returnData, id],
          (err, result) => {
            if (err) {
              return dbConn.rollback(() => {
                req.flash(
                  "error",
                  "Error al procesar la devolución: " + err.message
                );
                res.redirect("/loans");
              });
            }

            if (result.affectedRows === 0) {
              return dbConn.rollback(() => {
                req.flash(
                  "error",
                  "El préstamo no existe o ya ha sido devuelto"
                );
                res.redirect("/loans");
              });
            }

            // 2. Restaurar stock del libro en 1 unidad
            dbConn.query(
              "UPDATE books SET stock = stock + 1 WHERE id_book = ?",
              [bookId],
              (err) => {
                if (err) {
                  return dbConn.rollback(() => {
                    req.flash(
                      "error",
                      "Error al restaurar stock: " + err.message
                    );
                    res.redirect("/loans");
                  });
                }

                // Confirmar transacción
                dbConn.commit((err) => {
                  if (err) {
                    return dbConn.rollback(() => {
                      req.flash(
                        "error",
                        "Error al confirmar transacción: " + err.message
                      );
                      res.redirect("/loans");
                    });
                  }

                  req.flash(
                    "success",
                    "Libro devuelto correctamente. Stock restaurado."
                  );
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

// API route to get book statistics (stock and loaned units)
router.get("/stats/:id", (req, res) => {
  const bookId = req.params.id;

  // Get book information with stock and loaned units count
  const query = `
        SELECT 
            b.id_book,
            b.name as book_name,
            b.stock,
            a.name as author_name,
            COALESCE(loan_stats.units_loaned, 0) as units_loaned,
            (b.stock + COALESCE(loan_stats.units_loaned, 0)) as total_units
        FROM books b
        JOIN authors a ON b.id_author = a.id_author
        LEFT JOIN (
            SELECT 
                id_book, 
                COUNT(*) as units_loaned
            FROM loans 
            WHERE returned = 0 AND state = 1 AND id_book = ?
            GROUP BY id_book
        ) loan_stats ON b.id_book = loan_stats.id_book
        WHERE b.id_book = ? AND b.state = 1
    `;

  dbConn.query(query, [bookId, bookId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas del libro",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Libro no encontrado",
      });
    }

    const bookStats = result[0];

    // Calculate availability status
    let availability_status = "";
    let availability_class = "";

    if (bookStats.stock > 3) {
      availability_status = "Disponible";
      availability_class = "success";
    } else if (bookStats.stock > 0) {
      availability_status = "Pocas unidades";
      availability_class = "warning";
    } else {
      availability_status = "Sin stock";
      availability_class = "danger";
    }

    res.json({
      success: true,
      data: {
        id_book: bookStats.id_book,
        book_name: bookStats.book_name,
        author_name: bookStats.author_name,
        stock: bookStats.stock,
        units_loaned: bookStats.units_loaned,
        total_units: bookStats.total_units,
        availability_status: availability_status,
        availability_class: availability_class,
      },
    });
  });
});

module.exports = router;

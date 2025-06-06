const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const flash = require("express-flash");
const session = require("express-session");
const mysql = require("mysql");
const connection = require("./lib/db");

// Importar middleware de autenticación
const {
  requireAuth,
  requireAdminOrLibrarian,
  requireAdmin,
} = require("./middleware/auth");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const authorsRouter = require("./routes/authors");
const categoriesRouter = require("./routes/categories");
const publishersRouter = require("./routes/publishers");
const loansRouter = require("./routes/loans");
const dashboardRouter = require("./routes/dashboard");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    cookie: { maxAge: 60000 * 60 }, // 1 hora
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: "true",
    secret: "secret",
  })
);

app.use(flash());

// Middleware para hacer disponible la información del usuario en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rutas públicas
app.use("/", indexRouter);
app.use("/auth", authRouter);

// Rutas protegidas
app.use("/dashboard", requireAuth, dashboardRouter);
app.use("/books", requireAuth, booksRouter);
app.use("/authors", requireAuth, requireAdminOrLibrarian, authorsRouter);
app.use("/categories", requireAuth, requireAdminOrLibrarian, categoriesRouter);
app.use("/publishers", requireAuth, requireAdminOrLibrarian, publishersRouter);
app.use("/loans", requireAuth, loansRouter);
app.use("/users", requireAuth, requireAdmin, usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

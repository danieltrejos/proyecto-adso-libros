// Middleware para verificar si el usuario está autenticado
function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Debes iniciar sesión para acceder");
    return res.redirect("/auth/login");
  }
  next();
}

// Middleware para verificar roles específicos
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash("error", "Debes iniciar sesión para acceder");
      return res.redirect("/auth/login");
    }

    if (!roles.includes(req.session.user.role_name)) {
      req.flash("error", "No tienes permisos para acceder a esta sección");
      return res.redirect("/dashboard");
    }

    next();
  };
}

// Middleware para verificar si es admin
function requireAdmin(req, res, next) {
  return requireRole(["ADMIN"])(req, res, next);
}

// Middleware para verificar si es admin o bibliotecario
function requireAdminOrLibrarian(req, res, next) {
  return requireRole(["ADMIN", "LIBRARIAN"])(req, res, next);
}

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  requireAdminOrLibrarian
};

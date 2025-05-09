var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "proyectoadso",
});
connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Conectado! Da click aqui ---> http://localhost:3000/");
  }
});

module.exports = connection;

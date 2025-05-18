var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_books",
});
connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Conectado! Da click aqui ---> http://localhost:3002/");
  }
});

module.exports = connection;

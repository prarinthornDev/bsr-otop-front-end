const mysql = require("mysql");

/* exports.connections = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project-otop",
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log("connected database!");
  });
  return connection;
}; */

exports.connection = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project-otop",
  })
  .connect((err) => {
    if (err) throw err;
    console.log("connected database!");
  });

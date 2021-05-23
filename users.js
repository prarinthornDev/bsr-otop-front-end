const bcrypt = require("bcrypt");

const connection = require('./connectDB')
//------------Connect DB mySQL----------------//

 

exports.signUp = (username, passwordNonHash) => {
  const password = bcrypt.hashSync(passwordNonHash , 8);
  connection.query(
    `SELECT username FROM users WHERE  username="${username}"`,
    (err, row) => {
      if (err) throw err;
      if (row.length === 0) {
        connection.query(
          `INSERT INTO users(username, password) VALUES ("${username}","${password}")`,
          (err) => {
            if (err) throw err;
            return "ลงทะเบียนเสร็จสิ้น";
          }
        );
      } else {
        return "มีชื่อผู้ใช้นี้แล้ว";
      }
    }
  );
}

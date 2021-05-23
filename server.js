/* const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan'); */

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

//--------------test--------------------
var http = require("http");
var bodyParser = require("body-parser");
var helmet = require("helmet");

//--------------test--------------------

const mysql = require("mysql");
const bcrypt = require("bcrypt");

//-----------Uploadimage---------
const path = require("path");
const multer = require("multer");
var upload = multer({ dest: "uploads/" });

var formidable = require("formidable");

//--------APP USE ===================

const app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(express.json());
app.use(cors());

//------------Connect DB mySQL----------------//
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "otop",
});
connection.connect((err) => {
  if (err) throw err;
  console.log("connected database!");
});
//---------------Upload Image----------
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

app.get("/img/:id", (req, res) => {
  if(req.params.id === "undefined"){
    let p = path.join(__dirname, "/uploads/null-symbol.png");
    res.sendFile(p); 
  }else{
    let param = req.params.id;
    let p = path.join(__dirname, "/uploads/", param);
    res.sendFile(p);
  }
});

var datetime = new Date();

app.post("/uploadImg", function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.myImage;
  uploadPath = __dirname + "/uploads/" + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    console.log(uploadPath);
    console.log(sampleFile.name);
    res.send(sampleFile.name);
  });
});

//-----------------------------------------

app.get("/", (req, res) => {
  res.send("Hi");
  //-------------------HERE-----------------------
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const dateFomat = today.toISOString();
  const date = dateFomat.substring(0, 10);
  console.log(date);

});

//============getUsername--------------NEW// 
app.post('/getUsernameByIDprofile' , (req,res) => {
  const id = req.body.id;
  connection.query(`SELECT username FROM users WHERE profile_id=${id}`,(err,row)=>{
    if (err) throw err;
    res.send(row);
  })
})

//--------------LOGIN--------------//
app.post("/SignInWithUsernameAndPassword", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  connection.query(
    `SELECT username, password , profile_id FROM users WHERE username = '${username}'`,
    (err, row) => {
      if (err) throw err;
      if (row.length === 0) {
        res.send("ไม่พบชื่อผู้ใช้");
      } else {
        if (password === row[0].password) {
          let username = row[0].username;
          connection.query(
            `SELECT id, img, name, old, gender, tel, address FROM profile WHERE id=${row[0].profile_id}`,
            (err, row) => {
              if (err) throw err;
              res.send({
                username: username,
                profile_id: row[0].id,

                img: row[0].img,
                name: row[0].name,
                old: row[0].old,
                gender: row[0].gender,
                tel: row[0].tel,
                address: row[0].address,
              });
            }
          );
          // สำเร็จ
        } else {
          res.send("รหัสผ่านผิด");
        }
      }
    }
  );
});
//--------------GET PROFILE------------//
app.post("/getProfileById", (req, res) => {
  const profile_id = req.body.profile_id;
  connection.query(`SELECT * FROM profile WHERE id=${profile_id}` ,
    /* `SELECT username, profile_id , profile.img , profile.name , profile.tel , profile.address , profile.link_img
        FROM users 
          INNER JOIN profile
            ON profile_id = profile.id
              WHERE profile_id='${profile_id}'`, */
    (err, row) => {
      res.send(row);
    }
  );
});

//------------REGISTER------------//
app.post("/createUserWithUsernameAndPassword", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    `SELECT username FROM users WHERE  username="${username}"`,
    (err, row) => {
      if (err) throw err;
      if (row.length === 0) {
        connection.query(
          `INSERT INTO users(username, password) VALUES ("${username}","${password}")`,
          (err) => {
            if (err) throw err;
            res.send("ลงทะเบียนเสร็จสิ้น");
          }
        );
      } else {
        res.send("มีชื่อผู้ใช้นี้แล้ว");
      }
    }
  );
});
//-------------------ADD Product-------------------
app.post("/createProduct", (req, res) => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const dateFomat = today.toISOString();
  const date = dateFomat.substring(0, 10);


  const img1 = req.body.img1;
  const img2 = req.body.img2;
  const img3 = req.body.img3;
  const img4 = req.body.img4;

  const title = req.body.title;
  const detail = req.body.detail;
  const price = req.body.price;
  const type = req.body.type;

  const id_profile = req.body.id_profile;
  const date_update = date;

/* INSERT INTO `product`(`id`, `img1`, `img2`, `img3`, `img4`, `title`, `detail`, `price`, `type`, `id_profile`, `date_update`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7],[value-8],[value-9],[value-10],[value-11]) */
  connection.query(
    `INSERT INTO product(img1, img2, img3, img4 , title, detail , price, type, id_profile, date_update)
     VALUES ("${img1}","${img2}","${img3}","${img4}","${title}","${detail}","${price}","${type}","${id_profile}","${date_update}")`,
    (err, row) => {
      if (err) throw err;
      res.send(row);
    }
  );
});

//-----------------------EDIT Product----------------
app.post("/setProduct", (req, res) => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const dateFomat = today.toISOString();
  const date = dateFomat.substring(0, 10);

  const id = req.body.id;
  const img1 = req.body.img1;
  const img2 = req.body.img2;
  const img3 = req.body.img3;
  const img4 = req.body.img4;
  const title = req.body.title;
  const detail = req.body.detail;
  const price = req.body.price;
  const type = req.body.type;

  const date_update = date;

  connection.query(
    `UPDATE product SET img1="${img1}",img2="${img2}",img3="${img3}",img4="${img4}",title="${title}",detail="${detail}",price="${price}",type="${type}", date_update="${date_update}" WHERE id="${id}"`,
    (err, row) => { 
      if (err) throw err;
        res.sendStatus(200);
     }
  );
});

//--------------------GET Product ALL ------------------
app.get("/getProductAll", (req, res) => {
  connection.query(`SELECT * FROM product`, (err, row) => {
    if (err) throw err;
    res.send(row);
  });
});

//----------------------GET Product By ID -----------------
app.post('/getProductByID' , (req,res) => {
  const id  =  req.body.id;

  /* SELECT profile.name , profile.address ,  profile.tel  , product.id, product.img1, product.img2, product.img3, product.img4, product.title, product.detail, product.price, product.type, product.date_update
FROM product 
INNER JOIN profile 
ON  product.id_profile  = profile.id
WHERE product.id=${id}




 */
  connection.query(`SELECT profile.name , profile.address ,  profile.tel  , product.id, product.img1, product.img2, product.img3, product.img4, product.title, product.detail, product.price, product.type, product.date_update
  FROM product 
  INNER JOIN profile 
  ON  product.id_profile  = profile.id
  WHERE product.id=${id}` , (err,row)=>{
    if (err) throw err ; 
    res.send(row);
    //HERE
  })
});

//-----------------------GET Product By Type ---------------
app.post("/getProductByTypeID" , (req,res)=>{
  const type = req.body.type;
  connection.query(`SELECT * FROM product WHERE type=${type}` , (err,row)=>{
    if (err) throw err ; 
    res.send(row);
  })
});

//--------------------GET Product By ID_Profile-------------
app.post("/getProductByIdProfile", (req, res) => {
  const id_profile = req.body.id_profile;
  console.log(id_profile);
  connection.query(
    `SELECT * FROM product WHERE id_profile=${id_profile}`,
    (err, row) => {
      if (err) throw err;
      res.send(row);
    }
  );
});

//------------------------DELETE Product-------------------
app.post("/deleteByID" , (req,res) => {
  const id = req.body.id;
  connection.query(`DELETE FROM product WHERE id=${id}` , (err,row) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

//------------------- SET PROFILE------------------
app.post("/setProfile", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const old = req.body.old;
  const gender = req.body.gender;
  const tel = req.body.tel;
  const address = req.body.address;
  const img = req.body.img;

  connection.query(
    `SELECT username FROM users WHERE  username="${username}"`,
    (err, row) => {
      if (err) throw err;
      if (row.length === 0) {
        res.send("ไม่พบชื่อผู้ใช้ในระบบ");
      } else {
        connection.query(
          `SELECT profile_id FROM users WHERE username="${username}"`,
          (err, row) => {
            // res.send(`${row[0].profile_id}`);
            let id = `${row[0].profile_id}`;
            if (id == "null") {
              //res.send('ID null');
              connection.query(
                `INSERT INTO profile( img, name, old, gender, tel, address) VALUES ("${img}" ,"${name}" ,"${old}" ,"${gender}" , "${tel}" ,"${address}")`,
                (err, row, result) => {
                  if (err) throw err;
                  //res.send(`${row["insertId"]}`);
                  connection.query(
                    `UPDATE users SET profile_id = ${row["insertId"]} WHERE username="${username}"`,
                    (err, row) => {
                      if (err) throw err;
                      //res.send(`${row["insertId"]}`);
                      connection.query(
                        `SELECT username, profile_id , profile.img , profile.name , profile.old , profile.gender , profile.tel , profile.address 
                          FROM users 
                            INNER JOIN profile
                              ON profile_id = profile.id
                                WHERE username='${username}'`,
                        (err, row) => {
                          res.send(row);
                        }
                      );
                    }
                  );
                }
              );
            } else {
              //res.send('ID Not null');
              connection.query(
                `UPDATE profile SET img="${img}" , name="${name}" , old="${old}" , gender="${gender}" , tel="${tel}" , address="${address}" WHERE id=${id}`,
                (err, row) => {
                  if (err) throw err;
                  connection.query(
                    `SELECT username, profile_id , profile.img , profile.name , profile.old , profile.gender , profile.tel , profile.address
                FROM users 
                INNER JOIN profile
                ON profile_id = profile.id
                WHERE username='${username}'`,
                    (err, row) => {
                      res.send(row);
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
});

//-----------
app.listen(5001, () => {
  console.log(`Server start on port: 5001`);
});

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const conn = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

// User Registrasi
app.post('/user/register' , (req , res)=>{
    let data = {
        username: req.body.username,
        namalengkap: req.body.namalengkap, 
        email: req.body.email, 
        password: req.body.password,
        status : 'Belum vaksinasi'
    };
    let sql = "INSERT INTO user SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) {
        res.json({'error' : true, 'msg' : 'Gagal registrasi'});
      }else{
        res.json({'error' : false, 'msg' : 'Berhasil registrasi'});
      }
    });
});

// User Login
app.post('/user/login' , (req , res)=>{
    let sql = "SELECT * FROM user WHERE username='"+req.body.username+"' AND password="+req.body.password;
    let query = conn.query(sql, (err, results) => {
        if(err) {
            res.json({'error' : true, 'msg' : 'Gagal Login'});
        }else{
            res.json({'error' : false, 'msg' : 'Berhasil Login'});
        }
    });
});

// Get Data vaksinasi 
app.get('/vaksinasi',(req, res) => {
    let sql = "SELECT * FROM vaksinasi";
    let query = conn.query(sql, (err, results) => {
      res.json(results);
    });
  });

//  Add Detail vaksinasi
app.post('/vaksinasi/add' , (req , res)=>{
    var id = Math.random().toString(36).substr(2, 20);
    let data = {
        id: id,
        username: req.body.username, 
        rumahsakit: req.body.rumahsakit
    };
    let sql = "INSERT INTO vaksinasi SET ?";
    let query = conn.query(sql, data,(err, results) => {
        if(err) {
            res.json({'error' : true, 'msg' : 'Gagal terinput'});
        }else{
            res.json({'error' : false, 'msg' : 'Berhasil terinput'});
            // Update status vaksinasi
            let sqlUpdate = "UPDATE user SET status= 'Sudah vaksinasi' WHERE username='"+req.body.username+"'" ;
            let queryUpdate = conn.query(sqlUpdate);
        }
    });
});

const PORT = process.env.APP_PORT;
app.listen(PORT,()=>{
    console.log(`Server berjalan di http://localhost:${PORT}`)
});

module.exports = conn
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
        nama_lengkap: req.body.nama_lengkap, 
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

const PORT = process.env.APP_PORT;
app.listen(PORT,()=>{
    console.log(`Server berjalan di http://localhost:${PORT}`)
});

module.exports = conn
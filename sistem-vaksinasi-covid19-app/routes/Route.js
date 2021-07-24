const router = require('express').Router();
const axios = require('axios');
const mysql = require('mysql');
const session = require('express-session');
require('dotenv').config();

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

router.use(session({
	secret: process.env.SCRET_KEY,
	resave: true,
	saveUninitialized: true
}));

router.get('/', (req, res) => {
    const getDataCovid = () => {
        return axios.get('https://dekontaminasi.com/api/id/covid19/hospitals').then((response) => {
            res.render('index',{
                data : response.data
            })
        }).catch((error)=>{
            res.render('index',{
                error : error.message
            })
        })
    }
    getDataCovid();
});

router.get('/login', (req, res) => {
    req.session.destroy();
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/dashboard',(req, res) => {
    const getDataCovid = () => {
        return axios.get('https://dekontaminasi.com/api/id/covid19/hospitals').then((response) => {
            if (req.session.login != 'sukses') {
                res.redirect('/login');
            } else {
                res.render('dashboard',{
                    data : req.session.data[0],
                    rs : response.data
                });
            }
        }).catch((error) => {
            res.render('dashboard');
        })
    }
    getDataCovid();
   
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/user/register', (req, res) => {
    let data = {
        nik : req.body.nik,
        username: req.body.username,
        namalengkap: req.body.namalengkap, 
        email: req.body.email, 
        password: req.body.password,
        status : ''
    };
    let sql = "INSERT INTO user SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) {
        res.render('register',{
            msg : 'Gagal registrasi'
        })
      }else{
        res.redirect('/login');
      }
    });
});

router.post('/user/login', (req, res) => {
    let sql = "SELECT * FROM user WHERE nik='"+req.body.nik+"' AND password="+req.body.password;
    let query = conn.query(sql, (err, results) => {
        if(err) {
            res.render('login',{
                msg : 'Gagal login'
            })
        }else{
            if (results == '') {
                res.render('login',{
                    msg : 'Username dan password salah'
                })
            }else{
                req.session.login = 'sukses';
                req.session.data = results;
                res.redirect('/dashboard');
            }
        }
    });
});

router.post('/vaksinasi/add' , (req , res)=>{
    var id = Math.random().toString(36).substr(2, 20);
    let data = {
        id: id,
        nik: req.body.nik, 
        rumahsakit: req.body.rumahsakit
    };
    let cekNik = "SELECT * FROM user WHERE nik='"+req.body.nik+"'";
    let queryCekNik = conn.query(cekNik, (err, results) =>{
        if (results == '') {
            req.session.msg = 'Gagal terinput';
        } else {
            let sql = "INSERT INTO vaksinasi SET ?";
            let query = conn.query(sql, data,(err, results) => {
                if(err) {
                    req.session.msg = 'Gagal terinput';
                }else{
                    // Update status vaksinasi
                    let sqlUpdate = "UPDATE user SET status= 'Sudah vaksinasi' WHERE nik='"+req.body.nik+"'" ;
                    let queryUpdate = conn.query(sqlUpdate);
                    res.redirect('/dashboard');
                }
            });
        }
    });
});

module.exports  = router
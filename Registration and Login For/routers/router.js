const {Router} = require('express')
const router = Router()
const path = require('path')
const mysql = require('mysql')
const dotenv = require('dotenv')
const session = require('express-session')
const {v4:uuidv4} = require('uuid')

dotenv.config({path:'./.env'})

/// Session
router.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}))

/// CONNECTION MySQL
var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.PORT,
    database:process.env.DATABASE
 });
 connection.connect((error)=>{
    if(error){
        console.log('Error')
    }else{
        console.log('Database Connected...')
    }
})

// Router

router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',(req,res)=>{
    let query = 'SELECT * FROM users'
    connection.query(query, 
    function (error, rows, fields) {
      //var str='';
      for (var i = 0;i < rows.length; i++) {
        //str = str + rows[i].username;
        if(req.body.username == rows[i].username && req.body.password == rows[i].password){
            res.render('dashboard',{username:username,email:email})
            console.log(rows[i].username)
        }
        //res.end(str);
      }
      connection.end(); 
    }); 
})
router.post('/register',(req,res)=>{
    let fullname = req.body.fullname
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    let query = `INSERT INTO users (fullname,username,email,password) VALUES ('${fullname}','${username}','${email}','${password}')`
    if(req.body.password === req.body.confirm){
            connection.query(query,((err,result)=>{
            res.render('dashboard',{username:username,email:email})
            console.log('Equal')
         }))
        }else{
            pass_alert = req.body.pass_alert
            pass_alert = "“⚠” Password Isn't Correct"
            res.render('register',{pass_alert:pass_alert})
        }
        })
router.get('/dashboard',(req,res)=>{
        //let Username = 
        let email = req.body.email
        req.session.username = req.body.username
        if(req.session.username){
            res.render('./../views/dashboard',{username:req.session.username,email:req.body.email})
        }
})
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log('Destroied')
        }else{
            res.render('./../views/login',{logout:'Logout Successful !',userCase:true});
        }
    });
})
module.exports = router

const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const session = require('express-session')
const {v4:uuidv4} = require('uuid')

dotenv.config({path:'./.env'})

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')
app.use('/static',express.static(path.join(__dirname,'src')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:false
}))

app.use('/route',require('./routers/router'))
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}))

app.get('/',(req,res)=>{
    res.render('register')
})
    
app.listen(4000)
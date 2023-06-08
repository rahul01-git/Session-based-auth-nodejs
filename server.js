// import 
const express = require('express')
const helmet = require('helmet')
const session = require("express-session")
const authRoutes = require('./routes/auth.routes')
const todoRoutes = require('./routes/todo.routes')
const getConnection = require('./config/db')

//init
const app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(session({
    name: 'Auth Session Class',
    resave: false,
    secret: 'this-is-very-secret',
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        // secure: true, //for https only,
    }
}))
const conn = getConnection();

//middleware
app.use("/",(req,res,next)=>{
    req.conn = conn;
    next();
})

// routes  
app.use('/',authRoutes)
app.use('/todo',todoRoutes)

//servers spinning
app.listen(8000, () => {
    console.log("server has been started at 8000");
})
const express = require('express');
const { reset } = require('nodemon');
const { route } = require('./auth.routes');
const router = express.Router();

router.get("/", (req, res) => {
    if(!req.session.isUserLoggedIn){
        return res.redirect("/login")
    }
    req.conn.query('select * from todos', (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("error occured at todo get request")
        }
        res.render('todo', { todos: result.rows,username: req.session.username })
    })
})

router.post('/', (req, res) => {
    if(!req.session.isUserLoggedIn){
        return res.redirect("/login")
    }
    req.conn.query("insert into todos (title) values ($1)", [req.body.todo], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("error occured at todo post request")
        }
    })
    res.redirect('/todo')
})
router.get('/delete-todo', (req, res) => {
    if(!req.session.isUserLoggedIn){
        return res.redirect("/login")
    }
    const id = parseInt(req.query.id);
    req.conn.query("delete from todos where id=$1", [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("error occured at todo delete request")
        }
    })
    res.redirect('/todo')
})

router.get('/edit-todo',(req,res)=>{
    if(!req.session.isUserLoggedIn){
        return res.redirect("/login")
    }
    const id =  parseInt(req.query.id)
    req.conn.query('select * from todos where id = $1',[id],(error,result)=>{
        if(error){
            console.log(error)
            res.status(500).send("error occured at todo edit get request")
        }
        res.render('edit',{todo:result.rows[0]})
    })
})
router.post('/update-todo',(req,res)=>{
    if(!req.session.isUserLoggedIn){
        return res.redirect("/login")
    }
    const {id, todo} = req.body;
    req.conn.query('update todos set title=$1 where id=$2',[todo,id],(error,result)=>{
        console.log(result.rows[0])
        if(error){
            console.log(error)
            res.status(500).send('error occured at todo update post request')
        }
    })
    res.redirect('/todo')
})
module.exports = router;
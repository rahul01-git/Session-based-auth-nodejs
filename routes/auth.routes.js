const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')


router.get('/', (req, res) => {
    console.log(req.conn)
    res.render('index')
})

router.get("/login", (req, res) => {
    if (req.session.isUserLoggedIn) {
        return res.redirect('/todo')
    }
    res.render('login', { error: '' })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await new Promise((resolve, reject) => {
            req.conn.query("SELECT * FROM users WHERE email = $1", [email], (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.rows.length === 0) {
            return res.render('login', { error: 'Invalid email' });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.isUserLoggedIn = true;
            req.session.username= user.username;
            return res.redirect('/todo');
        } else {
            return res.render('login', { error: 'Invalid password' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred at login post request');
    }
});

router.get("/register", (req, res) => {
    if (req.session.isUserLoggedIn) {
        return res.redirect('/todo')
    }
    res.render('register')
})
router.post('/register', async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        req.conn.query("insert into users (username,email,password) values ($1,$2,$3)", [req.body.username, req.body.email, hashedPass], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send("error occured at register post request")
            }
        })
    } catch (error) {
        res.send(error)
    }
    res.redirect('/login')
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect("/login")
})


module.exports = router;
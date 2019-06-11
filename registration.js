const express = require('express');
const router = express.Router();
const path = require('path')
const mysql = require('mysql');
var bcrypt = require('bcrypt');

const proxima = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7295206',
    password: 'uDQL4RIWiS',
    database: 'sql7295206',
    port: '3306'
})


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/web/registration.html'))
});

router.post('/register', (req, res) => {
    console.log(req.body);
    req.checkBody('firstName', 'First Name cannot be empty').notEmpty();
    req.checkBody('lastName', 'Last Name cannot be empty').notEmpty();
    req.checkBody('email', 'Email cannot be empty').notEmpty();
    req.checkBody('email', 'email is invalid').isEmail();
    req.checkBody('userName', 'User Name cannot be empty').notEmpty();
    //req.checkBody('userName', 'Username must be between 4-15 characters long').len(4, 15);
    req.checkBody('password', 'Password cannot be empty').notEmpty();
    //req.checkBody('password', 'Password must be 8 long').len(8, 100);
    //req.checkBody('password', 'password must include one lowerCase ,one upperCase, a number and a special character ').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    const errors = req.validationErrors();
    if (errors) {
        console.log(errors)
        res.redirect('/register');
    } else {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userName = req.body.userName;
        const email = req.body.email;
        const password = req.body.password;
        const faction = req.body.faction;
        bcrypt.hash(password, 10, (err, hash) => {

            let q = 'call newPlayer(?,?,?,?,?,?)'
            proxima.query(q, [firstName, lastName, userName, email, hash,faction], (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect('/');
                }
            })
        })

    }


})

module.exports = router;

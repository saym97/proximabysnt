const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const app = express();

//ROuter files for login,registration and Game
const login = require('./login');
const registration = require('./registration');
const game = require('./proxima');

var bcrypt = require('bcrypt');
var session = require('express-session');
var mySqlSession = require('express-mysql-session')(session);
var passport = require('passport');
var strategy = require('passport-local').Strategy;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('web'))

var connection = {
    host: 'sql7.freesqldatabase.com',
    user: 'sql7295206',
    password: 'uDQL4RIWiS',
    database: 'sql7295206'
}
var sessionStore = new mySqlSession(connection);
app.use(session({
    secret: 'v19dZdNta4W7zU4lBlF5',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    //secure: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/', login)
app.use('/register', registration)
app.use('/proxima', game);

const proxima = mysql.createConnection({
host: 'sql7.freesqldatabase.com',
    user: 'sql7295206',
    password: 'uDQL4RIWiS',
    database: 'sql7295206'
});

passport.use(new strategy(
    function (username, password, res) {
        console.log(username, password)
        let q = 'select player_id ,faction_id,password from login where username = ?';
        proxima.query(q, [username], (err, result) => {
            if (err) {
                res(err);
            }
            if (result.length === 0) {
                res(null, false)
            } else {
                const hash = result[0].password.toString();
                console.log(hash);
                bcrypt.compare(password, hash, (req, result2) => {
                    if (result2 === true) {
                        res(null, { player_id: result[0].player_id, faction_id : result[0].faction_id })
                    } else {
                        res(null, false)
                    }
                })
            }
        })
    }
))

proxima.connect((err) => {
    if (err) throw err;
    console.log("Connected to proxima");
});

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log('listening on port', port) });

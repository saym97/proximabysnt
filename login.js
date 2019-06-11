const express = require('express');
const router = express.Router();
var path = require('path')
//const session = require('express-session');
const passport = require('passport');
router.post('/login', passport.authenticate(
    'local', {
        successRedirect: '/proxima',
        failureRedirect: '/'
    })
);
router.get('/logout', (req, res) => {
    //res.send(req.session.passport);
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
})

passport.serializeUser(function (username, done) {
    done(null, username);
});

passport.deserializeUser(function (username, done) {
    done(null, username);
});


module.exports = router;

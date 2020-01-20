var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/users');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'HarryPotter'

module.exports = function (app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }))

    passport.serializeUser(function (user, done) {
        if (user.active) {
            token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
        } else {
            token = 'inactive/error'
        }

        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: '911844129216991',
        clientSecret: '809db3b3ebc7e3abb4c5600d0be36e7f',
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile._json.email);
            User.findOne({ email: profile._json.email }).select('username active password email').exec(function (err, user) {
                if (err) done(err);

                if (user && user !== null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });
            // done(null, profile);
        }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/#!/facebookerror' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/#!/facebook/' + token);
        });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    return passport;
}


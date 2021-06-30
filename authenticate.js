const passport = require('passport');// supports sessions and tokens
const LocalStrategy = require('passport-local').Strategy;// will require a callback function
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;// tokens
const ExtractJwt = require('passport-jwt').ExtractJwt;// where to find token
const jwt = require('jsonwebtoken');

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));// mongoose has this 
passport.serializeUser(User.serializeUser());// data to store
passport.deserializeUser(User.deserializeUser());//grabbing data to add to request

exports.getToken = user => {// name, secretkey, token time of
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

const opts = {};// VV send us an auth header and a bearer token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});//verfiyUser to use tokens not sessions
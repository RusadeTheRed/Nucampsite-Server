const passport = require('passport');// supports sessions and tokens
const LocalStrategy = require('passport-local').Strategy;// will require a callback function
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;// tokens
const ExtractJwt = require('passport-jwt').ExtractJwt;// where to find token
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require('passport-facebook-token')

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

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    } else {
        err = new Error('You are not authorized to perform this action!');
        err.status = 403;
        return next(err);
    }
};

exports.verifyUser = passport.authenticate('jwt', {session: false});//verfiyUser to use tokens not sessions

exports.facebookPassport = passport.use(
    new FacebookTokenStrategy(
        {
            clientID: config.facebook.clientId,
            clientSecret: config.facebook.clientSecret
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({facebookId: profile.id}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (!err && user) {
                    return done(null, user);
                } else {
                    user = new User({ username: profile.displayName });
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        }
    )
)
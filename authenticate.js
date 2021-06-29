const passport = require('passport');// supports sessions and tokens
const LocalStrategy = require('passport-local').Strategy;// will require a callback function
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));// mongoose has this 
passport.serializeUser(User.serializeUser());// data to store
passport.deserializeUser(User.deserializeUser());//grabbing data to add to request
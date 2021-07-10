const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { populate } = require('../models/favorite');
const Campsite = require('../models/campsite');
const e = require('express');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favorite.find( { user: req.user._id } )
    .populate('user')
    .populate('campsites')
	.then(favorites => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorites);
	})
	.catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(favored => {
            if  (!favorite.campsites.includes(favored._id)) {
                    favorite.campsites.push(favored._id)
                }
            })
            favorite.save()
        } else {
            Favorite.create({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(favored => {
                    if  (!favorite.campsites.includes(favored._id)) {
                            favorite.campsites.push(favored._id)
                        }
                    })
                console.log('Favorite Created', favorite);
                }
                favorite.save()
            })
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /Favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorite.findOneAndDelete({ user: req.user._id })
	.then(favorite => {
		res.statusCode = 200;
        if (favorite) {
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.')
        }
	
	})
	.catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
	res.statusCode = 403;
	res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
    .then( favorite => {
        if (favorite) {
            if (favorite.campsites.includes(req.params.campsiteId)) {
                res.end('That campsite is already in the list of favorites!')
            } else {
                favorite.campsites.push(req.params.campsiteId)
                favorite.save()
            }
        } else {
            Favorite.create({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(favored => {
                    if  (!favorite.campsites.includes(favored._id)) {
                            favorite.campsites.push(favored)
                        }
                    })
                console.log('Favorite Created', campsite);
               
                }
                favorite.save()
            })
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
	res.statusCode = 403;
	res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then( favorite => {
        if (favorite) {
            favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1)
            favorite.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('There are no favorites to delete.')
        }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;
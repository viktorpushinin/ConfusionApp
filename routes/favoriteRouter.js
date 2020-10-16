const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    AddRemoveFavorite(req, res, next);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supperted on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.body = [{_id: req.params.dishId}];
    AddRemoveFavorite(req, res, next);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supperted on /favorites/' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: req.user._id})
    .then((favsArr) => {
        if (favsArr) {
            let favs = favsArr[0];

            for (var dishIdx = (favs.dishes.length - 1); dishIdx >= 0; dishIdx--) {
                if (favs.dishes[dishIdx].equals(req.params.dishId)) {
                    favs.dishes.splice(dishIdx, 1);
                    break;
                }
            }

            favs.save()
            .then((favs) => {
                Favorites.findById(favs._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(new Array(favorite));
                })
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

function AddRemoveFavorite(req, res, next) {
    Favorites.find({})
    .then((allFavs) => {
        let userFavorites = null;

        if (allFavs.length !== 0) {
            userFavorites = allFavs.filter((item) => item.user.equals(req.user._id) )[0];
        }

        if (!userFavorites) {
            Favorites.create({
                user: req.user._id,
                dishes: req.body
            })
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(new Array(favorite));
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
            for (var newDishIdx = 0; newDishIdx < req.body.length; newDishIdx++) {
                let removed = false;
                for (var favDishIdx = 0; favDishIdx < userFavorites.dishes.length; favDishIdx++) {
                    if (userFavorites.dishes[favDishIdx].equals(req.body[newDishIdx]._id)) {
                        // got the existing favorite hence remove it (toggle logic)
                        userFavorites.dishes.splice(favDishIdx, 1);
                        removed = true;
                        break;
                    }
                }

                if (!removed) {
                    userFavorites.dishes.push(req.body[newDishIdx]._id);
                }
            }

            userFavorites.save()
            .then((userFavorites) => {
                Favorites.findById(userFavorites._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(new Array(favorite));
                })
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}

module.exports = favoriteRouter;

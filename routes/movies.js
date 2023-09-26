const moviesRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const link = require('../utils/constants');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(link),
      trailerLink: Joi.string().required().pattern(link),
      thumbnail: Joi.string().required().pattern(link),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
moviesRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().hex(),
    }),
  }),
  deleteMovieById,
);

module.exports = moviesRouter;

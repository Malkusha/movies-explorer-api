const Movie = require('../models/movie');
const {
  NotFoundError,
  BadRequestError,
  ServerError,
  AccessError,
} = require('../errors/index');

function getMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(() => next(new ServerError('Произошла ошибка')));
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(201).send({ data: movie });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
        return next(new ServerError(`Произошла ошибка: ${err.message}`));
    });
}

function deleteMovieById(req, res, next) {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new AccessError('Нельзя удалить карточку фильма, загруженную другим пользователем');
      }
      movie.deleteOne()
        .then(() => res.send({ message: 'Карточка фильма удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID фильма'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};

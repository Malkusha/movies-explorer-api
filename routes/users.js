const usersRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get(
  '/me',
  getCurrentUser,
);

usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

module.exports = usersRouter;

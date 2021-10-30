import Joi from 'joi';
import { Room } from 'shared-types';

export const createGameSchema = Joi.object({
  size: Joi.number().valid(Room.two, Room.three, Room.four).required(),

  name: Joi.string().alphanum().min(2).max(16).required(),

  isPublic: Joi.boolean().required(),
});

export const enterGameSchema = Joi.object({
  id: Joi.string().min(2).max(32).required(),

  name: Joi.string().alphanum().min(2).max(16).required(),
});

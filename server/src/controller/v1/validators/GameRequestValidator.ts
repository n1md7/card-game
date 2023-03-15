import Joi from 'joi';
import { Room } from 'shared-types';

export const createGameSchema = Joi.object({
  size: Joi.number().valid(Room.two, Room.three, Room.four).required(),
  points: Joi.number().valid(1, 5, 11).required(),
  maxRounds: Joi.number().valid(1, 2, 3, 4, 5, 7, 9, 12).required(),
  name: Joi.string().alphanum().min(2).max(16).required(),
  isPublic: Joi.boolean().required(),
});

export const enterGameSchema = Joi.object({
  id: Joi.string().min(2).max(32).required(),
  name: Joi.string().alphanum().min(2).max(16).required(),
});

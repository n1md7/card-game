import Card from '../game/Card';
import { CardRankName, cardRanksByName, CardSuit, cardSuitsByName } from 'shared-types';
import * as Joi from 'joi';
import SocketIO from 'socket.io';
import { ErrorType } from '../types';
import Player from '../game/Player';
import Game from '../game/Game';

type CardObject = {
  suit: CardSuit;
  rank: CardRankName;
};

type PlayerMoveObject = {
  playerCard: CardObject;
  tableCards: CardObject[];
};

const validationSchema = Joi.object({
  playerCard: Joi.object({
    suit: Joi.string()
      .valid(...Object.values(CardSuit))
      .required(),
    rank: Joi.string()
      .valid(...Object.values(CardRankName))
      .required(),
  }).required(),
  tableCards: Joi.array()
    .items(
      Joi.object({
        suit: Joi.string()
          .valid(...Object.values(CardSuit))
          .required(),
        rank: Joi.string()
          .valid(...Object.values(CardRankName))
          .required(),
      }),
    )
    .optional(),
});

export default class Events {
  private static serializeToCardObject = (cardObject: CardObject): Card => {
    const cardSuit = cardSuitsByName.get(cardObject.suit);
    const cardRank = cardObject.rank;
    const cardValue = cardRanksByName.get(cardRank);

    return new Card(cardSuit, cardRank, cardValue);
  };

  public playerMove(player: Player, io: SocketIO.Server, game: Game) {
    // {playerMoveObject} is client passed data
    return (playerMoveObject: PlayerMoveObject) => {
      if (game.isFinished || !game.isStarted) {
        return;
      }
      const validation: Joi.ValidationResult = validationSchema.validate(playerMoveObject, {
        abortEarly: false,
        allowUnknown: false, // keep prevent unknown properties to be passed
      });
      if (validation.error) {
        const [
          {
            message,
            context: { key },
          },
        ] = validation.error.details;
        io.to(player.socketId).emit('validation:error', `${key}: ${message}`);
        return;
      }

      const playerCard = Events.serializeToCardObject(playerMoveObject.playerCard);
      const tableCards = playerMoveObject.tableCards.map(Events.serializeToCardObject);
      try {
        // When table is not empty than process the request otherwise place target card from hand
        tableCards.length ? player.takeCardsFromTable(playerCard, tableCards) : player.placeCardFromHand(playerCard);
      } catch (error) {
        switch (error.name) {
          case ErrorType.gameError:
            io.to(player.socketId).emit('game:error', error.message);
            break;
          case ErrorType.jsonWebTokenError:
            io.to(player.socketId).emit('jwt:error', error.message);
            break;
          default:
            io.to(player.socketId).emit('error', error.message);
        }
      }
    };
  }
}

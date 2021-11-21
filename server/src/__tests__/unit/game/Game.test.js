import Player from '../../../game/Player';
import { id } from '../../../helpers';
import { gameStore, playerStore, userStore } from '../../../store';
import Game from '../../../game/Game';
import { SocketManager } from '../../../socket/manager';
import SocketIO from 'socket.io';
import GameModel from '../../../model/GameModel';
import PlayerModel from '../../../model/PlayerModel';
import Card from '../../../game/Card';
import { CardSuit } from 'shared-types';
import { CardRank, CardRankName } from 'shared-types/index';

describe('Game', function () {
  beforeEach(() => {
    gameStore.clearStorage();
    playerStore.clearStorage();
    userStore.clearStorage();
    jest.clearAllMocks();
  });

  it('should verify .getGameData()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Jenny',
    };

    const player = new Player(payload.userId, payload.name);
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    const gameData = game.getGameData(player);

    expect(gameData).toEqual({
      playerData: expect.any(Object),
      remainedCards: expect.any(Number),
    });

    expect(gameData.playerData).toEqual({
      left: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
      up: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
      right: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
      down: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
    });
  });

  it('should verify .playersHaveCards()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Jenny',
    };

    const player = new Player(payload.userId, payload.name);
    player.position = 'down';
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    GameModel.create(payload.userId, player, game);
    PlayerModel.addPlayer(player, payload.userId);
    player.gameId = payload.roomId;
    // No cardsInHand in hand
    expect(game.playersHaveCards()).toBeFalsy();

    player.takeCardsInHand([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);

    expect(game.playersHaveCards()).toBeTruthy();
  });

  it('should verify .cardsList()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Jenny',
    };

    const player = new Player(payload.userId, payload.name);
    player.position = 'up';
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    GameModel.create(payload.userId, player, game);
    PlayerModel.addPlayer(player, payload.userId);
    player.gameId = payload.roomId;
    game.dealCards(true);

    expect(game.cardsList).toHaveLength(4);
  });

  it('should verify .playerAlreadyInGameRoom()/.removePlayerFromTheGame()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Pem',
    };

    const player = new Player(payload.userId, payload.name);
    player.position = 'up';
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    GameModel.create(payload.userId, player, game);
    PlayerModel.addPlayer(player, payload.userId);
    player.gameId = payload.roomId;
    game.dealCards(true);

    expect(game.playerAlreadyInGameRoom(player)).toBeTruthy();
    game.removePlayerFromGameById(player.id);
    expect(game.playerAlreadyInGameRoom(player)).toBeFalsy();
  });

  it('should verify .joinPlayer()', function () {
    const Jim = new Player('Jim-id', 'Jim');
    const Pam = new Player('Pam-id', 'Pam');
    const Michael = new Player('Michael-id', 'Michael');
    const Dwight = new Player('Dwight-id', 'Dwight');
    const Andy = new Player('Andy-id', 'Andy');
    const args = [4, id.game(), true, id.player(), 'Bold game', new SocketManager(SocketIO)];
    const game = new Game(...args);
    game.joinPlayer(Jim);
    game.joinPlayer(Pam);
    game.joinPlayer(Michael);
    game.joinPlayer(Dwight);

    expect(() => {
      game.joinPlayer(Andy);
    }).toThrow('Table is full');
  });

  it('should verify .tableContainsCards()', function () {
    const Jim = new Player('Jim-id', 'Jim');
    const Pam = new Player('Pam-id', 'Pam');
    const args = [2, id.game(), true, id.player(), 'Bold game', new SocketManager(SocketIO)];
    const game = new Game(...args);
    game.joinPlayer(Jim);
    game.joinPlayer(Pam);
    game.startGame();

    const cards = game.cardsList.map((card) => new Card(card.suit, card.rank, card.rank));

    expect(game.tableContainsCards(cards)).toBeTruthy();
    expect(game.tableContainsCards([])).toBeFalsy();
  });

  it('should verify .removeCardsFromTable()', function () {
    const Jim = new Player('Jim-id', 'Jim');
    const Pam = new Player('Pam-id', 'Pam');
    const args = [2, id.game(), true, id.player(), 'Bold game', new SocketManager(SocketIO)];
    const game = new Game(...args);
    game.joinPlayer(Jim);
    game.joinPlayer(Pam);
    game.startGame();

    const cards = game.cardsList.map((card) => new Card(card.suit, card.rank, card.rank));
    game.removeCardsFromTable(cards);
    expect(game.tableContainsCards(cards)).toBeFalsy();
  });

  it('should do score calculation', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    Jason.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.CLUBS, CardRankName.NINE, CardRank.NINE),
    ]);
    // Jason have more cardsInHand (+2 points) and more clubs count (+1 point)
    Game.calculateScores([Alex, Jason]);
    expect(Alex.score).toBe(1);
    expect(Jason.score).toBe(4);
  });

  it('should do score calculation when amount of cardsInHand are draw', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    Jason.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    // Amount of cardsInHand are equal so no one get points so the amount of clubs is equal too
    Game.calculateScores([Alex, Jason]);
    expect(Alex.score).toBe(1);
    expect(Jason.score).toBe(1);
  });

  it('should do score calculation when only one player scores', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
    ]);
    Jason.scoreCards([new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE)]);
    Game.calculateScores([Alex, Jason]);
    expect(Alex.score).toBe(5);
    expect(Jason.score).toBe(0);
  });

  it('should do score calculation for 3 players', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    const Julie = new Player('Julie-id', 'Julie');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
    ]);
    Jason.scoreCards([new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE)]);
    Julie.scoreCards([
      new Card(CardSuit.SPADES, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.SPADES, CardRankName.TWO, CardRank.TWO),
      new Card(CardSuit.CLUBS, CardRankName.THREE, CardRank.THREE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.CLUBS, CardRankName.JACK, CardRank.JACK),
      new Card(CardSuit.CLUBS, CardRankName.QUEEN, CardRank.QUEEN),
    ]);
    Game.calculateScores([Alex, Jason, Julie]);
    expect(Alex.score).toBe(2);
    expect(Jason.score).toBe(0);
    expect(Julie.score).toBe(3);
  });

  it('should do score calculation for 4 players', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    const Julie = new Player('Julie-id', 'Julie');
    const Pablo = new Player('Pablo-id', 'Pablo');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    Jason.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
    ]);
    Julie.scoreCards([
      new Card(CardSuit.SPADES, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.SPADES, CardRankName.TWO, CardRank.TWO),
      new Card(CardSuit.CLUBS, CardRankName.THREE, CardRank.THREE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.CLUBS, CardRankName.JACK, CardRank.JACK),
      new Card(CardSuit.CLUBS, CardRankName.QUEEN, CardRank.QUEEN),
    ]);
    Pablo.scoreCards([
      new Card(CardSuit.HEARTS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.HEARTS, CardRankName.TWO, CardRank.TWO),
      new Card(CardSuit.HEARTS, CardRankName.THREE, CardRank.THREE),
      new Card(CardSuit.HEARTS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.HEARTS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.HEARTS, CardRankName.JACK, CardRank.JACK),
      new Card(CardSuit.HEARTS, CardRankName.QUEEN, CardRank.QUEEN),
      new Card(CardSuit.HEARTS, CardRankName.KING, CardRank.KING),
    ]);
    Game.calculateScores([Alex, Jason, Julie, Pablo]);
    expect(Alex.score).toBe(1);
    expect(Jason.score).toBe(1);
    expect(Julie.score).toBe(1);
    expect(Pablo.score).toBe(2);
  });

  it('should evaluate gameplay with 4 players (unShuffled Deck)', function () {
    // List all cards in the deck
    const ClubsAce = new Card(CardSuit.CLUBS, CardRankName.ACE, CardRank.ACE);
    const ClubsTwo = new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO);
    const ClubsThree = new Card(CardSuit.CLUBS, CardRankName.THREE, CardRank.THREE);
    const ClubsFour = new Card(CardSuit.CLUBS, CardRankName.FOUR, CardRank.FOUR);
    const ClubsFive = new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE);
    const ClubsSix = new Card(CardSuit.CLUBS, CardRankName.SIX, CardRank.SIX);
    const ClubsSeven = new Card(CardSuit.CLUBS, CardRankName.SEVEN, CardRank.SEVEN);
    const ClubsEight = new Card(CardSuit.CLUBS, CardRankName.EIGHT, CardRank.EIGHT);
    const ClubsNine = new Card(CardSuit.CLUBS, CardRankName.NINE, CardRank.NINE);
    const ClubsTen = new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN);
    const ClubsJack = new Card(CardSuit.CLUBS, CardRankName.JACK, CardRank.JACK);
    const ClubsQueen = new Card(CardSuit.CLUBS, CardRankName.QUEEN, CardRank.QUEEN);
    const ClubsKing = new Card(CardSuit.CLUBS, CardRankName.KING, CardRank.KING);
    const DiamondsAce = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    const DiamondsTwo = new Card(CardSuit.DIAMONDS, CardRankName.TWO, CardRank.TWO);
    const DiamondsThree = new Card(CardSuit.DIAMONDS, CardRankName.THREE, CardRank.THREE);
    const DiamondsFour = new Card(CardSuit.DIAMONDS, CardRankName.FOUR, CardRank.FOUR);
    const DiamondsFive = new Card(CardSuit.DIAMONDS, CardRankName.FIVE, CardRank.FIVE);
    const DiamondsSix = new Card(CardSuit.DIAMONDS, CardRankName.SIX, CardRank.SIX);
    const DiamondsSeven = new Card(CardSuit.DIAMONDS, CardRankName.SEVEN, CardRank.SEVEN);
    const DiamondsEight = new Card(CardSuit.DIAMONDS, CardRankName.EIGHT, CardRank.EIGHT);
    const DiamondsNine = new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE);
    const DiamondsTen = new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN);
    const DiamondsJack = new Card(CardSuit.DIAMONDS, CardRankName.JACK, CardRank.JACK);
    const DiamondsQueen = new Card(CardSuit.DIAMONDS, CardRankName.QUEEN, CardRank.QUEEN);
    const DiamondsKing = new Card(CardSuit.DIAMONDS, CardRankName.KING, CardRank.KING);
    const HeartsAce = new Card(CardSuit.HEARTS, CardRankName.ACE, CardRank.ACE);
    const HeartsTwo = new Card(CardSuit.HEARTS, CardRankName.TWO, CardRank.TWO);
    const HeartsThree = new Card(CardSuit.HEARTS, CardRankName.THREE, CardRank.THREE);
    const HeartsFour = new Card(CardSuit.HEARTS, CardRankName.FOUR, CardRank.FOUR);
    const HeartsFive = new Card(CardSuit.HEARTS, CardRankName.FIVE, CardRank.FIVE);
    const HeartsSix = new Card(CardSuit.HEARTS, CardRankName.SIX, CardRank.SIX);
    const HeartsSeven = new Card(CardSuit.HEARTS, CardRankName.SEVEN, CardRank.SEVEN);
    const HeartsEight = new Card(CardSuit.HEARTS, CardRankName.EIGHT, CardRank.EIGHT);
    const HeartsNine = new Card(CardSuit.HEARTS, CardRankName.NINE, CardRank.NINE);
    const HeartsTen = new Card(CardSuit.HEARTS, CardRankName.TEN, CardRank.TEN);
    const HeartsJack = new Card(CardSuit.HEARTS, CardRankName.JACK, CardRank.JACK);
    const HeartsQueen = new Card(CardSuit.HEARTS, CardRankName.QUEEN, CardRank.QUEEN);
    const HeartsKing = new Card(CardSuit.HEARTS, CardRankName.KING, CardRank.KING);
    const SpadesAce = new Card(CardSuit.SPADES, CardRankName.ACE, CardRank.ACE);
    const SpadesTwo = new Card(CardSuit.SPADES, CardRankName.TWO, CardRank.TWO);
    const SpadesThree = new Card(CardSuit.SPADES, CardRankName.THREE, CardRank.THREE);
    const SpadesFour = new Card(CardSuit.SPADES, CardRankName.FOUR, CardRank.FOUR);
    const SpadesFive = new Card(CardSuit.SPADES, CardRankName.FIVE, CardRank.FIVE);
    const SpadesSix = new Card(CardSuit.SPADES, CardRankName.SIX, CardRank.SIX);
    const SpadesSeven = new Card(CardSuit.SPADES, CardRankName.SEVEN, CardRank.SEVEN);
    const SpadesEight = new Card(CardSuit.SPADES, CardRankName.EIGHT, CardRank.EIGHT);
    const SpadesNine = new Card(CardSuit.SPADES, CardRankName.NINE, CardRank.NINE);
    const SpadesTen = new Card(CardSuit.SPADES, CardRankName.TEN, CardRank.TEN);
    const SpadesJack = new Card(CardSuit.SPADES, CardRankName.JACK, CardRank.JACK);
    const SpadesQueen = new Card(CardSuit.SPADES, CardRankName.QUEEN, CardRank.QUEEN);
    const SpadesKing = new Card(CardSuit.SPADES, CardRankName.KING, CardRank.KING);

    // Define players
    const Jason = new Player(id.player(), 'Jason');
    const Alex = new Player(id.player(), 'Alex');
    const Julie = new Player(id.player(), 'Julie');
    const Pablo = new Player(id.player(), 'Pablo');
    // Define the game create payload
    const payload = {
      size: 4,
      isPublic: true,
      roomId: id.game(),
      userId: Jason.id,
      name: Jason.name, // Let's give Jason this privilege to be the room creator
    };
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO()),
      false, // Let's keep cards in the original order (do not shuffle)
    );
    game.joinPlayer(Jason);
    // Create a new game record in the database
    GameModel.create(payload.userId, Jason, game);
    PlayerModel.addPlayer(Jason, payload.userId);

    // Join rest of the players
    [Alex, Julie, Pablo].forEach((player) => {
      game.joinPlayer(player);
      PlayerModel.addPlayer(player, payload.userId);
    });
    expect(() => {
      // no place left for this dude
      game.joinPlayer(new Player(id.player(), 'Extra Player'));
    }).toThrow('Table is full');

    // Once all the players are joined, game starts automatically
    // But running the function startGame wont cause any trouble :)
    game.startGame();
    // Players are getting cardsInHand by joining order and the first player is Jason
    // 4 Cards on the table will be place once all the player gets their cardsInHand
    /*
      Initial data will be as following
    
      Jason Player {
        playerCardsInHand: [
          Card { suit: 'clubs', name: 'ace', value: 1 },
          Card { suit: 'clubs', name: 2, value: 2 },
          Card { suit: 'clubs', name: 3, value: 3 },
          Card { suit: 'clubs', name: 4, value: 4 }
        ],
        playerScoredCards: [],
        playerGameId: 'G-837fe',
        name: 'Jason',
        playerId: 'P-c0097',
        score: 0,
        position: 'down'
      };
      
      Alex Player {
        playerCardsInHand: [
          Card { suit: 'clubs', name: 5, value: 5 },
          Card { suit: 'clubs', name: 6, value: 6 },
          Card { suit: 'clubs', name: 7, value: 7 },
          Card { suit: 'clubs', name: 8, value: 8 }
        ],
        playerScoredCards: [],
        playerGameId: 'G-4b05c',
        name: 'Alex',
        playerId: 'P-ff461',
        score: 0,
        position: 'left'
      };
      
      Julie Player {
        playerCardsInHand: [
          Card { suit: 'clubs', name: 9, value: 9 },
          Card { suit: 'clubs', name: 10, value: 10 },
          Card { suit: 'clubs', name: 'jack', value: 12 },
          Card { suit: 'clubs', name: 'queen', value: 13 }
        ],
        playerScoredCards: [],
        playerGameId: 'G-13694',
        name: 'Julie',
        playerId: 'P-23161',
        score: 0,
        position: 'up'
      };
      
      Pablo Player {
        playerCardsInHand: [
          Card { suit: 'clubs', name: 'king', value: 14 },
          Card { suit: 'diamonds', name: 'ace', value: 1 },
          Card { suit: 'diamonds', name: 2, value: 2 },
          Card { suit: 'diamonds', name: 3, value: 3 }
        ],
        playerScoredCards: [],
        playerGameId: 'G-def04',
        name: 'Pablo',
        playerId: 'P-0ae3b',
        score: 0,
        position: 'right'
      };
    
      Table cards [
        { rank: 4, suit: 'diamonds', key: 'diamonds4' },
        { rank: 5, suit: 'diamonds', key: 'diamonds5' },
        { rank: 6, suit: 'diamonds', key: 'diamonds6' },
        { rank: 7, suit: 'diamonds', key: 'diamonds7' }
      ];
     */

    // Jason makes the first move
    // Jason makes a move and places the cardsInHand on the table. He takes the first card from the deck.
    // ClubsFour is making a combination with DiamondsSeven. 4 + 7 = 11
    Jason.takeCardsFromTable(ClubsFour, [DiamondsSeven]);
    expect(Jason.cardsInHand).toHaveLength(3);
    expect(Jason.scoredCards).toHaveLength(2);
    // Next active player is Alex
    expect(game.activePlayer).toBe(Alex);

    // Next move is made by Alex
    Alex.takeCardsFromTable(ClubsSix, [DiamondsFive]);
    expect(Alex.cardsInHand).toHaveLength(3);
    expect(Alex.scoredCards).toHaveLength(2);
    expect(game.activePlayer).toBe(Julie);

    // Next move is made by Julie
    // Remaining cards on the table
    //   { rank: 4, suit: 'diamonds', key: 'diamonds4' },
    //   { rank: 6, suit: 'diamonds', key: 'diamonds6' },
    // Julies places jack and takes both cards from the table
    Julie.takeCardsFromTable(ClubsJack, [DiamondsFour, DiamondsSix]);
    expect(Julie.cardsInHand).toHaveLength(3);
    expect(Julie.scoredCards).toHaveLength(3);
    expect(game.activePlayer).toBe(Pablo);

    // Next move is made by Pablo
    // Not card left on the table therefore he can't take anything. He is forced to place the card
    Pablo.placeCardFromHand(ClubsKing);
    expect(Pablo.cardsInHand).toHaveLength(3);
    expect(Pablo.scoredCards).toHaveLength(0);

    // One round of moves is finished. Next player is expected to be Jason again
    expect(game.activePlayer).toBe(Jason);
    Jason.placeCardFromHand(ClubsThree);
    expect(Jason.cardsInHand).toHaveLength(2);
    // Table cards: ClubsKing, ClubsThree
    expect(game.activePlayer).toBe(Alex);
    Alex.placeCardFromHand(ClubsSeven);
    // Table cards: ClubsKing, ClubsThree, ClubsSeven
    expect(game.activePlayer).toBe(Julie);
    Julie.placeCardFromHand(ClubsNine);
    // Table cards: ClubsKing, ClubsThree, ClubsSeven, ClubsNine
    expect(game.activePlayer).toBe(Pablo);
    Pablo.takeCardsFromTable(DiamondsAce, [ClubsThree, ClubsSeven]);
    expect(Pablo.cardsInHand).toHaveLength(2);
    expect(Pablo.scoredCards).toHaveLength(3);
    expect(game.activePlayer).toBe(Jason);
    // Table cards: ClubsKing, ClubsNine

    // Jason is scoring ClubsTwo which has special point +1
    Jason.takeCardsFromTable(ClubsTwo, [ClubsNine]);
    // Table cards: ClubsKing
    Alex.placeCardFromHand(ClubsFive);
    // Table cards: ClubsKing, ClubsFive
    Julie.placeCardFromHand(ClubsQueen);
    // Table cards: ClubsKing, ClubsFive, ClubsQueen
    Pablo.placeCardFromHand(DiamondsThree);
    // Table cards: ClubsKing, ClubsFive, ClubsQueen, DiamondsThree
    expect(game.activePlayer).toBe(Jason);
    Jason.placeCardFromHand(ClubsAce);
    // Table cards: ClubsKing, ClubsFive, ClubsQueen, DiamondsThree, ClubsAce
    Alex.takeCardsFromTable(ClubsEight, [DiamondsThree]);
    expect(Alex.cardsInHand).toHaveLength(0);
    expect(Alex.scoredCards).toHaveLength(4);
    // Table cards: ClubsKing, ClubsFive, ClubsQueen, ClubsAce
    expect(game.activePlayer).toBe(Julie);
    Julie.takeCardsFromTable(ClubsTen, [ClubsAce]);
    expect(Julie.cardsInHand).toHaveLength(0);
    expect(Julie.scoredCards).toHaveLength(5);
    // Table cards: ClubsKing, ClubsFive, ClubsQueen
    Pablo.placeCardFromHand(DiamondsTwo);

    // Continue the flow by placing random cards
    [1, 2, 3, 4].forEach(() => {
      Jason.placeRandomCardFromHand();
      Alex.placeRandomCardFromHand();
      Julie.placeRandomCardFromHand();
      Pablo.placeRandomCardFromHand();
    });

    /*
      Remaining cards having players
      Jason
        Card { suit: 'hearts', name: 'jack', value: 12 },
        Card { suit: 'hearts', name: 'queen', value: 13 },
        Card { suit: 'hearts', name: 'king', value: 14 },
        Card { suit: 'spades', name: 'ace', value: 1 }
      Alex
        Card { suit: 'spades', name: 2, value: 2 },
        Card { suit: 'spades', name: 3, value: 3 },
        Card { suit: 'spades', name: 4, value: 4 },
        Card { suit: 'spades', name: 5, value: 5 }
      Julie
        Card { suit: 'spades', name: 6, value: 6 },
        Card { suit: 'spades', name: 7, value: 7 },
        Card { suit: 'spades', name: 8, value: 8 },
        Card { suit: 'spades', name: 9, value: 9 }
      Pablo 
        Card { suit: 'spades', name: 10, value: 10 },
        Card { suit: 'spades', name: 'jack', value: 12 },
        Card { suit: 'spades', name: 'queen', value: 13 },
        Card { suit: 'spades', name: 'king', value: 14 }
    
    */
    // last deal
    Jason.placeCardFromHand(HeartsQueen);
    Alex.placeCardFromHand(SpadesTwo);
    Julie.placeCardFromHand(SpadesSix);
    Pablo.placeCardFromHand(SpadesTen);
    expect(game.activePlayer).toBe(Jason);
    Jason.placeCardFromHand(SpadesAce);
    Alex.placeCardFromHand(SpadesThree);
    Julie.placeCardFromHand(SpadesSeven);
    Pablo.placeCardFromHand(SpadesQueen);

    Jason.placeCardFromHand(HeartsKing);
    Alex.placeCardFromHand(SpadesFour);
    Julie.placeCardFromHand(SpadesEight);
    Pablo.placeCardFromHand(SpadesKing);

    // Last move
    // Take everything from the table (Kings and Queens are even numbers so Jason takes them all)
    Jason.takeCardsFromTable(HeartsJack, [
      ClubsKing,
      ClubsFive,
      ClubsQueen,
      DiamondsTwo,
      DiamondsEight,
      DiamondsKing,
      HeartsFive,
      HeartsSeven,
      DiamondsNine,
      DiamondsQueen,
      HeartsFour,
      HeartsNine,
      DiamondsTen,
      HeartsAce,
      HeartsThree,
      HeartsEight,
      DiamondsJack,
      HeartsTwo,
      HeartsSix,
      HeartsTen,
      HeartsQueen,
      SpadesTwo,
      SpadesSix,
      SpadesTen,
      SpadesAce,
      SpadesThree,
      SpadesSeven,
      SpadesQueen,
      SpadesKing,
      SpadesFour,
      SpadesEight,
      HeartsKing,
    ]);
    expect(game.activePlayer).toBe(Alex);
    Alex.placeCardFromHand(SpadesFive);
    expect(game.activePlayer).toBe(Julie);
    Julie.placeCardFromHand(SpadesNine);
    // Pablo can take the last two cards from the table but he leaves it to test something important :)
    // Pablo.takeCardsFromTable(SpadesJack, [SpadesNine, SpadesFive]);
    Pablo.placeCardFromHand(SpadesJack);
    expect(Pablo.cardsInHand).toHaveLength(0);
    expect(Pablo.scoredCards).toHaveLength(3);
    // Remaining cards will go to Jason since he is the last card taker
    expect(Jason.scoredCards).toHaveLength(40);
    expect(Jason.result).toEqual({
      hasTenOfDiamonds: true,
      hasTwoOfClubs: true,
      numberOfCards: 40,
      numberOfClubs: 6,
    });
    expect(Alex.result).toEqual({
      numberOfCards: 4,
      numberOfClubs: 2,
      hasTwoOfClubs: false,
      hasTenOfDiamonds: false,
    });
    expect(Julie.result).toEqual({
      numberOfCards: 5,
      numberOfClubs: 3,
      hasTwoOfClubs: false,
      hasTenOfDiamonds: false,
    });
    expect(Pablo.result).toEqual({
      numberOfCards: 3,
      numberOfClubs: 2,
      hasTwoOfClubs: false,
      hasTenOfDiamonds: false,
    });
    expect(game.isFinished).toBeTruthy();
  });
});

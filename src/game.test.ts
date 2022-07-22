import {
  calculateHandScore,
  determineGameResult,
  playerHits,
  playerStands,
  setupGame,
} from "./game";

import { Hand, CardSuit, CardRank } from "./types";

describe("The game setup", () => {
  test("The cards in the deck are shuffled randomly each time the game is started", () => {
    const firstGame = setupGame();
    const secondGame = setupGame();

    expect(firstGame.cardDeck).not.toStrictEqual(secondGame.cardDeck);
  });

  test("The player and dealer are each given two cards from the deck", () => {
    const initialGameState = setupGame();
    expect(initialGameState.playerHand.length).toBe(2);
    expect(initialGameState.dealerHand.length).toBe(2);
    expect(initialGameState.cardDeck.length).toBe(48);
  });
});

describe("Calculating the score", () => {
  const handA: Hand = [
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    { suit: CardSuit.Clubs, rank: CardRank.Ten },
  ];
  const handB: Hand = [
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    { suit: CardSuit.Clubs, rank: CardRank.Five },
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
  ];

  const handC: Hand = [
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    { suit: CardSuit.Clubs, rank: CardRank.Ten },
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    
  ];

  test("The score for a hand with Ace, 10 is 21", () => {
    expect(calculateHandScore(handA)).toBe(21);
  });

  test("The score for a hand with Ace, 5, Ace, Ace is 18", () => {
    expect(calculateHandScore(handB)).toBe(18);
  });

  test("The score for a hand with Ace, 10, Ace is 12", () => {
    expect(calculateHandScore(handC)).toBe(12);
  });
});

describe("The player actions", () => {
  test("When the player 'Hits' they receive a card from the deck", () => {
    const initialGameState = setupGame();

    const newGameState = playerHits(initialGameState);
    expect(newGameState.cardDeck.length).toBe(
      initialGameState.cardDeck.length - 1
    );
    expect(newGameState.playerHand.length).toBe(
      initialGameState.playerHand.length + 1
    );
  });

  test("When the player 'Stands' and the dealer has a score of 16 or less then the dealer must take another card", () => {
    const initialGameState = setupGame();
    initialGameState.dealerHand = [
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
      { suit: CardSuit.Clubs, rank: CardRank.Six },
    ];

    const newGameState = playerStands(initialGameState);

    expect(newGameState.dealerHand.length).toBe(
      initialGameState.dealerHand.length + 1
    );
  });

  test("When the player 'Stands' and the dealers score is 17 or more the dealer does not take another card", () => {
    const initialGameState = setupGame();
    initialGameState.dealerHand = [
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
      { suit: CardSuit.Clubs, rank: CardRank.Seven },
    ];

    const newGameState = playerStands(initialGameState);

    expect(newGameState.dealerHand.length).toBe(
      initialGameState.dealerHand.length
    );
  });
});

describe("Determining the winner", () => {
  const winningHand: Hand = [
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    { suit: CardSuit.Clubs, rank: CardRank.Ten },
  ];
  const losingHand: Hand = [
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    { suit: CardSuit.Clubs, rank: CardRank.Five },
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
    { suit: CardSuit.Clubs, rank: CardRank.Ace },
  ];

  test("When the players or dealers hand is higher than 21 they go 'bust' and the other player wins", () => {
    const game = setupGame();
    const bustHand: Hand = [
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
    ];
    game.playerHand = bustHand;
    expect(determineGameResult(game)).toBe("dealer_win");

    const game2 = setupGame();
    game2.dealerHand = bustHand;
    expect(determineGameResult(game2)).toBe("player_win");
  });

  test("When the dealers hand is higher than the players hand the dealer wins", () => {
    const game = setupGame();

    game.dealerHand = winningHand;
    game.playerHand = losingHand;
    expect(determineGameResult(game)).toBe("dealer_win");
  });

  test("When the players hand is higher than the dealers hand the player wins", () => {
    const game = setupGame();

    game.dealerHand = losingHand;
    game.playerHand = winningHand;
    expect(determineGameResult(game)).toBe("player_win");
  });

  test("When the players and dealers score is equal the game is a draw", () => {
    const game = setupGame();
    const equalHand: Hand = [
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
    ];
    game.playerHand = equalHand;
    game.dealerHand = equalHand;
    expect(determineGameResult(game)).toBe("draw");
  });

  test("When the players has Black Jack and the dealer doesn't the player will win", () => {
    const game = setupGame();
    const blackJack: Hand = [
      { suit: CardSuit.Clubs, rank: CardRank.Ace },
      { suit: CardSuit.Clubs, rank: CardRank.Ten },
    ];
    const notBlackJack: Hand = [
      { suit: CardSuit.Clubs, rank: CardRank.Ace },
      { suit: CardSuit.Clubs, rank: CardRank.Five },
      { suit: CardSuit.Clubs, rank: CardRank.Five },
    ];
    game.playerHand = blackJack;
    game.dealerHand = notBlackJack;
    expect(calculateHandScore(blackJack)).toBe(21);
    expect(calculateHandScore(notBlackJack)).toBe(21);
    expect(determineGameResult(game)).toBe("player_win");

    game.playerHand = blackJack;
    game.dealerHand = blackJack;
    expect(determineGameResult(game)).toBe("draw");
  });
});
export {};

import { useState } from "react";
import {
  Card,
  CardRank,
  CardDeck,
  CardSuit,
  GameState,
  Hand,
  GameResult,
} from "./types";

//UI Elements
const CardBackImage = () => (
  <img alt="backOfCardImage" src={process.env.PUBLIC_URL + `/SVG-cards/png/1x/back.png`} />
);

const CardImage = ({ suit, rank }: Card) => {
  const card = rank === CardRank.Ace ? 1 : rank;
  return (
    <img
      alt="frontOfCardImage"
      src={
        process.env.PUBLIC_URL +
        `/SVG-cards/png/1x/${suit.slice(0, -1)}_${card}.png`
      }
    />
  );
};

//Setup
const newCardDeck = (): CardDeck =>
  Object.values(CardSuit)
    .map((suit) =>
      Object.values(CardRank).map((rank) => ({
        suit,
        rank,
      }))
    )
    .reduce((a, v) => [...a, ...v]);

const shuffle = (deck: CardDeck): CardDeck => {
  return deck.sort(() => Math.random() - 0.5);
};

const takeCard = (deck: CardDeck): { card: Card; remaining: CardDeck } => {
  const card = deck[deck.length - 1];
  const remaining = deck.slice(0, deck.length - 1);
  return { card, remaining };
};

const setupGame = (): GameState => {
  const cardDeck = shuffle(newCardDeck());
  return {
    playerHand: cardDeck.slice(cardDeck.length - 2, cardDeck.length),
    dealerHand: cardDeck.slice(cardDeck.length - 4, cardDeck.length - 2),
    cardDeck: cardDeck.slice(0, cardDeck.length - 4), // remaining cards after player and dealer have been give theirs
    turn: "player_turn",
  };
};

//Scoring
const calculateHandScore = (hand: Hand): number => {
  let value: number = 0;
  hand.forEach((card) => {
    if (card.rank === "ace"){
      if (value + 11 > 21){
        value += 1
      } else {
        value += 11
      }
    } else if (card.rank === "jack" || card.rank === "queen" || card.rank === "king"){
      value += 10
    } else {
    value += parseInt(card.rank)
    }
  })
  return value
};

const determineGameResult = (state: GameState): GameResult => {
  // calculate and hands and store
  const playerTotalScore: number = calculateHandScore(state.playerHand)
  const dealerTotalScore: number = calculateHandScore(state.dealerHand)
  // check for player bust
  if (playerTotalScore > 21){
    return "dealer_win"
  }
  // check for dealer bust
  else if (dealerTotalScore > 21){
    return "player_win"
  }
  // check for player win
  else if (playerTotalScore > dealerTotalScore && playerTotalScore <= 21){
    return "player_win"
  }
  // check for dealer win
  else if (dealerTotalScore > playerTotalScore && dealerTotalScore <= 21){
    return "dealer_win"
  }
  // check for draw win
  else if (dealerTotalScore === playerTotalScore){
    return "draw"
  }
  // default no result
  return "draw";
};

//Player Actions
const playerStands = (state: GameState): GameState => {
  // dealer takes cards if dealer score is less than or equal to 16
  const { card, remaining } = takeCard(state.cardDeck);
  let dealerTotalScore: number = calculateHandScore(state.dealerHand)
  if(dealerTotalScore <= 16){
    return {
      ...state,
      cardDeck: remaining,
      dealerHand: [...state.dealerHand, card],
    }
  }
  return {
    ...state,
    turn: "dealer_turn",
  };
};

const playerHits = (state: GameState): GameState => {
  const { card, remaining } = takeCard(state.cardDeck);
  return {
    ...state,
    cardDeck: remaining,
    playerHand: [...state.playerHand, card],
  };
};

//UI Component
const Game = (): JSX.Element => {
  const [state, setState] = useState(setupGame());
  return (
    <>
      <div>
        <p>There are {state.cardDeck.length} cards left in deck</p>
        <button
          disabled={state.turn === "dealer_turn"}
          onClick={(): void => setState(playerHits)}
        >
          Hit
        </button>
        <button
          disabled={state.turn === "dealer_turn"}
          onClick={(): void => setState(playerStands)}
        >
          Stand
        </button>
        <button onClick={(): void => setState(setupGame())}>Reset</button>
      </div>
      <p>Player Cards</p>
      <div>
        {state.playerHand.map(CardImage)}
        <p>Player Score {calculateHandScore(state.playerHand)}</p>
      </div>
      <p>Dealer Cards</p>
      {state.turn === "player_turn" && state.dealerHand.length > 0 ? (
        <div>
          <CardBackImage />
          <CardImage {...state.dealerHand[1]} />
        </div>
      ) : (
        <div>
          {state.dealerHand.map(CardImage)}
          <p>Dealer Score {calculateHandScore(state.dealerHand)}</p>
        </div>
      )}
      {/*
        determines when to render game result -> when playerhand busts or when dealerbusts , otherwise it renders whom's turn it is
        dealer win state will render if the playerhand busts prior to standing
      */}
      {calculateHandScore(state.playerHand) > 21 ? determineGameResult(state) : state.turn === "dealer_turn" ? determineGameResult(state) : <p>{state.turn}</p>}
    </>

  );
};

export {
  Game,
  playerHits,
  playerStands,
  determineGameResult,
  calculateHandScore,
  setupGame,
};

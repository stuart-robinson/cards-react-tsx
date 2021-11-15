Installation

1 - Clone this github repo: `git clone git@github.com:stuart-robinson/cards.git`

2 - Install required packages: `yarn` (or npm)

3 - Run the local dev server with `yarn start`

4 - Run the test suit with `yarn test`

Rules

* The game is played with a deck of 52 cards
* At the start of the game the deck is shuffled and two cards are dealt to the player and the dealer
* Play begins with the player. The following choices available to the player:
    * "Stand": Player stays put with their cards.
    * "Hit": Player draws another card. If this card causes the player's total points to exceed 21 ("bust") then they will lose.
* After the player has had their turn, the dealer will turn over their first card.
* If the dealer has a score of 16 or less then the dealer must take another card

Result

* If the player or the dealer busts then they will lose.
* If no player has bust then the higher point total will win.
* If both players have the same score the result is a draw unless one player has blackjack in which case they win.

Scoring

* Aces may be counted as 1 or 11 points. The higher value applies if it does not cause the player to bust
* Cards 2 to 9 points are same as face value (e.g 5 = 5 points)
* Ten, Jack, Queen, Kind count as ten points.
* The value of a hand is the sum of the point values of the individual cards. Except, a "blackjack" is the highest hand, consisting of one ace and any 10-point card, and it outranks all other 21-point hands.

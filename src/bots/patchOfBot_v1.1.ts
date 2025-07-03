import { Gamestate, BotSelection } from '../models/gamestate';

type RoundOutcome = 'Win' | 'Lose' | 'Draw'

const winPoints: number = 1000;

class Bot {
    // Score info.
    myScore: number = 0;
    opponentScore: number = 0;
    rolledOverPoints: number = 0;

    // Move info.
    rpsList: BotSelection[] = ['R', 'P', 'S'];
    myDynamites: number = 100;
    opponentDynamites: number = 100;

    // Past round info:
    // Counts the number of times the opponent used or didn't use a dynamite after a draw. [Y, N].
    numberOfDrawRounds: number = 0;
    opponentSetDynamiteAfterDraw: number = 0;
    opponentSetWaterBalloonAfterDraw: number = 0;

    makeMove(gamestate: Gamestate): BotSelection {
        // Check last round info and update accordingly.
        if (gamestate.rounds.length > 0) {
            let lastRound = gamestate.rounds.at(-1);
            let lastResult: RoundOutcome = this.checkRoundResults(lastRound.p1, lastRound.p2);

            if (this.rolledOverPoints > 0) {
                this.numberOfDrawRounds += 1;
            }

            if (lastResult == 'Draw') {
                this.rolledOverPoints += 1;
            } else {
                this.rolledOverPoints = 0;
            }
        }

        let nextMove = this.generateMove();
        return nextMove;
    }

    generateMove(): BotSelection {
        // If there are more dynamites than points left until opponent's or my win, use dynamite.
        if (this.myDynamites >= (winPoints - this.myScore) || this.myDynamites >= (winPoints - this.opponentScore)) {
            return 'D'
        }

        // Strategy for when there has been a draw.
        if (this.rolledOverPoints > 1) {
            if ((this.opponentSetDynamiteAfterDraw / this.numberOfDrawRounds) > 0.5) {
                return 'W';
            } else if (((this.opponentSetWaterBalloonAfterDraw / this.numberOfDrawRounds) < 0.5) && this.myDynamites > 0) {
                return 'D';
            }
        }

        // Otherwise, choose randomly between rock, paper, and scissors.
        return this.rpsList[Math.floor(Math.random() * this.rpsList.length)];
    }

    // Checks round results,
    checkRoundResults(myMove: BotSelection, opponentMove: BotSelection): RoundOutcome {

        // Update dynamite counts.
        this.myDynamites -= (myMove === 'D') ? 1 : 0;
        this.opponentDynamites -= (opponentMove === 'D') ? 1 : 0;

        // Update opponent dynamite and water after draw counts.
        if (this.rolledOverPoints > 0) {
            this.opponentSetDynamiteAfterDraw += (opponentMove === 'D') ? 1 : 0;
            this.opponentSetWaterBalloonAfterDraw += (opponentMove === 'W') ? 1 : 0; 
        }

        // If the same move is played, draw
        if (myMove === opponentMove) {
            return 'Draw';
        }

        // If I play dynamite and opponent did not play water balloon, I win.
        if (myMove === 'D') {
            if (opponentMove !== 'W') {
                return 'Win';
            } else {
                return 'Lose';
            }
        }

        // If opponent plays dynamite and I did not play water balloon, I lose.
        if (opponentMove === 'D') {
            if (myMove !== 'W') {
                return 'Lose';
            } else {
                return 'Win';
            }
        }

        // If either of us played water balloon, that person loses.
        if (myMove === 'W') {
            return 'Lose';
        }
        if (opponentMove === 'W') {
            return 'Win';
        }

        // Basic rock paper scissor outcomes.
        switch (myMove + opponentMove) {
            case "RS":
            case "SP":
            case "PR":
                return 'Win'
            default:
                return 'Lose';
        }
    }
}

export = new Bot();
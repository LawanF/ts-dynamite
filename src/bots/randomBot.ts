import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    myDynamitesLeft: number = 100;

    availableMoves: BotSelection[] = ['R', 'P', 'S', 'D']

    makeMove(gamestate: Gamestate): BotSelection {
        let nextMove: BotSelection = this.generateMove();

        if (nextMove === 'D') {
            this.myDynamitesLeft -= 1;
            this.checkDynamiteAvailability();
        }

        return nextMove;
    }

    generateMove(): BotSelection {
        return this.availableMoves[Math.floor(Math.random() * this.availableMoves.length)];
    }

    checkDynamiteAvailability() {
        if (this.myDynamitesLeft === 0) {
                const ind = this.availableMoves.indexOf('D');
                this.availableMoves.splice(ind, 1);
        } 
    }
}

export = new Bot();
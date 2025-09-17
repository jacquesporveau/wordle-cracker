import prompts from "prompts";
import { WordleSolver } from "./wordle-solver.js";
import {} from "./types.js";
export class WordleGame {
    solver;
    constructor() {
        this.solver = new WordleSolver();
    }
    async play() {
        let currentGuess = "raise";
        for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
            console.log(`Your guess #${guessNumber} is "${currentGuess}"`);
            const feedback = (await prompts({
                type: "text",
                name: "value",
                message: `What is the feedback for guess #${guessNumber}?`,
            }));
            if (this.solver.isSolved(currentGuess, feedback.value)) {
                console.log(`The answer is "${currentGuess}"`);
                console.log(`I solved it in ${guessNumber} guesses!`);
                return;
            }
            const nextGuess = this.solver.getNextGuess(currentGuess, feedback.value);
            if (!nextGuess) {
                console.log("❌ No valid answers found. Check your feedback input.");
                return;
            }
            currentGuess = nextGuess;
            console.log(`Your next guess is "${currentGuess}"`);
        }
    }
}
//# sourceMappingURL=wordle-game.js.map
import prompts from "prompts";
import { WordleSolver } from "./wordle-solver.js";
import { type FeedbackResponse } from "./types.js";

export class WordleGame {
  private solver: WordleSolver;

  constructor() {
    this.solver = new WordleSolver();
  }

  public async play(): Promise<void> {
    let currentGuess = "crane";

    for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
      console.log(`Your guess #${guessNumber} is "${currentGuess}"`);

      const feedback = (await prompts<string>({
        type: "text",
        name: "value",
        message: `What is the feedback for guess #${guessNumber}?`,
      })) as FeedbackResponse;

      if (
        this.solver.isSolved({ guess: currentGuess, feedback: feedback.value })
      ) {
        console.log(`The answer is "${currentGuess}"`);
        console.log(`I solved it in ${guessNumber} guesses!`);
        return;
      }

      const nextGuess = this.solver.getNextGuess({
        guess: currentGuess,
        feedback: feedback.value,
      });

      if (!nextGuess) {
        console.log("❌ No valid answers found. Check your feedback input.");
        return;
      }

      currentGuess = nextGuess;
      console.log(`Your next guess is "${currentGuess}"`);
    }
  }
}

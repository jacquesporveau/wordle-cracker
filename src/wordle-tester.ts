import { answers } from "./answers.js";
import { WordleSolver } from "./wordle-solver.js";
import { WordleSimulator } from "./wordle-simulator.js";

export class WordleTester {
  private solver: WordleSolver;

  constructor() {
    this.solver = new WordleSolver();
  }

  public async testAllWords(): Promise<void> {
    console.log("🧪 Testing solver against all words...");
    console.log(`Total words to test: ${answers.length}`);

    const results: number[] = [];
    let failed = 0;

    for (let i = 0; i < answers.length; i++) {
      const word = answers[i];
      if (!word) {
        console.log(`Skipping undefined word at index ${i}`);
        continue;
      }

      try {
        const guesses = this.solveWord(word);
        results.push(guesses);

        if (guesses === 7) {
          failed++;
        }
      } catch (error) {
        console.log(`Error solving word "${word}" at index ${i}:`, error);
        results.push(7);
        failed++;
      }

      // Progress indicator
      if ((i + 1) % 100 === 0) {
        console.log(`Progress: ${i + 1}/${answers.length} words tested`);
      }
    }

    this.displayResults({ results, failed });
  }

  private solveWord(targetWord: string): number {
    this.solver.reset();
    let currentGuess = "raise";

    for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
      const feedback = WordleSimulator.getFeedback({
        guess: currentGuess,
        target: targetWord,
      });

      if (this.solver.isSolved({ guess: currentGuess, feedback })) {
        return guessNumber;
      }

      const nextGuess = this.solver.getNextGuess({
        guess: currentGuess,
        feedback,
      });

      if (!nextGuess) {
        return 7; // Failed to solve
      }

      currentGuess = nextGuess;
    }

    return 7; // Failed to solve
  }

  private displayResults({
    results,
    failed,
  }: {
    results: number[];
    failed: number;
  }): void {
    const average =
      results.reduce((sum, guesses) => sum + guesses, 0) / results.length;
    const successRate = ((results.length - failed) / results.length) * 100;

    console.log("\n📊 RESULTS:");
    console.log(`Average guesses: ${average.toFixed(2)}`);
    console.log(`Success rate: ${successRate.toFixed(1)}%`);
    console.log(`Failed words: ${failed}`);

    // Distribution
    const distribution = results.reduce((acc, guesses) => {
      acc[guesses] = (acc[guesses] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    console.log("\n📈 Distribution:");
    for (let i = 1; i <= 7; i++) {
      const count = distribution[i] || 0;
      const percentage = (count / results.length) * 100;
      console.log(`${i} guesses: ${count} words (${percentage.toFixed(1)}%)`);
    }
  }
}

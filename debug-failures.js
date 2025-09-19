import { WordleSolver } from "./dist/wordle-solver.js";
import { WordleSimulator } from "./dist/wordle-simulator.js";
import { answers } from "./dist/answers.js";

console.log("🔍 Debugging solver failures...\n");

const solver = new WordleSolver();
const failedWords = [];
let totalTested = 0;

// Test first 50 words to identify patterns
for (let i = 0; i < Math.min(50, answers.length); i++) {
  const word = answers[i];
  if (!word) continue;

  totalTested++;
  solver.reset();
  let currentGuess = "raise"; // Use fixed opening word
  let solved = false;

  console.log(`Testing word ${i + 1}: ${word}`);

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    const feedback = WordleSimulator.getFeedback({
      guess: currentGuess,
      target: word,
    });
    console.log(`  Guess ${guessNumber}: ${currentGuess} -> ${feedback}`);

    if (solver.isSolved({ guess: currentGuess, feedback })) {
      console.log(`  ✅ Solved in ${guessNumber} guesses!\n`);
      solved = true;
      break;
    }

    const nextGuess = solver.getNextGuess({ guess: currentGuess, feedback });
    if (!nextGuess) {
      console.log(`  ❌ Failed to find next guess\n`);
      failedWords.push({ word, guess: currentGuess, feedback, guessNumber });
      break;
    }

    currentGuess = nextGuess;
  }

  if (!solved && currentGuess) {
    console.log(`  ❌ Failed to solve in 6 guesses\n`);
    failedWords.push({ word, finalGuess: currentGuess, reason: "timeout" });
  }
}

console.log(`\n📊 Results:`);
console.log(`Total tested: ${totalTested}`);
console.log(`Failed: ${failedWords.length}`);
console.log(
  `Success rate: ${(
    ((totalTested - failedWords.length) / totalTested) *
    100
  ).toFixed(1)}%`
);

if (failedWords.length > 0) {
  console.log(`\n❌ Failed words:`);
  failedWords.forEach((failure, index) => {
    console.log(
      `${index + 1}. ${failure.word} - ${failure.reason || "no next guess"}`
    );
  });
}

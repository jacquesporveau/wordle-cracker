import { GUESS_MAP } from "./constants.js";
export class WordleSimulator {
    static getFeedback(guess, target) {
        const feedback = new Array(5).fill("b");
        const targetLetters = target.split("");
        const guessLetters = guess.split("");
        // First pass: mark greens
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                feedback[i] = GUESS_MAP.GREEN;
                targetLetters[i] = ""; // Mark as used
            }
        }
        // Second pass: mark yellows
        for (let i = 0; i < 5; i++) {
            if (feedback[i] === GUESS_MAP.BLANK && guessLetters[i]) {
                const letterIndex = targetLetters.indexOf(guessLetters[i]);
                if (letterIndex !== -1) {
                    feedback[i] = GUESS_MAP.YELLOW;
                    targetLetters[letterIndex] = ""; // Mark as used
                }
            }
        }
        return feedback.join("");
    }
}
//# sourceMappingURL=wordle-simulator.js.map
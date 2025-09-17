import {} from "./types.js";
export class WordleSimulator {
    static getFeedback(guess, target) {
        const feedback = new Array(5).fill("b");
        const targetLetters = target.split("");
        const guessLetters = guess.split("");
        // First pass: mark greens
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                feedback[i] = "g";
                targetLetters[i] = ""; // Mark as used
            }
        }
        // Second pass: mark yellows
        for (let i = 0; i < 5; i++) {
            if (feedback[i] === "b" && guessLetters[i]) {
                const letterIndex = targetLetters.indexOf(guessLetters[i]);
                if (letterIndex !== -1) {
                    feedback[i] = "y";
                    targetLetters[letterIndex] = ""; // Mark as used
                }
            }
        }
        return feedback.join("");
    }
}
//# sourceMappingURL=wordle-simulator.js.map
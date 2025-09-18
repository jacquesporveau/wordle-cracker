import { answers } from "./answers.js";
import { GUESS_MAP } from "./constants.js";
import { letters } from "./letters.js";
import {} from "./types.js";
export class WordleSolver {
    letterInformation;
    constructor() {
        this.letterInformation = this.initializeLetterInformation();
    }
    initializeLetterInformation() {
        return letters.reduce((acc, letter) => {
            acc[letter] = {
                presentAtIndex: null,
                absentAtIndecies: [],
                absent: false,
            };
            return acc;
        }, {});
    }
    isLetterPresent(letter) {
        return (this.letterInformation[letter].presentAtIndex !== null ||
            this.letterInformation[letter].absentAtIndecies.length > 0);
    }
    isLetterAbsent(letter) {
        return this.letterInformation[letter].absent;
    }
    processFeedback(guess, feedback) {
        feedback.split("").forEach((feedbackLetter, position) => {
            const letterKey = guess[position];
            switch (feedbackLetter) {
                case GUESS_MAP.GREEN: // Green: letter is correct and in the right position
                    this.letterInformation[letterKey].presentAtIndex = position;
                    break;
                case GUESS_MAP.YELLOW: // Yellow: letter is correct but in the wrong position
                    this.letterInformation[letterKey].absentAtIndecies.push(position);
                    break;
                case GUESS_MAP.BLANK: // Black: letter is not in the word
                    this.processBlackLetter(guess, feedback, letterKey, position);
                    break;
            }
        });
    }
    processBlackLetter(guess, feedback, letterKey, position) {
        // Only mark as absent if ALL instances of this letter in the guess are black
        const allInstancesBlack = guess.split("").every((letter, index) => {
            if (letter === letterKey) {
                return feedback[index] === "b";
            }
            return true;
        });
        if (allInstancesBlack) {
            this.letterInformation[letterKey].absent = true;
        }
        else {
            // If not all instances are black, just mark this position as forbidden
            this.letterInformation[letterKey].absentAtIndecies.push(position);
        }
    }
    getValidAnswers() {
        const presentLetters = Object.keys(this.letterInformation).filter((letter) => this.isLetterPresent(letter));
        const absentLetters = Object.keys(this.letterInformation).filter((letter) => this.isLetterAbsent(letter));
        return answers.filter((answer) => {
            // Check green letters are in correct positions
            const hasGreenLettersInCorrectPositions = letters.every((letter) => {
                const correctPosition = this.letterInformation[letter].presentAtIndex;
                return correctPosition === null || answer[correctPosition] === letter;
            });
            // Check yellow letters are not in forbidden positions
            const hasYellowLettersInValidPositions = answer
                .split("")
                .every((letter, index) => {
                const letterKey = letter;
                return !this.letterInformation[letterKey].absentAtIndecies.includes(index);
            });
            // Check all present letters are included
            const includesAllPresentLetters = presentLetters.every((letter) => answer.includes(letter));
            // Check no absent letters are included
            const excludesAllAbsentLetters = absentLetters.every((letter) => !answer.includes(letter));
            return (hasGreenLettersInCorrectPositions &&
                hasYellowLettersInValidPositions &&
                includesAllPresentLetters &&
                excludesAllAbsentLetters);
        });
    }
    getNextGuess(guess, feedback) {
        this.processFeedback(guess, feedback);
        const validAnswers = this.getValidAnswers();
        if (validAnswers.length === 0) {
            return undefined; // No valid answers found
        }
        return validAnswers[0];
    }
    isSolved(guess, feedback) {
        this.processFeedback(guess, feedback);
        const validAnswers = this.getValidAnswers();
        return validAnswers.length === 1 && validAnswers[0] === guess;
    }
    reset() {
        this.letterInformation = this.initializeLetterInformation();
    }
}
//# sourceMappingURL=wordle-solver.js.map
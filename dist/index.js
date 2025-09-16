import { answers } from "./answers.js";
import { letters } from "./letters.js";
import prompts from "prompts";
const letterInformation = letters.reduce((acc, letter) => {
    acc[letter] = { presentAtIndex: null, absentAtIndecies: [], absent: false };
    return acc;
}, {});
const isLetterPresent = (letter) => {
    return (letterInformation[letter].presentAtIndex !== null ||
        letterInformation[letter].absentAtIndecies.length > 0);
};
const isLetterAbsent = (letter) => {
    return letterInformation[letter].absent;
};
async function main() {
    let currentGuess = "raise";
    for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
        console.log(`Your guess #${guessNumber} is "${currentGuess}"`);
        const feedback = (await prompts({
            type: "text",
            name: "value",
            message: `What is the feedback for guess #${guessNumber}?`,
        }));
        // Process feedback for each letter in the guess
        feedback.value.split("").forEach((feedbackLetter, position) => {
            const letterKey = currentGuess[position];
            switch (feedbackLetter) {
                case "g": // Green: letter is correct and in the right position
                    letterInformation[letterKey].presentAtIndex = position;
                    break;
                case "y": // Yellow: letter is correct but in the wrong position
                    letterInformation[letterKey].absentAtIndecies.push(position);
                    break;
                case "b": // Black: letter is not in the word
                    // Only mark as absent if ALL instances of this letter in the guess are black
                    const allInstancesBlack = currentGuess
                        .split("")
                        .every((letter, index) => {
                        if (letter === letterKey) {
                            return feedback.value[index] === "b";
                        }
                        return true;
                    });
                    if (allInstancesBlack) {
                        letterInformation[letterKey].absent = true;
                    }
                    else {
                        // If not all instances are black, just mark this position as forbidden
                        letterInformation[letterKey].absentAtIndecies.push(position);
                    }
                    break;
            }
        });
        // Get lists of present and absent letters
        const presentLetters = Object.keys(letterInformation).filter((letter) => isLetterPresent(letter));
        const absentLetters = Object.keys(letterInformation).filter((letter) => isLetterAbsent(letter));
        // Find the next best guess that satisfies all constraints
        currentGuess = answers.find((answer) => {
            // Check green letters are in correct positions
            const hasGreenLettersInCorrectPositions = letters.every((letter) => {
                const correctPosition = letterInformation[letter].presentAtIndex;
                return correctPosition === null || answer[correctPosition] === letter;
            });
            // Check yellow letters are not in forbidden positions
            const hasYellowLettersInValidPositions = answer
                .split("")
                .every((letter, index) => {
                const letterKey = letter;
                return !letterInformation[letterKey].absentAtIndecies.includes(index);
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
        console.log(`Your next guess is "${currentGuess}"`);
    }
}
main().catch(console.error);
//# sourceMappingURL=index.js.map
import { answers } from "./answers.js";
import { letters } from "./letters.js";

import prompts from "prompts";

interface FeedbackResponse {
  value: string;
}

interface LetterInformationState {
  presentAtIndex: number | null;
  absentAtIndecies: number[];
  absent: boolean;
}

type Letter = (typeof letters)[number];

type LetterInformation = Record<Letter, LetterInformationState>;

const letterInformation: LetterInformation = letters.reduce((acc, letter) => {
  acc[letter] = { presentAtIndex: null, absentAtIndecies: [], absent: false };
  return acc;
}, {} as LetterInformation);

const isLetterPresent = (letter: Letter) => {
  return (
    letterInformation[letter].presentAtIndex !== null ||
    letterInformation[letter].absentAtIndecies.length > 0
  );
};

const isLetterAbsent = (letter: Letter) => {
  return letterInformation[letter].absent;
};

async function main() {
  let currentGuess = "raise";

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    console.log(`Your guess #${guessNumber} is "${currentGuess}"`);

    const feedback = (await prompts<string>({
      type: "text",
      name: "value",
      message: `What is the feedback for guess #${guessNumber}?`,
    })) as FeedbackResponse;

    // Process feedback for each letter in the guess
    feedback.value.split("").forEach((feedbackLetter, position) => {
      const letterKey = currentGuess[position] as Letter;

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
          } else {
            // If not all instances are black, just mark this position as forbidden
            letterInformation[letterKey].absentAtIndecies.push(position);
          }
          break;
      }
    });

    // Get lists of present and absent letters
    const presentLetters = Object.keys(letterInformation).filter((letter) =>
      isLetterPresent(letter as Letter)
    );

    const absentLetters = Object.keys(letterInformation).filter((letter) =>
      isLetterAbsent(letter as Letter)
    );

    // Find the next best guess that satisfies all constraints
    const possibleAnswers = answers.filter((answer) => {
      // Check green letters are in correct positions
      const hasGreenLettersInCorrectPositions = letters.every((letter) => {
        const correctPosition = letterInformation[letter].presentAtIndex;
        return correctPosition === null || answer[correctPosition] === letter;
      });

      // Check yellow letters are not in forbidden positions
      const hasYellowLettersInValidPositions = answer
        .split("")
        .every((letter, index) => {
          const letterKey = letter as Letter;
          return !letterInformation[letterKey].absentAtIndecies.includes(index);
        });

      // Check all present letters are included
      const includesAllPresentLetters = presentLetters.every((letter) =>
        answer.includes(letter)
      );

      // Check no absent letters are included
      const excludesAllAbsentLetters = absentLetters.every(
        (letter) => !answer.includes(letter)
      );

      return (
        hasGreenLettersInCorrectPositions &&
        hasYellowLettersInValidPositions &&
        includesAllPresentLetters &&
        excludesAllAbsentLetters
      );
    });

    if (possibleAnswers.length === 1) {
      console.log(`The answer is "${possibleAnswers[0]}"`);
      console.log(`I solved it in ${guessNumber} guesses!`);
      return;
    }

    if (possibleAnswers.length === 0) {
      console.log("❌ No valid answers found. Check your feedback input.");
      return;
    }

    currentGuess = possibleAnswers[0]!;
    console.log(`Your next guess is "${currentGuess}"`);
  }
}

main().catch(console.error);

import { answers } from "./answers.js";
import { letters } from "./letters.js";
import {
  type Letter,
  type LetterInformation,
  type LetterInformationState,
  type FeedbackLetter,
} from "./types.js";

export class WordleSolver {
  private letterInformation: LetterInformation;

  constructor() {
    this.letterInformation = this.initializeLetterInformation();
  }

  private initializeLetterInformation(): LetterInformation {
    return letters.reduce((acc, letter) => {
      acc[letter] = {
        presentAtIndex: null,
        absentAtIndecies: [],
        absent: false,
      };
      return acc;
    }, {} as LetterInformation);
  }

  private isLetterPresent(letter: Letter): boolean {
    return (
      this.letterInformation[letter].presentAtIndex !== null ||
      this.letterInformation[letter].absentAtIndecies.length > 0
    );
  }

  private isLetterAbsent(letter: Letter): boolean {
    return this.letterInformation[letter].absent;
  }

  private processFeedback(guess: string, feedback: string): void {
    feedback.split("").forEach((feedbackLetter, position) => {
      const letterKey = guess[position] as Letter;

      switch (feedbackLetter as FeedbackLetter) {
        case "g": // Green: letter is correct and in the right position
          this.letterInformation[letterKey].presentAtIndex = position;
          break;
        case "y": // Yellow: letter is correct but in the wrong position
          this.letterInformation[letterKey].absentAtIndecies.push(position);
          break;
        case "b": // Black: letter is not in the word
          this.processBlackLetter(guess, feedback, letterKey, position);
          break;
      }
    });
  }

  private processBlackLetter(
    guess: string,
    feedback: string,
    letterKey: Letter,
    position: number
  ): void {
    // Only mark as absent if ALL instances of this letter in the guess are black
    const allInstancesBlack = guess.split("").every((letter, index) => {
      if (letter === letterKey) {
        return feedback[index] === "b";
      }
      return true;
    });

    if (allInstancesBlack) {
      this.letterInformation[letterKey].absent = true;
    } else {
      // If not all instances are black, just mark this position as forbidden
      this.letterInformation[letterKey].absentAtIndecies.push(position);
    }
  }

  private getValidAnswers(): string[] {
    const presentLetters = Object.keys(this.letterInformation).filter(
      (letter) => this.isLetterPresent(letter as Letter)
    );

    const absentLetters = Object.keys(this.letterInformation).filter((letter) =>
      this.isLetterAbsent(letter as Letter)
    );

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
          const letterKey = letter as Letter;
          return !this.letterInformation[letterKey].absentAtIndecies.includes(
            index
          );
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
  }

  public getNextGuess(guess: string, feedback: string): string | undefined {
    this.processFeedback(guess, feedback);
    const validAnswers = this.getValidAnswers();

    if (validAnswers.length === 0) {
      return undefined; // No valid answers found
    }

    return validAnswers[0];
  }

  public isSolved(guess: string, feedback: string): boolean {
    this.processFeedback(guess, feedback);
    const validAnswers = this.getValidAnswers();
    return validAnswers.length === 1 && validAnswers[0] === guess;
  }

  public reset(): void {
    this.letterInformation = this.initializeLetterInformation();
  }
}

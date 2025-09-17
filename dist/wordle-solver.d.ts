export declare class WordleSolver {
    private letterInformation;
    constructor();
    private initializeLetterInformation;
    private isLetterPresent;
    private isLetterAbsent;
    private processFeedback;
    private processBlackLetter;
    private getValidAnswers;
    getNextGuess(guess: string, feedback: string): string | undefined;
    isSolved(guess: string, feedback: string): boolean;
    reset(): void;
}
//# sourceMappingURL=wordle-solver.d.ts.map
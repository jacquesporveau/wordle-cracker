import type { letters } from "./letters.js";
export type Letter = (typeof letters)[number];
export interface LetterInformationState {
    presentAtIndex: number | null;
    absentAtIndecies: number[];
    absent: boolean;
}
export type LetterInformation = Record<Letter, LetterInformationState>;
export interface FeedbackResponse {
    value: string;
}
export type FeedbackLetter = "g" | "y" | "b";
//# sourceMappingURL=types.d.ts.map
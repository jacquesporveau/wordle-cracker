export type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

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

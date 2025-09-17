import prompts from "prompts";
import { WordleGame } from "./wordle-game.js";
import { WordleTester } from "./wordle-tester.js";

export class CLI {
  public async run(): Promise<void> {
    const choice = await prompts({
      type: "select",
      name: "value",
      message: "What would you like to do?",
      choices: [
        { title: "Play Wordle (interactive)", value: "play" },
        { title: "Test against all words", value: "test" },
      ],
    });

    if (choice.value === "test") {
      const tester = new WordleTester();
      await tester.testAllWords();
      return;
    }

    if (choice.value === "play") {
      const game = new WordleGame();
      await game.play();
      return;
    }
  }
}

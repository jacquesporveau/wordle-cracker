import { CLI } from "./cli.js";

async function main() {
  const cli = new CLI();
  await cli.run();
}

main().catch(console.error);

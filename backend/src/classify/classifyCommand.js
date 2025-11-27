import natural from "natural";

const levenshtein = natural.LevenshteinDistance;
const metaphone = new natural.Metaphone(); // Create an instance of Metaphone

const COMMANDS = ["open", "close"];

export function classify(text) {
  const clean = text;

  const inputPhones = [metaphone.process(clean)];

  let bestCommand = "unknown";
  let bestScore = Infinity;

  for (const cmd of COMMANDS) {
    const cmdPhones = [metaphone.process(cmd)];

    // phonetic comparison
    const phoneticScore = levenshtein(inputPhones[0], cmdPhones[0]);

    // textual comparison
    const textScore = levenshtein(clean, cmd);

    const score = phoneticScore + textScore;

    if (score < bestScore) {
      bestScore = score;
      bestCommand = cmd;
    }
  }

  if (bestScore > 6) return "unknown";

  return bestCommand;
}
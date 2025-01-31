/**
 * Merges multiple lists of questions into a final set.
 * @param questionLists - Array of question lists from different models
 * @returns A merged list of questions
 */
export function mergeQuestions(questionLists: string[][]): string[] {
  const mergedSet = new Set<string>();

  questionLists.forEach((questions) => {
    questions.forEach((question) => mergedSet.add(question.trim()));
  });

  return Array.from(mergedSet);
}

export const extractParameters = (cyphertext: string): string[] => {
  const regex = /\$(\w+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(cyphertext)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

export const validateParameters = (
  cyphertext: string,
  naturalLanguage: string
): boolean => {
  const parameters = extractParameters(cyphertext);
  return parameters.every((param) => naturalLanguage.includes(`$${param}{`));
};

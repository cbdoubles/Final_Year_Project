// Extract parameters from the cyphertext query
export const extractParameters = (cyphertext: string): string[] => {
  // Regular expression to match placeholders in the format: $variable
  const regex = /\$(\w+)/g;
  const matches = [];
  let match;

  // Iterate through matches in the cyphertext
  while ((match = regex.exec(cyphertext)) !== null) {
    // Extract the parameter name (variable name)
    matches.push(match[1]);
  }
  return matches;
};

// Validate parameters between cyphertext and natural language query
export const validateParameters = (
  cyphertext: string,
  naturalLanguage: string
): boolean => {
  // Extract parameters from the cyphertext query
  const parameters = extractParameters(cyphertext);

  // Check if each parameter in the cyphertext exists in the natural language query
  return parameters.every((param) => naturalLanguage.includes(`$${param}{`));
};

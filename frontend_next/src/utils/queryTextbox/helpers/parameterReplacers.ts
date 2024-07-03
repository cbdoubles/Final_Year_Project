// Replace placeholders in the natural language query
export const replaceNaturalLanguageParameters = (
  query: string,
  params: Record<string, string>
) => {
  // Regular expression to match placeholders in the format: ${variable}:{type}
  const regex = /\$(\w+)\{(\w+):(\w+)\}/g;
  let resultQuery = query;
  let match;

  // Iterate through matches in the query
  while ((match = regex.exec(query)) !== null) {
    // Check if the params object has the variable defined
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [placeholder, variable, type, key] = match;
    // Replace the placeholder with the corresponding value from params
    // eslint-disable-next-line no-prototype-builtins
    if (params.hasOwnProperty(variable)) {
      resultQuery = resultQuery.replace(placeholder, params[variable]);
    }
  }

  return resultQuery;
};

// Replace placeholders in the Cypher query
export const replaceParametersInCypherQuery = (
  query: string,
  params: Record<string, string>
) => {
  let resultQuery = query;
  // Iterate through each key-value pair in params
  for (const key in params) {
    const realkey = key.split("{")[0]; // Extract the actual key from the placeholder format (e.g., $variable{type})
    const regex = new RegExp("\\" + realkey, "g"); // Create a regular expression to replace all occurrences of the key in the query
    resultQuery = resultQuery.replace(regex, params[key]); // Replace the key in the query with its corresponding value from params
  }
  return resultQuery;
};

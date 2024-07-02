// export const extractParameters = (cyphertext: string): string[] => {
//   const regex = /\$(\w+)/g;
//   const matches = [];
//   let match;
//   while ((match = regex.exec(cyphertext)) !== null) {
//     matches.push(match[1]);
//   }
//   return matches;
// };

// export const extractNaturalLanguageParameters = (
//   naturalLanguage: string
// ): string[] => {
//   const regex = /\$(\w+)\{/g;
//   const matches = [];
//   let match;
//   while ((match = regex.exec(naturalLanguage)) !== null) {
//     matches.push(match[1]);
//   }
//   return matches;
// };

// export const validateParameters = (
//   cyphertext: string,
//   naturalLanguage: string
// ): boolean => {
//   const cypherParams = extractParameters(cyphertext);
//   const naturalLanguageParams =
//     extractNaturalLanguageParameters(naturalLanguage);

//   if (cypherParams.length !== naturalLanguageParams.length) {
//     return false;
//   }

//   const cypherParamsSet = new Set(cypherParams);
//   const naturalLanguageParamsSet = new Set(naturalLanguageParams);

//   if (cypherParamsSet.size !== naturalLanguageParamsSet.size) {
//     return false;
//   }

//   const cypherParamsArray = Array.from(cypherParamsSet);
//   for (const param of cypherParamsArray) {
//     if (!naturalLanguageParamsSet.has(param)) {
//       return false;
//     }
//   }

//   return true;
// };


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
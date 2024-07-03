import { toast } from "react-toastify";

/**
 * Handle Error Function
 *
 * @description
 * Validates input values and displays error messages using toast notifications if conditions are not met.
 *
 * @param {string} natLang - Natural language query string.
 * @param {Record<string, string>} inputValues - Record of input placeholders and their corresponding values.
 * @param {number} boxes - Number of input boxes or placeholders expected.
 * @returns {boolean} - Returns true if all validations pass, otherwise false.
 */
export const handleError = (
  natLang: string,
  inputValues: Record<string, string>,
  boxes: number
): boolean => {
  // Check if no query is selected
  if (natLang === "") {
    toast.error("No query selected", {
      position: "bottom-right",
      theme: "colored",
    });
    return false;
  }

  // Check if not all input values are filled based on the number of boxes expected
  if (Object.keys(inputValues).length < boxes) {
    toast.error("Fill in the query text before proceeding.", {
      position: "bottom-right",
      theme: "colored",
    });
    return false;
  }

  // Check each input value individually and display an error if any are empty
  for (const key in inputValues) {
    if (inputValues[key] === "") {
      toast.error("Fill in the query text before proceeding.", {
        position: "bottom-right",
        theme: "colored",
      });
      return false;
    }
  }
  return true;
};

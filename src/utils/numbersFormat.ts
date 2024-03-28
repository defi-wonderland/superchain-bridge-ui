/**
 * Formats a number as a string for display, using U.S. locale formatting, without limiting to a specific number of decimals.
 * @param number The number to format.
 * @param decimals The number of decimal places to include. Not strictly limited, but used as a guide.
 * @returns A string representing the formatted number in U.S. locale.
 */
export const formatNumberForDisplay = (number: number, decimals: number): string => {
  // Use Intl.NumberFormat with dynamic minimum and maximum fraction digits based on decimals.
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals, // Adjust this if you need more flexibility in the number of decimal places shown.
  }).format(number);
};

/**
 * Parses a string input as a number, ensuring that both dot and comma decimal separators are correctly interpreted.
 * @param input The string input to parse.
 * @returns The parsed number, or NaN if the input is not a valid number.
 */
export const parseInputToNumber = (input: string): number => {
  const normalizedInput = input.replace(/,/g, '.');
  return parseFloat(normalizedInput);
};

/**
 * Normalizes a string input for number fields, ensuring a consistent decimal separator (dot) and filtering out invalid characters.
 * @param input The input string to normalize.
 * @returns A normalized string with only numbers and a dot for decimal separation.
 */
export const normalizeNumberInput = (input: string): string => {
  // Allow numbers, a single dot for decimal, and backspace for corrections.
  const filteredInput = input.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
  // Optionally, add logic here to limit to a certain number of decimal places if needed.
  return filteredInput;
};

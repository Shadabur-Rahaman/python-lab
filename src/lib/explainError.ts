/**
 * Plain-language, beginner-friendly explanations for common Python runtime and syntax errors.
 */
export function explainError(error: string): string {
  if (/IndentationError: expected an indented block/.test(error)) {
    return 'Python requires an indented block (usually 4 spaces) after an if, elif, else, for, while, or def line.';
  }
  if (/IndentationError: unexpected indent/.test(error)) {
    return 'This line has extra spaces at the beginning where Python was not expecting indentation. Align it with the lines in the same block.';
  }
  if (/IndentationError|TabError/.test(error)) {
    return 'Check the leading spaces on the indicated line and make sure spaces and tabs are not mixed.';
  }
  if (error.includes("SyntaxError: expected ':'")) {
    return "Python expects a colon ':' at the end of this header. Check the indicated if, elif, else, for, while, or def line.";
  }
  if (/SyntaxError: unterminated string literal|EOL while scanning string literal/.test(error)) {
    return "Look at the indicated line and the line above it. You opened quotation marks (' or \") but forgot to close them before the end of the line.";
  }
  if (/SyntaxError: '[\(\[\{]' was never closed|unexpected EOF while parsing/.test(error)) {
    return "Look at the indicated line and the line above it. A bracket or parenthesis was opened but never closed. Check that every '(', '[', and '{' has a matching closing pair.";
  }
  if (/SyntaxError: unmatched '[\)\]\}]'/.test(error)) {
    return "Look at the indicated line and the line above it. You have an extra closing bracket or parenthesis without an opening one. Check the line for mismatched brackets.";
  }
  if (error.includes('SyntaxError: cannot assign to')) {
    return "Look at the indicated line and the line above it. The variable name must be on the left side of '='. You cannot assign to a calculation or literal value.";
  }
  if (error.includes('SyntaxError')) {
    return 'Look at the indicated line and the line above it. Check for missing punctuation, brackets, colons, or mismatched quotes.';
  }
  if (error.includes('ZeroDivisionError')) {
    return 'You cannot divide by zero. Check your calculation or denominator before dividing.';
  }
  if (error.includes('IndexError')) {
    return 'List index out of range. Remember: Python indexes start at 0, and the last item is at length - 1.';
  }
  if (error.includes('KeyError')) {
    return 'This key was not found in the dictionary. Check spelling or use dict.get(key, default) for safe lookups.';
  }
  if (error.includes('ValueError: invalid literal for int()')) {
    return 'The text cannot be converted to a whole number. Make sure the value contains only digits before calling int().';
  }
  if (error.includes('ValueError: could not convert string to float')) {
    return 'The text cannot be converted to a decimal number. Check that it represents a valid number.';
  }
  if (error.includes('NameError')) {
    return 'Check that the name is spelled correctly and defined above this line. Remember: Python is case-sensitive (e.g. print, not Print).';
  }
  if (error.includes('TypeError: can only concatenate str')) {
    return "Cannot combine text and numbers directly with '+'. Wrap numbers with str(x) or use an f-string: f'Value: {x}'.";
  }
  if (error.includes('TypeError:') && error.includes('is not callable')) {
    return "You used parentheses '()' on a value that is not a function, or accidentally used a built-in name like print as a variable.";
  }
  if (error.includes('TypeError: unsupported operand type(s)')) {
    return 'The operator cannot be applied between these different types. Convert them to matching types first.';
  }
  if (error.includes('TypeError')) {
    return 'Check the types of the values supplied to the operation or function.';
  }
  if (error.includes('EOFError')) {
    return 'Add one queued response in Program Input for each input() call, then run again.';
  }
  if (error.includes('AttributeError')) {
    return 'This object does not have that method or property. Check for typos or verify what data type you are using.';
  }
  if (error.includes('UnboundLocalError')) {
    return 'A local variable was used before being assigned a value in this function.';
  }
  return '';
}

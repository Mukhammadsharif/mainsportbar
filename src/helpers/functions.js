export function toCapitalize(str) {
  if (!str) {
    return str;
  } // Return if empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
}

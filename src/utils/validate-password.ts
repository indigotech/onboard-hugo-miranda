export function validatePassword(password: string): boolean {
  // RegExp needs:
  // at least 7 characters
  // at least 1 letter
  // at least 1 number

  const passwordRegex = `^(?=.*?[a-z])(?=.*?[0-9]).{7,}$`;

  return new RegExp(passwordRegex).test(password.toLocaleLowerCase());
}

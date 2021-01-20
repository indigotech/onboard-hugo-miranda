export function ValidateCpf(cpf: string): boolean {
  // RegExp formats:
  // 123.456.789-01
  // 12345678901

  const cpfRegex = `([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})`;

  const isValid = new RegExp(cpfRegex).test(cpf.toLocaleLowerCase());

  return isValid;
}
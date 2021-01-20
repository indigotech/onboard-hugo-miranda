export function FormatCpf(cpf: string): string {
  const formattedCpf = cpf.replace(/\./g, '').replace(/\-/g, '');

  return formattedCpf;
}

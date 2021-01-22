export function formatCpf(cpf: string): string {
  const formattedCpf = cpf.replace(/\./g, '').replace(/\-/g, '');

  return formattedCpf;
}

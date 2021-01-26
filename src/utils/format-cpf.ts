export function formatCpf(cpf: string): string {
  return cpf.replace(/\./g, '').replace(/\-/g, '');
}

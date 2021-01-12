export default interface IHashProvider {
  generate(payload: string): Promise<string>;
  verify(paylaod: string, hash: string): Promise<boolean>;
}

import { compare, hash } from 'bcryptjs';
import IHashProvider from './i-hash-provider';

export default class HashProvider implements IHashProvider {
  async generate(payload: string): Promise<string> {
    return await hash(payload, 8);
  }

  async verify(paylaod: string, hash: string): Promise<boolean> {
    return await compare(paylaod, hash);
  }
}

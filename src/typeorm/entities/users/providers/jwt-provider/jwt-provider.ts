import jwt from 'jsonwebtoken';
import { IJWTProvider } from './i-jwt-provider';
import { JWTConfig } from './jwt-config';

export class JWTProvider implements IJWTProvider {
  sign(payload: string | Buffer | unknown): string {
    return jwt.sign({ payload }, JWTConfig.jwt.privateKey, JWTConfig.signOptions);
  }

  verify(token: string): Promise<any> {
    return new Promise((resolve, reject) =>
      jwt.verify(token, JWTConfig.jwt.publicKey, (error, data) => (error ? reject(error) : resolve(data))),
    );
  }
}

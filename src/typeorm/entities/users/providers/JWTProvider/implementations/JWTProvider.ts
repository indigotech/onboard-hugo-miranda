import jwt from 'jsonwebtoken';
import jwtConfig from '../../../../../../config/jwt';
import IJWTProvider from '../models/IJWTProvider';

export default class JWTProvider implements IJWTProvider {
  sign(payload: string | Buffer | unknown): string {
    return jwt.sign({ payload }, jwtConfig.jwt.privateKey, jwtConfig.signOptions);
  }

  verify(token: string): Promise<any> {
    return new Promise((resolve, reject) =>
      jwt.verify(token, jwtConfig.jwt.publicKey, (error, data) => (error ? reject(error) : resolve(data))),
    );
  }
}

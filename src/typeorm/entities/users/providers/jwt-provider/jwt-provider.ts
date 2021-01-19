import jwt from 'jsonwebtoken';
import { IJWTProvider, IVerifyResponse, Sign } from './i-jwt-provider';
import { JWTConfig } from './jwt-config';

export class JWTProvider implements IJWTProvider {
  sign({ payload, rememberMe }: Sign): string {
    JWTConfig.signOptions.expiresIn = rememberMe ? JWTConfig.rememberedExpiresIn : JWTConfig.expiresIn;
    return jwt.sign({ payload }, JWTConfig.jwt.privateKey, JWTConfig.signOptions);
  }

  verify(token: string): Promise<IVerifyResponse> {
    return new Promise((resolve, reject) =>
      jwt.verify(token, JWTConfig.jwt.publicKey, (error, data) =>
        error ? reject(error) : resolve(data as IVerifyResponse),
      ),
    );
  }
}

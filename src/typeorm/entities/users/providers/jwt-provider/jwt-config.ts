import { Secret, SignOptions } from 'jsonwebtoken';

interface IJWTConfig {
  salt: Secret;
  signOptions: SignOptions;
  expiresIn: string;
  rememberedExpiresIn: string;
  jwt: {
    privateKey: string;
    publicKey: string;
  };
}

export const JWTConfig: IJWTConfig = {
  salt: process.env.JWT_SALT,
  expiresIn: process.env.JWT_EXPIRES_IN,
  rememberedExpiresIn: process.env.JWT_REMEMBERED_EXPIRES_IN,
  signOptions: {
    algorithm: 'RS256',
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
  },
};

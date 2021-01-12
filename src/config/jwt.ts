import { Secret, SignOptions } from 'jsonwebtoken';

interface JWTConfig {
  salt: Secret;
  signOptions: SignOptions;
  jwt: {
    privateKey: string;
    publicKey: string;
  };
}

const JWTConfig: JWTConfig = {
  salt: process.env.JWT_SALT,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: 'RS256',
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
  },
};

export default JWTConfig;

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
  salt: '10',
  signOptions: {
    expiresIn: 15,
    algorithm: 'RS256',
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
  },
};

export default JWTConfig;

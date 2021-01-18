export interface Sign {
  payload: string | Buffer | unknown;
  rememberMe?: boolean;
}

export interface IVerifyResponse {
  payload: {
    userId: number;
  };
  iat?: number;
  exp?: number;
}

export interface IJWTProvider {
  sign(data: Sign): string;
  verify(token: string): Promise<IVerifyResponse>;
}

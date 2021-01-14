export interface Sign {
  payload: string | Buffer | unknown;
  rememberMe?: boolean;
}

export interface IJWTProvider {
  sign(data: Sign): string;
  verify(token: string): Promise<any>;
}

export interface IJWTProvider {
  sign(payload: string | Buffer | unknown): string;
  verify(token: string): Promise<any>;
}

export class AppError extends Error {
  public readonly message: string;
  public readonly code: number;
  public readonly additionalInfo: string;

  constructor(message: string, code = 500, additionalInfo?: string) {
    super(message);

    this.message = message;
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}

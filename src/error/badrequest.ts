export class BadRequestError extends Error {
    public statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.name = 'BadRequest';
      this.statusCode = 422;
    }
  }
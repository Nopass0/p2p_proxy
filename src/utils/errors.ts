export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Не авторизован') {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Нет доступа') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не найден') {
    super(404, message);
  }
}
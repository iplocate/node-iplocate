/** Base class for all IPLocate API errors */
export class IPLocateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IPLocateError';
  }
}

/** Error thrown when an invalid IP address is provided */
export class InvalidIPError extends IPLocateError {
  constructor(ip: string) {
    super(`Invalid IP address: ${ip}`);
    this.name = 'InvalidIPError';
  }
}

/** Error thrown when API authentication fails */
export class AuthenticationError extends IPLocateError {
  constructor(message = 'Invalid API key') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/** Error thrown when IP address is not found */
export class NotFoundError extends IPLocateError {
  constructor(message = 'IP address not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/** Error thrown when rate limit is exceeded */
export class RateLimitError extends IPLocateError {
  constructor(message = 'Rate limit exceeded. Upgrade your plan at https://iplocate.io/account') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/** Error thrown for general API errors */
export class APIError extends IPLocateError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

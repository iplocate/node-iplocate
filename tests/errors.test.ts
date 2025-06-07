import {
  IPLocateError,
  InvalidIPError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  APIError,
} from '../src/errors.js';

describe('Error Classes', () => {
  describe('IPLocateError', () => {
    it('should create base error with message', () => {
      const error = new IPLocateError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(IPLocateError);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('IPLocateError');
    });
  });

  describe('InvalidIPError', () => {
    it('should create error with IP address', () => {
      const error = new InvalidIPError('256.256.256.256');

      expect(error).toBeInstanceOf(IPLocateError);
      expect(error).toBeInstanceOf(InvalidIPError);
      expect(error.message).toBe('Invalid IP address: 256.256.256.256');
      expect(error.name).toBe('InvalidIPError');
    });
  });

  describe('AuthenticationError', () => {
    it('should create error with default message', () => {
      const error = new AuthenticationError();

      expect(error).toBeInstanceOf(IPLocateError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Invalid API key');
      expect(error.name).toBe('AuthenticationError');
    });

    it('should create error with custom message', () => {
      const error = new AuthenticationError('Custom auth error');

      expect(error.message).toBe('Custom auth error');
      expect(error.name).toBe('AuthenticationError');
    });
  });

  describe('NotFoundError', () => {
    it('should create error with custom message', () => {
      const error = new NotFoundError('Custom not found message');

      expect(error).toBeInstanceOf(IPLocateError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Custom not found message');
      expect(error.name).toBe('NotFoundError');
    });

    it('should create error with default message', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('IP address not found');
      expect(error.name).toBe('NotFoundError');
    });
  });

  describe('RateLimitError', () => {
    it('should create error with default message', () => {
      const error = new RateLimitError();

      expect(error).toBeInstanceOf(IPLocateError);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.message).toBe('Rate limit exceeded. Upgrade your plan at https://iplocate.io/account');
      expect(error.name).toBe('RateLimitError');
    });

    it('should create error with custom message', () => {
      const error = new RateLimitError('Too many requests');

      expect(error.message).toBe('Too many requests');
      expect(error.name).toBe('RateLimitError');
    });
  });

  describe('APIError', () => {
    it('should create error with message and status code', () => {
      const error = new APIError('Server error', 500);

      expect(error).toBeInstanceOf(IPLocateError);
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('Server error');
      expect(error.name).toBe('APIError');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('inheritance chain', () => {
    it('should maintain proper inheritance', () => {
      const errors = [
        new InvalidIPError('test'),
        new AuthenticationError(),
        new NotFoundError('test'),
        new RateLimitError(),
        new APIError('test', 500),
      ];

      errors.forEach(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(IPLocateError);
      });
    });
  });
});

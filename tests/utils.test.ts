import { encodeIP } from '../src/utils.js';

describe('Utils', () => {
  describe('encodeIP', () => {
    it('should encode IPv4 addresses correctly', () => {
      expect(encodeIP('192.168.1.1')).toBe('192.168.1.1');
      expect(encodeIP('127.0.0.1')).toBe('127.0.0.1');
    });

    it('should encode IPv6 addresses correctly', () => {
      expect(encodeIP('2001:4860:4860::8888')).toBe('2001%3A4860%3A4860%3A%3A8888');
      expect(encodeIP('::1')).toBe('%3A%3A1');
    });

    it('should handle special characters', () => {
      expect(encodeIP('test:value')).toBe('test%3Avalue');
    });
  });
});

import IPLocate from '../src/client.js';
import {
  IPLocateError,
  InvalidIPError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  APIError,
} from '../src/errors.js';
import type { LookupResponse } from '../src/types.js';

describe('IPLocate Client', () => {
  const API_KEY = 'test-api-key';
  let client: IPLocate;
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    client = new IPLocate(API_KEY);
    jest.clearAllMocks();

    mockFetch = jest.spyOn(global, 'fetch');
  });

  describe('constructor', () => {
    it('should create instance with API key', () => {
      expect(client).toBeInstanceOf(IPLocate);
    });

    it('should throw error for missing API key', () => {
      expect(() => new IPLocate('')).toThrow(IPLocateError);
      expect(() => new IPLocate(null as any)).toThrow(IPLocateError);
    });

    it('should accept custom options', () => {
      const customClient = new IPLocate(API_KEY, {
        baseUrl: 'https://custom.api.com',
        timeout: 10000,
      });
      expect(customClient).toBeInstanceOf(IPLocate);
    });
  });

  describe('lookup', () => {
    const mockResponse: LookupResponse = {
      ip: '8.8.8.8',
      country: 'United States',
      country_code: 'US',
      is_eu: false,
      city: 'Mountain View',
      continent: 'North America',
      latitude: 37.4056,
      longitude: -122.0775,
      time_zone: 'America/Los_Angeles',
      postal_code: '94043',
      subdivision: 'California',
      currency_code: 'USD',
      calling_code: '1',
      network: '8.8.8.0/24',
      asn: {
        asn: 'AS15169',
        route: '8.8.8.0/24',
        netname: 'GOOGLE',
        name: 'Google LLC',
        country_code: 'US',
        domain: 'google.com',
        type: 'business',
        rir: 'ARIN',
      },
      privacy: {
        is_abuser: false,
        is_anonymous: false,
        is_bogon: false,
        is_hosting: false,
        is_icloud_relay: false,
        is_proxy: false,
        is_tor: false,
        is_vpn: false,
      },
      company: {
        name: 'Google LLC',
        domain: 'google.com',
        country_code: 'US',
        type: 'business',
      },
      hosting: {
        provider: 'Google Cloud',
        domain: 'google.com',
        network: '8.8.8.0/24',
        region: 'us-west1',
        service: 'compute',
      },
      abuse: {
        address: '1600 Amphitheatre Parkway',
        country_code: 'US',
        email: 'abuse@google.com',
        name: 'Google Abuse Team',
        network: '8.8.8.0/24',
        phone: '+1-650-253-0000',
      },
    };

    it('should lookup IPv4 address successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await client.lookup('8.8.8.8');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://iplocate.io/api/lookup/8.8.8.8'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'User-Agent': 'node-iplocate/2.0.1',
          }),
        })
      );
    });

    it('should lookup IPv6 address successfully', async () => {
      const ipv6Response = { ...mockResponse, ip: '2001:4860:4860::8888' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ipv6Response,
      } as Response);

      const result = await client.lookup('2001:4860:4860::8888');

      expect(result.ip).toBe('2001:4860:4860::8888');
    });

    it('should include API key in request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      await client.lookup('8.8.8.8');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain(`apikey=${API_KEY}`);
    });

    it('should throw InvalidIPError for invalid IP', async () => {
      await expect(client.lookup('invalid-ip')).rejects.toThrow(InvalidIPError);
      await expect(client.lookup('256.256.256.256')).rejects.toThrow(InvalidIPError);
    });

    it('should handle 400 Bad Request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid IP address format' }),
      } as Response);

      await expect(client.lookup('192.168.1.1')).rejects.toThrow(InvalidIPError);
    });

    it('should handle 403 Forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Invalid API key' }),
      } as Response);

      await expect(client.lookup('192.168.1.1')).rejects.toThrow(AuthenticationError);
    });

    it('should handle 404 Not Found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'IP address not found' }),
      } as Response);

      await expect(client.lookup('192.168.1.1')).rejects.toThrow(NotFoundError);
    });

    it('should handle 429 Rate Limit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded. Upgrade your plan at https://iplocate.io/account' }),
      } as Response);

      await expect(client.lookup('8.8.8.8')).rejects.toThrow(RateLimitError);
    });

    it('should handle 500 Server Error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      } as Response);

      await expect(client.lookup('8.8.8.8')).rejects.toThrow(APIError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.lookup('8.8.8.8')).rejects.toThrow(IPLocateError);
    });

    it('should handle timeout', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      await expect(client.lookup('8.8.8.8')).rejects.toThrow(/timeout/i);
    });
  });

  describe('lookupSelf', () => {
    it('should lookup self IP successfully', async () => {
      const mockResponse: LookupResponse = {
        ip: '203.0.113.1',
        country: 'Australia',
        country_code: 'AU',
        is_eu: false,
        privacy: {
          is_abuser: false,
          is_anonymous: false,
          is_bogon: false,
          is_hosting: false,
          is_icloud_relay: false,
          is_proxy: false,
          is_tor: false,
          is_vpn: false,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await client.lookupSelf();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://iplocate.io/api/lookup/'),
        expect.any(Object)
      );
    });
  });

  describe('custom configuration', () => {
    it('should use custom base URL', async () => {
      const customClient = new IPLocate(API_KEY, {
        baseUrl: 'https://custom.api.com/v1',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ip: '8.8.8.8', privacy: { is_vpn: false } }),
      } as Response);

      await customClient.lookup('8.8.8.8');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom.api.com/v1/lookup/8.8.8.8'),
        expect.any(Object)
      );
    });

    it('should use custom timeout', async () => {
      const fastClient = new IPLocate(API_KEY, { timeout: 50 });

      // Mock fetch to reject with AbortError after a delay
      mockFetch.mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            const error = new Error('The operation was aborted');
            error.name = 'AbortError';
            reject(error);
          }, 60);
        });
      });

      await expect(fastClient.lookup('8.8.8.8')).rejects.toThrow(/timeout/i);
    }, 200); // Set test timeout to 200ms

    it('should merge custom HTTP client options', async () => {
      const customClient = new IPLocate(API_KEY, {
        httpClientOptions: {
          headers: {
            'Custom-Header': 'test-value',
          },
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ip: '8.8.8.8', privacy: { is_vpn: false } }),
      } as Response);

      await customClient.lookup('8.8.8.8');

      const [, options] = mockFetch.mock.calls[0];
      const headers = (options as RequestInit).headers as Record<string, string>;
      expect(headers).toEqual(
        expect.objectContaining({
          'Custom-Header': 'test-value',
          'Accept': 'application/json',
          'User-Agent': 'node-iplocate/2.0.1',
        })
      );
    });
  });
});

import {
  APIError,
  AuthenticationError,
  IPLocateError,
  InvalidIPError,
  NotFoundError,
  RateLimitError,
} from './errors.js';
import type { APIErrorResponse, IPLocateOptions, LookupResponse } from './types.js';
import { encodeIP } from './utils.js';
import { isValidIp } from 'ip-utils';

const DEFAULT_BASE_URL = 'https://iplocate.io/api';
const DEFAULT_TIMEOUT = 5000;

/**
 * IPLocate API client for geolocation and threat intelligence data
 */
export default class IPLocate {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly httpClientOptions: RequestInit;

  /**
   * Create a new IPLocate client
   * @param apiKey Your IPLocate API key
   * @param options Configuration options
   */
  constructor(apiKey: string, options: IPLocateOptions = {}) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new IPLocateError('API key is required');
    }

    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl?.replace(/\/$/, '') || DEFAULT_BASE_URL;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
    this.httpClientOptions = options.httpClientOptions || {};
  }

  /**
   * Look up geolocation and threat intelligence data for an IP address
   * @param ip The IP address to look up
   * @returns Promise resolving to lookup response
   */
  async lookup(ip: string): Promise<LookupResponse> {
    if (!isValidIp(ip)) {
      throw new InvalidIPError(ip);
    }
    const endpoint = `${this.baseUrl}/lookup/${encodeIP(ip)}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Look up geolocation and threat intelligence data for the client's current IP address
   * @returns Promise resolving to lookup response
   */
  async lookupSelf(): Promise<LookupResponse> {
    const endpoint = `${this.baseUrl}/lookup/`;
    return this.makeRequest(endpoint);
  }

  /**
   * Make HTTP request to the IPLocate API
   * @param endpoint The API endpoint URL
   * @returns Promise resolving to lookup response
   */
  private async makeRequest(endpoint: string): Promise<LookupResponse> {
    const url = new URL(endpoint);
    url.searchParams.set('apikey', this.apiKey);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        ...this.httpClientOptions,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'node-iplocate/2.0.1',
          ...this.httpClientOptions.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different HTTP status codes
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json() as LookupResponse;
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof IPLocateError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new IPLocateError(`Request timeout after ${this.timeout}ms`);
        }
        throw new IPLocateError(`Request failed: ${error.message}`);
      }

      throw new IPLocateError('Unknown error occurred');
    }
  }

  /**
   * Handle error responses from the API
   * @param response The fetch response object
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json() as APIErrorResponse;
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Ignore JSON parsing errors, use default message
    }

    switch (response.status) {
      case 400:
        throw new InvalidIPError(errorMessage);
      case 403:
        throw new AuthenticationError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 429:
        throw new RateLimitError(errorMessage);
      default:
        throw new APIError(errorMessage, response.status);
    }
  }
}

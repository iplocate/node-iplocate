import IPLocate from '../src/client.js';
import {
  InvalidIPError,
} from '../src/errors.js';

const LIVE_API_KEY = process.env.IPLOCATE_API_KEY;

const describeIntegration = LIVE_API_KEY ? describe : describe.skip;

describeIntegration('IPLocate Integration Tests', () => {
  let client: IPLocate;

  beforeAll(() => {
    client = new IPLocate(LIVE_API_KEY ?? '');
  });

  describe('Live API calls', () => {
    it('should lookup Google DNS (8.8.8.8) successfully', async () => {
      const result = await client.lookup('8.8.8.8');

      expect(result.ip).toBe('8.8.8.8');
      expect(result.country).toBeDefined();
      expect(result.country_code).toBeDefined();
      expect(typeof result.is_eu).toBe('boolean');

      expect(result.asn).toBeDefined();
      expect(result.asn?.asn).toMatch(/^AS\d+$/);
      expect(result.asn?.name).toBeDefined();

      expect(result.privacy).toBeDefined();
      expect(typeof result.privacy.is_vpn).toBe('boolean');
      expect(typeof result.privacy.is_proxy).toBe('boolean');
      expect(typeof result.privacy.is_tor).toBe('boolean');

      console.log('Google DNS (8.8.8.8) result:', {
        ip: result.ip,
        country: result.country,
        city: result.city,
        asn: result.asn?.name,
        is_vpn: result.privacy.is_vpn,
      });
    }, 15000);

    it('should lookup IPv6 address (Google DNS) successfully', async () => {
      const result = await client.lookup('2001:4860:4860::8888');

      expect(result.ip).toBe('2001:4860:4860:0000:0000:0000:0000:8888');
      expect(result.country).toBeDefined();
      expect(result.privacy).toBeDefined();

      console.log('Google DNS IPv6 result:', {
        ip: result.ip,
        country: result.country,
        city: result.city,
      });
    }, 15000);

    it('should lookup own IP address with lookupSelf()', async () => {
      const result = await client.lookupSelf();

      expect(result.ip).toBeDefined();
      expect(result.ip).toMatch(/^(?:\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]+$/);
      expect(result.country).toBeDefined();
      expect(result.privacy).toBeDefined();

      console.log('Own IP result:', {
        ip: result.ip,
        country: result.country,
        city: result.city,
      });
    }, 15000);

    it('should handle Cloudflare DNS (1.1.1.1) correctly', async () => {
      const result = await client.lookup('1.1.1.1');

      expect(result.ip).toBe('1.1.1.1');
      expect(result.country).toBeDefined();
      expect(result.asn).toBeDefined();
      expect(result.privacy).toBeDefined();

      expect(result.asn?.name).toContain('Cloudflare');

      console.log('Cloudflare DNS (1.1.1.1) result:', {
        ip: result.ip,
        country: result.country,
        asn: result.asn?.name,
      });
    }, 15000);

    it('should throw InvalidIPError for invalid IP format', async () => {
      await expect(client.lookup('invalid-ip-address')).rejects.toThrow(InvalidIPError);
      await expect(client.lookup('256.256.256.256')).rejects.toThrow(InvalidIPError);
      await expect(client.lookup('192.168.1')).rejects.toThrow(InvalidIPError);
    });

    it('should handle private IP addresses appropriately', async () => {
      const result = await client.lookup('192.168.1.1');

      expect(result.ip).toBe('192.168.1.1');
      expect(result.privacy).toBeDefined();
      console.log('Private IP (192.168.1.1) result:', result);
    }, 10000);
  });
});

if (!LIVE_API_KEY) {
  console.log('Integration tests skipped. Set IPLOCATE_API_KEY environment variable to run them.');
  console.log('Example: IPLOCATE_API_KEY=your_key_here yarn test integration.test.ts\n');
}

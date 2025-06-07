/**
 * Creates a URL-safe path component from an IP address
 * @param ip The IP address to encode
 * @returns URL-encoded IP address
 */
export function encodeIP(ip: string): string {
  return encodeURIComponent(ip);
}

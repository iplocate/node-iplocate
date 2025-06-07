# IPLocate - IP address geolocation and threat detection

[![npm version](https://img.shields.io/npm/v/node-iplocate.svg?style=flat-square)](https://npmjs.org/package/node-iplocate)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/node-iplocate.svg?style=flat-square)](https://npmjs.org/package/node-iplocate)

A Javascript/Typescript client for the [IPLocate.io](https://iplocate.io) geolocation API. Look up detailed geolocation and threat intelligence data for any IP address:

- **IP geolocation**: IP to country, IP to city, IP to region/state, coordinates, timezone, postal code
- **ASN information**: Internet service provider, network details, routing information  
- **Privacy & threat detection**: VPN, proxy, Tor, hosting provider detection
- **Company information**: Business details associated with IP addresses - company name, domain, type (ISP/hosting/education/government/business)
- **Abuse contact**: Network abuse reporting information
- **Hosting detection**: Cloud provider and hosting service detection using our proprietary hosting detection engine

See what information we can provide for [your IP address](https://iplocate.io/what-is-my-ip).

## Getting started

You can make 1,000 free requests per day with a [free account](https://iplocate.io/signup). For higher plans, check out [API pricing](https://www.iplocate.io/pricing).

### Installation

```bash
yarn add node-iplocate
# or
npm install node-iplocate
# or
pnpm add node-iplocate
```

### Quick start

```javascript
import IPLocate from 'node-iplocate';
// or: const IPLocate = require('node-iplocate').default;

// Create a client with your API key
// Get your free API key from https://iplocate.io/signup
const client = new IPLocate('your-api-key');

// Look up an IP address
const result = await client.lookup('8.8.8.8');

console.log(`IP: ${result.ip}`);
if (result.country) {
    console.log(`Country: ${result.country}`);
}
if (result.city) {
    console.log(`City: ${result.city}`);
}

// Check privacy flags
console.log(`Is VPN: ${result.privacy.is_vpn}`);
console.log(`Is Proxy: ${result.privacy.is_proxy}`);
```

### Get your own IP address information

```typescript
// Look up your own IP address (no IP parameter)
const result = await client.lookupSelf();
console.log(`Your IP: ${result.ip}`);
```

### Get the country for an IP address

```typescript
const result = await client.lookup('203.0.113.1');
console.log(`Country: ${result.country} (${result.country_code})`);
```

### Get the currency code for a country by IP address

```typescript
const result = await client.lookup('203.0.113.1');
console.log(`Currency: ${result.currency_code}`);
```

### Get the calling code for a country by IP address

```typescript
const result = await client.lookup('203.0.113.1');
console.log(`Calling code: +${result.calling_code}`);
```

## Authentication

Get your free API key from [IPLocate.io](https://iplocate.io/signup), and pass it when creating the client:

```typescript
const client = new IPLocate('your-api-key');
```

## Examples

### IP address geolocation lookup

```typescript
import IPLocate from 'node-iplocate';

const client = new IPLocate('your-api-key');
const result = await client.lookup('203.0.113.1');

console.log(`Country: ${result.country} (${result.country_code})`);
if (result.latitude && result.longitude) {
    console.log(`Coordinates: ${result.latitude}, ${result.longitude}`);
}
```

### Check for VPN/Proxy Detection

```typescript
const result = await client.lookup('192.0.2.1');

if (result.privacy.is_vpn) {
    console.log('This IP is using a VPN');
}

if (result.privacy.is_proxy) {
    console.log('This IP is using a proxy');
}

if (result.privacy.is_tor) {
    console.log('This IP is using Tor');
}
```

### ASN and network information

```typescript
const result = await client.lookup('8.8.8.8');

if (result.asn) {
    console.log(`ASN: ${result.asn.asn}`);
    console.log(`ISP: ${result.asn.name}`);
    console.log(`Network: ${result.asn.route}`);
}
```

### Custom configuration

```typescript
import IPLocate from 'node-iplocate';

// Custom timeout and HTTP options
const client = new IPLocate('your-api-key', {
    timeout: 60000, // 60 seconds
    baseUrl: 'https://custom-endpoint.com/api', // For enterprise customers
    httpClientOptions: {
        headers: {
            'Custom-Header': 'value'
        }
    }
});
```

## Response structure

The `LookupResponse` interface contains all available data:

```typescript
interface LookupResponse {
    ip: string;
    country?: string;
    country_code?: string;
    is_eu: boolean;
    city?: string;
    continent?: string;
    latitude?: number;
    longitude?: number;
    time_zone?: string;
    postal_code?: string;
    subdivision?: string;
    currency_code?: string;
    calling_code?: string;
    network?: string;
    asn?: ASN;
    privacy: Privacy;
    company?: Company;
    hosting?: Hosting;
    abuse?: Abuse;
}
```

### TypeScript support

All types are exported for use in your TypeScript projects:

```typescript
import IPLocate, { 
    LookupResponse, 
    ASN, 
    Privacy, 
    Company, 
    Hosting, 
    Abuse,
    IPLocateOptions 
} from 'node-iplocate';
```

## Error handling

The library provides typed error classes for different scenarios:

```typescript
import IPLocate, {
    InvalidIPError,
    AuthenticationError,
    NotFoundError,
    RateLimitError,
    APIError
} from 'node-iplocate';

const client = new IPLocate('your-api-key');

try {
    const result = await client.lookup('8.8.8.8');
    console.log(result);
} catch (error) {
    if (error instanceof InvalidIPError) {
        console.log('Invalid IP address format');
    } else if (error instanceof AuthenticationError) {
        console.log('Invalid API key');
    } else if (error instanceof NotFoundError) {
        console.log('IP address not found');
    } else if (error instanceof RateLimitError) {
        console.log('Rate limit exceeded');
    } else if (error instanceof APIError) {
        console.log(`API error (${error.statusCode}): ${error.message}`);
    } else {
        console.log('Unknown error:', error);
    }
}
```

Common API errors:

- `InvalidIPError`: Invalid IP address format (HTTP 400)
- `AuthenticationError`: Invalid API key (HTTP 403)
- `NotFoundError`: IP address not found (HTTP 404)
- `RateLimitError`: Rate limit exceeded (HTTP 429)
- `APIError`: Other API errors (HTTP 500, etc.)

## API reference

For complete API documentation, visit [iplocate.io/docs](https://iplocate.io/docs).

## Development

### Install dependencies

```bash
yarn install
```

### Run tests

```bash
yarn test
```

### Run tests with coverage

```bash
yarn test:coverage
```

### Build the library

```bash
yarn build
```

### Type checking

```bash
yarn type-check
```

### Linting

```bash
yarn lint
yarn lint:fix
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About IPLocate.io

Since 2017, IPLocate has set out to provide the most reliable and accurate IP address data.

We process 50TB+ of data to produce our comprehensive IP geolocation, IP to company, proxy and VPN detection, hosting detection, ASN, and WHOIS data sets. Our API handles over 15 billion requests a month for thousands of businesses and developers.

- Email: [support@iplocate.io](mailto:support@iplocate.io)
- Website: [iplocate.io](https://iplocate.io)
- Documentation: [iplocate.io/docs](https://iplocate.io/docs)
- Sign up for a free API Key: [iplocate.io/signup](https://iplocate.io/signup)

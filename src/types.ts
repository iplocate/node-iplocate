/** Complete response from the IPLocate API */
export interface LookupResponse {
  /** The IP address that was looked up */
  ip: string;
  /** Country name (e.g., "United States") */
  country?: string;
  /** ISO 3166-1 alpha-2 country code (e.g., "US") */
  country_code?: string;
  /** Whether the country is a member of the European Union */
  is_eu: boolean;
  /** City name (e.g., "Mountain View") */
  city?: string;
  /** Continent name (e.g., "North America") */
  continent?: string;
  /** Latitude coordinate */
  latitude?: number;
  /** Longitude coordinate */
  longitude?: number;
  /** Timezone (e.g., "America/Los_Angeles") */
  time_zone?: string;
  /** Postal/ZIP code */
  postal_code?: string;
  /** State/region/subdivision (e.g., "California") */
  subdivision?: string;
  /** ISO 4217 currency code (e.g., "USD") */
  currency_code?: string;
  /** International calling code (e.g., "1") */
  calling_code?: string;
  /** Network CIDR range */
  network?: string;
  /** Autonomous System Number information */
  asn?: ASN;
  /** Privacy and threat detection information */
  privacy: Privacy;
  /** Company information associated with the IP */
  company?: Company;
  /** Hosting provider information */
  hosting?: Hosting;
  /** Abuse contact information */
  abuse?: Abuse;
}

export type AsnType = 'isp' | 'hosting' | 'business' | 'education' | 'government' | 'inactive';

/** Autonomous System Number information */
export interface ASN {
  /** ASN identifier (e.g., "AS15169") */
  asn: string;
  /** Network route */
  route: string;
  /** Network name */
  netname: string;
  /** ASN organization name */
  name: string;
  /** Country code where ASN is registered */
  country_code: string;
  /** Associated domain */
  domain: string;
  /** ASN type */
  type: AsnType;
  /** Regional Internet Registry */
  rir: string;
}

/** Privacy and threat detection information */
export interface Privacy {
  /** Whether the IP is on a known spam/abuse blocklist */
  is_abuser: boolean;
  /** Whether the IP is anonymous */
  is_anonymous: boolean;
  /** Whether the IP is a bogon (unallocated/reserved) address */
  is_bogon: boolean;
  /** Whether the IP belongs to a hosting provider */
  is_hosting: boolean;
  /** Whether the IP is using iCloud Private Relay */
  is_icloud_relay: boolean;
  /** Whether the IP is using a proxy service */
  is_proxy: boolean;
  /** Whether the IP is using Tor */
  is_tor: boolean;
  /** Whether the IP is using a VPN service */
  is_vpn: boolean;
}

export type CompanyType = 'isp' | 'hosting' | 'education' | 'government' | 'business' | 'inactive';

/** Company information associated with the IP */
export interface Company {
  /** Company name */
  name: string;
  /** Company domain */
  domain: string;
  /** Country code where company network is located */
  country_code: string;
  /** Company type */
  type: CompanyType;
}

/** Hosting provider information */
export interface Hosting {
  /** Hosting provider name */
  provider?: string;
  /** Provider domain */
  domain?: string;
  /** Provider network */
  network?: string;
  /** Hosting region */
  region?: string;
  /** Hosting service type */
  service?: string;
}

/** Abuse contact information */
export interface Abuse {
  /** Abuse contact address */
  address?: string;
  /** Country code for abuse contact */
  country_code?: string;
  /** Abuse contact email */
  email?: string;
  /** Abuse contact name */
  name?: string;
  /** Associated network */
  network?: string;
  /** Abuse contact phone */
  phone?: string;
}

/** Client configuration options */
export interface IPLocateOptions {
  /** Custom base URL for the API (for enterprise customers) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 5000) */
  timeout?: number;
  /** Custom HTTP client options */
  httpClientOptions?: RequestInit;
}

/** Error response from the IPLocate API */
export interface APIErrorResponse {
  /** Error message */
  error: string;
}

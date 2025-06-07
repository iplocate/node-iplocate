import IPLocate, {
    LookupResponse,
    InvalidIPError,
    AuthenticationError,
    NotFoundError,
    RateLimitError,
    APIError
} from 'node-iplocate'; // '../src/index.js'

async function main(): Promise<void> {
    // Replace with your actual API key from https://iplocate.io/signup
    const apiKey = process.env.IPLOCATE_API_KEY || 'your-api-key-here';

    if (apiKey === 'your-api-key-here') {
        console.error('Please set IPLOCATE_API_KEY environment variable or update the apiKey in this example');
        process.exit(1);
    }

    const client = new IPLocate(apiKey, {
        timeout: 10000, // 10 second timeout
    });

    try {
        // Look up multiple IPs with different scenarios
        const ips = ['8.8.8.8', '1.1.1.1', '203.0.113.1'];

        for (const ip of ips) {
            console.log(`\\nLooking up ${ip}...`);

            try {
                const result: LookupResponse = await client.lookup(ip);

                console.log(`  Country: ${result.country} (${result.country_code})`);
                console.log(`  City: ${result.city || 'Unknown'}`);

                if (result.asn) {
                    console.log(`  ASN: ${result.asn.asn} - ${result.asn.name}`);
                    console.log(`  ISP Type: ${result.asn.type}`);
                }

                console.log(`  Privacy Flags:`);
                console.log(`    VPN: ${result.privacy.is_vpn}`);
                console.log(`    Proxy: ${result.privacy.is_proxy}`);
                console.log(`    Tor: ${result.privacy.is_tor}`);
                console.log(`    Hosting: ${result.privacy.is_hosting}`);

                if (result.company) {
                    console.log(`  Company: ${result.company.name} (${result.company.type})`);
                }

            } catch (error) {
                handleAPIError(error, ip);
            }
        }

        // Demonstrate self lookup
        console.log('\\n---\\nLooking up your own IP...');
        const selfResult = await client.lookupSelf();
        console.log(`Your IP: ${selfResult.ip}`);
        console.log(`Your Location: ${selfResult.city}, ${selfResult.country}`);

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

function handleAPIError(error: unknown, ip: string): void {
    if (error instanceof InvalidIPError) {
        console.error(`  ❌ Invalid IP format: ${ip}`);
    } else if (error instanceof AuthenticationError) {
        console.error(`  ❌ Authentication failed: ${error.message}`);
    } else if (error instanceof NotFoundError) {
        console.error(`  ❌ IP not found: ${ip}`);
    } else if (error instanceof RateLimitError) {
        console.error(`  ❌ Rate limit exceeded: ${error.message}`);
    } else if (error instanceof APIError) {
        console.error(`  ❌ API error (${error.statusCode}): ${error.message}`);
    } else {
        console.error(`  ❌ Unknown error for ${ip}:`, error);
    }
}

// Run the example
main().catch(console.error);

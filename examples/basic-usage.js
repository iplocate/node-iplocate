// const IPLocate = require('../dist/cjs/index.js').default;
const IPLocate = require('node-iplocate').default;

async function main() {
    // Replace with your actual API key from https://iplocate.io/signup
    const apiKey = process.env.IPLOCATE_API_KEY || 'your-api-key-here';

    if (apiKey === 'your-api-key-here') {
        console.error('Please set IPLOCATE_API_KEY environment variable or update the apiKey in this example');
        process.exit(1);
    }

    const client = new IPLocate(apiKey);

    try {
        // Look up a specific IP
        console.log('Looking up 8.8.8.8...');
        const result = await client.lookup('8.8.8.8');

        console.log(`IP: ${result.ip}`);
        console.log(`Country: ${result.country} (${result.country_code})`);
        console.log(`City: ${result.city}`);
        console.log(`ASN: ${result.asn?.asn} - ${result.asn?.name}`);
        console.log(`VPN: ${result.privacy.is_vpn}`);
        console.log(`Proxy: ${result.privacy.is_proxy}`);

        console.log('\n---\n');

        // Look up your own IP
        console.log('Looking up your own IP...');
        const selfResult = await client.lookupSelf();
        console.log(`Your IP: ${selfResult.ip}`);
        console.log(`Your Country: ${selfResult.country}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();

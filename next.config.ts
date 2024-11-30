import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	experimental: {
		after: true
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'api.dicebear.com' },
			{ protocol: 'https', hostname: 'files.edgestore.dev' },
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }
		]
	},
	async headers() {
		return [
			{
				source: '/api/organization/:id',
				headers: [
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{ key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
					{ key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
				]
			}
		]
	}
};

export default nextConfig;

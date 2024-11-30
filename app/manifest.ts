import { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => {
	return {
		name: 'FireFeed',
		short_name: 'FireFeed',
		description: '🔥 Ignite growth with real-time feedback, powered by FireFeed',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#ffffff',
		icons: [
			{
				src: '/favicon.ico',
				sizes: '64x64 32x32 24x24 16x16',
				type: 'image/x-icon'
			},
			{
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable'
      }
		]
	};
};

export default manifest;

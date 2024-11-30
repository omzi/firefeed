import type { Metadata } from 'next';
import Integrations from '#/app/(main)/integrations/Integrations';

export const metadata: Metadata = {
	title: 'Integrations ~ FireFeed',
	description: '...'
};

const Page = () => {
	return <Integrations />;
};

export default Page;

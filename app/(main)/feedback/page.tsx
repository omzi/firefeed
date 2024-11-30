import type { Metadata } from 'next';
import Feedback from '#/app/(main)/feedback/Feedback';

export const metadata: Metadata = {
	title: 'Feedback ~ FireFeed',
	description: '...'
};

const Page = () => {
	return <Feedback />;
};

export default Page;

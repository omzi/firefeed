import type { Metadata } from 'next';
import Home from '#/app/(home)/Home';
import authConfig from '#/auth.config';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
	title: 'Home ~ FireFeed',
	description: '🔥 Ignite growth with real-time feedback, powered by FireFeed'
}

const Page = async () => {
	let isAuthenticated = false;
	const session = await getServerSession(authConfig);
	if (session) isAuthenticated = true;

	return (
		<div className='h-full'>
			<Home isAuthenticated={isAuthenticated} />
		</div>
	);
};

export default Page;

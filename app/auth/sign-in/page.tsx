import type { Metadata } from 'next';
import SignIn from '#/app/auth/sign-in/SignIn';

export const metadata: Metadata = {
	title: 'Sign In ~ FireFeed',
	description: 'Sign in to your FireFeed account'
};

const Page = () => {
	return <SignIn />;
};

export default Page;

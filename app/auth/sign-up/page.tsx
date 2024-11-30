import type { Metadata } from 'next';
import SignUp from '#/app/auth/sign-up/SignUp';

export const metadata: Metadata = {
	title: 'Sign Up ~ FireFeed',
	description: 'Sign up for a FREE FireFeed account'
};

const Page = () => {
	return <SignUp />;
};

export default Page;

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SIGN_IN_ROUTE } from '#/lib/utils';
import VerifyAccount from '#/app/auth/verify-account/VerifyAccount';

export const metadata: Metadata = {
	title: 'Verify Your Account ~ FireFeed',
	description: 'Verify your FireFeed account'
};

type PageProps = {
	searchParams: Promise<{
		email: string;
	}>
};

const Page = async ({ searchParams }: PageProps) => {
	const { email } = await searchParams;
	if (!email) redirect(SIGN_IN_ROUTE);

	return <VerifyAccount email={email} />;
};

export default Page;

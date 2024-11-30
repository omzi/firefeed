import type { Metadata } from 'next';
import { User } from '@prisma/client';
import authConfig from '#/auth.config';
import { feedbackTips } from '#/lib/utils';
import { getServerSession, Session } from 'next-auth';
import Dashboard from '#/app/(main)/dashboard/Dashboard';
import { getUser, getDashboardStats } from '#/lib/graphql/queries';

export const metadata: Metadata = {
	title: 'Dashboard ~ FireFeed',
	description: '...'
};

const Page = async () => {
	const session = await getServerSession(authConfig) as Session;
	const user = await getUser({ id: session.user.id }) as User;
	
	const randomTip = feedbackTips[Math.floor(Math.random() * feedbackTips.length)];

	console.time('getDashboardStats :>>');
	const data = await getDashboardStats({ organizationId: user.currentOrganizationId });
	console.timeEnd('getDashboardStats :>>');
	
	return <Dashboard randomTip={randomTip} data={data} />;
};

export default Page;

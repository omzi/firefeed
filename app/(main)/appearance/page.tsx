import type { Metadata } from 'next';
import authConfig from '#/auth.config';
import { Session, getServerSession } from 'next-auth';
import Appearance from '#/app/(main)/appearance/Appearance';
import { AppearanceType, Organization, User } from '#/types';
import { getUser, getUserOrganizationsByUserId } from '#/lib/graphql/queries';

export const metadata: Metadata = {
	title: 'Appearance ~ FireFeed',
	description: '...'
};

const Page = async () => {
	const session = await getServerSession(authConfig) as Session;
	const [user, userOrganizations] = await Promise.all([
		getUser({ id: session.user.id }),
		getUserOrganizationsByUserId({ userId: session.user.id })
	]) as [NonNullable<User>, Organization[]];

	const organization = userOrganizations.find($ => $.id === user.currentOrganizationId)!;
	const widgetStyle = JSON.parse(`{${organization.widgetStyle}}`) as AppearanceType;

	return <Appearance widgetStyle={widgetStyle} />;
};

export default Page;

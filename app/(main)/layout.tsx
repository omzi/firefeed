import { ReactNode } from 'react';
import authConfig from '#/auth.config';
import { Organization, User } from '#/types';
import { Session, getServerSession } from 'next-auth';
import Navigation from '#/components/shared/Navigation';
import { UserProvider } from '#/components/contexts/UserContext';
import { getUser, getUserOrganizationsByUserId } from '#/lib/graphql/queries';

const MainLayout = async ({ children }: { children: ReactNode }) => {
	const session = await getServerSession(authConfig) as Session;

	const [user, userOrganizations] = await Promise.all([
		getUser({ id: session.user.id }),
		getUserOrganizationsByUserId({ userId: session.user.id })
	]) as [NonNullable<User>, Organization[]];

	const organization = userOrganizations.find($ => $.id === user.currentOrganizationId)!;

	return (
		<UserProvider user={user} organization={organization} organizations={userOrganizations}>
			<Navigation>
				{children}
			</Navigation>
		</UserProvider>
	);
};

export default MainLayout;

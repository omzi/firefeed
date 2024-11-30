import { Awaitable } from 'next-auth';
import { createUser, linkAccount } from '#/lib/graphql/mutation';
import { Adapter, AdapterAccount, AdapterUser } from 'next-auth/adapters';
import { getUser, getUserByAccount, getUserByEmail } from '#/lib/graphql/queries';

export const ModusAdapter: Adapter = {
  createUser: createUser,
	getUser: async (id) => {
		const user = await getUser({ id });

		return user as Awaitable<AdapterUser | null>;
	},
	getUserByEmail: async (email) => {
		const userByEmail = await getUserByEmail({ email });

		return userByEmail as Awaitable<AdapterUser | null>;
	},
	getUserByAccount: async ({ provider, providerAccountId }) => {
		const userByAccount = await getUserByAccount({ provider, providerAccountId });

		return userByAccount as Awaitable<AdapterUser | null>;
	},
	linkAccount: async (account: AdapterAccount) => {
		await linkAccount({
			userId: account.userId,
			type: account.type,
			provider: account.provider,
			providerAccountId: account.providerAccountId,
			refresh_token: account.refresh_token ?? '', // OPTIONAL, not supported yet by Modus ;(
			access_token: account.access_token ?? '', // OPTIONAL, not supported yet by Modus ;(
			expires_at: account.expires_at ?? 0, // OPTIONAL, not supported yet by Modus ;(
			token_type: account.token_type ?? '', // OPTIONAL, not supported yet by Modus ;(
			scope: account.scope ?? '', // OPTIONAL, not supported yet by Modus ;(
			id_token: account.id_token ?? '', // OPTIONAL, not supported yet by Modus ;(
			session_state: account.session_state ?? '', // OPTIONAL, not supported yet by Modus ;(
		});
	}
};

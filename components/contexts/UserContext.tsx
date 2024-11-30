'use client';

import { Organization, User } from '#/types';
import { createContext, FC, ReactNode, useContext } from 'react';

type UserContextType = {
	user: User;
	organization: Organization;
	organizations: Organization[];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
	user: User;
	organization: Organization;
	organizations: Organization[];
	children: ReactNode;
};

export const UserProvider: FC<UserProviderProps> = ({ user, organization, organizations, children }) => {
	return (
		<UserContext.Provider value={{ user, organization, organizations }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = (): User => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context.user;
};

export const useOrganization = (): Organization => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useOrganization must be used within a UserProvider');
	}

	return context.organization;
};

export const useOrganizations = (): Organization[] => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useOrganizations must be used within a UserProvider');
	}

	return context.organizations;
};

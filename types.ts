import { type DefaultSession } from 'next-auth';
import { AppearanceSchema } from '#/lib/validations';

export type Role = 'USER' | 'ADMIN';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  role: Role;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends ExtendedUser {}
}

export type OptionalExcept<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]: T[P];
} & {
  [P in keyof T as P extends K ? never : P]?: T[P];
};

export type AppearanceType = typeof AppearanceSchema['_output'];

export interface User {
	name: string | null;
  id: string;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: Role;
  currentOrganizationId: string;
  createdAt: Date;
  updatedAt: Date;
  isTwoFactorEnabled: boolean;
};

export interface Account {
	type: string;
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
	scope?: string;
	id_token?: string;
	session_state?: string;
	createdAt: string;
	updatedAt: string;
};

export interface VerificationCode {
	id: string;
	email: string;
	code: string;
	expires: string;
};

export interface PasswordResetToken {
	id: string;
	email: string;
	token: string;
	expires: string;
};

export interface TwoFactorToken {
	id: string;
	email: string;
	token: string;
	expires: string;
};

export interface TwoFactorConfirmation {
	id: string;
	userId: string;
};

export interface Organization {
	id: string;
	name: string;
	description: string;
	widgetStyle: string; // JSON serialized as a string;
	createdAt: string;
	updatedAt: string;
};

export interface OrganizationMembership {
	organizationId: string;
	userId: string;
	role: string;
	createdAt: string;
	updatedAt: string;
};

export interface Feedback {
  id: string;
  organizationId: string;
  rating: number | null;
	description: string | null;
  analysis: string | null;
  sentiment: string | null;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

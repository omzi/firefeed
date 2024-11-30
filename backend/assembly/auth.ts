import { JSON } from 'json-as';
import { postgresql } from '@hypermode/modus-sdk-as';
import { User, Account, VerificationCode, PasswordResetToken } from './schema';
import { generateOneTimePassword, generateRandomChars, uint8ArrayToUUID, uuid } from './utils';

// For NextAuth.js
export function createUser(name: string, email: string, password: string, currentOrganizationId: string): User {
	const user = postgresql.execute(
		'database',
		`INSERT INTO "User" (id, name, email, password, "currentOrganizationId", "emailVerified", "createdAt", "updatedAt")
		VALUES ('${uuid()}', '${name}', '${email}', '${password}', '${currentOrganizationId}', NULL, NOW(), NOW())`
	);

	if (user.error) {
		throw new Error(`Error creating user: ${JSON.stringify(user.error)}`);
	}

	// Fetch and return created user
	const fetchedUser = postgresql.query<User>(
		'database',
		`SELECT * FROM "User" WHERE email = '${email}' LIMIT 1`
	);

	if (fetchedUser.error) {
		throw new Error(`Error fetching created user: ${JSON.stringify(fetchedUser.error)}`);
	}

	const returnUser = fetchedUser.rows.pop();
	if (!returnUser) throw new Error('User creation failed');

	console.log(`Return User :>> ${JSON.stringify(returnUser)}`);
	
	return returnUser;
};

export function updateUser (
	userId: string,
	name: string | null = null,
	email: string | null = null,
	password: string | null = null,
	currentOrganizationId: string | null = null,
	emailVerified: string | null = null,
	image: string | null = null,
	isTwoFactorEnabled: i32 = -1, // Use -1 to represent "not set"
	twoFactorConfirmationId: string | null = null
): User | null {
	const setClauses: string[] = [];

	// Build `SET` clauses for each field
	if (name) setClauses.push(`"name" = '${name}'`);
	if (email) setClauses.push(`"email" = '${email}'`);
	if (password) setClauses.push(`"password" = '${password}'`);
	if (currentOrganizationId) setClauses.push(`"currentOrganizationId" = '${currentOrganizationId}'`);
	if (emailVerified) setClauses.push(`"emailVerified" = '${emailVerified}'`);
	if (image) setClauses.push(`"image" = '${image}'`);
	if (isTwoFactorEnabled != -1) setClauses.push(`"isTwoFactorEnabled" = ${isTwoFactorEnabled == 1}`);
	if (twoFactorConfirmationId) setClauses.push(`"twoFactorConfirmationId" = '${twoFactorConfirmationId}'`);

	// Exit early if no valid updates
	if (!setClauses.length) {
		console.error('No valid fields to update.');
		return null;
	}

	// Build the SQL query
	const query = `
		UPDATE "User"
		SET ${setClauses.join(', ')}, "updatedAt" = NOW()
		WHERE id = '${userId}'
		RETURNING *;
	`;

	const result = postgresql.query<User>('database', query);

	// Handle errors or empty results
	if (result.error) {
		console.error(`Error updating user: ${JSON.stringify(result.error)}`);
		return null;
	}

	return result.rows.length ? result.rows.pop() : null;
};

export function getUser(id: string): User | null {
	const fetchedUser = postgresql.query<User>(
		'database',
		`SELECT * FROM "User" WHERE id = '${id}' LIMIT 1`
	);

	if (fetchedUser.error) {
		throw new Error(`Error fetching user: ${JSON.stringify(fetchedUser.error)}`);
	}

	return fetchedUser.rows.length ? fetchedUser.rows.pop() : null;
};

export function getUserByEmail(email: string): User | null {
	const fetchedUser = postgresql.query<User>(
		'database',
		`SELECT * FROM "User" WHERE email = '${email}' LIMIT 1`
	);

	if (fetchedUser.error) {
		throw new Error(`Error fetching user by email: ${JSON.stringify(fetchedUser.error)}`);
	}

	return fetchedUser.rows.length ? fetchedUser.rows.pop() : null;
};

// NOT USED
export function getUserByAccount(provider: string, providerAccountId: string): User | null {
	const fetchedUser = postgresql.query<User>(
		'database',
		`SELECT u.* FROM "User" u
		 INNER JOIN "Account" a ON u.id = a."userId"
		 WHERE a.provider = '${provider}' AND a."providerAccountId" = '${providerAccountId}' LIMIT 1`
	);

	if (fetchedUser.error) {
		throw new Error(`Error fetching user by account: ${JSON.stringify(fetchedUser.error)}`);
	}

	return fetchedUser.rows.length ? fetchedUser.rows.pop() : null;
};

export function linkAccount(
	userId: string,
	type: string,
	provider: string,
	providerAccountId: string,
	refresh_token: string = '',
	access_token: string = '',
	expires_at: number = 0,
	token_type: string = '',
	scope: string = '',
	id_token: string = '',
	session_state: string = ''
): Account {
	const account = postgresql.execute(
		'database',
		`INSERT INTO "Account" ("userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state, "createdAt", "updatedAt")
		 VALUES ('${userId}', '${type}', '${provider}', '${providerAccountId}', ${refresh_token ? `'${refresh_token}'` : 'NULL'}, ${
			access_token ? `'${access_token}'` : 'NULL'
		}, ${expires_at ? `'${expires_at}'` : 'NULL'}, '${token_type}', '${scope}', '${id_token}', '${session_state}', NOW(), NOW())`
	);

	if (account.error) {
		throw new Error(`Error linking account: ${JSON.stringify(account.error)}`);
	}

	// Fetch the linked account
	const fetchedAccount = postgresql.query<Account>(
		'database',
		`SELECT * FROM "Account" WHERE "providerAccountId" = '${providerAccountId}' LIMIT 1`
	);

	if (fetchedAccount.error) {
		throw new Error(`Error fetching linked account: ${JSON.stringify(fetchedAccount.error)}`);
	}

	const returnAccount = fetchedAccount.rows.pop();
	if (!returnAccount) throw new Error('Account linking failed');

	console.log(`Linked Account :>> ${JSON.stringify(returnAccount)}`);

	return returnAccount;
};

// Auth Helpers
export function generateVerificationCode(email: string): VerificationCode {
	const existingCode = postgresql.query<VerificationCode>(
		'database',
		`SELECT * FROM "VerificationCode" WHERE email = '${email}' LIMIT 1`
	);

	if (existingCode.error) {
		throw new Error(`Error checking existing verification code: ${JSON.stringify(existingCode.error)}`);
	}

	if (existingCode.rows.length > 0) {
		const oldId = uint8ArrayToUUID(existingCode.rows.pop().id);
		const deleteResult = postgresql.execute(
			'database',
			`DELETE FROM "VerificationCode" WHERE id = '${oldId}'`
		);

		if (deleteResult.error) {
			throw new Error(`Error deleting existing verification code: ${JSON.stringify(deleteResult.error)}`);
		}
	}

	const code = generateOneTimePassword(6);
	const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

	const insertResult = postgresql.execute(
		'database',
		`INSERT INTO "VerificationCode" (id, email, code, expires)
		 VALUES ('${uuid()}', '${email}', '${code}', '${expires}')`
	);

	if (insertResult.error) {
		throw new Error(`Error creating verification code: ${JSON.stringify(insertResult.error)}`);
	}

	const verificationCode = postgresql.query<VerificationCode>(
		'database',
		`SELECT * FROM "VerificationCode" WHERE email = '${email}' LIMIT 1`
	);

	if (verificationCode.error) {
		throw new Error(`Error fetching created verification code: ${JSON.stringify(verificationCode.error)}`);
	}

	const returnCode = verificationCode.rows.pop();
	if (!returnCode) throw new Error('Verification code creation failed');

	console.log(`Generated Verification Code :>> ${JSON.stringify(returnCode)}`);

	return returnCode;
};

export function generatePasswordResetToken(email: string): PasswordResetToken {
	const existingToken = postgresql.query<PasswordResetToken>(
		'database',
		`SELECT * FROM "PasswordResetToken" WHERE email = '${email}' LIMIT 1`
	);

	if (existingToken.error) {
		throw new Error(`Error checking existing password reset token: ${JSON.stringify(existingToken.error)}`);
	}

	if (existingToken.rows.length > 0) {
		const oldId = uint8ArrayToUUID(existingToken.rows.pop().id);
		const deleteResult = postgresql.execute(
			'database',
			`DELETE FROM "PasswordResetToken" WHERE id = '${oldId}'`
		);

		if (deleteResult.error) {
			throw new Error(`Error deleting existing password reset token: ${JSON.stringify(deleteResult.error)}`);
		}
	}

	const token = generateRandomChars(36, ['alphanumeric']);
	const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

	const insertResult = postgresql.execute(
		'database',
		`INSERT INTO "PasswordResetToken" (id, email, token, expires)
		 VALUES ('${uuid()}', '${email}', '${token}', '${expires}')`
	);

	if (insertResult.error) {
		throw new Error(`Error creating password reset token: ${JSON.stringify(insertResult.error)}`);
	}

	const passwordResetToken = postgresql.query<PasswordResetToken>(
		'database',
		`SELECT * FROM "PasswordResetToken" WHERE email = '${email}' LIMIT 1`
	);

	if (passwordResetToken.error) {
		throw new Error(`Error fetching created password reset token: ${JSON.stringify(passwordResetToken.error)}`);
	}

	const returnToken = passwordResetToken.rows.pop();
	if (!returnToken) throw new Error('Password reset token creation failed');

	console.log(`Generated Password Reset Token :>> ${JSON.stringify(returnToken)}`);

	return returnToken;
};

export function getVerificationCodeByCode(code: string): VerificationCode | null {
	const result = postgresql.query<VerificationCode>(
		'database',
		`SELECT * FROM "VerificationCode" WHERE code = '${code}' LIMIT 1`
	);

	if (result.error) {
		console.error(`Error fetching verification code by code: ${JSON.stringify(result.error)}`);
		return null;
	}

	return result.rows.length ? result.rows.pop() : null;
};

export function getVerificationCodeByEmail(email: string): VerificationCode | null {
	const result = postgresql.query<VerificationCode>(
		'database',
		`SELECT * FROM "VerificationCode" WHERE email = '${email}' LIMIT 1`
	);

	if (result.error) {
		console.error(`Error fetching verification code by email: ${JSON.stringify(result.error)}`);
		return null;
	}

	return result.rows.length ? result.rows.pop() : null;
};

export function deleteVerificationCode(codeId: string): boolean {
	const result = postgresql.execute(
		'database',
		`DELETE FROM "VerificationCode" WHERE id = '${codeId}'`
	);

	if (result.error) {
		console.error(`Error deleting verification code: ${JSON.stringify(result.error)}`);
		return false;
	}

	return result.rowsAffected > 0;
};

export function getPasswordResetTokenByToken(token: string): PasswordResetToken | null {
	const query = `
		SELECT * 
		FROM "PasswordResetToken"
		WHERE "token" = '${token}'
		LIMIT 1;
	`;

	const result = postgresql.query<PasswordResetToken>('database', query);

	if (result.error) {
		throw new Error(`Error fetching password reset token: ${JSON.stringify(result.error)}`);
	}

	return result.rows.length ? result.rows.pop() : null;
};

export function deletePasswordResetToken(id: string): boolean {
	const result = postgresql.execute(
		'database',
		`DELETE FROM "PasswordResetToken" WHERE id = '${id}'`
	);

	if (result.error) {
		console.error(`Error deleting password reset token: ${JSON.stringify(result.error)}`);
		return false;
	}

	return result.rowsAffected > 0;
};

import axios from 'axios';
import {
	LinkAccountVariables,
	LinkAccountResponse,


	UserVariables,
	UserResponse,
	UserByAccountVariables,
	UserByAccountResponse,
	UserByEmailVariables,
	UserByEmailResponse,
	VerificationCodeByCodeVariables,
	VerificationCodeByCodeResponse,
	VerificationCodeByEmailVariables,
	VerificationCodeByEmailResponse,
	OrganizationVariables,
	OrganizationResponse,
	UserOrganizationsByUserIdVariables,
	UserOrganizationsByUserIdResponse,
	DashboardStatsVariables,
	DashboardStatsResponse,
	FeedbackByFeedbackIdVariables,
	FeedbackByFeedbackIdResponse,
	FeedbackByOrganizationIdAndFeedbackIdVariables,
	FeedbackByOrganizationIdAndFeedbackIdResponse,
	FeedbacksByOrganizationIdVariables,
	FeedbacksByOrganizationIdResponse,
	PasswordResetTokenByTokenVariables,
	PasswordResetTokenByTokenResponse
} from '#/lib/graphql/types';
import { uint8ArrayToUUID } from '#/lib/utils';

export const getUser = async (
	variables: UserVariables
): Promise<UserResponse['data']['user'] | null> => {
	const query = `query User($id: String!) {
		user(id: $id) {
			id
			name
			email
			emailVerified
			image
			password
			role
			currentOrganizationId
			createdAt
			updatedAt
			isTwoFactorEnabled
			twoFactorConfirmationId
		}
	}`;

	const { data: response } = await axios.post<UserResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (!response.data.user) return null;

	// Fix Modus' serialization error...
	return {
		...response.data.user,
		id: uint8ArrayToUUID(response.data.user.id),
		image: response.data.user.image === 'ul' ? '' : response.data.user.image
	};
};

export const getUserByAccount = async (
	variables: UserByAccountVariables
): Promise<UserByAccountResponse['data']['userByAccount'] | null> => {
	const query = `query UserByAccount($provider: String!, $providerAccountId: String!) {
		userByAccount(provider: $provider, providerAccountId: $providerAccountId) {
			id
			name
			email
			emailVerified
			image
			password
			role
			currentOrganizationId
			createdAt
			updatedAt
			isTwoFactorEnabled
			twoFactorConfirmationId
		}
	}`;

	const { data: response } = await axios.post<UserByAccountResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (!response.data.userByAccount) return null;

	return {
		...response.data.userByAccount,
		id: uint8ArrayToUUID(response.data.userByAccount.id),
		image: response.data.userByAccount.image === 'ul' ? '' : response.data.userByAccount.image
	};
};

export const getUserByEmail = async (
	variables: UserByEmailVariables
): Promise<UserByEmailResponse['data']['userByEmail'] | null> => {
	const query = `query UserByEmail($email: String!) {
		userByEmail(email: $email) {
			id
			name
			email
			emailVerified
			image
			password
			role
			currentOrganizationId
			createdAt
			updatedAt
			isTwoFactorEnabled
			twoFactorConfirmationId
		}
	}`;

	const { data: response } = await axios.post<UserByEmailResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (!response.data.userByEmail) return null;

	return {
		...response.data.userByEmail,
		id: uint8ArrayToUUID(response.data.userByEmail.id),
		image: response.data.userByEmail.image === 'ul' ? '' : response.data.userByEmail.image
	};
};

export const getVerificationCodeByCode = async (
	variables: VerificationCodeByCodeVariables
): Promise<VerificationCodeByCodeResponse['data']['verificationCodeByCode'] | null> => {
	const query = `query VerificationCodeByCode($code: String!) {
		verificationCodeByCode(code: $code) {
			id
			email
			code
			expires
		}
	}`;

	const { data: response } = await axios.post<VerificationCodeByCodeResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (!response.data.verificationCodeByCode) return null;

	return {
		...response.data.verificationCodeByCode,
		id: uint8ArrayToUUID(response.data.verificationCodeByCode.id)
	};
};

export const getVerificationCodeByEmail = async (
	variables: VerificationCodeByEmailVariables
): Promise<VerificationCodeByEmailResponse['data']['verificationCodeByEmail'] | null> => {
	const query = `query VerificationCodeByEmail($email: String!) {
		verificationCodeByEmail(email: $email) {
			id
			email
			code
			expires
		}
	}`;

	const { data: response } = await axios.post<VerificationCodeByEmailResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (!response.data.verificationCodeByEmail) return null;

	return {
		...response.data.verificationCodeByEmail,
		id: uint8ArrayToUUID(response.data.verificationCodeByEmail.id)
	};
};

export const getUserOrganizationsByUserId = async (
	variables: UserOrganizationsByUserIdVariables
): Promise<UserOrganizationsByUserIdResponse['data']['userOrganizationsByUserId']> => {
	const query = `query UserOrganizationsByUserId($userId: String!) {
		userOrganizationsByUserId(userId: $userId) {
			id
			name
			description
			widgetStyle
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<UserOrganizationsByUserIdResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	return response.data.userOrganizationsByUserId;
};

export const getOrganization = async (
	variables: OrganizationVariables
): Promise<OrganizationResponse['data']['organization'] | null> => {
	const query = `query Organization($organizationId: String!) {
		organization(organizationId: $organizationId) {
			id
			name
			description
			widgetStyle
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<OrganizationResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (!response.data.organization) return null;

	return response.data.organization;
};

export const getDashboardStats = async (
	variables: DashboardStatsVariables
): Promise<DashboardStatsResponse['data']['dashboardStats']> => {
	const query = `query DashboardStats($organizationId: String!) {
		dashboardStats(organizationId: $organizationId) {
			stats {
				totalFeedback
				openFeedback
				resolvedFeedback
				averageRating
				totalFeedbackChange
				openFeedbackChange
				resolvedFeedbackChange
				averageRatingChange
			}
			charts {
				feedbackThisWeek {
					name
					count
				}
			}
		}
	}`;

	const { data: response } = await axios.post<DashboardStatsResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	return response.data.dashboardStats;
};

export const getFeedbackByFeedbackId = async (
	variables: FeedbackByFeedbackIdVariables
): Promise<FeedbackByFeedbackIdResponse['data']['feedbackByFeedbackId']> => {
	const query = `query FeedbackByFeedbackId($feedbackId: String!) {
		feedbackByFeedbackId(feedbackId: $feedbackId) {
			id
			organizationId
			rating
			description
			analysis
			sentiment
			isResolved
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<FeedbackByFeedbackIdResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	return response.data.feedbackByFeedbackId;
};

export const getFeedbackByOrganizationIdAndFeedbackId = async (
	variables: FeedbackByOrganizationIdAndFeedbackIdVariables
): Promise<FeedbackByOrganizationIdAndFeedbackIdResponse['data']['feedbackByOrganizationIdAndFeedbackId']> => {
	const query = `query FeedbackByOrganizationIdAndFeedbackId($organizationId: String!, $feedbackId: String!) {
		feedbackByOrganizationIdAndFeedbackId(organizationId: $organizationId, feedbackId: $feedbackId) {
			id
			organizationId
			rating
			description
			analysis
			sentiment
			isResolved
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<FeedbackByOrganizationIdAndFeedbackIdResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	return response.data.feedbackByOrganizationIdAndFeedbackId;
};

export const getFeedbacksByOrganizationId = async (
	variables: FeedbacksByOrganizationIdVariables
): Promise<FeedbacksByOrganizationIdResponse['data']['feedbacksByOrganizationId']> => {
	const query = `query FeedbacksByOrganizationId($organizationId: String!) {
		feedbacksByOrganizationId(organizationId: $organizationId) {
			id
			organizationId
			rating
			description
			analysis
			sentiment
			isResolved
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<FeedbacksByOrganizationIdResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	return response.data.feedbacksByOrganizationId;
};

export const getPasswordResetTokenByToken = async (
	variables: PasswordResetTokenByTokenVariables
): Promise<PasswordResetTokenByTokenResponse['data']['passwordResetTokenByToken'] | null> => {
	const query = `query PasswordResetTokenByToken($token: String!) {
		passwordResetTokenByToken(token: $token) {
			id
			email
			token
			expires
		}
	}`;

	const { data: response } = await axios.post<PasswordResetTokenByTokenResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (!response.data.passwordResetTokenByToken) return null;

	return response.data.passwordResetTokenByToken;
};

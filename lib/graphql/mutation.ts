import axios from 'axios';
import {
	LinkAccountVariables,
	LinkAccountResponse,


	CreateUserVariables,
	CreateUserResponse,
	UpdateUserVariables,
	UpdateUserResponse,
	CreateOrganizationVariables,
	CreateOrganizationResponse,
	UpdateOrganizationVariables,
	UpdateOrganizationResponse,
	CreateMembershipVariables,
	CreateMembershipResponse,
	GenerateVerificationCodeVariables,
	GenerateVerificationCodeResponse,
	GeneratePasswordResetTokenVariables,
	GeneratePasswordResetTokenResponse,
	DeleteVerificationCodeVariables,
	DeleteVerificationCodeResponse,
	CreateFeedbackVariables,
	CreateFeedbackResponse,
	DeletePasswordResetTokenVariables,
	DeletePasswordResetTokenResponse
} from '#/lib/graphql/types';


/* For NextAuth... */
export const linkAccount = async (
	variables: LinkAccountVariables
): Promise<LinkAccountResponse['data']['linkAccount']> => {
	const query = `query LinkAccount($userId: String!, $type: String!, $provider: String!, $providerAccountId: String!, $refresh_token: String!, $access_token: String!, $expires_at: Float!, $token_type: String!, $scope: String!, $id_token: String!, $session_state: String!) {
		linkAccount(userId: $userId, type: $type, provider: $provider, providerAccountId: $providerAccountId, refresh_token: $refresh_token, access_token: $access_token, expires_at: $expires_at, token_type: $token_type, scope: $scope, id_token: $id_token, session_state: $session_state) {
			id
			userId
			type
			provider
			providerAccountId
			refresh_token
			access_token
			expires_at
			token_type
			scope
			id_token
			session_state
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<LinkAccountResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.linkAccount;
};

/* For Application... */
export const createUser = async (
	variables: CreateUserVariables
): Promise<CreateUserResponse['data']['createUser']> => {
	const query = `mutation CreateUser($name: String!, $email: String!, $password: String!, $currentOrganizationId: String!) {
		createUser(name: $name, email: $email, password: $password, currentOrganizationId: $currentOrganizationId) {
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

	const { data: response } = await axios.post<CreateUserResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.createUser;
};
export const updateUser = async (
	variables: UpdateUserVariables
): Promise<UpdateUserResponse['data']['updateUser']> => {
	const query = `mutation UpdateUser($userId: String!, $name: String, $email: String, $password: String, $currentOrganizationId: String, $emailVerified: String, $image: String, $isTwoFactorEnabled: Int!, $twoFactorConfirmationId: String) {
		updateUser(userId: $userId, name: $name, email: $email, password: $password, currentOrganizationId: $currentOrganizationId, emailVerified: $emailVerified, image: $image, isTwoFactorEnabled: $isTwoFactorEnabled, twoFactorConfirmationId: $twoFactorConfirmationId) {
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

	const { data: response } = await axios.post<UpdateUserResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.updateUser;
};

export const createOrganization = async (
	variables: CreateOrganizationVariables
): Promise<CreateOrganizationResponse['data']['createOrganization']> => {
	const query = `mutation CreateOrganization($firstName: String!) {
		createOrganization(firstName: $firstName) {
			id
			name
			description
			widgetStyle
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<CreateOrganizationResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	console.log('createOrganization Response :>>', JSON.stringify(response, null, 2));

	return response.data.createOrganization;
};

export const updateOrganization = async (
  variables: UpdateOrganizationVariables
): Promise<UpdateOrganizationResponse['data']['updateOrganization']> => {
  const query = `mutation UpdateOrganization($organizationId: String!, $name: String, $description: String, $widgetStyle: String) {
    updateOrganization(organizationId: $organizationId, name: $name, description: $description, widgetStyle: $widgetStyle) {
      id
      name
      description
      widgetStyle
      createdAt
      updatedAt
    }
  }`;

  const { data: response } = await axios.post<UpdateOrganizationResponse>(
    process.env.MODUS_ENDPOINT!,
    { query, variables },
    {
      headers: {
        'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
      }
    }
  );

  return response.data.updateOrganization;
};

export const createMembership = async (
	variables: CreateMembershipVariables
): Promise<CreateMembershipResponse['data']['createMembership']> => {
	const query = `mutation CreateMembership($organizationId: String!, $userId: String!, $role: String!) {
		createMembership(organizationId: $organizationId, userId: $userId, role: $role) {
			organizationId
			userId
			role
			createdAt
			updatedAt
		}
	}`;

	const { data: response } = await axios.post<CreateMembershipResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.createMembership;
};

export const generateVerificationCode = async (
	variables: GenerateVerificationCodeVariables
): Promise<GenerateVerificationCodeResponse['data']['generateVerificationCode']> => {
	const query = `query GenerateVerificationCode($email: String!) {
		generateVerificationCode(email: $email) {
			id
			email
			code
			expires
		}
	}`;

	const { data: response } = await axios.post<GenerateVerificationCodeResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	console.log('generateVerificationCode :>>', JSON.stringify(response, null, 2));

	return response.data.generateVerificationCode;
};

export const generatePasswordResetToken = async (
	variables: GeneratePasswordResetTokenVariables
): Promise<GeneratePasswordResetTokenResponse['data']['generatePasswordResetToken']> => {
	const query = `query GeneratePasswordResetToken($email: String!) {
		generatePasswordResetToken(email: $email) {
			id
			email
			code
			expires
		}
	}`;

	const { data: response } = await axios.post<GeneratePasswordResetTokenResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.generatePasswordResetToken;
};

export const deleteVerificationCode = async (
	variables: DeleteVerificationCodeVariables
): Promise<DeleteVerificationCodeResponse['data']['deleteVerificationCode']> => {
	const query = `mutation DeleteVerificationCode($codeId: String!) {
		deleteVerificationCode(codeId: $codeId)
	}`;

	const { data: response } = await axios.post<DeleteVerificationCodeResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.deleteVerificationCode;
};

export const createFeedback = async (
	variables: CreateFeedbackVariables
): Promise<CreateFeedbackResponse['data']['createFeedback']> => {
	const query = `mutation CreateFeedback($rating: Float!, $description: String!, $organizationId: String!) {
		createFeedback(rating: $rating, description: $description, organizationId: $organizationId) {
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

	const { data: response } = await axios.post<CreateFeedbackResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.createFeedback;
};

export const deletePasswordResetToken = async (
	variables: DeletePasswordResetTokenVariables
): Promise<DeletePasswordResetTokenResponse['data']['deletePasswordResetToken']> => {
	const query = `mutation DeletePasswordResetToken($id: String!) {
		deletePasswordResetToken(id: $id)
	}`;

	const { data: response } = await axios.post<DeletePasswordResetTokenResponse>(
		process.env.MODUS_ENDPOINT!,
		{ query, variables },
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MODUS_TOKEN}`
			}
		}
	);

	return response.data.deletePasswordResetToken;
};


/* Update User Helper */
export const initializeUpdateUserVariables = (
	overrides: Partial<UpdateUserVariables>
): UpdateUserVariables => ({
	userId: '',
	name: null,
	email: null,
	password: null,
	currentOrganizationId: null,
	emailVerified: null,
	image: null,
	isTwoFactorEnabled: -1,
	twoFactorConfirmationId: null,
	...overrides
});

export const initializeUpdateOrganizationVariables = (
	overrides: Partial<UpdateOrganizationVariables>
): UpdateOrganizationVariables => ({
	organizationId: '',
	name: null,
	description: null,
	widgetStyle: null,
	...overrides
});

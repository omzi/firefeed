
@json
export class User {
	id!: string
	name!: string // OPTIONAL, not supported yet by Modus ;(
	email!: string // OPTIONAL, not supported yet by Modus ;(
	emailVerified!: Date // OPTIONAL, not supported yet by Modus ;(
	image!: string // OPTIONAL, not supported yet by Modus ;(
	password!: string // OPTIONAL, not supported yet by Modus ;(
	role: string = "USER"
	currentOrganizationId!: string
	createdAt!: string
	updatedAt!: string
	isTwoFactorEnabled: boolean = false
	twoFactorConfirmationId!: string // OPTIONAL, not supported yet by Modus ;(
}

@json
export class Account {
	id!: string
	userId!: string
	type!: string
	provider!: string
	providerAccountId!: string
	refresh_token!: string // OPTIONAL, not supported yet by Modus ;(
	access_token!: string // OPTIONAL, not supported yet by Modus ;(
	expires_at!: i32 // OPTIONAL, not supported yet by Modus ;(
	token_type!: string // OPTIONAL, not supported yet by Modus ;(
	scope!: string // OPTIONAL, not supported yet by Modus ;(
	id_token!: string // OPTIONAL, not supported yet by Modus ;(
	session_state!: string // OPTIONAL, not supported yet by Modus ;(
	createdAt!: string
	updatedAt!: string
}

@json
export class VerificationCode {
	id!: string
	email!: string
	code!: string
	expires!: string
}

@json
export class PasswordResetToken {
	id!: string
	email!: string
	token!: string
	expires!: string
}

@json
export class TwoFactorToken {
	id!: string
	email!: string
	token!: string
	expires!: string
}

@json
export class TwoFactorConfirmation {
	id!: string
	userId!: string
}

@json
export class Organization {
	id!: string
	name!: string
	description!: string // OPTIONAL, not supported yet by Modus ;(
	widgetStyle!: string // JSON serialized as a string // OPTIONAL, not supported yet by Modus ;(
	createdAt!: string
	updatedAt!: string
}

@json
export class OrganizationMembership {
	organizationId!: string
	userId!: string
	role!: string
	createdAt!: string
	updatedAt!: string
}

@json
export class Feedback {
	id!: string
	organizationId!: string
	rating!: i32 // OPTIONAL, not supported yet by Modus ;(
	description!: string // OPTIONAL, not supported yet by Modus ;(
	analysis!: string // OPTIONAL, not supported yet by Modus ;(
	sentiment!: string // OPTIONAL, not supported yet by Modus ;(
	isResolved: boolean = false
	createdAt!: string
	updatedAt!: string
}

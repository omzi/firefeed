import { JSON } from 'json-as';
import { escapeSQL, uuid } from './utils';
import { postgresql } from '@hypermode/modus-sdk-as';
import { Organization, OrganizationMembership } from './schema';

@json
class WidgetStyle {
	buttonBackground: string = '#222FE6';
	buttonColour: string = 'white';
	buttonText: string = 'Give Feedback';
	buttonPosition: string = 'right';
	formBackground: string = '#222FE6';
	formColour: string = 'white';
	formTitle: string = 'Your Feedback Matters';
	formSubtitle: string = `We'd love to hear your thoughts!`;
	formRateText: string = 'Rate your overall experience';
	formDetailsText: string = 'Add more details...';
	formButtonText: string = 'Send Feedback';
};

export function createOrganization(firstName: string): Organization {
	const organizationId = uuid();
	const name = escapeSQL(`${firstName}'s Workspace`);
	const description = 'Default Organization';

	// Use the WidgetStyle class and serialize to JSON
	const widgetStyle = new WidgetStyle();
	const serializedWidgetStyle = escapeSQL(JSON.stringify<WidgetStyle>(widgetStyle));

	const insertResult = postgresql.execute(
		'database',
		`INSERT INTO "Organization" (id, name, description, "widgetStyle", "createdAt", "updatedAt")
		 VALUES ('${organizationId}', '${name}', '${description}', '${serializedWidgetStyle}', NOW(), NOW())`
	);

	if (insertResult.error) {
		throw new Error(`Error creating organization: ${JSON.stringify(insertResult.error)}`);
	}

	const fetchedOrganization = postgresql.query<Organization>(
		'database',
		`SELECT * FROM "Organization" WHERE id = '${organizationId}' LIMIT 1`
	);

	if (fetchedOrganization.error) {
		throw new Error(`Error fetching created organization: ${JSON.stringify(fetchedOrganization.error)}`);
	}

	const organization = fetchedOrganization.rows.pop();
	if (!organization) throw new Error('Organization creation failed');

	console.log(`Created Organization :>> ${JSON.stringify(organization)}`);

	return organization;
};

export function createMembership(organizationId: string, userId: string, role: string = 'owner'): OrganizationMembership {
	const insertResult = postgresql.execute(
		'database',
		`INSERT INTO "OrganizationMembership" ("organizationId", "userId", role, "createdAt", "updatedAt")
		 VALUES ('${organizationId}', '${userId}', '${role}', NOW(), NOW())`
	);

	if (insertResult.error) {
		throw new Error(`Error creating organization membership: ${JSON.stringify(insertResult.error)}`);
	}

	// Fetch and return the membership
	const fetchedMembership = postgresql.query<OrganizationMembership>(
		'database',
		`SELECT * FROM "OrganizationMembership" WHERE "organizationId" = '${organizationId}' AND "userId" = '${userId}' LIMIT 1`
	);

	if (fetchedMembership.error) {
		throw new Error(`Error fetching created membership: ${JSON.stringify(fetchedMembership.error)}`);
	}

	const membership = fetchedMembership.rows.pop();
	if (!membership) throw new Error('Membership creation failed');

	console.log(`Created Membership :>> ${JSON.stringify(membership)}`);

	return membership;
};

export function getOrganization(organizationId: string): Organization | null {
  const fetchedOrganization = postgresql.query<Organization>(
    'database',
    `SELECT * FROM "Organization" WHERE id = '${organizationId}' LIMIT 1`
  );

  if (fetchedOrganization.error) {
    throw new Error(`Error fetching organization: ${JSON.stringify(fetchedOrganization.error)}`);
  }

  return fetchedOrganization.rows.length ? fetchedOrganization.rows.pop() : null;
};

export function getUserOrganizationsByUserId(userId: string): Organization[] {
	const userOrganizations = postgresql.query<Organization>(
		'database',
		`SELECT o.id, 
					o.name, 
					o.description, 
					o."widgetStyle", 
					o."createdAt", 
					o."updatedAt", 
					om.role
		FROM "Organization" o
		INNER JOIN "OrganizationMembership" om ON o.id = om."organizationId"
		WHERE om."userId" = '${userId}'`
	);

	if (userOrganizations.error) {
		throw new Error(`Error fetching user organization: ${JSON.stringify(userOrganizations.error)}`);
	}

	return userOrganizations.rows;
};

export function updateOrganization(
  organizationId: string,
  name: string | null = null,
  description: string | null = null,
  widgetStyle: string | null = null
): Organization | null {
  const setClauses: string[] = [];

  if (name) setClauses.push(`"name" = '${escapeSQL(name)}'`);
  if (description) setClauses.push(`"description" = '${escapeSQL(description)}'`);
  if (widgetStyle) setClauses.push(`"widgetStyle" = '${escapeSQL(widgetStyle)}'`);

  if (!setClauses.length) {
    console.error('No valid fields to update.');
    return null;
  }

  const query = `
    UPDATE "Organization"
    SET ${setClauses.join(', ')}, "updatedAt" = NOW()
    WHERE id = '${organizationId}'
    RETURNING *;
  `;

  const result = postgresql.query<Organization>('database', query);

  if (result.error) {
    console.error(`Error updating organization: ${JSON.stringify(result.error)}`);
    return null;
  }

  return result.rows.length ? result.rows.pop() : null;
};

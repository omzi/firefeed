import { getToken } from 'next-auth/jwt';
import { AppearanceSchema } from '#/lib/validations';
import { NextRequest, NextResponse } from 'next/server';
import { getOrganization, getUser } from '#/lib/graphql/queries';
import { initializeUpdateOrganizationVariables, updateOrganization } from '#/lib/graphql/mutation';

export const maxDuration = 45;

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
	const token = await getToken({ req });
	if (!token) {
		return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
	}

	try {
		const user = await getUser({ id: token.sub as string });
		if (!user) {
			return NextResponse.json({ message: 'Unauthenticated!' }, { status: 401 });
		}

		const organization = await getOrganization({ organizationId: user.currentOrganizationId });
		if (!organization) {
			return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
		}

		const data = AppearanceSchema.parse(body.widgetStyle);
		const updatedOrganization = await updateOrganization(initializeUpdateOrganizationVariables({
			organizationId: organization.id,
			widgetStyle: JSON.stringify(data)
		}));

		return NextResponse.json(updatedOrganization, { status: 200 });
	} catch (error) {
		console.error('Server Error [PUT/Appearance]:>>', error);
		return NextResponse.json({ message: 'Error updating appearance ;(' }, { status: 500 });
	}
};

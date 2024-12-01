import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { getFeedbacksByOrganizationId, getOrganization, getUser } from '#/lib/graphql/queries';

export const maxDuration = 45;

export const GET = async (req: NextRequest) => {
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
		
		const feedbacks = await getFeedbacksByOrganizationId({ organizationId: user.currentOrganizationId });

		return NextResponse.json(feedbacks, { status: 200 });
	} catch (error) {
		console.error('Server Error [GET/FeedbackHistory]:>>', error);
		return NextResponse.json({ message: 'Error fetching feedback history ;(' }, { status: 500 });
	}
};

import { getOrganization } from '#/lib/graphql/queries';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) => {
  const { organizationId } = await params;

	try {
		const organization = await getOrganization({ organizationId });
		if (!organization) {
			return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
		}

		return NextResponse.json(
			{ message: 'Organization fetched successfully!', data: organization },
			{
				status: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization'
				}
			}
		);
	} catch (error) {
		console.error('Server Error [GET/Organization]:>>', error);
		return NextResponse.json({ message: 'Error getting history ;(' }, { status: 500 });
	}
};

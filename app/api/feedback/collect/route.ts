import { NextRequest, NextResponse } from 'next/server';
import { getOrganization } from '#/lib/graphql/queries';
import { createFeedback } from '#/lib/graphql/mutation';

export const POST = async (req: NextRequest) => {
  const body: {
		rating: number,
		description: string,
		organizationId: string
	} = await req.json();

	try {
		const organization = await getOrganization({ organizationId: body.organizationId });
		if (!organization) {
			return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
		}

		const savedFeedback = await createFeedback({
			rating: body.rating,
			description: body.description,
			organizationId: body.organizationId
		});

    return NextResponse.json({ message: 'Feedback saved successfully!', data: savedFeedback }, { status: 201 });
	} catch (error) {
		console.error('Server Error [POST/Feedback]:>>', error);
		return NextResponse.json({ message: 'Error saving feedback ;(' }, { status: 500 });
	}
};

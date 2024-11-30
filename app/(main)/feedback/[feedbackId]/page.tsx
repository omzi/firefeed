import { Feedback } from '#/types';
import type { Metadata } from 'next';
import { User } from '@prisma/client';
import authConfig from '#/auth.config';
import { notFound } from 'next/navigation';
import { Awaitable, getServerSession, Session } from 'next-auth';
import FeedbackId from '#/app/(main)/feedback/[feedbackId]/FeedbackId';
import { getFeedbackByOrganizationIdAndFeedbackId, getUser } from '#/lib/graphql/queries';

export const metadata: Metadata = {
	title: 'Feedback Detail ~ FireFeed',
	description: '...'
};

type PageProps = {
	params: Promise<{
		feedbackId: string;
	}>;
};

const Page = async (props: PageProps) => {
	const params = await props.params;
	const session = await getServerSession(authConfig) as Session;
	const user = await getUser({ id: session.user.id }) as User;

	const feedback = await getFeedbackByOrganizationIdAndFeedbackId({
		organizationId: user.currentOrganizationId,
		feedbackId: params.feedbackId
	}) as Awaited<Feedback | null>;
	if (!feedback) {
		return notFound();
	}
	
	return <FeedbackId feedback={feedback} />;
};

export default Page;

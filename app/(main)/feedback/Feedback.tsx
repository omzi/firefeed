'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Button } from '#/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import FeedbackCard from '#/components/FeedbackCard';
import { getFeedbackHistory } from '#/lib/actions/queries';

const Feedback = () => {
	const { isPending: getFeedbackHistoryLoading, data: feedbackHistory } = useQuery({
		queryKey: ['feedbackHistory'],
		queryFn: async () => {
			try {
				const feedbackHistory = await getFeedbackHistory();

				return feedbackHistory;
			} catch (error) {
				toast.error('Failed to fetch your feedback history ;(');
				throw error;
			}
		}
	});

	if (getFeedbackHistoryLoading) {
		return (
			<div className='flex flex-col h-full'>
				<div className='space-y-2 my-2'>
					<h1 className='text-3xl font-semibold text-black dark:text-white'>
						Customer Feedback
					</h1>
					<div className='grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3'>
						<FeedbackCard.Skeleton />
						<FeedbackCard.Skeleton />
						<FeedbackCard.Skeleton />
						<FeedbackCard.Skeleton />
						<FeedbackCard.Skeleton />
						<FeedbackCard.Skeleton />
					</div>
				</div>
			</div>
		)
	}

	if (!feedbackHistory?.length) {
		return (
			<div className='h-full flex flex-col items-center justify-center'>
				<Image
					src='/images/empty-state-dark.svg'
					height='200'
					width='200'
					alt='No feedback, yet ;)'
					fetchPriority='high'
					className='hidden dark:block'
				/>
				<Image
					src='/images/empty-state-light.svg'
					height='200'
					width='200'
					alt='No feedback, yet ;)'
					fetchPriority='high'
					className='block dark:hidden'
				/>
				<h2 className='text-2xl font-semibold mt-6'>No feedback, yet ;)</h2>
				<p className='text-muted-foreground text-sm mt-2'>Customize or integrate the feedback widget by clicking any of the links below</p>
				<div className='mt-6 space-x-2'>
					<Link href='/appearance'>
						<Button className='text-white transition-colors duration-300 bg-core hover:bg-blue-600' size='sm'>
							Customize Widget
						</Button>
					</Link>
					<Link href='/integrations'>
						<Button className='text-white transition-colors duration-300 bg-core hover:bg-blue-600' size='sm'>
							Integrate Widget
						</Button>
					</Link>
				</div>
			</div>
		)
	}
	
	return (
		<div className='flex flex-col h-full'>
			<div className='space-y-2 my-2'>
				<h1 className='text-3xl font-semibold text-black dark:text-white'>
					Customer Feedback
				</h1>
				<div className='grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3'>
					{feedbackHistory.map(feedback => (
						<FeedbackCard
							key={feedback.id}
							id={feedback.id}
							rating={feedback.rating ?? 0}
							description={feedback.description ?? ''}
							sentiment={feedback.sentiment ?? ''}
							createdAt={feedback.createdAt}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default Feedback;

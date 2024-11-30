'use client';

import Link from 'next/link';
import { marked } from 'marked';
import { cn } from '#/lib/utils';
import { Feedback } from '#/types';
import Rating from '#/components/ui/rating';
import { Button } from '#/components/ui/button';
import { ArrowLeftIcon, SmilePlusIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';

interface FeedbackIdProps {
	feedback: Feedback;
};

const FeedbackId = ({ feedback }: FeedbackIdProps) => {
	return (
		<div className='flex flex-col h-full'>
			<div className='space-y-2 my-2'>
				<div className='flex items-center justify-start gap-3 w-full'>
					<Link href='/feedback'>
						<Button variant='outline' size='icon' className='rounded-full dark:bg-black w-10 h-10'>
							<ArrowLeftIcon className='text-muted-foreground stroke-1' />
						</Button>
					</Link>
					<h1 className='text-3xl font-semibold text-black dark:text-white'>
						Feedback Details
					</h1>
				</div>
				

				<Card className='mb-2'>
					<CardHeader className='flex flex-col md:flex-row justify-between items-center border-b bg-muted px-6 py-3'>
						<CardTitle className='font-semibold text-base'>User Feedback</CardTitle>
						<Rating value={feedback.rating ?? 0} />
					</CardHeader>
					<CardContent className='prose pt-4'>{feedback?.description}</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-col md:flex-row justify-between items-center border-b bg-muted px-6 py-3'>
						<CardTitle className='font-semibold text-base'>AI Generated Analysis</CardTitle>

						<div className={cn(
							'flex items-center gap-1.5 p-1.5 pr-2 rounded-full text-xs capitalize',
							feedback.sentiment === 'POSITIVE' && 'bg-green-500 text-white',
							feedback.sentiment === 'NEGATIVE' && 'bg-red-500 text-white',
							feedback.sentiment === 'NEUTRAL' && 'bg-gray-500 text-white'
						)}>
							<SmilePlusIcon className='size-4 stroke-[1.5]' />
							{feedback.sentiment}
						</div>
					</CardHeader>
					<CardContent className='pt-4 prose prose-p:text-sm prose-li:text-sm prose-h1:text-xl prose-h2:text-lg prose-h3:text-lg prose-h4:text-lg prose-h5:text-lg prose-h6:text-lg'>
						<div dangerouslySetInnerHTML={{ __html: marked(feedback.analysis ?? '') }}></div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default FeedbackId;

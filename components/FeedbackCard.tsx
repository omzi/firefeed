'use client';

import Link from 'next/link';
import { cn } from '#/lib/utils';
import { Card } from '#/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '#/components/ui/skeleton';
import { StarIcon, SmilePlusIcon } from 'lucide-react';

interface FeedbackCardProps {
	id: string;
	description: string;
	sentiment: string;
	rating: number;
	createdAt: Date;
};

const FeedbackCard = ({
	id,
	description,
	sentiment,
	rating,
	createdAt
}: FeedbackCardProps) => {
	return (
		<Link
			href={`/feedback/${id}`}
			key={id}
			className='flex flex-col gap-2.5 h-36 rounded-lg border p-3 hover:shadow hover:border-gray-300 transition-all'
		>
			<div className='font-semibold text-base leading-none line-clamp-1'>Anonymous</div>
			<div className='line-clamp-2 text-sm text-muted-foreground'>{description}</div>
			<div className='h-px bg-border w-full' />
			<div className='flex items-center justify-between w-full my-auto'>
				<div className='flex items-center gap-2'>
					<div className={cn(
						'flex p-1 rounded-full',
						sentiment === 'POSITIVE' && 'bg-green-500 text-white',
						sentiment === 'NEGATIVE' && 'bg-red-500 text-white',
						sentiment === 'NEUTRAL' && 'bg-gray-500 text-white'
					)}>
						<SmilePlusIcon className='size-4 stroke-[1.5]' />
					</div>
					<div className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted'>
						<StarIcon className='size-4 stroke-[1.5]' />
						{rating}
					</div>
				</div>
				<div className='ml-auto text-sm italic capitalize'>{formatDistanceToNow(createdAt, { addSuffix: true })}</div>
			</div>
		</Link>
	);
};

export default FeedbackCard;

FeedbackCard.Skeleton = function FeedbackCardSkeleton() {
	return (
		<div className='flex flex-col gap-2.5 h-36 rounded-lg border p-3'>
			<Skeleton className='w-1/2 h-4 rounded' />
			<Skeleton className='w-full h-10 rounded' />
			
			<div className='h-px bg-border w-full' />

			<div className='flex items-center justify-between w-full my-auto'>
				<div className='flex items-center gap-2'>
					<Skeleton className='w-6 h-6 rounded-full' />
					<Skeleton className='w-11 h-6 rounded-full' />
				</div>
				<Skeleton className='w-28 h-5 rounded ml-auto' />
			</div>
		</div>
	)
};

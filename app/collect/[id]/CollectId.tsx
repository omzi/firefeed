'use client';

import clsx from 'clsx';
import axios from 'axios';
import Link from 'next/link';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { AppearanceType } from '#/types';
import { Transition } from '@headlessui/react';
import { Button } from '#/components/ui/button';
import { FlameIcon, LoaderIcon, ArrowUpRightIcon, XIcon } from 'lucide-react';

type CollectIdProps = {
	params: {
		id: string;
	},
	widgetStyle: AppearanceType;
};

const CollectId: FC<CollectIdProps> = ({ params, widgetStyle }) => {
	const { id } = params;
	const [rating, setRating] = useState(0);
	const [description, setDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const siteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/?utm_medium=powered_by&utm_source=widget`;

	const handleSendFeedback = async () => {
		if (rating === 0) {
			return toast.error('Rate your overall experience!');
		}

		if (!description) {
			return toast.error('Add more details, please!');
		}

		setIsSubmitting(true);

		try {
			await axios.post('/api/feedback/collect', {
				rating,
				description,
				organizationId: id
			});

			setRating(0);
			setDescription('');

			toast.success('Feedback sent successfully!');
			setTimeout(() => parent.postMessage('firefeed-minimized', '*'), 1500);
		} catch (error) {
			console.log('Feedback sending error :>>', error);
			toast.error('Failed to send feedback ;(');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='bg-black/70 backdrop-blur-sm inset-0 fixed'>
			<div className='absolute bottom-4 right-4 max-w-xs w-full bg-white rounded-xl'>
				<div className='w-full rounded-xl p-4' style={{ backgroundColor: widgetStyle.formBackground }}>
					<div className='flex items-start justify-between mb-3' style={{ color: widgetStyle.formColour }}>
						<div>
							<h6 className='font-bold'>{widgetStyle.formTitle}</h6>
							<p className='text-sm'>{widgetStyle.formSubtitle}</p>
						</div>
						<button
							onClick={() => parent.postMessage('firefeed-minimized', '*')}
							className='p-1 bg-white/50 rounded-full'
							style={{ color: widgetStyle.formBackground }}
						>
							<XIcon className='w-4 h-4' />
						</button>
					</div>
					<div className='bg-white/90 rounded-lg p-3'>
						<p className='text-sm mb-2 text-black'>{widgetStyle.formRateText}</p>
						<div className='grid grid-cols-5 gap-3'>
							{Array.from({ length: 5 }, (_, idx) => (
								<button
									key={idx}
									onClick={() => setRating(idx + 1)}
									className='w-full bg-white dark:bg-muted select-none aspect-square shadow rounded-md border active:scale-95 transition-all hover:border-gray-300'
									style={{ background: rating === idx + 1 ? widgetStyle.formBackground : 'white', color: rating === idx + 1 ? widgetStyle.formColour : 'black' }}
								>
									{idx + 1}
								</button>
							))}
						</div>

						<Transition show={rating > 0} enter='transition-all duration-500' enterFrom='opacity-0 h-0' enterTo='opacity-100 h-full'>
							<div className={clsx([
								// Base styles
								'transition-all ease-in-out',
								// Shared closed styles
								'data-[closed]:opacity-0',
								// Entering styles
								'data-[enter]:duration-500',
								// Leaving styles
								'data-[leave]:duration-300',
							])}>
								<p className='text-sm mb-2 mt-3 text-black'>{widgetStyle.formDetailsText}</p>
								<textarea
									className='w-full rounded border p-3 placeholder:text-sm text-black mb-2 resize-none h-[140px]'
									placeholder={`Please let us know your feedback`}
									value={description}
									onChange={e => setDescription(e.target.value)}
								/>

								<Button
									className='w-full disabled:contrast-75 disabled:cursor-not-allowed'
									onClick={handleSendFeedback}
									disabled={isSubmitting}
									style={{ background: widgetStyle.formBackground, color: widgetStyle.formColour }}
								>
									{isSubmitting
										? <LoaderIcon className='size-4 animate-spin' />
										: widgetStyle.formButtonText}
								</Button>
							</div>
						</Transition>

						<Link href={siteLink} target='_blank'>
							<div className='w-fit mx-auto mt-4 rounded-full group flex gap-1 items-center align-middle text-xs font-medium mb-1 border border-muted/25 hover:border-transparent origin-center scale-95 hover:scale-100 duration-200 text-black hover:text-white bg-white hover:from-core hover:to-blue-500 hover:bg-gradient-to-r backdrop-blur-lg'>
								<div className='p-1 m-0.5 -mr-0.5 group-hover:mr-0.5 rounded-full group-hover:scale-105 shadow-xl bg-white'>
									<FlameIcon className='inline size-4 -mt-0.5 text-black group-hover:text-core' />
								</div>
								<div className='py-1'>Collect feedback with FireFeed</div>
								<ArrowUpRightIcon className='mr-2 size-4' />
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CollectId;

'use client';

import QRCode from 'react-qr-code';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { buttonVariants } from '#/components/ui/button';
import { GlobeIcon, LinkIcon, QrCodeIcon } from 'lucide-react';
import { useOrganization } from '#/components/contexts/UserContext';

const Integrations = () => {
	const organization = useOrganization();
	const link = `${process.env.NEXT_PUBLIC_BASE_URL}/collect/${organization.id}`;
	const snippet = `<script src='${process.env.NEXT_PUBLIC_BASE_URL}/widget.js' firefeed-id='${organization.id}' defer/>`;

	return (
		<div className='flex flex-col h-full'>
			<div className='space-y-2 my-2'>
				<h1 className='text-3xl font-semibold text-black dark:text-white'>
					Integrations
				</h1>
				
				<div className='grid grid-cols-1 gap-6 py-4 md:grid-cols-2 lg:grid-cols-3'>
					<div className='w-full bg-white dark:bg-black border rounded-lg p-4 md:p-6 shadow-sm'>
						<div className='flex items-center gap-2 mb-3'>
							<div className='size-10 bg-core/10 text-core rounded-md flex items-center justify-center'>
								<GlobeIcon className='size-5' />
							</div>
							<h5 className='font-bold text-lg'>Website</h5>
						</div>
						<p className='text-gray-500 mb-3'>Embed feedback widget with your websites easily</p>
						<Dialog>
							<DialogTrigger className={buttonVariants({ variant: 'default', size: 'sm' })}>Connect</DialogTrigger>
							<DialogContent showCloseButton={false} className='bg-muted dark:bg-muted'>
								<DialogHeader>
									<DialogTitle>Embed to your website</DialogTitle>
									<DialogDescription className='space-y-2'>
										<span className='mb-2 text-base'>Add this script before <strong>{`</body>`}</strong> on your site:</span>
										<Input value={snippet} readOnly onFocus={e => e.target.select()} />
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose className={buttonVariants({ variant: 'default', size: 'sm' })}>Close</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					<div className='w-full bg-white dark:bg-black border rounded-lg p-4 md:p-6 shadow-sm'>
						<div className='flex items-center gap-2 mb-3'>
							<div className='size-10 bg-core/10 text-core rounded-md flex items-center justify-center'>
								<LinkIcon className='size-5' />
							</div>
							<h5 className='font-bold text-lg'>Quick Link</h5>
						</div>
						<p className='text-gray-500 mb-3'>Share a quick link to interact directly with the widget</p>
						<Dialog>
							<DialogTrigger className={buttonVariants({ variant: 'default', size: 'sm' })}>Connect</DialogTrigger>
							<DialogContent showCloseButton={false} className='bg-muted dark:bg-muted'>
								<DialogHeader>
									<DialogTitle>Quick Link</DialogTitle>
									<DialogDescription className='space-y-2'>
										<span className='mb-2 text-base'>Share this link with your customers:</span>
										<Input value={link} readOnly onFocus={e => e.target.select()} />
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose className={buttonVariants({ variant: 'default', size: 'sm' })}>Close</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					<div className='w-full bg-white dark:bg-black border rounded-lg p-4 md:p-6 shadow-sm'>
						<div className='flex items-center gap-2 mb-3'>
							<div className='size-10 bg-core/10 text-core rounded-md flex items-center justify-center'>
								<QrCodeIcon className='size-5' />
							</div>
							<h5 className='font-bold text-lg'>QR Code</h5>
						</div>
						<p className='text-gray-500 mb-3'>Download & Share QR code to interact directly</p>
						<Dialog>
							<DialogTrigger className={buttonVariants({ variant: 'default', size: 'sm' })}>Connect</DialogTrigger>
							<DialogContent showCloseButton={false} className='bg-muted dark:bg-muted'>
								<DialogHeader>
									<DialogTitle>QR Code</DialogTitle>
									<DialogDescription>
										<QRCode
											size={128}
											style={{ height: 'auto', maxWidth: '50%', width: '50%' }}
											value={link}
											viewBox={`0 0 128 128`}
											className='mx-auto'
										/>
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose className={buttonVariants({ variant: 'default', size: 'sm' })}>Close</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Integrations;

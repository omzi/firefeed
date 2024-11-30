'use client';

import {
	BadgeDelta,
	BarChart,
	Card,
	Flex,
	Grid,
	Icon,
	Metric,
	Text,
	Title
} from '@tremor/react';
import {
	TimerIcon,
	LightbulbIcon,
	Link2Icon,
	MessageSquareTextIcon,
	ZapIcon,
	SmileIcon,
	PaletteIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '#/components/ui/button';
import { CardContent } from '#/components/ui/card';
import background from '#/public/images/background.webp';
import { getDashboardStats } from '#/lib/graphql/queries';
import { useUser } from '#/components/contexts/UserContext';
import { chartColors, formatNumberWithCommas, formatPercentageDelta } from '#/lib/utils';

interface DashboardProps {
	randomTip: string;
	data: Awaited<ReturnType<typeof getDashboardStats>>;
};

const Dashboard = ({ randomTip, data }: DashboardProps) => {
	const user = useUser();
	const [firstName] = `${user.name}`.split(' ');
	
	return (
		<div className='max-w-[1560px] mx-auto p-4 flex flex-col gap-y-4'>
			<div className='flex flex-col sm:grid-cols-2 lg:grid lg:grid-cols-3 gap-4'>
				<div className='rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm w-full'>
					<Image
						src={background}
						alt='Abstract Purple Background'
						width={1920}
						height={1920}
						className='w-full h-16 object-cover'
						placeholder='blur'
					/>
					
					<CardContent className='pt-6 space-y-4'>
						<h2 className='text-2xl font-bold text-gray-900 dark:text-gray-50'>👋 Hi there, {firstName}!</h2>
						<p className='text-muted-foreground mb-2 leading-1.5'>Ready to gain insights from customer feedback? Explore quick actions below.</p>

						<div className='flex flex-col gap-3 sm:flex-row lg:flex-col sm:gap-5 lg:gap-3'>
							<Link href='/integrations' className='w-fit'>
								<Button className='mt-0 h-auto w-fit py-1 px-3 bg-core hover:bg-blue-600 text-white'>
									<Link2Icon className='h-4 w-4 mr-2' />
									Integrate Widget
								</Button>
							</Link>
							<Link href='/appearance' className='w-fit'>
								<Button className='mt-0 h-auto w-fit py-1 px-3 bg-core hover:bg-blue-600 text-white'>
									<PaletteIcon className='h-4 w-4 mr-2' />
									Customize Widget
								</Button>
							</Link>
						</div>
					</CardContent>
				</div>

				<Grid numItemsSm={1} numItemsMd={2} className='md:col-span-2 gap-4'>
					{/* Total Feedback Card */}
					<Card className='p-4 ring-0 bg-primary/5 dark:bg-primary/5 flex flex-col justify-between' decoration='top' decorationColor='blue' key='Total Feedback'>
						<Flex alignItems='center' justifyContent='start' className='gap-2'>
							<Icon icon={MessageSquareTextIcon} className='rounded-full' color='blue' variant='light' size='xs' />
							<Text>Total Feedback</Text>
						</Flex>
						<Metric className='truncate mt-2'>{formatNumberWithCommas(data.stats.totalFeedback)}</Metric>
						<div className='flex justify-start items-center space-x-2 mt-2'>
							<BadgeDelta deltaType={formatPercentageDelta(`${data.stats.totalFeedbackChange}`).deltaType} />
							<div className='flex justify-start space-x-1 truncate'>
								<Text color={chartColors[formatPercentageDelta(`${data.stats.totalFeedbackChange}`).deltaType] as any}>
									{formatPercentageDelta(`${data.stats.totalFeedbackChange}`).absoluteValue}%
								</Text>
								<Text>from previous month</Text>
							</div>
						</div>
					</Card>
					{/* Open Feedback Card */}
					<Card className='p-4 ring-0 bg-primary/5 dark:bg-primary/5 flex flex-col justify-between' decoration='top' decorationColor='green' key='Open Feedback'>
						<Flex alignItems='center' justifyContent='start' className='gap-2'>
							<Icon icon={TimerIcon} className='rounded-full' color='green' variant='light' size='xs' />
							<Text>Open Feedback</Text>
						</Flex>
						<Metric className='truncate mt-2'>{formatNumberWithCommas(data.stats.openFeedback)}</Metric>
						<div className='flex justify-start items-center space-x-2 mt-2'>
							<BadgeDelta deltaType={formatPercentageDelta(`${data.stats.openFeedbackChange}`).deltaType} />
							<div className='flex justify-start space-x-1 truncate'>
								<Text color={chartColors[formatPercentageDelta(`${data.stats.openFeedbackChange}`).deltaType] as any}>
									{formatPercentageDelta(`${data.stats.openFeedbackChange}`).absoluteValue}%
								</Text>
								<Text>from previous month</Text>
							</div>
						</div>
					</Card>
					{/* Resolved Feedback Card */}
					<Card className='p-4 ring-0 bg-primary/5 dark:bg-primary/5 flex flex-col justify-between' decoration='top' decorationColor='fuchsia' key='Resolved Feedback'>
						<Flex alignItems='center' justifyContent='start' className='gap-2'>
							<Icon icon={SmileIcon} className='rounded-full' color='fuchsia' variant='light' size='xs' />
							<Text>Resolved Feedback</Text>
						</Flex>
						<Metric className='truncate mt-2'>{formatNumberWithCommas(data.stats.resolvedFeedback)}</Metric>
						<div className='flex justify-start items-center space-x-2 mt-2'>
							<BadgeDelta deltaType={formatPercentageDelta(`${data.stats.resolvedFeedbackChange}`).deltaType} />
							<div className='flex justify-start space-x-1 truncate'>
								<Text color={chartColors[formatPercentageDelta(`${data.stats.resolvedFeedbackChange}`).deltaType] as any}>
									{formatPercentageDelta(`${data.stats.resolvedFeedbackChange}`).absoluteValue}%
								</Text>
								<Text>from previous month</Text>
							</div>
						</div>
					</Card>
					{/* Average Rating Card */}
					<Card className='p-4 ring-0 bg-primary/5 dark:bg-primary/5 flex flex-col justify-between' decoration='top' decorationColor='yellow' key='Average Rating'>
						<Flex alignItems='center' justifyContent='start' className='gap-2'>
							<Icon icon={ZapIcon} className='rounded-full' color='yellow' variant='light' size='xs' />
							<Text>Average Rating</Text>
						</Flex>
						<Metric className='truncate mt-2'>{data.stats.averageRating.toFixed(2)}</Metric>
						<div className='flex justify-start items-center space-x-2 mt-2'>
							<BadgeDelta deltaType={formatPercentageDelta(`${data.stats.averageRatingChange}`).deltaType} />
							<div className='flex justify-start space-x-1 truncate'>
								<Text color={chartColors[formatPercentageDelta(`${data.stats.averageRatingChange}`).deltaType] as any}>
									{formatPercentageDelta(`${data.stats.averageRatingChange}`).absoluteValue}%
								</Text>
								<Text>from previous month</Text>
							</div>
						</div>
					</Card>
				</Grid>
			</div>
			
			<div className='bg-core border-l-4 border-primary/20 p-2.5 rounded-lg'>
				<div className='flex'>
					<div className='flex-shrink-0'>
						<LightbulbIcon className='h-4 w-4 text-white' aria-hidden='true' />
					</div>
					<span className='ml-1 text-sm font-bold text-white'>
						Feedback Tip
					</span>
				</div>
				<p className='mt-1 text-sm text-white'>
					{randomTip}
				</p>
			</div>

			<Card className='p-4 ring-0 bg-primary/5 dark:bg-primary/5 flex flex-col justify-between'>
				<Title className='mb-4'>Feedback This Week</Title>
				<BarChart
					className='h-64'
					data={data.charts.feedbackThisWeek}
					index='name'
					categories={['count']}
					colors={['blue']}
					yAxisWidth={40}
					showLegend={false}
				/>
			</Card>
		</div>
	);
}

export default Dashboard;

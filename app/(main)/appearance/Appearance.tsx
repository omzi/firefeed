'use client';

import { z } from 'zod';
import axios from 'axios';
import { cn } from '#/lib/utils';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AppearanceType } from '#/types';
import { useForm } from 'react-hook-form';
import { ChromePicker } from 'react-color';
import { Label } from '#/components/ui/label';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { LoaderIcon, XIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppearanceSchema } from '#/lib/validations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select';

type AppearanceTab = 'form' | 'button';

interface AppearanceProps {
	widgetStyle: AppearanceType;
};

const Appearance = ({ widgetStyle }: AppearanceProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [appearanceTab, setAppearanceTab] = useState<AppearanceTab>('form');

	const form = useForm<z.infer<typeof AppearanceSchema>>({
		resolver: zodResolver(AppearanceSchema),
		defaultValues: widgetStyle
	});

	const onTabChange = (tab: string) => {
		setAppearanceTab(tab as AppearanceTab);
	};

	const onSubmit = async (data: z.infer<typeof AppearanceSchema>) => {
		try {
			setIsSubmitting(true);

			const response = await axios.put('/api/appearance', { widgetStyle: data });
			console.log('Response :>>', response.data);

			toast.success('Saved successfully!');

			form.reset(JSON.parse(`{${response.data.widgetStyle}}`) as AppearanceType);
		} catch (error: any) {
			console.error(`Appearance Update Error :>>`, error);
			toast.error('Failed to save your changes');
		} finally {
			setIsSubmitting(false);
		}
	};
	
	return (
		<div className='flex flex-col h-full'>
			<div className='space-y-2 my-2'>
				<h1 className='text-3xl font-semibold text-black dark:text-white'>
					Appearance
				</h1>

				<div className='grid gap-6 py-4 grid-cols-1 md:grid-cols-2'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<Card>
								<CardHeader className='border-b py-3'>
									<h2 className='font-bold'>Settings</h2>
								</CardHeader>
								<CardContent className='pt-6'>
									<Tabs value={appearanceTab} onValueChange={onTabChange} className='w-full flex flex-col gap-y-3'>
										<TabsList className='grid w-full grid-cols-2'>
											<TabsTrigger value='form'>Feedback Form</TabsTrigger>
											<TabsTrigger value='button'>Button Trigger</TabsTrigger>
										</TabsList>
										<TabsContent value='form' className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label htmlFor='formBackground'>Background</Label>
												<Popover>
													<PopoverTrigger className='w-full h-10 rounded-full border border-dashed border-black text-xs text-black/50' style={{ background: form.watch('formBackground') }}></PopoverTrigger>
													<PopoverContent className='p-0 bg-transparent border-none shadow-none flex items-center justify-center'>
														<ChromePicker
															color={form.watch('formBackground')}
															onChangeComplete={(color) => {
																form.setValue('formBackground', color.hex);
															}}
														/>
													</PopoverContent>
												</Popover>
											</div>
											<div className='space-y-2'>
												<Label htmlFor='formColour'>Foreground</Label>
												<Popover>
													<PopoverTrigger className='w-full h-10 rounded-full border border-dashed border-black text-xs text-black/50' style={{ background: form.watch('formColour') }}></PopoverTrigger>
													<PopoverContent className='p-0 bg-transparent border-none shadow-none flex items-center justify-center'>
														<ChromePicker
															color={form.watch('formColour')}
															onChangeComplete={(color) => {
																form.setValue('formColour', color.hex);
															}}
														/>
													</PopoverContent>
												</Popover>
											</div>
											<FormField
												control={form.control}
												name='formTitle'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Title</FormLabel>
														<FormControl>
															<Input {...field} placeholder='....' disabled={isSubmitting} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='formSubtitle'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Subtitle</FormLabel>
														<FormControl>
															<Input {...field} placeholder='....' disabled={isSubmitting} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='formRateText'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Rate Text</FormLabel>
														<FormControl>
															<Input {...field} placeholder='....' disabled={isSubmitting} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='formDetailsText'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Details Text</FormLabel>
														<FormControl>
															<Input {...field} placeholder='....' disabled={isSubmitting} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='formButtonText'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text</FormLabel>
														<FormControl>
															<Input {...field} placeholder='....' disabled={isSubmitting} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</TabsContent>
										<TabsContent value='button' className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label htmlFor='buttonBackground'>Background</Label>
												<Popover>
													<PopoverTrigger className='w-full h-10 rounded-full border border-dashed border-black text-xs text-black/50' style={{ background: form.watch('buttonBackground') }}></PopoverTrigger>
													<PopoverContent className='p-0 bg-transparent border-none shadow-none flex items-center justify-center'>
														<ChromePicker
															color={form.watch('buttonBackground')}
															onChangeComplete={(color) => {
																form.setValue('buttonBackground', color.hex);
															}}
														/>
													</PopoverContent>
												</Popover>
											</div>
											<div className='space-y-2'>
												<Label htmlFor='buttonColour'>Foreground</Label>
												<Popover>
													<PopoverTrigger className='w-full h-10 rounded-full border border-dashed border-black text-xs text-black/50' style={{ background: form.watch('buttonColour') }}></PopoverTrigger>
													<PopoverContent className='p-0 bg-transparent border-none shadow-none flex items-center justify-center'>
														<ChromePicker
															color={form.watch('buttonColour')}
															onChangeComplete={(color) => {
																form.setValue('buttonColour', color.hex);
															}}
														/>
													</PopoverContent>
												</Popover>
											</div>
											<FormField
												control={form.control}
												name='buttonText'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Text</FormLabel>
														<FormControl>
															<Input {...field} placeholder='....' disabled={isSubmitting} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='buttonPosition'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Position</FormLabel>
														<FormControl>
															<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
																<SelectTrigger className='w-full'>
																	<SelectValue placeholder='Position' />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value='right'>Right</SelectItem>
																	<SelectItem value='left'>Left</SelectItem>
																	<SelectItem value='bottomLeft'>Bottom Left</SelectItem>
																	<SelectItem value='bottomRight'>Bottom Right</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</TabsContent>
									</Tabs>
								</CardContent>
								<CardFooter className='border-t py-3'>
									<Button type='submit' disabled={isSubmitting || Object.keys(form.formState.dirtyFields).length === 0} className='w-24'>
										{isSubmitting ? <LoaderIcon className='text-white size-5 animate-spin' /> : 'Save'}
									</Button>
								</CardFooter>
							</Card>
						</form>
					</Form>

					<Card>
						<CardHeader className='border-b py-3'>
							<h2 className='font-bold'>Preview</h2>
						</CardHeader>
						<CardContent className='pt-6 h-full'>
							<Tabs value={appearanceTab} onValueChange={onTabChange} className='w-full h-full flex flex-col gap-y-2'>
								<TabsList className='grid w-full grid-cols-2'>
									<TabsTrigger value='form'>Feedback Form</TabsTrigger>
									<TabsTrigger value='button'>Button Trigger</TabsTrigger>
								</TabsList>
								<TabsContent value='form' className='flex flex-col items-center'>
									<div className='max-w-xs w-full bg-muted rounded-xl'>
										<div className={`w-full rounded-xl p-4`} style={{ backgroundColor: form.watch('formBackground') }}>
											<div className='flex items-start justify-between mb-3' style={{ color: form.watch('formColour') }}>
												<div>
													<h6 className='font-bold'>{form.watch('formTitle')}</h6>
													<p className='text-sm'>{form.watch('formSubtitle')}</p>
												</div>
												<button type='button' className='p-1 bg-white/50 rounded-full' style={{ color: form.watch('formBackground') }}>
													<XIcon className='w-4 h-4' />
												</button>
											</div>
											<div className='bg-white/90 rounded-lg p-3'>
												<p className='text-sm mb-2 text-black'>{form.watch('formRateText')}</p>
												<div className='grid grid-cols-5 gap-3'>
													{Array.from({ length: 5 }, (_, idx) => (
														<button
															key={idx}
															type='button'
															className='w-full bg-white dark:bg-muted select-none aspect-square shadow rounded-md border active:scale-95 transition-all hover:border-gray-300'
														>
															{idx + 1}
														</button>
													))}
												</div>

												<p className='text-sm mb-2 mt-3 text-black'>{form.watch('formDetailsText')}</p>
												<textarea
													className='w-full rounded border p-3 placeholder:text-sm text-black mb-2 resize-none h-[140px]'
													placeholder={`Please let us know your feedback`}
												/>

												<Button
													type='button'
													className='w-full disabled:contrast-75 disabled:cursor-not-allowed bg-core'
													style={{ background: form.watch('formBackground'), color: form.watch('formColour') }}
												>
													{form.watch('formButtonText')}
												</Button>
											</div>
										</div>
									</div>
								</TabsContent>
								<TabsContent value='button' className='relative bg-muted rounded-lg min-h-80 md:min-h-40 h-[calc(100%-25px)] md:h-[calc(100%-120px)]'>
									<button
										style={{ background: form.watch('buttonBackground'), color: form.watch('buttonColour') }}
										className={cn(
											form.watch('buttonPosition') === 'right' && 'absolute right-0 px-4 py-2 rounded-t-lg -rotate-90 bottom-2/3 origin-bottom-right',
											form.watch('buttonPosition') === 'left' && 'absolute left-0 px-4 py-2 rounded-t-lg rotate-90 bottom-2/3 origin-bottom-left',
											form.watch('buttonPosition') === 'bottomRight' && 'absolute right-4 px-4 py-2 rounded-t-lg bottom-0',
											form.watch('buttonPosition') === 'bottomLeft' && 'absolute left-4 px-4 py-2 rounded-t-lg bottom-0'
										)}
									>
										{form.watch('buttonText')}
									</button>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Appearance;

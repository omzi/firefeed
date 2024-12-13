import { Feedback } from '#/types';

export const getFeedbackHistory = async (): Promise<Feedback[]> => {
	const response = await fetch('/api/getFeedbackHistory');
	if (!response.ok) {
		throw new Error('Error fetching feedback history');
	}

	return response.json();
};

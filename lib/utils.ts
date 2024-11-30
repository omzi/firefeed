import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const getScrollbarWidth = () => {
  const div = document.createElement('div');

  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';

  document.body.appendChild(div);

  // Calculate the scrollbar width
  const scrollbarWidth = div.offsetWidth - div.clientWidth;

  document.body.removeChild(div);

  return scrollbarWidth;
};

export const formatName = (fullName: string): string => {
  const [firstName, ...lastNameParts] = fullName.split(' ');
  const lastName = lastNameParts.join(' ');

  return `${firstName} (first name) ${lastName} (last name)`;
};

export const getInitials = (name: string): string => {
	const [first, second = ''] = name.split(' ');

	return (first + second).toUpperCase();
};

export const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const generateDefaultAvatar = (seed: string) => {
  return `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${seed}`;
};

export const isBase64Image = (imageData: string) => {
  return /^data:image\/(png|jpe?g|gif|webp);base64,/.test(imageData);
};

export const titleCase = (input: string): string => {
  return input.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const copyToClipboard = async (text: string, successMessage: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(successMessage);
		return true;
	} catch (error) {
		try {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.setAttribute('readonly', '');
			textarea.style.position = 'absolute';
			textarea.style.left = '-9999px';
			document.body.appendChild(textarea);
			
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			toast.success(successMessage);

			return true;
		} catch (fallbackError) {
			console.error('Copying to clipboard failed :>>', fallbackError);
			return false;
		}
	}
};

export const blurActiveElement = () => {
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement) activeElement.blur();
};

export const generateRandomChars = (() => {
	const generateChars = (min: number, max: number): string[] => Array.from({ length: max - min + 1 }, (_, i) => String.fromCharCode(min + i));

	const sets = {
		numeric: generateChars(48, 57),
		lowerCase: generateChars(97, 122),
		upperCase: generateChars(65, 90),
		special: [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?`],
		alphanumeric: [
			...generateChars(48, 57),
			...generateChars(65, 90),
			...generateChars(97, 122)
		]
	};

	const iter = function* (
		len: number,
		set: string[] | undefined
	): Generator<string, void, unknown> {
		if (set && set.length < 1) set = Object.values(sets).flat();
		for (let i = 0; i < len; i++) yield set![(Math.random() * set!.length) | 0];
	};

	return Object.assign(
		(len: number, ...set: string[]) => [...iter(len, set.flat())].join(''),
		sets
	);
})();

export const generateOneTimePassword = (length: number): string => {
  const chars = '0123456789';
  const charsLength = chars.length;
  const isBrowser = typeof window !== 'undefined' && typeof window.crypto !== 'undefined';
  
  let oneTimePassword = '';
  const randomValues = new Uint8Array(length);
  if (isBrowser) {
    window.crypto.getRandomValues(randomValues);
  } else {
    // Node.js environment
    const { randomBytes } = require('crypto');
    const bytes = randomBytes(length);
    for (let i = 0; i < length; i++) {
      randomValues[i] = bytes[i];
    }
  }

  for (let i = 0; i < length; i++) {
    oneTimePassword += chars[randomValues[i] % charsLength];
  }

  return oneTimePassword;
};

export const UUIDRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
export const uint8ArrayToUUID = (uint8String: string): string => {
  const uint8Array = new Uint8Array(uint8String.split(',').map($ => parseInt($.trim(), 10)));  // Trim spaces and parse numbers
  
  // Ensure the byte array has the correct length (16 bytes for UUID)
  if (uint8Array.length !== 16) {
    throw new Error('Invalid UUID length: UUID must be 16 bytes.');
  }

  // Convert each byte to a 2-character hex string
  const hex = Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0')) // Convert byte to hex and pad with leading zeros
    .join('');

  // Format the hex string into UUID format (8-4-4-4-12)
  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
};

export const publicRoutes = ['/', '/terms', '/privacy-policy', '/api/edgestore/init', '/api/feedback/collect'];
export const authRoutes = [
	'/auth/error',
	'/auth/sign-up',
	'/auth/sign-in',
	'/auth/verify-account',
	'/auth/forgot-password',
	'/auth/reset-password'
];
export const metaRoutes = [
	'/android-chrome-192x192.png',
	'/android-chrome-512x512.png',
	'/apple-touch-icon.png',
	'/browserconfig.xml',
	'/favicon-32x32.png',
	'/favicon-16x16.png',
	'/mstile-150x150.png',
	'/manifest.webmanifest',
	'/safari-pinned-tab.svg'
];

export const API_AUTH_PREFIX = '/api/auth';
export const COLLECT_PREFIX = '/collect';
export const API_ORGANIZATION_PREFIX = '/api/organization';
export const SIGN_IN_ROUTE = '/auth/sign-in';
export const DEFAULT_SIGN_IN_REDIRECT = '/dashboard';

export const chartColors = {
	increase: 'emerald',
	moderateIncrease: 'emerald',
	unchanged: 'orange',
	moderateDecrease: 'rose',
	decrease: 'rose'
};

type DeltaType = keyof typeof chartColors;

export const formatPercentageDelta = (percentage: string): { absoluteValue: number; deltaType: DeltaType } => {
	const numericPercentage = parseFloat(percentage);
	const absoluteValue = Math.abs(numericPercentage);

	if (numericPercentage > 35) {
		return { absoluteValue, deltaType: 'increase' };
	} else if (numericPercentage > 0) {
		return { absoluteValue, deltaType: 'moderateIncrease' };
	} else if (numericPercentage === 0) {
		return { absoluteValue, deltaType: 'unchanged' };
	} else if (numericPercentage >= -35) {
		return { absoluteValue, deltaType: 'moderateDecrease' };
	} else {
		return { absoluteValue, deltaType: 'decrease' };
	}
};

export const calculateMonthlyPercentageChange = (currentValue: number, previousValue: number) => {
	if (previousValue === 0) {
		return currentValue > 0 ? '100' : '0'; // If it's the first month, consider it as a 100% increase
	}

	const monthlyPercentageChange = ((currentValue - previousValue) / previousValue) * 100;
	return monthlyPercentageChange.toFixed(2);
};

export const getFirstDayOfMonth = (month: number) => new Date(new Date().getFullYear(), month, 1);
export const getLastDayOfMonth = (month: number) => new Date(new Date().getFullYear(), month + 1, 0);

export const feedbackTips = [
  'Encourage open and honest feedback from customers to gain genuine insights into their experience.',
  'Regularly analyze customer feedback to identify trends, recurring issues, and potential areas for improvement.',
  'Make feedback easy to give by providing simple and user-friendly channels for customers to share their thoughts.',
  'Act on both positive and negative feedback to improve your products, services, and customer experience.',
  'Look for actionable insights in qualitative feedback (like comments or suggestions) and quantitative data (like ratings or scores).',
  'Don’t just focus on customer complaints—use positive feedback to highlight what’s working and replicate success.',
  'Segment your feedback by customer demographics or behavior to identify patterns and better understand specific groups.',
  'Ensure that feedback is collected regularly, so you have up-to-date insights on customer satisfaction and expectations.',
  'Use feedback to guide product or service development, ensuring they align with what customers truly want.',
  'Make sure to follow up with customers who provided feedback, especially when changes are made based on their input.',
  'Track feedback over time to measure improvements and see how changes have impacted customer satisfaction.',
  'Communicate the value of feedback to customers, showing them how their input has contributed to improvements.',
  'Monitor competitor feedback to understand how your offerings compare and where you can gain an edge.',
  'Ensure that your feedback collection methods are diverse (surveys, interviews, focus groups) to capture a wide range of insights.',
  'Review feedback for both recurring themes and one-off comments—both can provide valuable insights into customer needs.',
  'Use feedback to personalize customer experiences, tailoring your products or services to better meet their expectations.',
  'Encourage feedback at various stages of the customer journey to understand different touchpoints and pain points.',
  'Prioritize feedback that aligns with your business goals and can drive measurable improvements in performance.',
  'Leverage data from customer feedback to inform marketing campaigns, creating messaging that resonates with your audience.',
  'Use feedback to identify gaps in your customer support process and improve response times and service quality.',
  'Be transparent with your customers about the changes you’re making based on their feedback to build trust.',
  'Create a system to categorize and organize feedback, making it easier to identify key themes and track progress over time.',
  'Develop a feedback loop to continuously collect insights, make improvements, and close the loop by sharing updates with customers.',
  'Use feedback to identify customer pain points early and proactively address them before they escalate.',
  'Make feedback collection a part of your customer service routine to ensure you’re always in tune with customer satisfaction.',
  'Leverage feedback to anticipate customer needs and innovate before competitors can capitalize on new trends.',
  'Incorporate feedback into employee training programs to improve customer interactions and product knowledge.',
  'Regularly evaluate the effectiveness of your feedback collection methods to ensure you’re gathering meaningful data.',
  'Don’t be afraid to ask for constructive criticism—sometimes the most valuable insights come from what’s not working.',
  'Be receptive to feedback from both satisfied and dissatisfied customers to gain a full picture of your brand perception.',
  'Track the performance of new features or updates to see how customer feedback translates into real-world improvements.',
  'Create customer personas based on feedback to better understand different customer needs and how to address them.',
  'Consider integrating feedback into your product or service roadmap, using it as a foundation for future growth and improvement.',
  'Use customer feedback to refine your value proposition, ensuring it aligns with what customers care about most.',
  'Make sure to actively listen to customer feedback and avoid dismissing it, even if it’s difficult to hear or act upon.',
  'Build a culture of feedback within your organization, encouraging employees at all levels to contribute insights and ideas.',
  'Be responsive to feedback, showing customers that their opinions matter and lead to positive changes.',
  'Measure the impact of improvements made based on customer feedback to ensure that your efforts are driving real results.',
  'Identify and track recurring issues in feedback to prioritize them in your product or service updates.',
  'Encourage customers to provide feedback on specific aspects of your product or service to get more detailed and actionable insights.',
  'Don’t just collect feedback—use it to make data-driven decisions that improve customer loyalty, retention, and satisfaction.',
  'Use feedback to create a continuous improvement process, so you’re always working to enhance your products and services.',
  'Share success stories from feedback-driven changes to show customers that their input leads to real, tangible results.',
  'Maintain an open line of communication with customers about how their feedback is being used to enhance their experience.',
  'Create a feedback-friendly environment where customers feel comfortable and valued in sharing their thoughts.',
  'Use customer feedback to assess the usability of your product or service, identifying areas where users may be struggling.',
  'Revisit older feedback to see if past concerns have been addressed or if new solutions are needed.',
  'Use feedback to measure the effectiveness of marketing campaigns and adjust strategies accordingly.',
  'Create a clear action plan for addressing feedback and communicate the next steps to stakeholders and customers.',
  'Be consistent in the way you request and respond to feedback, ensuring a smooth and predictable process for customers.',
  'Make sure your feedback collection methods are accessible to all customers, including those with disabilities or language barriers.',
  'Evaluate feedback to identify new opportunities for innovation, such as new features, services, or customer segments.',
  'Refine your customer experience strategy using feedback to ensure it supports your business objectives and customer needs.'
];

export const compileTemplate = <T extends Record<string, any>>(template: string, values: T): string => {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim() as string;
    return trimmedKey in values ? String(values[trimmedKey]) : `{{${trimmedKey}}}`;
  });
};

'use server';

import { getUserByEmail, getVerificationCodeByCode } from '#/lib/graphql/queries';
import { deleteVerificationCode, updateUser, initializeUpdateUserVariables } from '#/lib/graphql/mutation';

const verifyUser = async (code: string) => {
	// Check if the OTP is valid
	const existingCode = await getVerificationCodeByCode({ code });
	if (!existingCode) {
		return { error: 'Invalid OTP!' };
	}

	const hasCodeExpired = new Date(existingCode.expires) < new Date();
	if (hasCodeExpired) {
		return { error: 'OTP has expired! Please request a new code.' };
	}
	
	// Check if the token is valid
	const user = await getUserByEmail({ email: existingCode.email });
	if (!user) {
		return { error: 'Email does not exist!' };
	}

	console.log('Verify Email User :>>', user);

	if (new Date(user.emailVerified).getFullYear() !== 0 && user.emailVerified) {
		return { error: 'Email has already been verified!' };
	}

	await updateUser(initializeUpdateUserVariables({
		userId: user.id,
		emailVerified: new Date().toISOString()
	}));

	await deleteVerificationCode({ codeId: existingCode.id });
	
	// TODO: Send welcome email
	// 	await sendBrevoEmail({
  //   sender: { email: 'notifications@firefeed.com', name: 'FireFeed' },
  //    to: [{ email, name: `${user.name}` }],
  //    subject: 'Welcome to FireFeed! 🎉',
  //    htmlContent: accountVerificationEmailTemplate({
  //      email,
  //      firstName,
  //      verificationCode: code
  //    })
  //  });

	return { success: 'Email verified successfully! Please sign in to proceed.' };
};

export default verifyUser;

'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import config from '#/lib/config';
import { AuthSchema } from '#/lib/validations';
import { getUserByEmail } from '#/lib/graphql/queries';
import { sendAccountVerificationEmail } from '#/lib/emails/mail';
import { createMembership, createOrganization, createUser, generateVerificationCode } from '#/lib/graphql/mutation';

const handleSignUp = async (data: z.infer<typeof AuthSchema>) => {
  const validatedFields = AuthSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, firstName, lastName } = validatedFields.data;

  try {
    // Check if the email already exists
    const existingUser = await getUserByEmail({ email: `${email}` });
    if (existingUser) {
      return { error: 'Email already in use! Please use a different email.' };
    }
  
    const hashedPassword = await bcrypt.hash(`${password}`, 12);
    const organization = await createOrganization({ firstName });
  
    const user = await createUser({
      email,
      name: `${firstName} ${lastName}`,
      password: hashedPassword,
      currentOrganizationId: organization.id
    });

    await createMembership({
      organizationId: organization.id,
      userId: user.id,
      role: 'owner'
    });

    const { code } = await generateVerificationCode({ email: `${email}` });
    console.log('Verification Code :>>', code);
    const verifyAccountLink = `${config.NEXTAUTH_URL}/auth/verify-account?email=${email}`;

		await sendAccountVerificationEmail({
			email: `${email}`,
			name: `${firstName} ${lastName}`,
			firstName: `${firstName}`,
			verifyAccountLink,
			verificationCode: code
		});
  
    return { success: 'Account created successfully!' };
  } catch (error) {
    return { error: 'An error occurred while signing up ;(' };
  }
};

export default handleSignUp;

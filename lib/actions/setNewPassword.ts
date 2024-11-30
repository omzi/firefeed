'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { AuthSchema } from '#/lib/validations';
import { getPasswordResetTokenByToken, getUserByEmail } from '#/lib/graphql/queries';
import { deletePasswordResetToken, initializeUpdateUserVariables, updateUser } from '#/lib/graphql/mutation';

const NewPasswordSchema = AuthSchema.pick({
	password: true
});

const setNewPassword = async (data: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
	if (!token) {
		return { error: 'Missing token!' };
	}

  const validatedFields = NewPasswordSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const existingToken = await getPasswordResetTokenByToken({ token });
  if (!existingToken) {
    return { error: 'Invalid token!' };
  }
	
	const hasTokenExpired = new Date(existingToken.expires) < new Date();
	if (hasTokenExpired) {
		return { error: 'Token has expired!' };
	}

	const user = await getUserByEmail({ email: existingToken.email });
  if (!user) {
    return { error: 'Email does not exist!' };
  }

	const { password } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 12);
	await updateUser(initializeUpdateUserVariables({
		userId: user.id,
		password: hashedPassword
	}));

	await deletePasswordResetToken({ id: existingToken.id });

  return { success: 'Password changed successfully!' };
};

export default setNewPassword;

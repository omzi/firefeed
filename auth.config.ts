import bcrypt from 'bcryptjs';
import { Role } from '#/types';
import { AuthSchema } from '#/lib/validations';
import { ModusAdapter } from '#/lib/ModusAdapter';
import { type AuthOptions, type User } from 'next-auth';
import { getUser, getUserByEmail } from '#/lib/graphql/queries';
import CredentialsProvider from 'next-auth/providers/credentials';
import { initializeUpdateUserVariables, updateUser } from '#/lib/graphql/mutation';

const SignInSchema = AuthSchema.pick({
	password: true,
	email: true
});

export default {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    //   allowDangerousEmailAccountLinking: true
    // }),
    CredentialsProvider({
      name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' }
			},
      async authorize(credentials): Promise<User | null> {
        try {
          const validatedFields = await SignInSchema.safeParseAsync(credentials);
          if (!validatedFields.success) {
            throw new Error('Invalid credentials!');
          }
          
          const { email, password } = validatedFields.data;

          // Check if the user already exists
          const user = await getUserByEmail({ email: `${email}` });
          if (!user) {
            throw new Error('Invalid credentials!');
          }

          if (!user.emailVerified) {
            throw new Error('Please verify your email to proceed!');
          }

          if (!user.password) {
            throw new Error('You have not set your password yet. Please sign in using your Google account.');
          }
        
          const isPasswordCorrect = await bcrypt.compare(`${password}`, user.password);
          if (!isPasswordCorrect) {
            throw new Error('Invalid credentials!');
          }
  
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    })
  ],
  adapter: ModusAdapter,
  session: { strategy: 'jwt' },
	callbacks: {
		async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUser({ id: user.id });

      // Prevent sign in without email verification
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      return true;
    },
		async session({ token, session }) {
			if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.isOAuth = token.isOAuth;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

      const existingUser = await getUser({ id: token.sub });
      if (!existingUser) return token;

			token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role as Role;
      token.image = existingUser.image;
			
			return token;
		},
	},
  events: {
    async linkAccount({ user, profile }) {
			const userDetails = {} as Record<string, string>;

			if (profile.name && !user.name) {
				userDetails.name = profile.name;
			}

			if (profile.image && !user.image) {
				userDetails.image = profile.image;
			}

      await updateUser(initializeUpdateUserVariables({
        userId: user.id,
        emailVerified: new Date().toUTCString(),
        ...userDetails
      }));
    }
  },
	debug: process.env.NODE_ENV === 'development',
	secret: process.env.NEXTAUTH_SECRET,
  pages: {
		signIn: '/auth/sign-in',
		error: '/auth/error'
	}
} satisfies AuthOptions;
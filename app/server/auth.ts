import type { User } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import type { IUser } from './users/interfaces';
import { createUser, findUserByName } from './users/service';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        name: { label: 'Username', type: 'text' },
      },
      authorize: async (credentials) => {
        let user = null;
        // logic to verify if user exists
        user = await findUserByName(credentials.name as string);
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          user = await createUser({ name: credentials.name as string } as IUser);
        }

        // return user object with the their profile data
        return { name: user._doc.name, id: user._id } as User;
      },
    }),
  ],

  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/autherror', // Error code passed in query string as ?error=
  },
});

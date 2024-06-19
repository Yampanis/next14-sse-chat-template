'use server';

import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { LoginSchema } from 'src/schema';
import type zod from 'zod';

import { signIn } from '../auth';

export const login = async (values: zod.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name } = validatedFields.data;

  try {
    await signIn('credentials', {
      name,
      redirectTo: callbackUrl || '/',
      redirect: true,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'An error occurred' };
      }
    }

    throw error;
  }

  redirect('/');
};

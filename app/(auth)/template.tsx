import { auth } from 'app/server/auth';
import { redirect } from 'next/navigation';

export default async function Template({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) redirect('/');

  return <div>{children}</div>;
}

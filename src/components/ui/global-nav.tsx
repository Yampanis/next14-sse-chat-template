import { Profile } from '@components/profile';
import { headers } from 'next/headers';
import Link from 'next/link';

async function GlobalNav() {
  const headersList = headers();
  const currentPathname = headersList.get('url') || '/';

  return (
    <nav className="shadow-bottom mx-auto flex h-16 w-full max-w-7xl grid-cols-2 items-center justify-between bg-[hsla(0,0%,100%,.8)] px-8 py-4 backdrop-blur-sm backdrop-saturate-150">
      <div className="flex justify-start text-2xl text-gray-900">
        <Link href="/" aria-disabled={currentPathname === '/'}>
          Home
        </Link>
      </div>

      <Profile />
    </nav>
  );
}

export default GlobalNav;

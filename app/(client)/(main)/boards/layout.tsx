import Link from 'next/link';

export default function Layout({ modal, children }: { modal: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mb-4 text-3xl font-semibold">Boards</h1>
        <Link
          href={'/board/create'}
          className="rounded border border-gray-200 p-2 transition duration-300 hover:bg-gray-100"
        >
          Create New Board
        </Link>
      </div>
      {modal}
      {children}
    </>
  );
}

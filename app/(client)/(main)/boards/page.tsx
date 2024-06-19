import { getAllBoards } from 'app/server/boards/action';
import type { IBoard } from 'app/server/boards/interfaces';
import Link from 'next/link';

export default async function MainPage() {
  const boards = (await getAllBoards()) as IBoard[];

  return (
    <div className="grid grid-cols-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <Link
          href={`/board/${board.id}`}
          key={board.id}
          className="rounded border border-gray-200 p-4 transition duration-300 hover:bg-gray-100"
        >
          <h2 className="text-lg font-semibold">{board.name}</h2>
          <p>{board.description}</p>
        </Link>
      ))}
    </div>
  );
}

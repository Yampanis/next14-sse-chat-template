import { BoardForm } from '@components/boards/boardForm';
import type { IBoard } from 'app/server/boards/interfaces';

export default async function BoardCreatePage() {
  return (
    <div className="flex h-full items-center justify-center align-middle">
      <BoardForm board={{} as IBoard} />
    </div>
  );
}

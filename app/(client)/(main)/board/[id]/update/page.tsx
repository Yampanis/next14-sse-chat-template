'use client';

import { BoardForm } from '@components/boards/boardForm';
import { getBoard } from 'app/server/boards/action';
import type { IBoard } from 'app/server/boards/interfaces';
import { useEffect, useState } from 'react';

export default function BoardUpdatePage({ params }: { params: { [key: string]: string } }) {
  const [board, setBoard] = useState<IBoard>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const get = async () => {
      const result = await getBoard(params.id || '');
      if (result.success && result.data) {
        setBoard(JSON.parse(result.data) as IBoard);
        setError('');
      } else if (!result.success) {
        setError(result.message);
      }
    };
    get();
  }, []);

  return (
    <div className="flex h-full items-center justify-center align-middle">
      {board ? <BoardForm board={board} /> : <> {error ? 'error' : 'Loading ...'}</>}
    </div>
  );
}

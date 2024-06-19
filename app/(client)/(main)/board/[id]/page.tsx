'use client';

import { BoardFooter } from '@components/board/BoardFooter';
import { BoardHeader } from '@components/board/BoardHeader';
import { BoardsShower } from '@components/board/BoardShower';
import { getBoard } from 'app/server/boards/action';
import type { IBoard } from 'app/server/boards/interfaces';
import type { IPostStoreData } from 'app/server/posts/interfaces';
import { useEffect, useState } from 'react';

export default function BoardPage({ params }: { params: { [key: string]: string } }) {
  const [board, setBoard] = useState<IBoard>();
  const [error, setError] = useState<string>();
  const [updatingPost, setUpdatingPost] = useState<IPostStoreData>();

  const clearPost = () => setUpdatingPost(undefined);
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
    <div className="flex h-full flex-col items-center">
      {board ? (
        <>
          <BoardHeader board={board} />
          <main className="my-2 w-full grow overflow-auto rounded-lg bg-gray-100 p-4">
            <BoardsShower boardId={board?._id.toString()} setUpdatingPost={setUpdatingPost} />
          </main>

          <BoardFooter boardId={board?._id.toString()} post={updatingPost} clearPost={clearPost} />
        </>
      ) : (
        <>{error || 'Loading...'}</>
      )}
    </div>
  );
}

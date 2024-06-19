'use client';

import { BoardHeader } from '@components/board/BoardHeader';
import { BoardsShower } from '@components/board/BoardShower';
import { getBoard } from 'app/server/boards/action';
import type { IBoard } from 'app/server/boards/interfaces';
import { getExpirationTime } from 'app/server/temp-board/action';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BoardPage({ params }: { params: { [key: string]: string } }) {
  const [board, setBoard] = useState<IBoard>();
  const [error, setError] = useState<string>();
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const checkLink = async () => {
      if (!params?.id || params.id === '') return;
      const result = await getExpirationTime(params.id);
      if (result < new Date().getTime()) {
        setIsExpired(true);
      } else {
        setTimeout(() => setIsExpired(true), result - new Date().getTime());
      }
    };
    checkLink();
  }, []);

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
      {isExpired ? (
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <h2 className="text-[20px] font-bold text-black">Temp link is expired</h2>
          <Link href="/signin" className="text-[18px] font-semibold text-blue-700">
            Please log in.
          </Link>
        </div>
      ) : (
        <>
          {board ? (
            <>
              <BoardHeader board={board} />
              <main className="my-2 w-full grow overflow-auto rounded-lg bg-gray-100 p-4">
                <BoardsShower boardId={board?._id.toString()} setUpdatingPost={() => {}} />
              </main>
            </>
          ) : (
            <>{error || 'Loading...'}</>
          )}
        </>
      )}
    </div>
  );
}

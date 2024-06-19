'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@components/ui/breadcrumb';
import { CardDescription } from '@components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import useClipBoard from 'src/hooks/useCustomHook';
import { deleteBoard as deleteBoardAction } from 'app/server/boards/action';
import type { IBoard } from 'app/server/boards/interfaces';
import { createTempBoard } from 'app/server/temp-board/action';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const BoardHeader = ({ board }: { board: IBoard }) => {
  return (
    <div className="board-header flex w-full justify-start">
      <div>
        <BoardBreadcrumb board={board} />
        <CardDescription className="mt-2">{board?.description || `${board?.name} description`}</CardDescription>
      </div>
    </div>
  );
};

export const BoardBreadcrumb = ({ board }: { board: IBoard }) => {
  const { copySuccess, copyToClipboard } = useClipBoard();
  const session = useSession();
  const router = useRouter();
  const isMyBoard = session.data?.user?.id === board.creator.toString();

  const createTempLink = async () => {
    await createTempBoard({ board: board._id.toString() });
    copyToClipboard(`localhost:3000/temp-board/${board._id.toString()}`);
  };

  const deleteBoard = async () => {
    await deleteBoardAction(board._id.toString());
    router.push('/boards');
  };

  const updateBoard = () => {
    router.push(`/board/${board._id.toString()}/update`);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-[18px] font-bold text-black">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="text-[17px] font-[600]  text-black">Board</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-[17px] font-[500]  text-black">{board.name}</BreadcrumbPage>
        </BreadcrumbItem>
        {isMyBoard && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => updateBoard()}>Update</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteBoard()}>Delete</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => createTempLink()}>Create Temp Link</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

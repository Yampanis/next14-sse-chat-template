'use client';

import { BreadcrumbEllipsis } from '@components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Label } from '@radix-ui/react-label';
import type { IPostStoreData } from 'app/server/posts/interfaces';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { cn } from 'src/lib/utils';

export const BoardsShower = ({
  boardId,
  setUpdatingPost,
}: {
  boardId: string;
  setUpdatingPost: (value: IPostStoreData) => void;
}) => {
  const session = useSession();
  const [messages, setMessages] = useState<IPostStoreData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse/${boardId}`);

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data) as IPostStoreData[];
      setMessages((prevMessages) => {
        const addingMessages = newMessage.filter(
          (value) => prevMessages.findIndex((prev) => prev._id.toString() === value._id.toString()) === -1,
        );
        const updatingMessages = newMessage.filter((value) => value?.action === 'update');
        const deletingMessages = newMessage.filter((value) => value?.action === 'delete');
        let result: IPostStoreData[] = prevMessages.length ? prevMessages : [];
        if (deletingMessages.length)
          result = result.filter(
            (value) =>
              deletingMessages.findIndex((deleteMessage) => deleteMessage._id.toString() === value._id.toString()) ===
              -1,
          );
        // @ts-ignore
        if (updatingMessages.length)
          result = result.map((value) => {
            const index = updatingMessages.findIndex(
              (updatingMessage) => updatingMessage._id.toString() === value._id.toString(),
            );
            return index > -1 ? updatingMessages[index] : value;
          });
        return [...result, ...addingMessages];
      });
    };

    eventSource.onerror = () => {
      console.log('Error occurred');
      eventSource.close();
      setIsConnected(false);
    };

    eventSource.onopen = () => {
      console.log('Connection opened');
      setIsConnected(true);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      {!isConnected ? (
        <Label>Connecting to Server</Label>
      ) : (
        <>
          {messages.map((message, index) => (
            <Message
              setUpdatingPost={setUpdatingPost}
              message={message}
              isRight={(session.data?.user?.id || messages[0]?.poster._id) === message.poster?._id.toString()}
              key={`message-${index}`}
            />
          ))}
        </>
      )}
    </>
  );
};

export const Message = ({
  message,
  isRight,
  setUpdatingPost,
}: {
  message: IPostStoreData;
  isRight: boolean;
  setUpdatingPost: (value: IPostStoreData) => void;
}) => {
  const session = useSession();
  const isMyMessage = session?.data?.user?.id === message.poster._id.toString();

  const setPost = () => setUpdatingPost(message);

  const deletePost = () => {
    fetch(`/api/sse/${message.board}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: message._id.toString() }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div
      className={cn(['flex rounded-sm mb-2', isRight ? 'justify-end' : 'justify-start'])}
      key={message._id?.toString()}
    >
      <div className="flex gap-1">
        {!isMyMessage && (
          <div
            className={cn([
              'w-[38px] h-[38px] bg-[#cef9f2] border border-black border-opacity-10 rounded-full flex items-center justify-center text-[#157e82] font-bold',
              isRight ? 'order-1' : '',
            ])}
          >
            {message.poster?.name.slice(0, 2).toUpperCase() || ''}
          </div>
        )}
        <div className="bg-[#f1f1f1] p-2" dangerouslySetInnerHTML={{ __html: message.content }} />
        {isMyMessage && <MessageEditor setPost={setPost} deletePost={deletePost} />}
      </div>
    </div>
  );
};

export const MessageEditor = ({ setPost, deletePost }: { setPost: () => void; deletePost: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <BreadcrumbEllipsis className="size-4" />
        <span className="sr-only">Toggle menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="right-0">
        <DropdownMenuItem onClick={() => setPost()}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => deletePost()}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

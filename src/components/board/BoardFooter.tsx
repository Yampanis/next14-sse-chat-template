'use client';

import { Cross1Icon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import type { KeyboardEvent } from 'react';
import { useEffect, useState, useTransition } from 'react';

import type { IPostStoreData } from '../../../app/server/posts/interfaces';
import { Textarea } from '../ui/textarea';

export const BoardFooter = ({
  boardId,
  post,
  clearPost,
}: {
  boardId: string;
  post: IPostStoreData | undefined;
  clearPost: () => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const session = useSession();
  const [text, setText] = useState<string>('');

  const save = async () => {
    if (!text.length) return;
    startTransition(() => {
      // @ts-ignore
      if (!post) {
        fetch(`/api/sse/${boardId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: text, poster: session.data?.user?.id, board: boardId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Response:', data);
            setText('');
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } else {
        fetch(`/api/sse/${boardId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...post,
            _id: post._id.toString(),
            content: text,
            poster: post.poster._id.toString(),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Response:', data);
            cancel();
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    });
  };

  const cancel = () => {
    clearPost();
    setText('');
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      // Prevent the default behavior (e.g., adding a newline)
      event.preventDefault();

      // Perform your custom logic here
      await save();
    }
  };

  useEffect(() => {
    if (post?.content) {
      setText(post.content);
    }
  }, [post]);

  return (
    <div className="mb-2 flex w-full items-center justify-center gap-2">
      <Textarea
        placeholder="Type your message here."
        className="h-10 rounded-lg"
        onChange={(event) => setText(event.target.value)}
        value={text}
        disabled={isPending}
        onKeyDown={handleKeyDown}
      />
      <button
        className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-800"
        onClick={() => save()}
        disabled={isPending}
      >
        <PaperPlaneIcon />
      </button>
      {post && (
        <button
          className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-800"
          onClick={() => cancel()}
          disabled={isPending}
        >
          <Cross1Icon />
        </button>
      )}
    </div>
  );
};

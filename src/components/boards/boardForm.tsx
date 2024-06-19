'use client';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { saveBoard } from 'app/server/boards/action';
import type { IBoard } from 'app/server/boards/interfaces';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Suspense, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { BoardSchema } from 'src/schema';
import type * as zod from 'zod';

export function BoardForm({ board }: { board: IBoard }) {
  const router = useRouter();
  const pathName = usePathname();
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  // @ts-ignore
  const isMyBoard = pathName.includes('/create') || board.creator.toString() === session.data?.user.id;

  const form = useForm<zod.infer<typeof BoardSchema>>({
    resolver: zodResolver(BoardSchema),
    defaultValues: {
      name: board.name,
      description: board.description,
    },
  });

  const onSubmit = (values: zod.infer<typeof BoardSchema>) => {
    setError('');
    startTransition(() => {
      saveBoard(values.name, session.data?.user?.id || '', board?._id || '', values.description || '')
        .then((data) => {
          if (data?.message) {
            setError(data.message);
            return;
          }
          router.push("/");
        })
        .catch(() => setError('Something went wrong'));
    });
  };

  return (
    <Suspense>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-[350px] sm:w-[450px]">
            <CardHeader>
              <CardTitle>Board</CardTitle>
              {/* <CardDescription>Please enter your User name.</CardDescription> */}
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="Board name" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="Board Description" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              {isMyBoard && (
                <Button type="submit" disabled={!form.formState.isDirty}>
                  {!board._id ? 'Create' : 'Update'}
                </Button>
              )}
            </CardFooter>
            {error && (
              <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <ExclamationTriangleIcon />
                <p>{error}</p>
              </div>
            )}
          </Card>
        </form>
      </Form>
    </Suspense>
  );
}

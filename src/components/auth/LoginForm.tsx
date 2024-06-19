'use client';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { login } from 'app/server/users/action';
import { Suspense, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { LoginSchema } from 'src/schema';
import type * as zod from 'zod';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');

  const form = useForm<zod.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: zod.infer<typeof LoginSchema>) => {
    console.log({values})
    setError('');
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
        })
        .catch(() => setError('Something went wrong'));
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (!form.getValues('name')) {
        form.trigger();
        return;
      }
      onSubmit(form.getValues());
    }
  }

  return (
    <Suspense>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onKeyPress={handleKeyDown}>
          <Card className="w-[350px] sm:w-[450px]">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Please enter your User name.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="User name" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit">Sign In</Button>
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

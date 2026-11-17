'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { helloAction } from '@/actions/hello-action';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { helloFormSchema } from '@/lib/hello-schema';
import { cn } from '@/lib/utils';
import * as m from '@/paraglide/messages';

type FormSchema = z.infer<typeof helloFormSchema>;

export const HeroForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(helloFormSchema),
    defaultValues: {
      name: '',
    },
  });
  const { toast } = useToast();

  const onSubmit = async ({ name }: FormSchema) => {
    const result = await helloAction(name);

    if ('error' in result) {
      form.setError('name', { type: 'server', message: result.error });
      return;
    }

    toast({ description: result.message });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={m.input_placeholder()}
                  className={cn(
                    'md:w-96',
                    form.formState.errors.name && 'border-destructive'
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <Button variant="secondary" type="submit">
          {m.submit_form()}
        </Button>
      </form>
    </Form>
  );
};

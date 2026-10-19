'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { helloAction } from '@/actions/hello-action';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import * as m from '@/paraglide/messages';

export const HeroForm = () => {
  const formSchema = z.object({
    name: z.string().min(3, m.name_min_length()),
  });
  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  const { toast } = useToast();

  const onSubmit = async ({ name }: FormSchema) => {
    const { message } = await helloAction(name);

    toast({ description: message });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{m.name_label()}</FormLabel>
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
              <FormDescription>{m.name_hint()}</FormDescription>
              <FormMessage className="text-red-600 dark:text-red-400" />
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

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
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
import { Input } from '@/components/ui/input.tsx';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
  }),
  password: z.string().min(2, {
    message: 'Le mot de passe doit contenir au moins 2 caractères.',
  }),
});

function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Connexion en cours...',
      description: `Nom d'utilisateur: ${data.username}`,
    });
  }

  return (
    <DialogContent>
      <DialogHeader>
        {/* Formulaire de connexion */}
        <DialogTitle>Connexion</DialogTitle>
        <DialogDescription>
          Connectez-vous pour accéder à votre compte.
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3 mx-auto pt-3"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ceci est votre identifiant à l'intranet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type={'password'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}

export default LoginForm;
